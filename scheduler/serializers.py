from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = serializers.SlugRelatedField(slug_field='user_type', read_only=True)

    class Meta:
        model = User
        fields = ('username', 'is_superuser', 'first_name', 'last_name', 'profile')
