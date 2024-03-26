# Generated by Django 5.0.1 on 2024-02-12 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('password', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'Admin',
            },
        ),
        migrations.CreateModel(
            name='Books',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book_name', models.CharField(max_length=50)),
                ('ISBN', models.IntegerField()),
                ('publication', models.CharField(max_length=50)),
                ('published_on', models.DateField()),
                ('author', models.CharField(max_length=50)),
                ('subject', models.CharField(max_length=50)),
                ('copies', models.IntegerField()),
            ],
            options={
                'db_table': 'Books',
            },
        ),
        migrations.CreateModel(
            name='Borrow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client_id', models.IntegerField()),
                ('book_id', models.IntegerField()),
                ('borrow_date', models.DateField()),
                ('return_date', models.DateField()),
            ],
            options={
                'db_table': 'Borrow',
            },
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('ph_no', models.ImageField(upload_to='')),
                ('email', models.EmailField(max_length=50)),
                ('client_id', models.IntegerField()),
            ],
            options={
                'db_table': 'Client',
            },
        ),
    ]
