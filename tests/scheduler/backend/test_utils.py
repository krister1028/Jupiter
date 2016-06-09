from django.test import TestCase
import datetime
from scheduler.utils import daterange


class TestUtils(TestCase):
    def setUp(self):
        pass

    def test_date_range_length(self):
        start_date = datetime.datetime(2015, 01, 01)
        end_date = datetime.datetime(2015, 01, 20)
        ranges = daterange(start_date, end_date)
        self.assertEqual(sum(1 for _ in ranges), 20)

    def test_date_range_values(self):
        start_date = datetime.datetime(2015, 01, 01)
        end_date = datetime.datetime(2015, 01, 20)
        ranges = daterange(start_date, end_date)
        for date in ranges:
            self.assertLessEqual(date, end_date)
            self.assertGreaterEqual(date, start_date)
