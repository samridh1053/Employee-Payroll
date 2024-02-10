function details(){
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

                const headerColumns = ["NAME", "GENDER", "DEPARTMENT", "SALARY", "START DATE", "ACTIONS"];

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

                    const tdActions = $("<td>").text("DELETE");
                    tr.append(tdActions);

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

$(document).on('click', '.delete', function(){
    $.ajax({
        url: "http://localhost:3000/users/7691",
        method: "DELETE",
        
        success: function(data) {
            console.log("delete");
        },
        error: function(xhr, status, error) {
            console.error("Error fetching data:", status, error);
            console.log("Server response:", xhr.responseText);
        }
    });

})




document.getElementById("submitButton").addEventListener("click", function() {
    details();
});

