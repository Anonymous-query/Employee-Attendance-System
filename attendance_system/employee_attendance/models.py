from django.db import models
from django.core.validators import RegexValidator

DEPARTMENT_VALUES = (
    ('development', 'Development'),
    ('testing', 'Testing'),
    ('hr', 'HR')
)

class Employee(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    mobile = models.CharField(max_length=15, validators=[
        RegexValidator(regex=r'^\d+$', message='Phone number must contain only digits'),
        RegexValidator(regex=r'^(\+\d{1,2})?\d+$', message='Optional country code followed by digits'),
    ])
    department = models.CharField(max_length=25, choices=DEPARTMENT_VALUES)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Employee Name: {self.name}'
    
    class Meta:
        verbose_name_plural = 'Employee'

class EmployeeAttendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="employee")
    date = models.DateField()
    is_present =models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Employee Name: {self.employee.name}'
    
    class Meta:
        verbose_name_plural = 'Employee Attendance'