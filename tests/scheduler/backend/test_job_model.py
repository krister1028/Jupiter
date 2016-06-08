from django.test import TestCase
from backend.factories import JobFactory, ProductFactory, ProductTaskFactory, JobTaskFactory
from scheduler.models import Task, JobTask
from datetime import datetime


class JobTest(TestCase):
    def setUp(self):
        self.product = ProductFactory.create()
        self.job = JobFactory.create(product=self.product)

    def test_creates_job_tasks(self):
        ProductTaskFactory.create(product=self.product)
        # after saving, the product should be assigned
        self.assertEqual(len(self.job.product_tasks.all()), 0)
        self.job.save()
        self.assertEqual(len(self.job.product_tasks.all()), 1)

    def test_remaining_minutes_aggregated_by_type(self):
        ProductTaskFactory.create(product=self.product, completion_time=10, task__expertise_level=Task.LOW)
        ProductTaskFactory.create(product=self.product, completion_time=20, task__expertise_level=Task.LOW)
        ProductTaskFactory.create(product=self.product, completion_time=5, task__expertise_level=Task.MEDIUM)
        ProductTaskFactory.create(product=self.product, completion_time=10, task__expertise_level=Task.MEDIUM)
        self.job.save()
        self.assertEqual(self.job.get_remaining_task_minutes_by_expertise_level(Task.LOW), 30)
        self.assertEqual(self.job.get_remaining_task_minutes_by_expertise_level(Task.MEDIUM), 15)
        self.assertEqual(self.job.get_remaining_task_minutes_by_expertise_level(Task.HIGH), 0)

    def test_remaining_minutes_are_active_only(self):
        product_task = ProductTaskFactory.create(product=self.product, completion_time=10, task__expertise_level=Task.LOW)
        job_task = JobTaskFactory.create(
            job=self.job,
            product_task=product_task,
            completed_time=datetime.today(),
            status=JobTask.IN_PROGRESS
        )
        self.job.save()

        self.assertEqual(self.job.get_remaining_task_minutes_by_expertise_level(Task.LOW), 10)
        job_task.status = JobTask.COMPLETE
        job_task.save()
        self.assertEqual(self.job.get_remaining_task_minutes_by_expertise_level(Task.LOW), 0)
