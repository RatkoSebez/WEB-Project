$(document).ready(function(){
    let form = $('form');
    form.submit(function(event){

        var valid = true;
        
        //validacija da polja nisu prazna
        $('input').each(function(){
            if(!$(this).val()){
                valid = false;
            }
        });

        //validacija broja indeksa
        let username = $('input[name="username"]').val();
        if(username.length == 9){
            if(username[0] != 'R' || username[1] != 'A') valid = false;
            if(isNaN(username[2])) valid = false;
            if(isNaN(username[3])) valid = false;
            if(username[4] != '/') valid = false;
            if(isNaN(username[5])) valid = false;
            if(isNaN(username[6])) valid = false;
            if(isNaN(username[7])) valid = false;
            if(isNaN(username[8])) valid = false;
        }
        else valid = false;
        

        if(valid == false){
            event.preventDefault();
            $('#errorMessage').text('Wrong input.');
            return;
        }



        let data = {
        'username' : $('input[name="username"]').val(),
        'password' : $('input[name="password"]').val()
        }
        
        

        //alert($('input[name="username"]').val());
        $.post({
            url: "rest/userService/register",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data2){
                //alert(data2);
                if(data2 == 'false') event.preventDefault();;
            },
            error: function(){
                alert('ne radi');
            }
        });
    });
});