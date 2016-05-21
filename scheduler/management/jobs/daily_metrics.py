import json
from collections import defaultdict

from django.contrib.auth.models import Group

from scheduler.models import DailyMetric, JobTask, JobType


class DailyMetricJob(object):
    def init(self):
        self.group = None

    def run(self):
        for group in Group.objects.all():
            self.group = group
            DailyMetric(
                group=group,
                active_task_hours=self.get_task_hours(JobTask.IN_PROGRESS),
                pending_task_hours=self.get_task_hours(JobTask.PENDING),
                active_type_hours=self.get_type_hours(JobTask.IN_PROGRESS),
                pending_type_hours=self.get_type_hours(JobTask.PENDING)
            ).save()

    def get_task_hours(self, task_status):
        task_minutes = defaultdict(lambda: 0)
        tasks = JobTask.objects.filter(status=task_status, job__group=self.group)
        for task in tasks:
            task_minutes[task.description] += task.product_task.completion_time
        return json.dumps(task_minutes)

    def get_type_hours(self, task_status):
        type_minutes = {}
        for type in JobType.objects.filter(group=self.group):
            time = sum([x.product_task.completion_time
                        for x in JobTask.objects.filter(status=task_status, job__group=self.group, job__type=type)])
            type_minutes[type.description] = time
        return json.dumps(type_minutes)
