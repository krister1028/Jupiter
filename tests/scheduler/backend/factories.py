import factory
from scheduler.models import Job


class JobFactory(factory.Factory):
    class Meta:
        model = Job