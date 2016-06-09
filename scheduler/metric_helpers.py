from datetime import datetime
import pytz
from django.db.models import Min

import utils
from scheduler.models import Job, JobTask, Task


def get_default_start_end_dates(group, start_date_string=None, end_date_string=None):

    if start_date_string:
        start_date = utils.parse_date_string(start_date_string)
    else:
        start_date = Job.objects.filter(group=group).aggregate(Min('created'))['created__min'] or datetime.now(pytz.utc)

    if end_date_string:
        end_date = utils.parse_date_string(end_date_string)
    else:
        end_date = datetime.now(pytz.utc)

    return start_date, end_date


def get_task_breakdown(primary_group, start_date, end_date):
    date_list = []
    records = JobTask.history.filter(
        job__group=primary_group
    ).exclude(job__created__gt=end_date).order_by('-history_date')
    jobs = Job.objects.filter(pk__in=[x.job.pk for x in records])
    for date in utils.daterange(start_date, end_date):
        date_string = datetime.strftime(date, '%Y-%m-%d')
        date_dict = build_default_dict_for_date(date_string)
        for job in jobs:
            # get most recent record for date in question
            for job_task in job.jobtask_set.all():
                try:
                    record = filter(lambda x: x.id == job_task.id and x.history_date.date() <= date.date(), records)[0]
                except IndexError:  # if the task didn't exist on this date (and therefore has no records)
                    continue
                if record.completed_by is None:  # if the task was incomplete at this point
                    date_dict[Task.get_level_text(record.product_task.task.expertise_level)] += record.product_task.completion_time
        date_list.append(date_dict)
    return date_list


def build_default_dict_for_date(date_string):
    default_breakdown = {'date': date_string}
    for expertise_level in Task.EXPERTISE_CHOICES:
        default_breakdown[expertise_level[1]] = 0
    return default_breakdown
