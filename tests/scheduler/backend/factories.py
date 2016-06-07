import factory
import factory.fuzzy as fuzzy
from django.contrib.auth.models import Group

from scheduler.models import Job, JobTask, Product, ProductTask, JobStatus


class GroupFactory(factory.DjangoModelFactory):
    name = fuzzy.FuzzyText()

    class Meta:
        model = Group


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
    class Meta:
        model = ProductTask
