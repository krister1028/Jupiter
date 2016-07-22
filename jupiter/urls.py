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

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^rest-auth/login/$', views.CustomLoginView.as_view()),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^backlog-hours/$', views.BackLogHours.as_view()),
    url(r'^jobs-completed-by-product/$', views.JobsCompletedByProduct.as_view()),
    url(r'^jobs-completed-by-type/$', views.JobsCompletedByType.as_view()),
    url(r'^task-completion-by-tech/$', views.JobTaskCompletionByTechnician.as_view())
]
