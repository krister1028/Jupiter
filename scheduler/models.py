from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    TECHNICIAN = 1
    ADMINISTRATOR = 2
    USER_TYPE_CHOICES = (
        (TECHNICIAN, 'Technician'),
        (ADMINISTRATOR, 'Administrator')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.IntegerField(choices=USER_TYPE_CHOICES, default=TECHNICIAN)

