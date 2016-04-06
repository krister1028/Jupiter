from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render

from rest_framework import viewsets
from scheduler.serializers import UserSerializer


def index(request):
    return render(request, 'index.html')


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.queryset.filter(groups__in=self.request.user.groups.all())


class UserLogin(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def post(self, *args, **kwargs):
        user = authenticate(username=self.request.data['username'], password=self.request.data['password'])
        login(self.request, user)
        return HttpResponse('ok')

    def delete(self, *args, **kwargs):
        logout(self.request)

    def get_queryset(self):
        return self.queryset.filter(pk=self.request.user.pk)
