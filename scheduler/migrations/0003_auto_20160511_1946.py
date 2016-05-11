# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0002_auto_20160510_0035'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobTask',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(default=1, choices=[(1, 'Pending'), (2, 'In Progress'), (3, 'Complete')])),
                ('job', models.ForeignKey(related_name='tasks', to='scheduler.Job')),
            ],
        ),
        migrations.RemoveField(
            model_name='producttask',
            name='status',
        ),
        migrations.AddField(
            model_name='jobtask',
            name='task',
            field=models.ForeignKey(to='scheduler.ProductTask'),
        ),
    ]
