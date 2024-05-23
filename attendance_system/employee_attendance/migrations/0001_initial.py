# Generated by Django 4.2 on 2024-05-06 14:35

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('mobile', models.CharField(max_length=15, validators=[django.core.validators.RegexValidator(message='Phone number must contain only digits', regex='^\\d+$'), django.core.validators.RegexValidator(message='Optional country code followed by digits', regex='^(\\+\\d{1,2})?\\d+$')])),
                ('department', models.CharField(choices=[('development', 'Development'), ('testing', 'Testing'), ('hr', 'HR')], max_length=25)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Employee',
            },
        ),
        migrations.CreateModel(
            name='EmployeeAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('is_present', models.BooleanField(default=False)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employee', to='employee_attendance.employee')),
            ],
            options={
                'verbose_name_plural': 'Employee Attendance',
            },
        ),
    ]