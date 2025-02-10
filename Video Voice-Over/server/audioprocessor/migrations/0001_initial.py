# Generated by Django 4.1.13 on 2025-01-23 05:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BgMusic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bgmusic', models.FileField(upload_to='bgMusic/')),
            ],
        ),
        migrations.CreateModel(
            name='CombinedMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('combined_video', models.FileField(default=None, max_length=1000, upload_to='combined_video/')),
            ],
        ),
        migrations.CreateModel(
            name='combinedMusic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('combinedMusic', models.FileField(upload_to='combinedMusic/')),
            ],
        ),
        migrations.CreateModel(
            name='ExampleTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='videos/')),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='videos/')),
                ('audio', models.FileField(default=None, max_length=1000, upload_to='audios/')),
                ('extracted_video', models.FileField(default=None, max_length=1000, upload_to='extracted_video/')),
            ],
        ),
    ]
