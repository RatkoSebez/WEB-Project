$(document).ready(function(){
    let form = $('form');
    form.submit(function(event){
        event.preventDefault();
        let role = "";
        if($('#roleManager').prop('checked')) role = "Manager";
        if($('#roleDeliverer').prop('checked')) role = "Deliverer";
        //console.log($('#roleManager').prop('checked'))
        $('#roleDeliverer').prop('checked');
        let data = {
        'username' : $('input[name="username"]').val(),
        'password' : $('input[name="password"]').val(),
        'name' : $('input[name="name"').val(),
        'surname' : $('input[name="surname"').val(),
        'birthDate' : $('input[name="birthDate"]').val(),
        'role' : role
        }

        $.post({
            url: "rest/userService/register",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data2){
                if(data2 == true) window.location.replace("adminRegister.html");
                console.log("ello");
            }
        });
    });
});