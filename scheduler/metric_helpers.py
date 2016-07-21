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

    if not record.completed_by and record.history_type != record.DELETED:
        series_dict[series_key].append([record.history_date, last_result + record.task_minutes])
    else:
        if last_result != 0:  # edge case to cover history not starting from the beginning of time (though it should)
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
    return '{} ({})'.format(expertise_description, job_status)


def aggregate_task_completion(completion_data):
    categories = set()
    names = set()
    data_map = {}
    series = []

    for record in completion_data:
        category = record['task_expertise_description']
        name = record['completed_by_name']
        categories.add(category)
        names.add(name)
        data_map['{}__{}'.format(name, category)] = record['completion_minutes__sum']

    categories = list(categories)
    names = list(names)

    for name in names:
        data = []
        series.append({'name': name, 'data': data})
        for category in categories:
            data.append(data_map.get('{}__{}'.format(name, category), 0))

    return categories, series
