from django.shortcuts import render
from django.conf import settings

def employee_details_view(request):
    """
    Renders a template using the current HTTP request object of employee page.

    Returns:
        HttpResponse: An HTTP response object with the rendered template content.

    Raises:
        TemplateDoesNotExist: If the template cannot be found.
    """
    return render(request, 'employee_page.html')

def employee_attendance_view(request):
    """
    Renders a template using the current HTTP request object of employee attendance page.

    Returns:
        HttpResponse: An HTTP response object with the rendered template content.

    Raises:
        TemplateDoesNotExist: If the template cannot be found.
    """
    return render(request, 'employee_attendance.html')