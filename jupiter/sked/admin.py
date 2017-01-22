from django.contrib import admin

from . import models

admin.site.register(models.Organization)
admin.site.register(models.OrgGroup)
admin.site.register(models.OrgUsers)
