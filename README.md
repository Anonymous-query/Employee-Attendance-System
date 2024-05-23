#AUTHOR: NILESH DATANIYA
Employee Attendance System

Task: Create a simple listing for the employee's attendance system using DataTable and Ajax. Use Django Web Framework for the project. Create the project in a virtual environment. Make requirements.txt file with all libraries used for the project. Use Postgresql as a database. Employee Model (name, email, mobile, department(Development/Testing/HR)) with validated forms(All fields are mandatory to fill) Add / Edit / Update / Delete the employee details Create Delete functionality using jquery and ajax. if request success dispatch success notification else dispatch error notification Employee attendance Model (employee_id, date, is_present) Two buttons for attendance table view (1. View Today's attendance 2. All attendance) if click the first button then view today's attendance if already filled if not then open the edit form to fill each employee's attendance on a bootstrap modal then click the save button to update attendance and reload the list table using DataTable and Ajax

-> Project use for tracking employee attendance on daily basis.
-> In this  project there is two main pages is 1. Employee and 2. Employee attendance
-> The Employee page have the employee's record and Option to add/Update/Delete the employee
-> Second page is Employee attendace is for adding employee daily attedance and view of all attendace

this project required python 3.10.3 and other requiremnts are in requirements.txt file

First You have to create virtual environment for project use following steps

    Go into project main directory and run following command
        python310 -m venv attendance_system_environment

    After successfull run of above command active the environment using following command
        source attendance_system_environment/Scripts/Activate

Now change the credentails of database or you can change the database by using sqllite

Now follow the Following command to Run successfull
    Go into the attendance_system directory
        python manage.py makemigrations

        python manage.py migrate

    Create Superuser and login by admin panel (As in APIs there IsAutenticated permision class added)
        python manage.py createsuperuser

        python manage.pu runserver (There is ALLOWED_HOSTS is 127.0.0.1 in settings file)

Note: Please keep you internet on as I have added some CDNs for JS and CSS
