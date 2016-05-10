# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('description', models.CharField(max_length=255)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(default=None, max_length=255)),
                ('code', models.CharField(max_length=8)),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='ProductTask',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.IntegerField(choices=[(1, 'Pending'), (2, 'In Progress'), (3, 'Complete')])),
                ('completion_time', models.IntegerField()),
                ('product', models.ForeignKey(related_name='tasks', to='scheduler.Product')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(max_length=255)),
                ('abbreviation', models.CharField(max_length=20)),
                ('expertise_level', models.IntegerField(choices=[(1, 'Low'), (2, 'Medium'), (3, 'High')])),
                ('min_completion_time', models.IntegerField()),
                ('max_completion_time', models.IntegerField()),
                ('cost', models.IntegerField()),
                ('group', models.ForeignKey(to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_type', models.IntegerField(default=1, choices=[(1, 'Technician'), (2, 'Administrator')])),
                ('user', models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='producttask',
            name='task',
            field=models.ForeignKey(related_name='products', to='scheduler.Task'),
        ),
        migrations.AddField(
            model_name='job',
            name='product',
            field=models.ForeignKey(to='scheduler.Product'),
        ),
    ]
