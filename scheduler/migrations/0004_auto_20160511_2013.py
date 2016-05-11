# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0003_auto_20160511_1946'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobtask',
            name='task',
        ),
        migrations.AddField(
            model_name='jobtask',
            name='product_task',
            field=models.ForeignKey(related_name='job_tasks', default=1, to='scheduler.ProductTask'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='jobtask',
            name='job',
            field=models.ForeignKey(related_name='job_tasks', to='scheduler.Job'),
        ),
        migrations.AlterField(
            model_name='producttask',
            name='task',
            field=models.ForeignKey(related_name='product_tasks', to='scheduler.Task'),
        ),
    ]
