var imageInBase64;

$(document).ready(function () {
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function (user) {
            let form = $('form');
            form.submit(function (event) {
                event.preventDefault();
                let data = {
                    'name': $('input[name="name"]').val(),
                    'price': $('input[name="price"]').val(),
                    'description': $('input[name="description"]').val(),
                    'quantity': $('input[name="quantity"]').val(),
                    'restaurant': user.restaurant.name,
                    'type': $('#type').val()
                }

                //nemam proveru za to da li je slika uploadovana
                var isEmpty = false;
                var isNumber = true;
                if (data.name == "" || data.price == "" || data.price == "") isEmpty = true;
                if (isEmpty) {
                    $('#errorMessage').text('*empty fields');
                    return;
                }
                isNumber = !isNaN(data.price);
                if (!isNumber) {
                    $('#errorMessage').text('*price must be a number');
                    return;
                }

                $.post({
                    url:
                        "rest/userService/newItem",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (ok) {
                        //rest za sliku
                        if (ok) {
                            $.post({
                                url: "rest/userService/saveItemImage",
                                data: imageInBase64,
                                contentType: "application/json",
                                success: function (data2) {
                                    //console.log(imageInBase64);
                                    if (data2 == true) window.location.replace("restaurant.html?name=" + user.restaurant.name);
                                }
                            });
                        }
                        else {
                            $("#errorMessage").text('*item name already exists');
                        }
                    }
                });
                //nemoj odmah redirektovati jer se onda slika nece poslati, njoj treba vremena da stigne pa probaj naci nacin da redirektujes tek kad se slanje zavrsi
                //window.location.replace("index.html")
            });
        }
    });

});

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        //console.log('RESULT', reader.result)
        imageInBase64 = reader.result;
        //console.log(imageInBase64);
    }
    reader.readAsDataURL(file);
}
