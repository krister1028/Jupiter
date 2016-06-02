from django.contrib.auth.models import User
from rest_framework import serializers

from scheduler.models import Product, Task, Job, ProductTask, JobTask, JobType, JobStatus, DailyMetric


class CurrentGroupDefault(serializers.CurrentUserDefault):
    def get_primary_group(self):
        return self.user.groups.all()[0]

    def __call__(self, *args, **kwargs):
        return self.get_primary_group()


class IDIncludeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = serializers.SlugRelatedField(slug_field='user_type', read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'is_superuser', 'first_name', 'last_name', 'profile')


class TaskSerializer(IDIncludeSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = Task


class ProductTaskSerializer(IDIncludeSerializer):
    description = serializers.CharField(read_only=True)
    min_completion_time = serializers.IntegerField(read_only=True)
    max_completion_time = serializers.IntegerField(read_only=True)

    class Meta:
        model = ProductTask


class ProductSerializer(IDIncludeSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = Product


class JobTaskSerializer(IDIncludeSerializer):
    description = serializers.CharField(read_only=True)
    completion_time = serializers.IntegerField(read_only=True)

    class Meta:
        model = JobTask


class JobTypeSerializer(IDIncludeSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = JobType


class JobStatusSerializer(IDIncludeSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = JobStatus


class JobSerializer(IDIncludeSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = Job


class DailyMetricSerializer(IDIncludeSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = DailyMetric
