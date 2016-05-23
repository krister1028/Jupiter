# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0012_statushistory'),
    ]

    operations = [
        migrations.AlterField(
            model_name='statushistory',
            name='status',
            field=models.IntegerField(null=True),
        ),
    ]
