from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('orgs', views.OrganizationViewset)
router.register('orgs/(?P<organization_id>[^/]+)/technicians', views.TechnicianViewset)
router.register('orgs/(?P<organization_id>[^/]+)/expertises', views.ExpertiseViewset)
router.register('orgs/(?P<organization_id>[^/]+)/jobs', views.JobViewset)
router.register('orgs/(?P<organization_id>[^/]+)/jobs/(?P<job_id>[^/]+)/tasks', views.JobTasksViewset)
router.register('orgs/(?P<organization_id>[^/]+)/job-types', views.JobTypeViewset)
router.register('orgs/(?P<organization_id>[^/]+)/products', views.ProductViewset)
router.register('orgs/(?P<organization_id>[^/]+)/products/(?P<product_id>[^/]+)/tasks', views.ProductTasksViewset)
router.register('orgs/(?P<organization_id>[^/]+)/tasks', views.TaskViewset)
router.register('orgs/(?P<organization_id>[^/]+)/dates', views.DateViewset)

urlpatterns = router.urls
