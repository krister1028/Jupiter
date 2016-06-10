import json

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_auth.views import LoginView, Response
from scheduler.metric_helpers import get_default_start_end_dates, get_task_backlog

from scheduler.models import Product, Task, Job, JobStatus, JobType, ProductTask, JobTask
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


class JobTaskViewSet(viewsets.ModelViewSet):
    queryset = JobTask.objects.all()
    serializer_class = JobTaskSerializer


class CustomLoginView(LoginView):
    response_serializer = UserSerializer

    def get_response(self):
        return Response(self.response_serializer(self.request.user).data)


def backlog_hours(request):
    primary_group = request.user.groups.all()[0]
    start_date, end_date = get_default_start_end_dates(request.user, request.GET.get('start_date'), request.GET.get('end_date'))

    date_list = get_task_backlog(primary_group, start_date, end_date)
    return HttpResponse(json.dumps(date_list))
