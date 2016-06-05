import json
from collections import defaultdict

from django.contrib.auth.models import User
from django.db.models import Min
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_auth.views import LoginView, Response
from datetime import datetime
import utils

from scheduler.models import Product, Task, Job, JobStatus, JobType, DailyMetric, ProductTask, JobTask
from scheduler.serializers import UserSerializer, ProductSerializer, TaskSerializer, JobSerializer, JobStatusSerializer, \
    JobTypeSerializer, DailyMetricSerializer, ProductTaskSerializer, JobTaskSerializer


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


class JobTaskViewSet(viewsets.ModelViewSet):
    queryset = JobTask.objects.all()
    serializer_class = JobTaskSerializer


class CustomLoginView(LoginView):
    response_serializer = UserSerializer

    def get_response(self):
        return Response(self.response_serializer(self.request.user).data)


class DailyMetricViewSet(viewsets.ModelViewSet, IsolateGroupMixin):
    queryset = DailyMetric.objects.all()
    serializer_class = DailyMetricSerializer


def backlog_hours(request):
    context = {}
    primary_group = request.user.groups.all()[0]
    start_date_string = request.GET.get('start_date')
    end_date_string = request.GET.get('end_date')
    # get start/end dates
    if start_date_string:
        start_date = utils.parse_date_string(start_date_string)
    else:
        start_date = Job.objects.filter(group=primary_group).aggregate(Min('created'))['created__min'].date()
    if end_date_string:
        end_date = utils.parse_date_string(end_date_string).date()
    else:
        end_date = datetime.today().date()
    all_jobs = Job.objects.filter(group=primary_group).exclude(completed_timestamp__lt=start_date, created__gt=end_date)
    records = Job.history.filter(id__in=[j.id for j in all_jobs]).order_by('-history_date')

    for date in utils.daterange(start_date, end_date):
        time_string = datetime.strftime(date, '%Y-%m-%d')
        context[time_string] = defaultdict(lambda: 0)
        for job in all_jobs:
            try:
                status_on_date = filter(lambda x: x.id == job.id and x.history_date.date() <= date, records)[0]
            except IndexError:
                continue
            if status_on_date.completed_timestamp is None:
                for level in Task.EXPERTISE_CHOICES:
                    context[time_string][level[1]] += status_on_date.instance.get_task_minutes_by_expertise_level(level[0])
    return HttpResponse(json.dumps(context))


# want to know on a given date: list of jobs with null timestamps