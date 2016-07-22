# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-07-22 00:40
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('scheduler', '0005_auto_20160721_0147'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historicaljobtask',
            name='completed_by_name',
        ),
        migrations.AddField(
            model_name='historicaljobtask',
            name='task_technician',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='historicaljobtask',
            name='completion_minutes',
            field=models.IntegerField(null=True),
        ),
    ]
