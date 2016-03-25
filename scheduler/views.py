from django.contrib.auth.models import User
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
