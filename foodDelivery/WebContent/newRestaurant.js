var imageInBase64;

$(document).ready(function(){
    let form = $('form');
    form.submit(function(event){
        event.preventDefault();

        //var file_data = $('#img').prop('files')[0];
        //console.log(file_data);

        // let reader = new FileReader();
        // reader.readAsDataURL(this.img[0]);
        //console.log(imageInBase64);

        var fd = new FormData();
        var image = $("#img")[0].files[0];
        fd.append('file', image);
        var imageTest = $('#img').val();
        var stringOfImage = URL.createObjectURL(image);
        //console.log(stringOfImage);
        //console.log(image);

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
        $.post({
            url: "rest/userService/newRestaurant",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data2){
                //if(data2 == true) window.location.replace("index.html");
            }
        });
        $.post({
            url: "rest/userService/saveImage",
            data: imageInBase64,
            contentType: "application/json",
            success: function(data2){
                console.log(imageInBase64);
                //if(data2 == true) window.location.replace("index.html");
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