from dateutil.parser import parse

from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets
from rest_auth.views import LoginView, Response
from rest_framework.views import APIView

from scheduler.metric_helpers import BackLogMetrics

from scheduler.models import Product, Task, Job, JobStatus, JobType, ProductTask, JobTask, JobTaskMetrics
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
        start_time = parse(request.query_params['startDate'])
        end_time = parse(request.query_params['endDate'])

        data = list(JobTaskMetrics.objects.filter(date__gt=start_time, date__lte=end_time).values().order_by('date'))
        try:
            # grab the status as of the query start
            data.insert(0, JobTaskMetrics.objects.filter(group=primary_group, date__lte=start_time).latest('date'))
        except JobTaskMetrics.DoesNotExist:
            pass

        return Response(data)
