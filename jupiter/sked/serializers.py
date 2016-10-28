from rest_framework import serializers
from rest_framework.reverse import reverse

from . import models


class OrganizationSerializer(serializers.ModelSerializer):
    technicians = serializers.SerializerMethodField()
    expertises = serializers.SerializerMethodField()
    jobs = serializers.SerializerMethodField()
    job_types = serializers.SerializerMethodField()
    products = serializers.SerializerMethodField()
    tasks = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()

    def get_technicians(self, obj):
        return reverse('technician-list', kwargs={'organization_id': obj.pk}, request=self.context['request'])

    def get_expertises(self, obj):
        return reverse('expertise-list', kwargs={'organization_id': obj.pk}, request=self.context['request'])

    def get_jobs(self, obj):
        return reverse('job-list', kwargs={'organization_id': obj.pk}, request=self.context['request'])

    def get_job_types(self, obj):
        return reverse('jobtype-list', kwargs={'organization_id': obj.pk}, request=self.context['request'])

    def get_products(self, obj):
        return reverse('product-list', kwargs={'organization_id': obj.pk}, request=self.context['request'])

    def get_tasks(self, obj):
        return reverse('task-list', kwargs={'organization_id': obj.pk}, request=self.context['request'])

    def get_dates(self, obj):
        return reverse('date-list', kwargs={'organization_id': obj.pk}, request=self.context['request'])

    class Meta:
        model = models.Organization


class DimensionSerializer(serializers.ModelSerializer):

    def get_default_field_names(self, *args, **kwargs):
        field_names = super(DimensionSerializer, self).get_default_field_names(*args, **kwargs)
        field_names.remove('deleted')
        field_names.remove('organization')
        return field_names


class TechnicianSerializer(DimensionSerializer):

    class Meta:
        model = models.Technician


class ExpertiseSerializer(DimensionSerializer):

    class Meta:
        model = models.Expertise


class JobSerializer(DimensionSerializer):

    class Meta:
        model = models.Job


class JobTasksSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.JobTasks
        exclude = ['id', 'job']


class JobTypeSerializer(DimensionSerializer):

    class Meta:
        model = models.JobType


class ProductSerializer(DimensionSerializer):

    class Meta:
        model = models.Product


class ProductTasksSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ProductTasks
        exclude = ['id', 'product']


class TaskSerializer(DimensionSerializer):

    class Meta:
        model = models.Task


class DateSerializer(DimensionSerializer):

    class Meta:
        model = models.Date
