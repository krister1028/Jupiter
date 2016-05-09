# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0006_auto_20160509_1849'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='product',
            field=models.ForeignKey(default=1, to='scheduler.Product'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='jobtask',
            name='job',
            field=models.ForeignKey(related_name='job_tasks', to='scheduler.Job'),
        ),
        migrations.AlterField(
            model_name='jobtask',
            name='task',
            field=models.ForeignKey(related_name='jobs', to='scheduler.Task'),
        ),
    ]
