from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets
from rest_auth.views import LoginView, Response

from scheduler.models import Product, Task, Job
from scheduler.serializers import UserSerializer, ProductSerializer, TaskSerializer, JobSerializer


def index(request):
    return render(request, 'index.html')


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(groups__in=user.groups.all()).exclude(id=user.id)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        return self.queryset.filter(group__in=self.request.user.groups.all())


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        return self.queryset.filter(group__in=self.request.user.groups.all())


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_queryset(self):
        return self.queryset.filter(group__in=self.request.user.groups.all())


class CustomLoginView(LoginView):
    response_serializer = UserSerializer

    def get_response(self):
        return Response(self.response_serializer(self.request.user).data)