function employee_details(){
    var dataTable = $('#employee_details').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/employee-hanlder/",
            "type": "GET"
        },
        "columns": [
            { "data": "index" },
            { "data": "name" },
            { "data": "email" },
            { "data": "mobile_number" },
            { "data": "department" },
            {
                "data": "id",
                "render": function (data, type, row) {
                    // Return HTML for links with unique IDs based on row data
                    return '<a class="employee-edit-link" onclick="editItem(' + row.id + ')"><i class="fa fa-edit"></i></a>' +
                           '<a class="employee-delete-link" onclick="deleteItem(' + row.id + ')"><i class="fa fa-trash-o"></i></a>';
                }
            }            
        ]
    });
}

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

function editItem(itemId) {
    // Code to handle edit action
    console.log("Edit item with ID:", itemId);

    let csrftoken = getCookie('csrftoken');
    $.ajax({
        url: `/employee-hanlder/${itemId}`, // Specify the URL of your endpoint
        type: 'GET', // Specify the HTTP method (GET, POST, PUT, DELETE, etc.)
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: function(response) {
            // Handle the successful response
            console.log('Success:', response);

            // Set the retrieved values to the edit modal fields
            $('#edit_form_name').val(response.name);
            $('#edit_form_email').val(response.email);
            $('#edit_form_phone').val(response.mobile_number);
            $('#edit_form_department').val(response.department);
            $("#updateEmployeeButton").data('employee-id', response.id);

            $('#editEmployeeModal').modal('show');
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.log('Error:', error);
            Swal.fire("Something went wrong try again.", "", "info");
        }
    });    
}

function deleteItem(itemId) {
    // Code to handle delete action
    console.log("Delete item with ID:", itemId);

    Swal.fire({
        title: "Do you want to delete this employee?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            deleteEmployee(itemId)
        } else if (result.isDenied) {
          Swal.fire("Employee not delete", "", "info");
        }
    });
}

function deleteEmployee(employee_id){
    let csrftoken = getCookie('csrftoken');
    $.ajax({
        url: `/employee-hanlder/${employee_id}`, // Specify the URL of your endpoint
        type: 'DELETE', // Specify the HTTP method (GET, POST, PUT, DELETE, etc.)
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: function(response) {
            // Handle the successful response
            console.log('Success:', response);
            employee_details();
            Swal.fire("Employee delete!", "", "success");
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.log('Error:', error);
            Swal.fire("Something went wrong try again.", "", "info");
        }
    });    
}

$(document).ready(function() {
    employee_details();

    $('#saveChangesButton').click(function() {
        let csrftoken = getCookie('csrftoken');
        $('#contact-form').bootstrapValidator({
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: 'The name is required'
                        }
                    }
                },
                department: {
                    validators: {
                        notEmpty: {
                            message: 'The department is required'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: 'The email address is required'
                        },
                        emailAddress: {
                            message: 'The email address is not valid'
                        }
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {
                            message: 'The mobile number is required'
                        },
                        stringLength: {
                            min: 10,
                            max: 10,
                            message: 'The mobile number must be 10 digits'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: 'The mobile number can only contain digits'
                        }
                    }
                }
            },
            onSuccess: function(e) {
                e.preventDefault(); // Prevent form submission
                let formDataEmployee = {
                    name: $('#form_name').val(),
                    email: $('#form_email').val(),
                    mobile: $('#form_phone').val(),
                    department: $('#form_department').val()
                };
                // Perform AJAX call
                $.ajax({
                    url: '/employee-hanlder/',
                    method: 'POST',
                    contentType: 'application/json', // Set content type to JSON
                    data: JSON.stringify(formDataEmployee),
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    success: function(response) {
                        // Handle success
                        console.log('AJAX success:', response);
                        employee_details();
                        $('#employeeModal').modal('hide'); // Close modal
                        Swal.fire("Employee added!", "", "success");
                    },
                    error: function(xhr, status, error) {
                        // Handle error
                        console.log('AJAX error:', error);
                        Swal.fire("Something went wrong try again.", "", "info");
                    }
                });
            }
        }).data('bootstrapValidator').validate(); // Trigger validation
    });

    $('#employeeModal').on('hidden.bs.modal', function () {
        // Reset the form fields
        $('#contact-form')[0].reset();
    });

    $('#updateEmployeeButton').click(function(e) {
        let csrftoken = getCookie('csrftoken');
        let this_value = this
        // Initialize Bootstrap Validator
        $('#edit-contact-form').bootstrapValidator({
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: 'The name is required'
                        }
                    }
                },
                department: {
                    validators: {
                        notEmpty: {
                            message: 'The department is required'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: 'The email address is required'
                        },
                        emailAddress: {
                            message: 'The email address is not valid'
                        }
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {
                            message: 'The mobile number is required'
                        },
                        stringLength: {
                            min: 10,
                            max: 10,
                            message: 'The mobile number must be 10 digits'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: 'The mobile number can only contain digits'
                        }
                    }
                }
            },
            onSuccess: function(e) {
                e.preventDefault(); // Prevent form submission
                let formDataEmployee = {
                    name: $('#edit_form_name').val(),
                    email: $('#edit_form_email').val(),
                    mobile: $('#edit_form_phone').val(),
                    department: $('#edit_form_department').val()
                };
                let employeeId = $(this_value).data('employee-id');
                // Perform AJAX call for updating employee data
                $.ajax({
                    url: `/employee-hanlder/${employeeId}/`, // Change this to your actual endpoint for updating employee data
                    method: 'PUT',
                    contentType: 'application/json', // Set content type to JSON
                    data: JSON.stringify(formDataEmployee),
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    success: function(response) {
                        // Handle success
                        console.log('AJAX success:', response);
                        employee_details();
                        $('#editEmployeeModal').modal('hide'); // Close modal
                        Swal.fire("Details Updated!", "", "success");
                    },
                    error: function(xhr, status, error) {
                        // Handle error
                        console.log('AJAX error:', error);
                        Swal.fire("Something went wrong try again.", "", "info");
                    }
                });
            }
        }).data('bootstrapValidator').validate(); // Trigger validation
    });    
});