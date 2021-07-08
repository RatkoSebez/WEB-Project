var users;
var loggedInUser;

$(document).ready(function(){
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
            loggedInUser = user;
        }
    });

    $.get({
        url: "rest/userService/getUsers",
        success: function(data){
            users = data;
            buildTable(data);
        }
    });
    
    $('#roleSelect').on('change', function() {
        filterTable();
    });
    $('#customerTypeSelect').on('change', function() {
        filterTable();
    });
    $("#searchName").on('keyup', function(){
        filterTable();
    });
    $("#searchSurname").on('keyup', function(){
        filterTable();
    });
    $("#searchUsername").on('keyup', function(){
        filterTable();
    });

    $(".sortColumn").mouseover(function() {
        $(this).css('cursor', 'pointer'); 
    });

    //sortiranje
    $('.sortColumn').on('click', function(){
        var usersForSort = filterTable();
        var column = $(this).data('column');
        var order = $(this).data('order');
        var text = $(this).html();
        text = text.substring(0, text.length-1);
        //console.log(column + " " + order);
        if(order == 'desc'){
            $(this).data('order', 'asc');
            usersForSort = usersForSort.sort((a,b) => a[column] > b[column] ? 1 : -1);
            text += '&#9660';
        }
        else{
            $(this).data('order', 'desc');
            usersForSort = usersForSort.sort((a,b) => a[column] < b[column] ? 1 : -1);
            text += '&#9650';
        }
        $(this).html(text);
        buildTable(usersForSort);
    });

    function filterTable(){
        var roleInput = $('#roleSelect').find(":selected").text().toLowerCase();
        var customerTypeInput = $('#customerTypeSelect').find(":selected").text().toLowerCase();
        var nameInput = $('#searchName').val().toLowerCase();
        var surnameInput = $('#searchSurname').val().toLowerCase();
        var usernameInput = $('#searchUsername').val().toLowerCase();
        var allUsers = users;
        var tmpUsers = [];
        //name
        //console.log(nameInput + ", " + surnameInput);
        for(var i=0; i<allUsers.length; i++){
            var name = allUsers[i].name.toLowerCase();
            if(name.includes(nameInput)) tmpUsers.push(allUsers[i]);
        }
        allUsers = tmpUsers;
        tmpUsers = [];
        //surname
        for(var i=0; i<allUsers.length; i++){
            var surname = allUsers[i].surname.toLowerCase();
            if(surname.includes(surnameInput)) tmpUsers.push(allUsers[i]);
        }
        allUsers = tmpUsers;
        tmpUsers = [];
        //username
        for(var i=0; i<allUsers.length; i++){
            var username = allUsers[i].username.toLowerCase();
            if(username.includes(usernameInput)) tmpUsers.push(allUsers[i]);
        }
        allUsers = tmpUsers;
        tmpUsers = [];
        //role
        //console.log(roleInput);
        if(roleInput == 'role') tmpUsers = allUsers;
        for(var i=0; i<allUsers.length; i++){
            if(roleInput == 'role') break;
            var role = allUsers[i].role.toLowerCase();
            if(role == roleInput) tmpUsers.push(allUsers[i]);
        }
        allUsers = tmpUsers;
        tmpUsers = [];
        //customer type
        //console.log(roleInput);
        //console.log(tmpUsers.length);
        if(customerTypeInput == 'customer type') tmpUsers = allUsers;
        //console.log(tmpUsers.length);
        for(var i=0; i<allUsers.length; i++){
            //console.log(i);
            if(customerTypeInput == 'customer type') break;
            //ako korisnik nije specijalni (nema popusta) idi dalje
            if(!allUsers[i].customerType) continue;
            if(!allUsers[i].customerType.type) continue;
            var customerType = allUsers[i].customerType.type.toLowerCase();
            if(customerType == customerTypeInput) tmpUsers.push(allUsers[i]);
        }
        //console.log(allUsers.length);
        allUsers = tmpUsers;
        //console.log(allUsers.length);
        currentUsers = allUsers;
        buildTable(allUsers);
        return allUsers;
    }

    $("#reset").click(function(){
        //console.log("yoo");
        $('#roleSelect').val('All').change();
        $('#customerTypeSelect').val('All').change();
        $('#searchName').val('');
        $('#searchSurname').val('');
        $('#searchUsername').val('');
        filterTable();
    });
});

function buildTable(data){
    $("#users > tbody").html("");
    let i = 0;
    for(let users of data){
        //console.log(users.suspicious)
        let tbody = $('#users tbody');
        let name = $('<td>' + users.name + '</td>');
        let surname = $('<td>' + users.surname + '</td>');
        let username = $('<td>' + users.username + '</td>');
        let gender = $('<td>' + users.gender + '</td>');
        let role = $('<td>' + users.role + '</td>');
        let discountPoints = $('<td>' + users.discountPoints + '</td>');
        //datum rodjenja
        let date = new Date(users.birthDate);
        var day = date.getDate();
        var month =  date.getMonth() + 1;
        var year = date.getFullYear();
        formattedDate = day + "." + month + "." + year + ".";
        let birthDate = ($('<td>' + formattedDate + '</td>'));
        let deleteUser = $('<td><button id="deleteUser" onclick="deleteUser(' + i + ')">delete</button></td>');
        let banUser = $('<td><button id="banUser" onclick="banUser(' + i + ')">ban</button></td>');
        //kreiranje tabele
        let tr = $('<tr></tr>');
        if(users.suspicious) 
        tr.css('background-color', '#FF0000');
        tr.append(name).append(surname).append(username).append(role).append(gender).append(birthDate).append(discountPoints);
        if(users.role != "Admin" && loggedInUser.role == "Admin") tr.append(deleteUser).append(banUser);
        tbody.append(tr);
        i++;
    }
}

function deleteUser(i){
    $.post({
        url: "rest/userService/deleteUser",
        data: JSON.stringify({username: users[i].username}),
        contentType: "application/json",
        success: function(){
            $.get({
                url: "rest/userService/getUsers",
                success: function(data){
                    users = data;
                    buildTable(data);
                }
            });
        }
    });
}

function banUser(i){
    $.post({
        url: "rest/userService/banUser",
        data: JSON.stringify({username: users[i].username}),
        contentType: "application/json",
        success: function(){
            $.get({
                url: "rest/userService/getUsers",
                success: function(data){
                    users = data;
                    buildTable(data);
                }
            });
        }
    });
}