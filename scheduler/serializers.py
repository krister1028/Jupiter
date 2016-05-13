from django.contrib.auth.models import User
from rest_framework import serializers

from scheduler.models import Product, Task, Job, ProductTask, JobTask, JobType, JobStatus


class CurrentGroupDefault(serializers.CurrentUserDefault):
    def get_primary_group(self):
        return self.user.groups.all()[0]

    def __call__(self, *args, **kwargs):
        return self.get_primary_group()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = serializers.SlugRelatedField(slug_field='user_type', read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'is_superuser', 'first_name', 'last_name', 'profile')


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
    description = serializers.CharField(read_only=True)
    completion_time = serializers.IntegerField(read_only=True)

    class Meta:
        model = JobTask
        exclude = ('job', )


class JobTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = JobType


class JobStatusSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    group = serializers.HiddenField(default=CurrentGroupDefault())

    class Meta:
        model = JobStatus


class JobSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    product_id = serializers.IntegerField()
    group = serializers.HiddenField(default=CurrentGroupDefault())
    job_tasks = JobTaskSerializer(many=True, required=False)
    type = JobTypeSerializer(required=False)
    status = JobStatusSerializer(required=False)

    def create(self, validated_data):
        job = super(JobSerializer, self).create(validated_data)
        JobTask.create_for_job(job)
        return job

    def update(self, instance, validated_data):
        # save main instance
        job_tasks = validated_data.pop('job_tasks')
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        # save associated tasks
        for task in job_tasks:
            job_task = JobTask.objects.get_or_create(
                job=instance,
                product_task=task['product_task'],
            )[0]
            excluded_fields = ['id', 'job', 'product_task']
            for field in JobTask._meta.fields:
                column = field.column.rstrip('_id')  # account for FK's in column names
                new_value = task.get(column)
                if column and column not in excluded_fields:
                    setattr(job_task, column, new_value)
            job_task.save()

        return instance

    class Meta:
        model = Job
        fields = ('id', 'description', 'product_id', 'group', 'created', 'job_tasks', 'type', 'status')
