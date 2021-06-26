var imageInBase64;

$(document).ready(function(){
    let form = $('form');
    form.submit(function(event){
        event.preventDefault();

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
                        if(data2 == true) window.location.replace("index.html");
                    }
                });
            }
        });
        
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