import pytz
from django.test import TestCase
import datetime
from dateutil.parser import parse
from factories import JobFactory, GroupFactory
from scheduler.metric_helpers import get_default_start_end_dates


class TestBackLogHours(TestCase):

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
