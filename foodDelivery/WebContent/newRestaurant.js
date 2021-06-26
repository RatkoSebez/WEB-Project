var imageInBase64;

$(document).ready(function(){
    //dobijam menadzere koji nisu zaduzeni ni za jedan restoran i stavljam ih u combobox
    $.get({
        url: "rest/userService/getFreeManagers",
        success: function(managers){
            var managersSelectList = $('#managers');
            //console.log(managers.length);
            for (var i = 0; i < managers.length; i++) {
                managersSelectList.append(new Option(managers[i].username, 'value'));
            }
            if(managers.length == 0) managersSelectList.append(new Option('no free managers', 'value'));
        }
    });
    
    let form = $('form');
    form.submit(function(event){
        event.preventDefault();
        var managersUsername = $("#managers option:selected").text();
        let latitude = $('input[name="latitude"]').val();
        let longitude = $('input[name="longitude"]').val();
        let city = $('input[name="city"]').val();
        let street = $('input[name="street"]').val();
        let zipCode = $('input[name="zipCode"]').val();
        let location = {latitude:latitude, longitude:longitude, address:street + "," + city + "," + zipCode + ","};
        let data = {
        'name' : $('input[name="name"]').val(),
        'location' : location,
        'type' : $('#type').val()
        }
        
        //prvo saljem sve osim slike restorana pa kad budem siguran da je restoran dodat onda cu da uploadujem i sliku
        $.post({
            url: "rest/userService/newRestaurant",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(){
                //rest za sliku
                $.post({
                    url: "rest/userService/saveImage",
                    data: imageInBase64,
                    contentType: "application/json",
                    success: function(data2){
                        console.log(imageInBase64);
                        //if(data2 == true) window.location.replace("index.html");
                    }
                });
                //rest za dodavanje restorana menadzeru
                $.post({
                    url: "rest/userService/setManagersRestaurant",
                    data: managersUsername,
                    contentType: "application/json",
                });
            }
        });
        
        //nemoj odmah redirektovati jer se onda slika nece poslati, njoj treba vremena da stigne pa probaj naci nacin da redirektujes tek kad se slanje zavrsi
        //window.location.replace("index.html")
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