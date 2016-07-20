from collections import defaultdict
from copy import deepcopy

from scheduler.models import CustomHistoricalJobTask


def get_initial_task_backlog(start_time, group):
    series_dict = defaultdict(lambda: [[start_time, 0]])
    initial_job_tasks = CustomHistoricalJobTask.historical_records_as_of(start_time, group)
    for record in initial_job_tasks:
        if not record.completed_by or record.history_type == '+':
            series_dict[get_record_key(record)][0][1] += record.task_minutes
    return series_dict


def update_backlog_series(series_dict, record):
    series_key = get_record_key(record)
    last_result = series_dict[series_key][-1][1]

    if not record.completed_by or record.history_type == '+':
        series_dict[series_key].append([record.history_date, last_result + record.task_minutes])
    else:
        if last_result != 0:
            series_dict[series_key].append([record.history_date, last_result - record.task_minutes])
    return series_dict


def series_dict_to_series(series_dict):
    series = []
    for k, v in series_dict.items():
        series.append({'name': k, 'data': v})
    return series


def get_record_key(historic_job_task):
    expertise_description = historic_job_task.task_expertise_description
    job_status = historic_job_task.job_status_description
    return '{}__{}'.format(expertise_description, job_status)
