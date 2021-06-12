$(document).ready(function(){
    
});

function login(){
    var data = $('#loginForm').serialize();
    var jsonData = JSON.stringify(data);

    username = $('input[name="username"]').val();
    password = $('input[name="password"]').val();

    $.post({
        url: "rest/userService/login",
        data: JSON.stringify({username: username, password: password}),
        contentType: "application/json",
        success: function(){
            //alert('uspeo');
        },
        error: function(){
            //alert('ne radi');
        }
    });
}
