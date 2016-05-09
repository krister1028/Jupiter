# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        ('scheduler', '0004_auto_20160509_1822'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(choices=[(1, 'Pending'), (2, 'In Progress'), (3, 'Complete')])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('description', models.CharField(max_length=255)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
    ]
