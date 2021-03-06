from __future__ import unicode_literals

from django.contrib.auth.models import User, Group
from django.db import models
from django.db.models import Sum, Max
from django.utils import timezone
from simple_history.models import HistoricalRecords


class UserProfile(models.Model):
    TECHNICIAN = 1
    ADMINISTRATOR = 2
    USER_TYPE_CHOICES = (
        (TECHNICIAN, 'Technician'),
        (ADMINISTRATOR, 'Administrator')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.IntegerField(choices=USER_TYPE_CHOICES, default=TECHNICIAN)


class Task(models.Model):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CP = 4
    EXPERTISE_CHOICES = (
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High'),
        (CP, 'CP')
    )

    group = models.ForeignKey(Group)
    description = models.CharField(max_length=255)
    abbreviation = models.CharField(max_length=255)
    expertise_level = models.IntegerField(choices=EXPERTISE_CHOICES)
    min_completion_time = models.IntegerField()
    max_completion_time = models.IntegerField()
    cost = models.IntegerField()

    history = HistoricalRecords()

    def __unicode__(self):
        return self.description

    @classmethod
    def get_level_text(cls, level_id):
        return filter(lambda x: x[0] == level_id, cls.EXPERTISE_CHOICES)[0][1]


class Product(models.Model):
    group = models.ForeignKey(Group)
    description = models.CharField(max_length=255, default=None)
    code = models.CharField(max_length=255)
    tasks = models.ManyToManyField(Task, through='ProductTask')

    def __unicode__(self):
        return self.description


class JobStatus(models.Model):
    group = models.ForeignKey(Group)
    description = models.CharField(max_length=255)

    def __unicode__(self):
        return self.description


class JobType(models.Model):
    group = models.ForeignKey(Group)
    description = models.CharField(max_length=255)

    def __unicode__(self):
        return self.description


class ProductTask(models.Model):
    product = models.ForeignKey(Product)
    task = models.ForeignKey(Task)
    completion_time = models.IntegerField(null=True, blank=True)  # in minutes
    history = HistoricalRecords()

    @property
    def description(self):
        return self.task.description

    @property
    def min_completion_time(self):
        return self.task.min_completion_time

    @property
    def max_completion_time(self):
        return self.task.max_completion_time

    def __unicode__(self):
        return self.task.description


class Job(models.Model):

    group = models.ForeignKey(Group)
    product = models.ForeignKey(Product)
    status = models.ForeignKey(JobStatus)
    type = models.ForeignKey(JobType, null=True, blank=True)
    rework = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255)
    started_timestamp = models.DateTimeField(null=True, blank=True)
    completed_timestamp = models.DateTimeField(null=True, blank=True)
    product_tasks = models.ManyToManyField(ProductTask, through='JobTask')
    history = HistoricalRecords()

    def __unicode__(self):
        return self.description

    @property
    def product_description(self):
        return self.product.description

    @property
    def product_code(self):
        return self.product.code

    def get_remaining_task_minutes_by_expertise_level(self, expertise_level):
        minutes = 0
        for job_task in self.jobtask_set.all():
            try:
                if job_task.product_task.task.expertise_level == expertise_level and job_task.status != JobTask.COMPLETE:
                    minutes += job_task.product_task.completion_time
            except JobTask.DoesNotExist:
                continue
        return minutes

    def save(self, *args, **kwargs):
        super(Job, self).save(*args, **kwargs)
        if not self.product_tasks.all().count():
            for product_task in ProductTask.objects.filter(product=self.product):
                JobTask(job=self, product_task=product_task, group=self.group).save()


class CustomHistoricalJobTask(models.Model):
    DELETED = '-'
    ADDED = '+'

    completion_status_change = models.BooleanField(default=False)
    task_technician = models.ForeignKey(User, null=True)
    task_expertise_description = models.CharField(max_length=255)
    task_minutes = models.IntegerField()
    completion_minutes_flow = models.IntegerField(null=True)
    job_status_description = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        self._get_last_instance()
        self.completion_status_change = self._is_completion_status_change()
        self.task_expertise_description = Task.get_level_text(self.instance.product_task.task.expertise_level)
        self.task_minutes = self.instance.product_task.completion_time
        self.job_status_description = self.job.status.description
        self.completion_minutes_flow = self._get_completion_minutes()
        self.task_technician = self._get_task_tech()
        super(CustomHistoricalJobTask, self).save(*args, **kwargs)

    def _get_last_instance(self):
        try:
            self.last_instance = self.instance.history.most_recent()
        except JobTask.DoesNotExist:
            self.last_instance = None

    def _is_completion_status_change(self):
        if not self.last_instance:
            return True

        # compare presence of timestamp, not timestamp value
        completion_change = bool(self.completed_by) != bool(self.last_instance.completed_by)
        # if open tasks are deleted
        deletion_change = (self.history_type == self.DELETED and not self.completed_by)

        return completion_change or deletion_change

    def _get_task_tech(self):
        if self.completed_by:
            return self.completed_by
        else:
            # if a task is being marked as incomplete
            if self.completion_status_change and self.last_instance:
                return self.last_instance.completed_by

    def _get_completion_minutes(self):
        if self.completion_status_change:
            if self.completed_by:
                return self.task_minutes
            else:
                return -self.task_minutes

    @classmethod
    def historical_records_as_of(cls, time, group):
        deleted_task_ids = JobTask.history.filter(
            group=group, history_date__lte=time, history_type=cls.DELETED
        ).values_list('id', flat=True)

        task_ids_as_of = JobTask.history.filter(
            group=group, history_date__lte=time
        ).exclude(id__in=deleted_task_ids).values('id').annotate(Max('history_id')).distinct().order_by()

        return JobTask.history.filter(history_id__in=[x['history_id__max'] for x in task_ids_as_of])

    class Meta:
        abstract = True


class JobTask(models.Model):
    PENDING = 1
    IN_PROGRESS = 2
    COMPLETE = 3
    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (IN_PROGRESS, 'In Progress'),
        (COMPLETE, 'Complete')
    )
    group = models.ForeignKey(Group)
    job = models.ForeignKey(Job)
    product_task = models.ForeignKey(ProductTask)
    status = models.IntegerField(choices=STATUS_CHOICES, default=PENDING)
    completed_by = models.ForeignKey(User, null=True, blank=True)
    completed_time = models.DateTimeField(null=True, blank=True)
    history = HistoricalRecords(bases=[CustomHistoricalJobTask])

    @property
    def completion_time(self):
        return self.product_task.completion_time

    @property
    def description(self):
        return self.product_task.task.description

    def save(self, *args, **kwargs):
        if self.completed_by and not self.completed_time:
            self.completed_time = timezone.now()
        elif not self.completed_by:  # allow regression
            self.completed_time = None
        super(JobTask, self).save(*args, **kwargs)

    def completion_status_has_changed(self):
        try:
            last_completion_time = self.history.most_recent().completion_time
        except JobTask.DoesNotExist:
            return True
        return bool(self.completion_time) == bool(last_completion_time)


