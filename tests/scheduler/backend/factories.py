import factory
import factory.fuzzy as fuzzy
from django.contrib.auth.models import Group

from scheduler.models import Job, JobTask, Product, ProductTask, JobStatus, Task


expertise_choices = [c[0] for c in Task.EXPERTISE_CHOICES]


class GroupFactory(factory.DjangoModelFactory):
    name = fuzzy.FuzzyText()

    class Meta:
        model = Group


class TaskFactory(factory.DjangoModelFactory):
    group = factory.SubFactory(GroupFactory)
    expertise_level = fuzzy.FuzzyChoice(expertise_choices)
    min_completion_time = fuzzy.FuzzyInteger(999)
    max_completion_time = fuzzy.FuzzyInteger(999)
    cost = fuzzy.FuzzyInteger(999)

    class Meta:
        model = Task


class ProductFactory(factory.DjangoModelFactory):
    group = factory.SubFactory(GroupFactory)
    description = fuzzy.FuzzyText()

    class Meta:
        model = Product


class JobStatusFactory(factory.DjangoModelFactory):
    group = factory.SubFactory(GroupFactory)

    class Meta:
        model = JobStatus


class JobFactory(factory.DjangoModelFactory):
    group = factory.SubFactory(GroupFactory)
    product = factory.SubFactory(ProductFactory)
    status = factory.SubFactory(JobStatusFactory)

    class Meta:
        model = Job


class JobTaskFactory(factory.DjangoModelFactory):
    class Meta:
        model = JobTask


class ProductTaskFactory(factory.DjangoModelFactory):
    task = factory.SubFactory(TaskFactory)

    class Meta:
        model = ProductTask
