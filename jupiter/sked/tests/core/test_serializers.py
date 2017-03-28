import unittest

from django import http

from ... import models, serializers


class OrganizationSerializerTestCase(unittest.TestCase):

    def setUp(self):
        self.request = http.HttpRequest()
        self.request.META['SERVER_NAME'] = 'testhost'
        self.request.META['SERVER_PORT'] = 80
        self.organization = models.Organization()
        self.serialized = serializers.OrganizationSerializer(
            self.organization,
            context={'request': self.request},
        ).data

    def test_serialized(self):
        self.assertEquals(self.serialized, {
            'id': str(self.organization.pk),
            'description': '',
            'dates': 'http://testhost/api/v1/orgs/{}/dates/'.format(self.organization.pk),
            'expertises': 'http://testhost/api/v1/orgs/{}/expertises/'.format(self.organization.pk),
            'jobs': 'http://testhost/api/v1/orgs/{}/jobs/'.format(self.organization.pk),
            'job_types': 'http://testhost/api/v1/orgs/{}/job-types/'.format(self.organization.pk),
            'products': 'http://testhost/api/v1/orgs/{}/products/'.format(self.organization.pk),
            'tasks': 'http://testhost/api/v1/orgs/{}/tasks/'.format(self.organization.pk),
            'technicians': 'http://testhost/api/v1/orgs/{}/technicians/'.format(self.organization.pk),
        })
