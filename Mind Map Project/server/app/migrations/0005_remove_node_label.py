# Generated by Django 3.1.4 on 2024-01-10 06:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20240110_0623'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='node',
            name='label',
        ),
    ]
