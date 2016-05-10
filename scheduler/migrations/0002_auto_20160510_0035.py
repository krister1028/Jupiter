# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producttask',
            name='status',
            field=models.IntegerField(default=1, choices=[(1, 'Pending'), (2, 'In Progress'), (3, 'Complete')]),
        ),
    ]
