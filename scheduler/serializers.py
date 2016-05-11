from django.contrib.auth.models import User
from rest_framework import serializers

from scheduler.models import Product, Task, Job, ProductTask, JobTask


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


class TaskSerializer(serializers.ModelSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = Task


class ProductTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductTask
        exclude = ('product', )


class ProductSerializer(serializers.ModelSerializer):
    group = serializers.HiddenField(default=CurrentGroupDefault())
    tasks = ProductTaskSerializer(many=True)

    def create(self, validated_data):
        related_tasks = validated_data.pop('tasks')
        product = Product(**validated_data)
        product.save()

        for task in related_tasks:
            task['product'] = product
            ProductTask(**task).save()

        return product

    class Meta:
        model = Product


class JobTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobTask
        exclude = ('job', )


class JobSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    product_id = serializers.IntegerField()
    group = serializers.HiddenField(default=CurrentGroupDefault())
    job_tasks = JobTaskSerializer(many=True, read_only=True)

    def create(self, validated_data):
        job = super(JobSerializer, self).create(validated_data)
        JobTask.create_for_job(job)
        return job

    class Meta:
        model = Job
        fields = ('id', 'description', 'product_id', 'group', 'created', 'job_tasks')
