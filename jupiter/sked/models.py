from __future__ import unicode_literals
import uuid

from django.conf import settings
from django.db import models


class Organization(models.Model):
    id = models.UUIDField(editable=False, default=uuid.uuid4, primary_key=True)
    description = models.CharField(max_length=100)

    def __unicode__(self):
        return self.description


class OrgGroup(models.Model):
    id = models.UUIDField(editable=False, default=uuid.uuid4, primary_key=True)
    organization = models.ForeignKey(Organization)


class OrgUsers(models.Model):
    org_group = models.ForeignKey(OrgGroup)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    class Meta:
        unique_together = (
            ('org_group', 'user'),
        )


class Dimension(models.Model):
    id = models.UUIDField(editable=False, default=uuid.uuid4, primary_key=True)
    description = models.CharField(max_length=100)
    organization = models.ForeignKey(Organization)
    deleted = models.DateTimeField(null=True)

    def __unicode__(self):
        return self.description

    class Meta:
        abstract = True


class Technician(Dimension):
    user = models.OneToOneField('auth.User')


class Expertise(Dimension):
    pass


class Product(Dimension):
    pass


class Task(Dimension):
    pass


class ProductTasks(models.Model):
    product = models.ForeignKey(Product)
    task = models.ForeignKey(Task)

    class Meta:
        unique_together = [
            ('product', 'task'),
        ]


class JobType(Dimension):
    pass


class Job(Dimension):
    product = models.ForeignKey(Product)
    type = models.ForeignKey(JobType)


class JobTasks(models.Model):
    job = models.ForeignKey(Job)
    task = models.ForeignKey(Task)

    class Meta:
        unique_together = [
            ('job', 'task'),
        ]


class Date(Dimension):
    date = models.DateField(db_index=True)


class JobTaskFact(models.Model):
    organization = models.ForeignKey(Organization)

    # dimensions
    technician = models.ForeignKey(Technician)
    expertise = models.ForeignKey(Expertise)
    job = models.ForeignKey(Job)
    job_type = models.ForeignKey(JobType)
    product = models.ForeignKey(Product)
    task = models.ForeignKey(Task)
    date = models.ForeignKey(Date)

    # metrics
    backlog_minutes = models.IntegerField(default=0)
    complete_minutes = models.IntegerField(default=0)
    job_complete = models.BooleanField(default=False)
