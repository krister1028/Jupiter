# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historicaljobtask',
            name='product_task',
        ),
        migrations.RemoveField(
            model_name='jobtask',
            name='product_task',
        ),
        migrations.AddField(
            model_name='historicaljobtask',
            name='task',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='scheduler.Task', null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='tasks',
            field=models.ManyToManyField(to='scheduler.Task', through='scheduler.JobTask'),
        ),
        migrations.AddField(
            model_name='jobtask',
            name='task',
            field=models.ForeignKey(default=1, to='scheduler.Task'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='tasks',
            field=models.ManyToManyField(to='scheduler.Task', through='scheduler.ProductTask'),
        ),
        migrations.AlterField(
            model_name='historicaljob',
            name='completed_timestamp',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaljob',
            name='started_timestamp',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='historicaljobtask',
            name='completed_time',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='completed_timestamp',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='started_timestamp',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='status',
            field=models.ForeignKey(blank=True, to='scheduler.JobStatus', null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='type',
            field=models.ForeignKey(blank=True, to='scheduler.JobType', null=True),
        ),
        migrations.AlterField(
            model_name='joblog',
            name='error',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='jobtask',
            name='completed_by',
            field=models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='jobtask',
            name='completed_time',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='jobtask',
            name='job',
            field=models.ForeignKey(to='scheduler.Job'),
        ),
        migrations.AlterField(
            model_name='producttask',
            name='completion_time',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='producttask',
            name='product',
            field=models.ForeignKey(to='scheduler.Product'),
        ),
        migrations.AlterField(
            model_name='producttask',
            name='task',
            field=models.ForeignKey(to='scheduler.Task'),
        ),
    ]
