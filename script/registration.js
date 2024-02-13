function details(){
    var nameRegex = /^[a-zA-Z]{3,}\s?[a-zA-Z]*$/; // Allows only letters, at least 3 characters

        var user_name = $(".name").val();

        if (!nameRegex.test(user_name)) {
            alert('Please enter a valid name with at least 3 letters.');
            return;
        }



    var name = $('#name').val();
    var gender = $('#gender').is(':checked');
    var department1 = $('#dept1').is(':checked');
    var department2 = $('#dept2').is(':checked');
    var department3 = $('#dept3').is(':checked');
    var department4 = $('#dept4').is(':checked');
    var salary = $('#salary').val();
    var date = $('#date').val();
    var note = jQuery('#note').val();
    const obj = {
        name : name,
        gender: gender ? "male" : "female",
        department : [],
        salary : salary,
        date : date,
        note : note
    }
    let arr = [];
    if(department1){
        arr.push("HR");
    }
    if(department2){
        arr.push("Sales");
    }
    if(department3){
        arr.push("Finance")
    }
    if(department4){
        arr.push("Engineer")
    }

    obj.department=arr;

    $.ajax({
        url: "http://localhost:3000/users/",
        method: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function(data) {
            console.log("Success:", data);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching data:", status, error);
            console.log("Server response:", xhr.responseText);
        }
    });


}

