# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0007_auto_20160513_2047'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='rework',
            field=models.BooleanField(default=False),
        ),
    ]
