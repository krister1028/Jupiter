from django import http, test
from rest_framework import views as drf_views

from . import factories
from ... import views


class PermissionTestCase(test.TestCase):

    def test_has_permission(self):
        request = http.HttpRequest()
        org_user = factories.OrgUsersFactory.create()
        view = drf_views.APIView(kwargs={'organization_id': org_user.org_group.organization_id})
        request.user = org_user.user

        has_perm = views.OrgAccessPermission().has_permission(request, view)

        self.assertTrue(has_perm)
