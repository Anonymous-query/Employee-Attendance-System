from django.contrib import admin

from employee_attendance.models import Employee, EmployeeAttendance

class EmployeeAdmin(admin.ModelAdmin):
    search_fields = ('name', 'email', 'department')
    list_display = ('name', 'department')

class EmployeeAttendanceAdmin(admin.ModelAdmin):
    search_fields = ('employee',)
    list_display = ('employee',)

admin.site.register(Employee, EmployeeAdmin)
admin.site.register(EmployeeAttendance, EmployeeAttendanceAdmin)
