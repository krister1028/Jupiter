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
        if not self.product_tasks.all():
            for product_task in ProductTask.objects.filter(product=self.product):
                JobTask(job=self, product_task=product_task, group=self.group).save()

    def delete(self, *args, **kwargs):
        super(Job, self).delete(*args, **kwargs)
        JobTaskMetrics.take_snapshot(self.group)


class CustomHistoricalJobTask(models.Model):
    DELETED = '-'

    completion_status_change = models.BooleanField(default=False)
    completed_by_name = models.CharField(max_length=255, null=True)
    task_expertise_description = models.CharField(max_length=255)
    task_minutes = models.IntegerField()
    job_status_description = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        self.completion_status_change = self._is_completion_status_change()
        self.task_expertise_description = Task.get_level_text(self.instance.product_task.task.expertise_level)
        self.task_minutes = self.instance.product_task.completion_time
        self.job_status_description = self.job.status.description
        if self.completed_by:
            self.completed_by_name = self.completed_by__first_name + self.completed_by__last_name
        super(CustomHistoricalJobTask, self).save(*args, **kwargs)

    def _is_completion_status_change(self):
        try:
            last_completed_by = self.instance.history.most_recent().completed_by
        except JobTask.DoesNotExist:
            return bool(self.completed_by)
        # compare presence of timestamp, not timestamp value
        return bool(self.completed_by) != bool(last_completed_by)

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
        if self.completion_status_has_changed():
            JobTaskMetrics.take_snapshot(self.group)

    def delete(self, *args, **kwargs):
        super(JobTask, self).delete(*args, **kwargs)
        JobTaskMetrics.take_snapshot(self.group)

    def completion_status_has_changed(self):
        try:
            last_completion_time = self.history.most_recent().completion_time
        except JobTask.DoesNotExist:
            return True
        return bool(self.completion_time) == bool(last_completion_time)


class JobTaskMetrics(models.Model):
    group = models.ForeignKey(Group)
    date = models.DateTimeField()
    high = models.IntegerField()
    medium = models.IntegerField()
    low = models.IntegerField()
    cp = models.IntegerField()

    @classmethod
    def take_snapshot(cls, group):
        current_backlog = JobTask.objects.filter(
            group=group, completed_by__isnull=True
        ).values(
            'product_task__task__expertise_level'
        ).annotate(Sum('product_task__completion_time'))

        snapshot = cls._make_empty_snapshot(group)

        for aggregation in current_backlog:
            field_name = Task.get_level_text(aggregation['product_task__task__expertise_level']).lower()
            value = aggregation['product_task__completion_time__sum']
            setattr(snapshot, field_name, value)
        snapshot.save()

    @classmethod
    def _make_empty_snapshot(cls, group):
        return cls(
            group=group,
            date=timezone.now(),
            high=0,
            medium=0,
            low=0,
            cp=0
        )
