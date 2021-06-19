$(document).ready(function(){
    $('#loginForm').submit(function(event){
        event.preventDefault();
        username = $('input[name="username"]').val();
        password = $('input[name="password"]').val();
        $.post({
            url: "rest/userService/login",
            data: JSON.stringify({username: username, password: password}),
            contentType: "application/json",
            success: function(data){
                if(data == true) window.location.replace("index.html");
            }
        });
    });
});
