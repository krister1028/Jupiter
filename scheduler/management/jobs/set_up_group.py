from django.contrib.auth.models import Group

from scheduler.models import JobStatus, JobType


def onboard_group(group_name):
    default_statuses = ['Active', 'Inactive']
    default_types = ['Standard']
    group = Group(name=group_name)
    group.save()

    for status in default_statuses:
        JobStatus(group=group, description=status).save()

    for job_type in default_types:
        JobType(group=group, description=job_type).save()
