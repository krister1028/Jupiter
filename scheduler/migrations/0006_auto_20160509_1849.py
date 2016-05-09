# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0005_job'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobTask',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(choices=[(1, 'Pending'), (2, 'In Progress'), (3, 'Complete')])),
            ],
        ),
        migrations.RemoveField(
            model_name='job',
            name='status',
        ),
        migrations.AddField(
            model_name='jobtask',
            name='job',
            field=models.ForeignKey(to='scheduler.Job'),
        ),
        migrations.AddField(
            model_name='jobtask',
            name='task',
            field=models.ForeignKey(to='scheduler.Task'),
        ),
    ]
