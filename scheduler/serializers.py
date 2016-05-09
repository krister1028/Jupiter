from django.contrib.auth.models import User
from rest_framework import serializers

from scheduler.models import Product, Task, Job


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = serializers.SlugRelatedField(slug_field='user_type', read_only=True)

    class Meta:
        model = User
        fields = ('username', 'is_superuser', 'first_name', 'last_name', 'profile')


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job