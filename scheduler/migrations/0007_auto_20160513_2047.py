# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        ('scheduler', '0006_auto_20160513_2042'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobstatus',
            name='group',
            field=models.ForeignKey(default=1, to='auth.Group'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobtype',
            name='group',
            field=models.ForeignKey(default=1, to='auth.Group'),
            preserve_default=False,
        ),
    ]
