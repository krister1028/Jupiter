# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0008_job_rework'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='expertise_level',
            field=models.IntegerField(choices=[(1, 'Low'), (2, 'Medium'), (3, 'High'), (4, 'CP')]),
        ),
    ]
