from django.contrib.auth.models import User
from rest_framework import serializers

from scheduler.models import Product, Task, Job, JobTask


class CurrentGroupDefault(serializers.CurrentUserDefault):
    def get_primary_group(self):
        return self.user.groups.all()[0]

    def __call__(self, *args, **kwargs):
        return self.get_primary_group()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = serializers.SlugRelatedField(slug_field='user_type', read_only=True)

    class Meta:
        model = User
        fields = ('username', 'is_superuser', 'first_name', 'last_name', 'profile')


class ProductSerializer(serializers.ModelSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = Product
        exclude = ('tasks', )


class TaskSerializer(serializers.ModelSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = Task


class JobTaskSerializer(serializers.ModelSerializer):
    task = TaskSerializer()

    class Meta:
        model = JobTask


class JobSerializer(serializers.ModelSerializer):
    job_tasks = JobTaskSerializer(many=True)
    product = ProductSerializer()

    class Meta:
        model = Job
        exclude = ('group', )
