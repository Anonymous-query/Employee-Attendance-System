function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function employee_attendance(condtion_val){
    let csrftoken = getCookie('csrftoken');
    var dataTable = $('#employee_attendance_table').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/employee-attendance-handler/",
            "type": "POST",
            "data": {
                "today_or_all": condtion_val // Pass the condition value as data
            },
            "headers": {
                'X-CSRFToken': csrftoken
            },
        },
        "columns": [
            { "data": "index" },
            { "data": "name" },
            { 
                "data": "is_present",
                "render": function(data, type, row, meta) {
                    if (row.is_present) {
                        return '<i class="fa fa-check"></i>'; // Use tick mark icon for true values
                    } else {
                        return '<i class="fa fa-times"></i>'; // Use cross mark icon for false values
                    }
                }
            },
            { "data": "date" }      
        ]
    });
}

function fetchAttendance(){
    let csrftoken = getCookie('csrftoken');
    $.ajax({
        url: `/employee-attendance-handler/`, // Specify the URL of your endpoint
        type: 'GET', // Specify the HTTP method (GET, POST, PUT, DELETE, etc.)
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: function(response) {
            // Handle the successful response
            console.log('Success:', response);
         
            // Clear previous content if any
            $('#employeeAttendanceModal .modal-body').empty();

            // Iterate over the list of employees and add elements dynamically
            response.data.forEach(function(employee) {
               
                // Create elements for each employee
                var employeeDiv = $('<div class="row"></div>');
                var nameLabel = $('<label class="col-md-6">' + employee.name + '</label>');
                var checkboxDiv = $('<div class="col-md-6"><div class="form-group form-check"></div></div>');
                var checkboxInput = $('<input type="checkbox" class="form-check-input is-present-checkbox" id="is_present_checkbox_' + employee.id + '">');
                // Add employee ID as a data attribute
                checkboxInput.attr('data-employee-id', employee.id);
                var checkboxLabel = $('<label class="form-check-label" for="is_present_checkbox_' + employee.id + '">Is Present</label>');

                // Append elements to employeeDiv
                checkboxDiv.find('.form-group').append(checkboxInput);
                checkboxDiv.find('.form-group').append(checkboxLabel);
                employeeDiv.append(nameLabel);
                employeeDiv.append(checkboxDiv);

                // Append employeeDiv to modal body
                $('#employeeAttendanceModal .modal-body').append(employeeDiv);
            });
            $('#employeeAttendanceModal').modal('show');
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.log('Error:', error);
            Swal.fire("Something went wrong try again.", "", "info");
        }
    });  
}

$(document).ready(function() {
    employee_attendance("all_attendance");
    
    $('#today-employee-attendance').click(function() {
        $.ajax({
            url: '/check-employee-attendance/',  // Replace this with your actual API endpoint URL
            type: 'GET',
            success: function(response) {
                // Handle the success response
                console.log(response);
                // Display the message to the user
                $('#attendanceStatus').text(response.message);
                // If there are employees without attendance, you can display them as well
                if (response.all_attendance_done) {
                    employee_attendance("today_attendance");
                } else {
                    fetchAttendance();
                }
            },
            error: function(xhr, status, error) {
                // Handle errors
                console.log('Error:', error);
                Swal.fire("Something went wrong. Please try again.", "", "info");
            }
        });
    });

    $('#all-employee-attendance').click(function() {
        employee_attendance("all_attendance");
    });

    $('#updateEmployeeButton').click(function() {
        // Create an array to store employee data
        var employeeData = [];
    
        // Iterate over each checkbox
        $('.is-present-checkbox').each(function() {
            // Get employee ID from data attribute
            var employeeId = $(this).data('employee-id');
            // Get is_present status
            var isPresent = $(this).prop('checked');
            // Add employee data to the array
            employeeData.push({ 'id': employeeId, 'is_present': isPresent });
        });
    
        // Make AJAX call to update backend
        let csrftoken = getCookie('csrftoken');
        $.ajax({
            url: '/update-employee-attendance/', // Specify the URL of your endpoint
            method: 'POST',
            contentType: 'application/json', // Set content type to JSON
            data: JSON.stringify(employeeData), // Convert array to JSON string
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(response) {
                // Handle success
                console.log('AJAX success:', response);
                // Close modal or perform any other action
                employee_attendance("today_attendance");
                $('#employeeAttendanceModal').modal('hide'); // Close modal
                Swal.fire("Attendance Updated!", "", "success");
            },
            error: function(xhr, status, error) {
                // Handle error
                console.log('AJAX error:', error);
            }
        });
    });
});