# Generated by Django 4.1.13 on 2025-01-29 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_alter_mail_cc_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mail',
            name='subject',
            field=models.CharField(max_length=500),
        ),
    ]
