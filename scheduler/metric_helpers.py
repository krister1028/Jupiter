from collections import defaultdict
from copy import deepcopy

from scheduler.models import CustomHistoricalJobTask


def get_initial_task_backlog(start_time, group):
    aggregate = defaultdict(lambda: 0)
    initial_job_tasks = CustomHistoricalJobTask.historical_records_as_of(start_time, group)
    for record in initial_job_tasks:
        if not record.completed_by or record.history_type == '+':
            aggregate[get_record_key(record)] += record.task_minutes
    return {'date': start_time, 'data': aggregate}


def get_record_key(historic_job_task):
    expertise_description = historic_job_task.task_expertise_description
    job_status = historic_job_task.job_status_description
    return '{}__{}'.format(expertise_description, job_status)


def add_task_backlog_aggregate(last_aggregation, next_historical_job_task_record):
    key = get_record_key(next_historical_job_task_record)
    aggregation = deepcopy(last_aggregation['data'])

    if not next_historical_job_task_record.completed_by or next_historical_job_task_record.history_type == '+':
        aggregation[key] += next_historical_job_task_record.task_minutes
    else:
        if aggregation[key] != 0:
            aggregation[key] -= next_historical_job_task_record.task_minutes
    return {'date': next_historical_job_task_record.history_date, 'data': aggregation}
