# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0011_auto_20160521_2309'),
    ]

    operations = [
        migrations.CreateModel(
            name='StatusHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('model', models.IntegerField(choices=[(1, 'Job'), (2, 'Job Task')])),
                ('model_id', models.IntegerField()),
                ('status', models.IntegerField()),
                ('date', models.DateField()),
            ],
        ),
    ]
