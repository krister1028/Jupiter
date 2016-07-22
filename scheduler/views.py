from copy import copy

import time
from dateutil.parser import parse

from django.contrib.auth.models import User
from django.db.models import Q, Count, F, Sum, Max
from django.shortcuts import render
from rest_framework import viewsets
from rest_auth.views import LoginView, Response
from rest_framework.views import APIView

from scheduler.metric_helpers import get_initial_task_backlog, update_backlog_series, series_dict_to_series, \
    aggregate_task_completion
from scheduler.models import Product, Task, Job, JobStatus, JobType, ProductTask, JobTask, HistoricalJob
from scheduler.serializers import UserSerializer, ProductSerializer, TaskSerializer, JobSerializer, JobStatusSerializer, \
    JobTypeSerializer, ProductTaskSerializer, JobTaskSerializer


def index(request):
    return render(request, 'index.html')


class IsolateGroupMixin(object):
    def get_queryset(self):
        return self.queryset.filter(group=self.request.user.groups.all()[0])


class UserViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(groups__in=user.groups.all()).exclude(id=user.id)


class ProductViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductTaskViewSet(viewsets.ModelViewSet):
    queryset = ProductTask.objects.all()
    serializer_class = ProductTaskSerializer


class TaskViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class JobViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class JobStatusViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    queryset = JobStatus.objects.all()
    serializer_class = JobStatusSerializer


class JobTypeViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    queryset = JobType.objects.all()
    serializer_class = JobTypeSerializer


class JobTaskViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    queryset = JobTask.objects.all()
    serializer_class = JobTaskSerializer


class CustomLoginView(LoginView):
    response_serializer = UserSerializer

    def get_response(self):
        return Response(self.response_serializer(self.request.user).data)


class BackLogHours(APIView):

    def get(self, request, *args, **kwargs):
        primary_group = request.user.groups.all()[0]
        # start/end dates are required - not checking for a possible KeyError is ok here
        start_time = parse(request.query_params['start_date'])
        end_time = parse(request.query_params['end_date'])

        series_dict = get_initial_task_backlog(start_time, primary_group)

        data = JobTask.history.filter(
            completion_status_change=True,
            group=primary_group, history_date__gt=start_time, history_date__lte=end_time
        ).order_by('history_date')

        for record in data:
            update_backlog_series(series_dict, record)

        return Response(series_dict_to_series(series_dict))


class JobsCompleted(APIView):

    def get(self, request, *args, **kwargs):
        primary_group = request.user.groups.all()[0]
        # start/end dates are required - not checking for a possible KeyError is ok here
        start_time = parse(request.query_params['start_date'])
        end_time = parse(request.query_params['end_date'])

        data = HistoricalJob.objects.filter(group=primary_group, completed_timestamp__range=(start_time, end_time)).values(
            'started_timestamp', 'completed_timestamp', 'product__description', 'type__description', 'created')

        return Response(data)


class JobTaskCompletionByTechnician(APIView):

    def get(self, request, *args, **kwargs):
        primary_group = request.user.groups.all()[0]
        # start/end dates are required - not checking for a possible KeyError is ok here
        start_time = parse(request.query_params['start_date'])
        end_time = parse(request.query_params['end_date'])

        completion_data = JobTask.history.filter(
            task_technician__isnull=False,
            completion_status_change=True,
            group=primary_group,
            history_date__range=(start_time, end_time)
        ).values(
            'task_technician', 'task_expertise_description'
        ).annotate(Sum('completion_minutes_flow')).order_by()

        categories, series = aggregate_task_completion(completion_data)

        return Response({'categories': categories, 'series': series})
