# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0003_auto_20160602_0042'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historicaljobtask',
            name='task',
        ),
        migrations.RemoveField(
            model_name='job',
            name='tasks',
        ),
        migrations.RemoveField(
            model_name='jobtask',
            name='task',
        ),
        migrations.AddField(
            model_name='historicaljobtask',
            name='product_task',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='scheduler.ProductTask', null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='product_tasks',
            field=models.ManyToManyField(to='scheduler.ProductTask', through='scheduler.JobTask'),
        ),
        migrations.AddField(
            model_name='jobtask',
            name='product_task',
            field=models.ForeignKey(default=1, to='scheduler.ProductTask'),
            preserve_default=False,
        ),
    ]
