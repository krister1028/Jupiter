from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

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


class AuthView(APIView):
    authentication_classes = (SessionAuthentication,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
        login(request, user)
        return Response(self.serializer_class(request.user).data)
