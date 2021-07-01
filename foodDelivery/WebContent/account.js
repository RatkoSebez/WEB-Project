	$(document).ready(function(){
    let form = $('form');
    setInputFieldsData();

    $.get({
        url: "rest/userService/getCustomerOrders",
        success: function(data){
            //console.log(data.length);
            buildTable(data);
        }
    });

    form.submit(function(event){
        event.preventDefault();
        let data = {
        'username' : $('input[name="username"]').val(),
        'password' : $('input[name="newPassword"]').val(),
        'name' : $('input[name="name"').val(),
        'surname' : $('input[name="surname"').val(),
        'birthDate' : $('input[name="birthDate"]').val()
        }

        //proveri da li je uneo dobru sifru i ako jeste sacuvaj promene
        $.post({
            url: "rest/userService/checkPassword",
            data: JSON.stringify({username: $('input[name="username"]').val(), password: $('input[name="oldPassword"]').val()}),
            contentType: "application/json",
            success: function(ok){
                if(ok){
                    $.post({
                        url: "rest/userService/editUser",
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function(data2){
                            if(data2 == true) window.location.replace("account.html");
                        }
                    });
                }
                else $('#errorMessage').text('*wrong password');
            }
        });
    });

    $("#reset").click(function(){
        setInputFieldsData();
    });
});


function setInputFieldsData(){
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
            $('h1').text("Account " + user.username);
            $('input[name="username"').val(user.username);
            $('input[name="name"').val(user.name);
            $('input[name="surname"').val(user.surname);
            $('input[name="birthDate"]').val(new Date(user.birthDate).toISOString().slice(0, 10));
            $('input[name="oldPassword"]').val("");
            $('input[name="newPassword"]').val("");
        }
    });
}

function buildTable(data){
        $("#orders > tbody").html("");
        for(let orders of data){
            let tbody = $('#orders tbody');
            let restaurant = $('<td class="ordersTd">' + orders.restaurant + '</td>');
            //let date = $('<td class="ordersTd">' + orders.date + '</td>');
            let status = $('<td class="ordersTd">' + orders.status + '</td>');
            let price = $('<td class="ordersTd">' + orders.price + '$' + '</td>');
            //datum rodjenja
            let dateTmp = new Date(orders.date);
            var day = dateTmp.getDate();
            var month =  dateTmp.getMonth() + 1;
            var year = dateTmp.getFullYear();
            formattedDate = day + "." + month + "." + year + ".";
            let date = ($('<td class="ordersTd">' + formattedDate + '</td>'));
            let items = ($('<td class="ordersTd"></td>'));
            for(let i=0; i<orders.items.length; i++){
                items.append(orders.items[i].name);
                if(i != orders.items.length - 1) items.append(' | ');
            }
            //kreiranje tabele
            let tr = $('<tr class="ordersTr"></tr>');
            tr.append(restaurant).append(date).append(items).append(status).append(price);
            tbody.append(tr);
        }
    }