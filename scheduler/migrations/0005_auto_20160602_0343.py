# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0004_auto_20160602_0321'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historicaljob',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='historicaljobtask',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='job',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='jobstatus',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='jobtask',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='jobtype',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='product',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='producttask',
            name='deleted',
        ),
        migrations.RemoveField(
            model_name='task',
            name='deleted',
        ),
    ]
