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
        url: "http://localhost:3000/users",
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
document.getElementById("submitButton").addEventListener("click", function() {
    details();
});