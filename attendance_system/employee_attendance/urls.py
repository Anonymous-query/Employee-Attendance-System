from django.conf import settings
from django.urls import path

from employee_attendance.views import employee_attendance_view, employee_details_view
from employee_attendance.apis import (
    EmployeeHandler, 
    EmployeeAttendanceHandler, 
    check_employee_attendance,
    update_employee_attendance_view, 
)

urlpatterns = [
    path('', employee_details_view, name="employee_details"),
    path('employee/attendance', employee_attendance_view, name="employee_attendance"),

    #API ENDPOINTS
    path('employee-hanlder/<int:pk>/', EmployeeHandler.as_view(), name='employee_detail_view'),  # Detail view
    path('employee-hanlder/', EmployeeHandler.as_view(), name='employee_view'),  # Data table view
    path('check-employee-attendance/', check_employee_attendance, name="check_employee_attendance"),
    path('employee-attendance/<int:pk>/', EmployeeAttendanceHandler.as_view(), name='employee_attendance'),  # Detail view
    path('employee-attendance-handler/', EmployeeAttendanceHandler.as_view(), name='employee_attendance_handler'),  # Data table view
    path('update-employee-attendance/', update_employee_attendance_view, name="update_employee_attendance_view"),
]