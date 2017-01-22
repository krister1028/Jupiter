from django.contrib import auth
import factory

from ... import models


class UserFactory(factory.DjangoModelFactory):

    class Meta:
        model = auth.get_user_model()


class OrgFactory(factory.DjangoModelFactory):

    class Meta:
        model = models.Organization


class OrgGroupFactory(factory.DjangoModelFactory):
    organization = factory.SubFactory(OrgFactory)

    class Meta:
        model = models.OrgGroup


class OrgUsersFactory(factory.DjangoModelFactory):
    org_group = factory.SubFactory(OrgGroupFactory)
    user = factory.SubFactory(UserFactory)

    class Meta:
        model = models.OrgUsers
