$(document).ready(function(){
    let form = $('form');
    form.submit(function(event){
        event.preventDefault();
        let role = "";
        if($('#roleManager').prop('checked')) role = "Manager";
        if($('#roleDeliverer').prop('checked')) role = "Deliverer";
        var genderVal = $('input[name=gender]:checked', '#loginForm').val();
        var gender;
        if(genderVal == 'male') gender = 0;
        else gender = 1;
        let data = {
        'username' : $('input[name="username"]').val(),
        'password' : $('input[name="password"]').val(),
        'name' : $('input[name="name"').val(),
        'surname' : $('input[name="surname"').val(),
        'birthDate' : $('input[name="birthDate"]').val(),
        'role' : role,
        'gender' : gender
        }
        $.post({
            url: "rest/userService/register",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data2){
                if(data2) window.location.replace("adminRegister.html");
                if(!data2) $('#errorMessage').text('*username is already taken');
            }
        });
    });
});