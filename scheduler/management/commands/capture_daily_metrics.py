from django.core.management import BaseCommand

from scheduler.management.jobs.daily_metrics import DailyMetricJob
from scheduler.models import JobLog


class Command(BaseCommand):
    def handle(self, *args, **options):
        job_log = JobLog(job=JobLog.DAILY_METRICS)
        try:
            DailyMetricJob().run()
            job_log.successful = True
        except Exception as e:
            job_log.error = e
            job_log.successful = False
        job_log.save()
