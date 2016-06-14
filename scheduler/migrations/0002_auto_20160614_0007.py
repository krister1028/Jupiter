# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-14 00:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0007_alter_validators_add_error_messages'),
        ('scheduler', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicaljobtask',
            name='group',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='auth.Group'),
        ),
        migrations.AddField(
            model_name='jobtask',
            name='group',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='auth.Group'),
            preserve_default=False,
        ),
    ]