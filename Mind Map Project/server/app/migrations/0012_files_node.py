# Generated by Django 3.1.4 on 2024-01-22 12:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_files'),
    ]

    operations = [
        migrations.AddField(
            model_name='files',
            name='node',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='app.node'),
        ),
    ]
