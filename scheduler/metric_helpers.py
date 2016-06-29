from collections import defaultdict
from datetime import datetime
import pytz
from django.db.models import Max

import utils
from scheduler.models import Job, JobTask, Task, ProductTask, CustomHistoricalJobTask


def get_initial_task_backlog(start_time, group):
    aggregate = defaultdict(lambda: 0)
    initial_job_tasks = CustomHistoricalJobTask.historical_records_as_of(start_time, group)
    for record in filter(lambda r: r.group_id == group_id, initial_job_tasks):
        if not record.completed_time:
            defaultdict[get_record_key(record, start_time)] += record.task_minutes
    return {'date': start_time, 'data': aggregate}


def get_record_key(job_task, time):
    expertise_description = job_task.history.as_of(time).task_expertise_description
    job_status = job_task.history.job_status_description
    return '{}__{}'.format(expertise_description, job_status)


class BackLogMetrics(object):
    CHANGED = '~'
    CREATED = '+'
    DELETED = '-'

    def __init__(self, primary_group, start_time, end_time):
        self.start_time = start_time
        self.end_time = end_time
        self.primary_group = primary_group

        self.job_task_records = self._get_job_task_records()

    def get_task_backlog(self):
        self._get_associated_records()
        records = [self._get_initial_backlog()]
        for job_task in self.job_task_records:
            records.append(self._get_backlog_breakdown_at_time(job_task.history_date))
        return records

    def _get_initial_backlog(self):
        initial_tasks = JobTask.history.as_of(self.start_time)
        record = self._get_empty_backlog_record(self.start_time)
        for job_task in initial_tasks:
            if job_task.completed_by is None:
                try:
                    product_task = self._get_product_task_as_of(self.start_time, job_task.product_task_id)
                    task = self._get_task_as_of(self.start_time, product_task.task_id)
                    task_level = Task.get_level_text(task.expertise_level)
                    record[task_level] += product_task.completion_time
                except IndexError:
                    continue
        return record

    def _get_job_task_records(self):
        return JobTask.history.filter(
            group=self.primary_group, history_date__range=(self.start_time, self.end_time)
        ).order_by('-history_date')

    def _get_associated_records(self):
        self.product_tasks = ProductTask.history.filter(id__in=[jt.product_task_id for jt in self.job_task_records]).order_by('-history_date')
        self.tasks = Task.history.filter(id__in=[pt.task_id for pt in self.product_tasks]).order_by('-history_date')

    def _get_backlog_breakdown_at_time(self, time):
        record = self._get_empty_backlog_record(time)
        job_tasks = self._get_records_as_of_time(time, self.job_task_records)
        for job_task in job_tasks:
            if job_task.completed_by is None and job_task.history_type != self.DELETED:
                product_task = self._get_product_task_as_of(job_task.history_date, job_task.product_task_id)
                task = self._get_task_as_of(job_task.history_date, product_task.task_id)
                task_level = Task.get_level_text(task.expertise_level)
                record[task_level] += product_task.completion_time
        return record

    def _get_product_task_as_of(self, time, product_task_id):
        return self._get_records_as_of_time(time, self.product_tasks, lambda x: x.id == product_task_id)[0]

    def _get_task_as_of(self, time, task_id):
        return self._get_records_as_of_time(time, self.tasks, lambda x: x.id == task_id)[0]

    def _get_records_as_of_time(self, time, records, sub_filter_func=None):
        records = filter(lambda x: x.history_date <= time, records)
        if sub_filter_func:
            records = filter(sub_filter_func, records)
        return self._build_unique_records(records)

    @staticmethod
    def _build_unique_records(records_as_of_time):
        # assumes that records are ordered by history date descending
        id_set = set([x.id for x in records_as_of_time])
        most_recent_list = []
        for id_val in id_set:
            most_recent_list.append(
                filter(lambda x: x.id == id_val, records_as_of_time)[0]
            )
        return most_recent_list

    @staticmethod
    def _get_empty_backlog_record(date):
        backlog_record = {'date': date}
        for expertise_level in Task.EXPERTISE_CHOICES:
            backlog_record[expertise_level[1]] = 0
        return backlog_record


def get_default_start_end_dates(user, start_date_string=None, end_date_string=None):

    if start_date_string:
        start_date = utils.parse_date_string(start_date_string)
    else:
        start_date = user.date_joined

    if end_date_string:
        end_date = utils.parse_date_string(end_date_string)
    else:
        end_date = datetime.now(pytz.utc)

    return start_date, end_date


def get_task_backlog(primary_group, start_date, end_date):
    date_list = []
    # Note that all of these queries have to be made independently since joining from history model to history model
    # is not possible, and joining through the actual model will filter out any deleted items, thereby removing some
    # records

    # get historic jobs
    historic_jobs = Job.history.filter(group=primary_group).exclude(
        created__gt=end_date,
        history_date__gt=end_date
    ).order_by('-history_date')
    # get job tasks mapping to those jobs
    historic_job_tasks = JobTask.history.filter(job_id__in=[x.id for x in historic_jobs]).exclude(
        history_date__gt=end_date
    ).order_by('-history_date')
    # get product tasks mapping to those job tasks
    historic_product_tasks = ProductTask.history.filter(
        id__in=[x.product_task_id for x in historic_job_tasks]
    ).exclude(
        history_date__gt=end_date
    ).order_by('-history_date')
    # get tasks mapping to those product tasks
    historic_tasks = Task.history.filter(id__in=[x.task_id for x in historic_product_tasks]).exclude(
        history_date__gt=end_date
    ).order_by('-history_date')

    for date in utils.daterange(start_date, end_date):
        date_string = datetime.strftime(date, '%Y-%m-%d')
        date_dict = _build_default_dict_for_date(date_string)
        for job in _get_records_as_of_date(historic_jobs, date):
            # get most recent task records for job
            job_tasks = _get_records_as_of_date(historic_job_tasks, date, lambda x: x.job_id == job.id)
            for job_task in job_tasks:
                product_task = _get_records_as_of_date(historic_product_tasks, date, lambda x: x.id == job_task.product_task_id)[0]
                task = _get_records_as_of_date(historic_tasks, date, lambda x: x.id == product_task.task_id)[0]
                if job_task.completed_by is None:  # if the task was incomplete at this point
                    task_level = Task.get_level_text(task.expertise_level)
                    date_dict[task_level] += product_task.completion_time
        date_list.append(date_dict)
    return date_list


def _build_default_dict_for_date(date_string):
    default_breakdown = {'date': date_string}
    for expertise_level in Task.EXPERTISE_CHOICES:
        default_breakdown[expertise_level[1]] = 0
    return default_breakdown


def _get_records_as_of_date(records, date, sub_filter_func=None):
    records = filter(lambda x: x.history_date.date() <= date, records)
    if sub_filter_func:
        records = filter(sub_filter_func, records)
    return _build_unique_records(records)


def _build_unique_records(records_as_of_date):
    # assumes that records are ordered by history date descending
    id_set = set([x.id for x in records_as_of_date])
    most_recent_list = []
    for id_val in id_set:
        most_recent_list.append(
            filter(lambda x: x.id == id_val, records_as_of_date)[0]
        )
    return most_recent_list
