from collections import defaultdict
from datetime import datetime
import pytz
from django.db.models import Min, Max

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
    ).values(
        'completed_time',
        'product_task__task__expertise_level',
        'id', 'product_task__completion_time'
    ).annotate(
        Max('completed_time')
    ).exclude(completed_time__lt=start_date, completed_time__gt=end_date).order_by('-completed_time')

    for date in utils.daterange(start_date, end_date):
        time_string = datetime.strftime(date, '%Y-%m-%d')
        date_dict = {'date': time_string, 'tasks': defaultdict(lambda: 0)}
        for r in records:
            # get most recent record for date in question
            try:
                record = filter(lambda x: x['completed_time__max'] is None or x['completed_time__max'] <= date, records)[0]
            except IndexError:  # if the task didn't exist on this date (and therefore has no records)
                continue
            if record['completed_time__max'] is None:  # if the task was incomplete at this point
                date_dict['tasks'][Task.get_level_text(record['product_task__task__expertise_level'])] += record['product_task__completion_time']
        date_list.append(date_dict)
    return date_list