# Generated by Django 5.0.1 on 2024-02-15 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library_server', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='available_copies',
            field=models.IntegerField(default=0),
        ),
    ]
