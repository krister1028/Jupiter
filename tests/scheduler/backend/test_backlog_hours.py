import pytz
from django.test import TestCase
import datetime
from dateutil.parser import parse
from factories import JobFactory, GroupFactory, HistoricalJobTaskFactory
from scheduler.metric_helpers import get_default_start_end_dates, get_task_breakdown
from scheduler.models import Task, JobTask


class TestBackLogHours(TestCase):
    def setUp(self):
        self.group = GroupFactory.create()
        self.group.save()

    def test_default_dates_of_today(self):
        start_date, end_date = get_default_start_end_dates(1)
        self.assertEqual(start_date.date(), datetime.datetime.now(pytz.utc).date())
        self.assertEqual(end_date.date(), datetime.datetime.now(pytz.utc).date())

    def test_start_date_by_string(self):
        start_string = '2016-06-05T06:09:00.951891Z'
        created_date = parse(start_string).date()
        start_date, _ = get_default_start_end_dates(1, start_string)
        self.assertEqual(created_date, start_date)

    def test_start_date_by_model(self):
        group = GroupFactory.create()
        job_start = datetime.datetime.now(pytz.utc) - datetime.timedelta(10)
        job = JobFactory.create(group=group)
        job.created = job_start  # call this out of constructor to avoid auto_now
        job.save()
        start_date, _ = get_default_start_end_dates(group.pk)
        self.assertEqual(start_date, job_start)

    def test_task_breakdown_ignores_task_before_date_range(self):
        start_date = datetime.datetime(2015, 01, 01)
        end_date = datetime.datetime(2015, 01, 02)
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 12, 31))

        date_breakdown = get_task_breakdown(self.group, start_date, end_date)
        self.assert_empty_breakdown(date_breakdown)

    def test_task_breakdown_ignores_task_after_date_range(self):
        start_date = datetime.datetime(2015, 01, 01)
        end_date = datetime.datetime(2015, 01, 02)
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 03))

        date_breakdown = get_task_breakdown(self.group, start_date, end_date)
        self.assert_empty_breakdown(date_breakdown)

    def test_breakdown_counts_task(self):
        start_date = datetime.datetime(2015, 01, 01, tzinfo=pytz.utc)
        end_date = datetime.datetime(2015, 01, 01, tzinfo=pytz.utc)
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 01))

        date_breakdown = get_task_breakdown(self.group, start_date, end_date)
        self.assertTrue(date_breakdown[0][Task.get_level_text(Task.LOW)] == 1)

    def test_breakdown_sums_task_type(self):
        start_date = datetime.datetime(2015, 01, 01, tzinfo=pytz.utc)
        end_date = datetime.datetime(2015, 01, 01, tzinfo=pytz.utc)
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 01))
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 01))

        date_breakdown = get_task_breakdown(self.group, start_date, end_date)
        self.assertTrue(date_breakdown[0][Task.get_level_text(Task.LOW)] == 2)

    def test_breakdown_persists_for_future_dates(self):
        start_date = datetime.datetime(2015, 01, 01, tzinfo=pytz.utc)
        end_date = datetime.datetime(2015, 01, 02, tzinfo=pytz.utc)
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 01))

        date_breakdown = get_task_breakdown(self.group, start_date, end_date)
        self.assertTrue(date_breakdown[0][Task.get_level_text(Task.LOW)] == 1)
        self.assertTrue(date_breakdown[1][Task.get_level_text(Task.LOW)] == 1)

    def test_breakdown_does_not_sum_on_older_dates(self):
        start_date = datetime.datetime(2015, 01, 01, tzinfo=pytz.utc)
        end_date = datetime.datetime(2015, 01, 02, tzinfo=pytz.utc)
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 01))
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 02))

        date_breakdown = get_task_breakdown(self.group, start_date, end_date)
        self.assertTrue(date_breakdown[0][Task.get_level_text(Task.LOW)] == 1)
        self.assertTrue(date_breakdown[1][Task.get_level_text(Task.LOW)] == 2)

    def test_breakdown_persists(self):
        start_date = datetime.datetime(2015, 01, 01, tzinfo=pytz.utc)
        end_date = datetime.datetime(2015, 01, 02, tzinfo=pytz.utc)
        self.create_historical_task(Task.LOW, datetime.datetime(2015, 01, 01))

        date_breakdown = get_task_breakdown(self.group, start_date, end_date)
        self.assertTrue(date_breakdown[0][Task.get_level_text(Task.LOW)] == 1)
        self.assertTrue(date_breakdown[1][Task.get_level_text(Task.LOW)] == 1)

    ###############################################################################################
    # Helpers
    ###############################################################################################

    def assert_empty_breakdown(self, breakdown):
        for date_data in breakdown:
            for index, value in enumerate(date_data.values()):
                if index == 0:  # the first value is the date
                    continue
                self.assertEqual(value, 0)

    def create_historical_task(self, expertise_level, record_created=None):
        record_created = record_created or datetime.datetime.now()
        record_created.replace(tzinfo=pytz.utc)

        task = HistoricalJobTaskFactory.create()
        task.product_task.completion_time = 1
        task.product_task.task.expertise_level = expertise_level
        task.history_date = record_created
        task.job.group = self.group
        task.job.created = record_created
        task.job.save()
        task.product_task.save()
        task.product_task.task.save()
        task.instance.save()
        task.save()

        return task

