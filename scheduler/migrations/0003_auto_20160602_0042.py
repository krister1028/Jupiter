# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0002_auto_20160601_2320'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicaljob',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='historicaljobtask',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='job',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='jobstatus',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='jobtask',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='jobtype',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='product',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='producttask',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
        migrations.AddField(
            model_name='task',
            name='deleted',
            field=models.IntegerField(default=False),
        ),
    ]
