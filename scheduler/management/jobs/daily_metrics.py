import json

from django.contrib.auth.models import Group

from scheduler.models import DailyMetric, JobTask, JobType


class DailyMetricJob(object):
    def run(self):
        for group in Group.objects.all():
            DailyMetric(
                group=group,
                active_task_hours=self.get_active_task_hours()
            ).save()

    @staticmethod
    def get_active_task_hours():
        for task in JobTask.objects.all():
            pass

    @staticmethod
    def get_job_count_by_type():
        job_count_by_type = {}
        for job_type in JobType.objects.all():
            job_count_by_type[job_type.description] = 1

        return json.dumps(job_count_by_type)
