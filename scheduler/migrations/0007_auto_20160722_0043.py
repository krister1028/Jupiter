# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-07-22 00:43
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0006_auto_20160722_0040'),
    ]

    operations = [
        migrations.RenameField(
            model_name='historicaljobtask',
            old_name='completion_minutes',
            new_name='completion_minutes_flow',
        ),
    ]
