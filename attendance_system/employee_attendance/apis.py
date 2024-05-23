from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import date
from rest_framework.decorators import api_view

from employee_attendance.models import Employee, EmployeeAttendance

class EmployeeHandler(APIView):
    """
    This API endpoint provides functionalities for:

    * Listing all Employee's instances (GET request without pk).
    * Retrieving a single Employee instance (GET request with pk).
    * Creating a new Employee instance (POST request).
    * Updating a specific Employee instance (PUT request with pk).
    * Deleting a specific Employee instance (DELETE request with pk).

    **Permissions:**

        * By default, only authenticated users can access this API endpoint.
        * You can customize permissions by overriding the `get_permissions` method.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        """
        Handles GET requests for listing or retrieving a employee instance.

        * GET request without pk: Retrieves all employee instances.
        * GET request with pk: Retrieves a specific employee instance.

        Returns:
            Response object with data or appropriate error message.
        """

        if pk is None:
            employees = Employee.objects.all()
            repsonse_data = [
                {
                    "index": index+1,
                    "name": employee.name,
                    "email": employee.email,
                    "mobile_number": employee.mobile,
                    "department": employee.department,
                    "id": employee.id
                } 
                for index, employee in enumerate(employees)
            ]
            print(f"repsonse_data {repsonse_data}")
            return Response({"data":repsonse_data}, status=status.HTTP_200_OK)
        else:
            try:
                instance = Employee.objects.get(pk=pk)
            except Employee.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            repsonse_data = {
                "id": instance.id,
                "name": instance.name,
                "email": instance.email,
                "mobile_number": instance.mobile,
                "department": instance.department
            }
            return Response(repsonse_data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Handles POST requests for creating a new employee instance.

        Returns:
            Response success status of the created instance or
            error message on failure.
        """
        data = request.data
        try:
            new_instance = Employee.objects.create(**data)  # Create using kwargs
        except Exception as e:  # Catch any exceptions (improve error handling)
            return Response(f"Error creating instance: {e}", status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        """
        Handles PUT requests for updating a specific Employee instance.

        Requires a valid `pk` in the URL.

        Returns:
            Response success status the updated instance or
            error message on failure.
        """

        try:
            instance = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data
        for field, value in data.items():
            setattr(instance, field, value)  # Update instance attributes

        try:
            instance.save()
        except Exception as e:  # Catch any exceptions (improve error handling)
            return Response(f"Error updating instance: {e}", status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status.HTTP_200_OK)
        
    def delete(self, request, pk):
        """
        Handles DELETE requests for deleting a specific Employee instance.

        Requires a valid `pk` in the URL.

        Returns:
            Response object with an appropriate status code (204 on success) or
            error message on failure.
        """

        try:
            instance = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@csrf_exempt
def check_employee_attendance(request):
    if request.method == 'GET':
        # Get today's date
        today = date.today()
         # Count total number of employees
        total_employees = Employee.objects.count()
        # Count number of employees with attendance records for today
        employees_with_attendance_today = EmployeeAttendance.objects.filter(date=today).values_list('employee', flat=True).distinct().count()
    
        if total_employees != employees_with_attendance_today:
            return JsonResponse({
                'message': 'Not all employees have attendance records for today',
                'all_attendance_done': False
            })
        else:
            return JsonResponse({
                'message': 'All employees have attendance records for today',
                'all_attendance_done': True
            })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
class EmployeeAttendanceHandler(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        repsonse_data = []
        employees = Employee.objects.all()
        for employee in employees:
            employee_data = {}
            if EmployeeAttendance.objects.filter(employee=employee, date=today, is_present= True).exists():
                employee_data["is_present"] = True
            else:
                 employee_data["is_present"] = False
            employee_data["name"] = employee.name
            employee_data["id"] = employee.id
            repsonse_data.append(employee_data)
                
        return Response({"data":repsonse_data}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        today = date.today()
        if data['today_or_all'] == "today_attendance":
            attendance_data = EmployeeAttendance.objects.filter(date=today)
        else:
            attendance_data = EmployeeAttendance.objects.all()

        repsonse_data = [
            {
                "index": index+1,
                "name": attendance.employee.name,
                "is_present": attendance.is_present,
                "date": attendance.date.strftime('%d %b, %Y')
                # "id": attendance.id
            } 
            for index, attendance in enumerate(attendance_data)
        ]
        print(f"repsonse_data {repsonse_data}")
        return Response({"data":repsonse_data}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
def update_employee_attendance_view(request):
    if request.method == 'POST':
        # Process the received data
        data = request.data
        try:
            today = date.today()
            # Iterate over each dictionary in the list
            for entry in data:
                employee_id = entry['id']
                is_present = entry['is_present']
                # Check if an entry already exists for today's date and the employee
                attendance_entry = EmployeeAttendance.objects.filter(employee_id=employee_id, date=today).first()
                if attendance_entry:
                    # If entry exists, update is_present field
                    attendance_entry.is_present = is_present
                    attendance_entry.save()
                else:
                    # If entry does not exist, create a new one with today's date
                    EmployeeAttendance.objects.create(employee_id=employee_id, is_present=is_present, date=today)
            return Response({'message': 'Employee attendance updated successfully'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Method not allowed'}, status=405)