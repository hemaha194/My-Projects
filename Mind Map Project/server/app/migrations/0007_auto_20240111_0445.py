# Generated by Django 3.1.4 on 2024-01-11 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20240110_0652'),
    ]

    operations = [
        migrations.AlterField(
            model_name='node',
            name='id',
            field=models.CharField(max_length=255, primary_key=True, serialize=False),
        ),
    ]
