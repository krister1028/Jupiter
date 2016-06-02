# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyMetric',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('active_task_hours', models.TextField()),
                ('pending_task_hours', models.TextField()),
                ('active_type_hours', models.TextField()),
                ('pending_type_hours', models.TextField()),
                ('job_count_by_type', models.TextField()),
                ('time_stamp', models.DateField(auto_now_add=True)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='HistoricalJob',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('rework', models.BooleanField(default=False)),
                ('created', models.DateTimeField(editable=False, blank=True)),
                ('description', models.CharField(max_length=255)),
                ('started_timestamp', models.DateTimeField(null=True)),
                ('completed_timestamp', models.DateTimeField(null=True)),
                ('history_id', models.AutoField(serialize=False, primary_key=True)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(max_length=1, choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')])),
                ('group', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='auth.Group', null=True)),
                ('history_user', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
                'verbose_name': 'historical job',
            },
        ),
        migrations.CreateModel(
            name='HistoricalJobTask',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('status', models.IntegerField(default=1, choices=[(1, 'Pending'), (2, 'In Progress'), (3, 'Complete')])),
                ('completed_time', models.DateTimeField(null=True)),
                ('history_id', models.AutoField(serialize=False, primary_key=True)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(max_length=1, choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')])),
                ('completed_by', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('history_user', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
                'verbose_name': 'historical job task',
            },
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rework', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('description', models.CharField(max_length=255)),
                ('started_timestamp', models.DateTimeField(null=True)),
                ('completed_timestamp', models.DateTimeField(null=True)),
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
        migrations.CreateModel(
            name='JobStatus',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(max_length=255)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='JobTask',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(default=1, choices=[(1, 'Pending'), (2, 'In Progress'), (3, 'Complete')])),
                ('completed_time', models.DateTimeField(null=True)),
                ('completed_by', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True)),
                ('job', models.ForeignKey(related_name='job_tasks', to='scheduler.Job')),
            ],
        ),
        migrations.CreateModel(
            name='JobType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(max_length=255)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(default=None, max_length=255)),
                ('code', models.CharField(max_length=8)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='ProductTask',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('completion_time', models.IntegerField(null=True)),
                ('product', models.ForeignKey(related_name='tasks', to='scheduler.Product')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(max_length=255)),
                ('abbreviation', models.CharField(max_length=20)),
                ('expertise_level', models.IntegerField(choices=[(1, 'Low'), (2, 'Medium'), (3, 'High'), (4, 'CP')])),
                ('min_completion_time', models.IntegerField()),
                ('max_completion_time', models.IntegerField()),
                ('cost', models.IntegerField()),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_type', models.IntegerField(default=1, choices=[(1, 'Technician'), (2, 'Administrator')])),
                ('user', models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='producttask',
            name='task',
            field=models.ForeignKey(related_name='product_tasks', to='scheduler.Task'),
        ),
        migrations.AddField(
            model_name='jobtask',
            name='product_task',
            field=models.ForeignKey(related_name='job_tasks', to='scheduler.ProductTask'),
        ),
        migrations.AddField(
            model_name='job',
            name='product',
            field=models.ForeignKey(to='scheduler.Product'),
        ),
        migrations.AddField(
            model_name='job',
            name='status',
            field=models.ForeignKey(to='scheduler.JobStatus', null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='type',
            field=models.ForeignKey(to='scheduler.JobType', null=True),
        ),
        migrations.AddField(
            model_name='historicaljobtask',
            name='job',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='scheduler.Job', null=True),
        ),
        migrations.AddField(
            model_name='historicaljobtask',
            name='product_task',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='scheduler.ProductTask', null=True),
        ),
        migrations.AddField(
            model_name='historicaljob',
            name='product',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='scheduler.Product', null=True),
        ),
        migrations.AddField(
            model_name='historicaljob',
            name='status',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='scheduler.JobStatus', null=True),
        ),
        migrations.AddField(
            model_name='historicaljob',
            name='type',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.DO_NOTHING, db_constraint=False, blank=True, to='scheduler.JobType', null=True),
        ),
    ]
