# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        ('scheduler', '0009_auto_20160516_0221'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyMetric',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('active_task_hours', models.TextField()),
                ('pending_task_hours', models.TextField()),
                ('job_count_by_type', models.TextField()),
                ('time_stamp', models.DateField(auto_now_add=True)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='JobLog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('job', models.IntegerField(choices=[(1, 'Daily Metric Job')])),
                ('error', models.CharField(max_length=255, null=True)),
                ('successful', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='job',
            name='completed_timestamp',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='started_timestamp',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='jobtask',
            name='completed_time',
            field=models.DateTimeField(null=True),
        ),
    ]