$(document).ready(function () {
    const containers = $(".inner"); // Change to use class selector

    $.ajax({
        url: '../employee-payroll.json',
        dataType: 'json',
        success: function (jsonData) {
            containers.each(function () {
                const container = $(this);

                // Create the table element
                const table = $("<table>");

                // Create the tbody element
                const tbody = $("<tbody>");

                // Create the header row
                const headerRow = $("<tr>");

                const headerColumns = ["NAME", "GENDER", "DEPARTMENT", "SALARY", "START DATE", "ACTIONS", "ACTIONS"];

                headerColumns.forEach(columnName => {
                    const th = $("<th>").text(columnName);
                    headerRow.append(th);
                });

                tbody.append(headerRow);

                // Create the data rows
                jsonData.users.forEach(user => {
                    const tr = $("<tr>");

                    const tdName = $("<td>").text(user.name.split(" ")[0]);
                    tr.append(tdName);

                    const tdGender = $("<td>").text(user.gender);
                    tr.append(tdGender);

                    const tdDepartment = $("<td>").text(user.department.join(", "));
                    tr.append(tdDepartment);

                    const tdSalary = $("<td>").text(user.salary);
                    tr.append(tdSalary);

                    const tdDate = $("<td>").text(user.date);
                    tr.append(tdDate);



                    const deleteIconClass = 'delete'; // Replace with your actual class for the delete icon

                    const deleteButton = $("<button class='delete " + deleteIconClass + "' data-userid='" + user.id + "'>🗑️</button>");
                    
                    const tdDelete = $("<td>").append(deleteButton);
                    const updateButton = $("<button class='update' data-userid='" + user.id + "'>🔄 Update</button>");
                    const tdUpdate = $("<td>").append(updateButton);
                    tr.append(tdUpdate);
                    tr.append(tdDelete);

                    tbody.append(tr);
                });

                // Append the tbody to the table
                table.append(tbody);

                // Append the table to the container
                container.append(table);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', status, error);

            // Log the complete xhr object for more details
            console.log(xhr);

            // Optionally, you can log the response text if available
            if (xhr.responseText) {
                console.log('Response Text:', xhr.responseText);
            }
        }
    });
});

$(document).on('click', '.update', function () {
    var userId = $(this).data('userid');


    $.ajax({
        url: "http://localhost:3000/users/" + userId,
        method: "GET",
        success: function (userData) {
    
            showUpdateDialog(userData);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", status, error);
            console.log("Server response:", xhr.responseText);
        }
    });
});

function updateDialog(userData) {

    var modalHtml = `
        <div id="updateModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Update User Data</h2>
                <form id="updateForm">
                    <!-- Add input fields with pre-filled values from userData -->
                    <label for="updateName">Name:</label>
                    <input type="text" id="updateName" value="${userData.name}" required>
                    
                    <label for="updateGender">Gender:</label>
                    <input type="radio" id="updateMale" name="updateGender" value="male" ${userData.gender === 'male' ? 'checked' : ''}>
                    <label for="updateMale">Male</label>
                    <input type="radio" id="updateFemale" name="updateGender" value="female" ${userData.gender === 'female' ? 'checked' : ''}>
                    <label for="updateFemale">Female</label>
                    
                    <label for="updateDepartment">Department:</label>
                    <input type="checkbox" id="updateDept1" value="HR" ${userData.department.includes('HR') ? 'checked' : ''}>
                    <label for="updateDept1">HR</label>
                    <input type="checkbox" id="updateDept2" value="Sales" ${userData.department.includes('Sales') ? 'checked' : ''}>
                    <label for="updateDept2">Sales</label>
                    <input type="checkbox" id="updateDept3" value="Finance" ${userData.department.includes('Finance') ? 'checked' : ''}>
                    <label for="updateDept3">Finance</label>
                    <input type="checkbox" id="updateDept4" value="Engineer" ${userData.department.includes('Engineer') ? 'checked' : ''}>
                    <label for="updateDept4">Engineer</label>
                    
                    <label for="updateSalary">Salary:</label>
                    <input type="text" id="updateSalary" value="${userData.salary}" required>
                    
                    <label for="updateDate">Start Date:</label>
                    <input type="date" id="updateDate" value="${userData.date}" required>
                    
                    <label for="updateNote">Note:</label>
                    <textarea id="updateNote">${userData.note}</textarea>

                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    `;

    // Append the modal HTML to the body
    $('body').append(modalHtml);


$('#updateForm').submit(function (e) {
    e.preventDefault();

    // Extract updated data from the form
    var updatedName = $('#updateName').val();
    var updatedGender = $("input[name='updateGender']:checked").val();
    var updatedDepartment = [];

    // Iterate through all checkboxes with the name 'updateDepartment'
    $("#updateDept1, #updateDept2, #updateDept3, #updateDept4").each(function () {
        if ($(this).is(':checked')) {
            updatedDepartment.push($(this).val());
        }
    });

console.log("Updated Department:", updatedDepartment);
    var updatedSalary = $('#updateSalary').val();
    var updatedDate = $('#updateDate').val();
    var updatedNote = $('#updateNote').val();

    // Create an object with updated data
    var updatedUserData = {
        name: updatedName,
        gender: updatedGender,
        department: updatedDepartment,
        salary: updatedSalary,
        date: updatedDate,
        note: updatedNote
        // Add other properties with updated values
    };

    // Perform the update using an AJAX request
    $.ajax({
        url: "http://localhost:3000/users/" + userData.id,
        method: "PUT",
        data: JSON.stringify(updatedUserData),
        contentType: "application/json",
        success: function (data) {
            console.log("Update successful:", data);

        
            $('#updateModal').remove();
        },
        error: function (xhr, status, error) {
            console.error("Error updating data:", status, error);
            console.log("Server response:", xhr.responseText);
        }
    });
});

    // Add close functionality to the modal
    $('.close').click(function () {
        $('#updateModal').remove();
    });
}




function showUpdateDialog(userData) {

    updateDialog(userData);
}


$(document).on('click', '.delete', function () {
    var userId = $(this).data('userid');
    $.ajax({
        url: "http://localhost:3000/users/" + userId,
        method: "DELETE",
        success: function (data) {
            console.log("delete");
        
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", status, error);
            console.log("Server response:", xhr.responseText);
        }
    });
});



document.getElementById("submitButton").addEventListener("click", function() {
    details();
});

