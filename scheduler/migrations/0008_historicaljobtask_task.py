# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-07-22 05:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0007_auto_20160722_0043'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicaljobtask',
            name='task',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='scheduler.HistoricalTask'),
            preserve_default=False,
        ),
    ]