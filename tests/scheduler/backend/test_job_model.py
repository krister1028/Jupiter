from django.test import TestCase
from backend.factories import JobFactory


class JobTest(TestCase):
    def setUp(self):
        self.job = JobFactory.create()

    def test_thing(self):
        print self.job
        assert self.job.id is None