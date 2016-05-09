# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='user_type',
            field=models.IntegerField(default=1, choices=[(1, 'Technician'), (2, 'Administrator')]),
        ),
    ]
