from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import viewsets
from rest_auth.views import LoginView, Response

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


class CustomLoginView(LoginView):
    response_serializer = UserSerializer

    def get_response(self):
        return Response(self.response_serializer(self.request.user).data)