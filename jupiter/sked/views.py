from django.utils import timezone
from rest_framework import permissions, viewsets
from django.contrib.auth import models

from . import models, serializers


class OrgAccessPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_active and models.OrgUsers.objects.filter(
            user=request.user,
            org_group__organization=view.kwargs['organization_id'],
        ).exists()


class OrganizationViewset(viewsets.ReadOnlyModelViewSet):
    queryset = models.Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer


class DimensionViewset(viewsets.ModelViewSet):
    permission_classes = (OrgAccessPermission,)

    def perform_create(self, serializer):
        serializer.save(organization_id=self.kwargs['organization_id'])

    def perform_destroy(self, instance):
        instance.deleted = timezone.now()
        instance.save(update_fields=['deleted'])

    def get_queryset(self):
        queryset = super(DimensionViewset, self).get_queryset()
        return queryset.filter(
            deleted__isnull=True,
            organization=self.kwargs['organization_id'],
        )


class TechnicianViewset(DimensionViewset):
    queryset = models.Technician.objects.all()
    serializer_class = serializers.TechnicianSerializer


class ExpertiseViewset(DimensionViewset):
    queryset = models.Expertise.objects.all()
    serializer_class = serializers.ExpertiseSerializer


class JobViewset(DimensionViewset):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer


class JobTasksViewset(viewsets.ModelViewSet):
    queryset = models.JobTasks.objects.all()
    serializer_class = serializers.JobTasksSerializer

    def perform_create(self, serializer):
        serializer.save(job_id=self.kwargs['job_id'])


class JobTypeViewset(DimensionViewset):
    queryset = models.JobType.objects.all()
    serializer_class = serializers.JobTypeSerializer


class ProductViewset(DimensionViewset):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer


class ProductTasksViewset(viewsets.ModelViewSet):
    queryset = models.ProductTasks.objects.all()
    serializer_class = serializers.ProductTasksSerializer

    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs['product_id'])


class TaskViewset(DimensionViewset):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer


class DateViewset(DimensionViewset):
    queryset = models.Date.objects.all()
    serializer_class = serializers.DateSerializer
