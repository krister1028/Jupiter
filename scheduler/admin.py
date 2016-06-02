from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from scheduler.models import UserProfile, Product, Task, Job, ProductTask, JobStatus, JobType, JobLog, JobTask

admin.site.site_header = 'Jupiter Admin'


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'


# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, )


class ProductTaskInline(admin.StackedInline):
    model = ProductTask


class ProductAdmin(admin.ModelAdmin):
    model = Product
    inlines = (ProductTaskInline, )

# Re-register UserAdmin to add inlines
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Job)
admin.site.register(Task)
admin.site.register(Product, ProductAdmin)
admin.site.register(JobStatus)
admin.site.register(JobType)
admin.site.register(JobLog)
admin.site.register(JobTask)
