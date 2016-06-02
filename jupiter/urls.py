"""jupiter URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from rest_framework import routers

from scheduler import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'product-tasks', views.ProductTaskViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'jobs', views.JobViewSet)
router.register(r'job-statuses', views.JobStatusViewSet)
router.register(r'job-types', views.JobTypeViewSet)
router.register(r'job-tasks', views.JobTaskViewSet)
router.register(r'daily-metrics', views.DailyMetricViewSet)

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^rest-auth/login/$', views.CustomLoginView.as_view()),
    url(r'^rest-auth/', include('rest_auth.urls'))
]
