# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0005_auto_20160602_0343'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='status',
            field=models.ForeignKey(default=1, to='scheduler.JobStatus'),
            preserve_default=False,
        ),
    ]
