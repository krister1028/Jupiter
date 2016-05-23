from __future__ import unicode_literals

import datetime
from django.contrib.auth.models import User, Group
from django.db import models
from django.utils import timezone


class StatusHistory(models.Model):
    JOB = 1
    JOB_TASK = 2
    MODEL_CHOICES = (
        (JOB, 'Job'),
        (JOB_TASK, 'Job Task')
    )
    model = models.IntegerField(choices=MODEL_CHOICES)
    model_id = models.IntegerField()
    status = models.IntegerField(null=True)
    date = models.DateField()


class StatusHistoryMixin(object):
    """
    Quick and dirty way to capture updates to a Job or JobTask status.  Note that status_model must be defined, and
    that a 'status' field must exist.
    Status updates are overwritten daily (i.e. there's only a single status for any given record on a single day -
    corresponding to the last recorded status change that day.)
    """
    def save(self, *args, **kwargs):
        if self.status:
            status_log = StatusHistory.objects.get_or_create(
                model=self.status_model,
                model_id=self.pk,
                date=datetime.datetime.today())[0]
            if type(self.status) == int:
                status_log.status = self.status
            else:
                status_log.status = self.status.id
            status_log.save()
        super(StatusHistoryMixin, self).save(*args, **kwargs)


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
    abbreviation = models.CharField(max_length=20)
    expertise_level = models.IntegerField(choices=EXPERTISE_CHOICES)
    min_completion_time = models.IntegerField()
    max_completion_time = models.IntegerField()
    cost = models.IntegerField()

    def __unicode__(self):
        return self.description


class Product(models.Model):
    group = models.ForeignKey(Group)
    description = models.CharField(max_length=255, default=None)
    code = models.CharField(max_length=8)

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


class Job(StatusHistoryMixin, models.Model):
    status_model = StatusHistory.JOB

    group = models.ForeignKey(Group)
    product = models.ForeignKey(Product)
    status = models.ForeignKey(JobStatus, null=True)
    type = models.ForeignKey(JobType, null=True)
    rework = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255)
    started_timestamp = models.DateTimeField(null=True)
    completed_timestamp = models.DateTimeField(null=True)

    def __unicode__(self):
        return self.description


class ProductTask(models.Model):
    product = models.ForeignKey(Product, related_name='tasks')
    task = models.ForeignKey(Task, related_name='product_tasks')
    completion_time = models.IntegerField()  # in minutes

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


class JobTask(StatusHistoryMixin, models.Model):
    status_model = StatusHistory.JOB_TASK
    PENDING = 1
    IN_PROGRESS = 2
    COMPLETE = 3
    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (IN_PROGRESS, 'In Progress'),
        (COMPLETE, 'Complete')
    )

    job = models.ForeignKey(Job, related_name='job_tasks')
    product_task = models.ForeignKey(ProductTask, related_name='job_tasks')
    status = models.IntegerField(choices=STATUS_CHOICES, default=PENDING)
    completed_by = models.ForeignKey(User, null=True)
    completed_time = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        if self.completed_by and not self.completed_time:
            self.completed_time = timezone.now()
        elif not self.completed_by:
            self.completed_time = None

        super(JobTask, self).save(*args, **kwargs)

    @property
    def description(self):
        return self.product_task.task.description

    @property
    def completion_time(self):
        return self.product_task.completion_time

    @classmethod
    def create_for_job(cls, job):
        for product_task in job.product.tasks.all():
            cls.objects.create(job=job, product_task=product_task, status=cls.PENDING)


class DailyMetric(models.Model):
    group = models.ForeignKey(Group)
    # all text fields store json strings, as tasks and types are dynamic
    active_task_hours = models.TextField()
    pending_task_hours = models.TextField()
    active_type_hours = models.TextField()
    pending_type_hours = models.TextField()
    job_count_by_type = models.TextField()
    time_stamp = models.DateField(auto_now_add=True)


class JobLog(models.Model):
    DAILY_METRICS = 1
    JOB_CHOICES = (
        (DAILY_METRICS, 'Daily Metric Job'),
    )
    job = models.IntegerField(choices=JOB_CHOICES)
    error = models.CharField(max_length=255, null=True)
    successful = models.BooleanField(default=False)
