# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0010_auto_20160521_2231'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailymetric',
            name='active_type_hours',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dailymetric',
            name='pending_type_hours',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
