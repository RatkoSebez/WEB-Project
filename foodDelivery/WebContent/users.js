$(document).ready(function(){
    $.get({
        url: "rest/userService/getUsers",
        success: function(data){
            for(let users of data){
                let tbody = $('#korisnici tbody');
                let username = $('<td>' + users.username + '</td>');
                let password = $('<td>' + users.password + '</td>');
                let tr = $('<tr></tr>');
                tr.append(username).append(password);
                tbody.append(tr);
            }
        }
    });
});