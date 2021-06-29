var imageInBase64;

$(document).ready(function(){
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
            let form = $('form');
            form.submit(function(event){
                event.preventDefault();
                let data = {
                'name' : $('input[name="name"]').val(),
                'price' : $('input[name="price"]').val(),
                'description' : $('input[name="description"]').val(),
                'quantity' : $('input[name="quantity"]').val(),
                'restaurant' : user.restaurant.name,
                'type' : $('#type').val()
                }
                console.log(data.name)
                console.log(data.price)
                console.log(data.description)
                console.log(data.quantity)
                console.log(data.restaurant)
                console.log(data.type)
                
                $.post({
                    url:
                    "rest/userService/newItem",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function(){
                        //rest za sliku
                        $.post({
                            url: "rest/userService/saveItemImage",
                            data: imageInBase64,
                            contentType: "application/json",
                            success: function(data2){
                                console.log(imageInBase64);
                                //if(data2 == true) window.location.replace("index.html");
                            }
                        });
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
    reader.onloadend = function() {
        //console.log('RESULT', reader.result)
        imageInBase64 = reader.result;
        //console.log(imageInBase64);
    }
    reader.readAsDataURL(file);
}
