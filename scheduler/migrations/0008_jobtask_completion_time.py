# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0007_auto_20160509_1924'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobtask',
            name='completion_time',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
