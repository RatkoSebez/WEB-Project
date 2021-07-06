$(document).ready(function(){
    let form = $('form');
    form.submit(function(event){
        event.preventDefault();
        var valid = true;
        
        //validacija da polja nisu prazna
        $('input').each(function(){
            if(!$(this).val()){
                valid = false;
            }
        });

        if(valid == false){
            $('#errorMessage').text('*wrong input');
            return;
        }

        var genderVal = $('input[name=gender]:checked', '#loginForm').val();
        var gender;
        if(genderVal == 'male') gender = 0;
        else gender = 1;

        let data = {
        'username' : $('input[name="username"]').val(),
        'password' : $('input[name="password"]').val(),
        'name' : $('input[name="name"').val(),
        'surname' : $('input[name="surname"').val(),
        'gender' : gender,
        'birthDate' : $('input[name="birthDate"]').val()
        }
        $.post({
            url: "rest/userService/register",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data2){
                if(data2) window.location.replace("index.html");
                if(!data2) $('#errorMessage').text('*username is already taken');
            },
            error: function(){
                console.log('error');
            }
        });
    });
});