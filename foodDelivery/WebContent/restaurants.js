$(document).ready(function(){
    $.get({
        url: "rest/userService/getRestaurants",
        success: function(restaurants){
            $('.container').html('');
            let mainDiv = $('.container');
            for(let i=0; i<restaurants.length; i++){
                var link = $('<a href="#home"></a>');
                var categoriesDiv = $('<div class="categories"></div>');
                var img = $('<img src="' + restaurants[i].image + '" class="item-image"></img>');

                var textDiv = $('<div class="image-title"></div>');
                textDiv.append('<b>' + restaurants[i].name + '</b>' + '<br>' + restaurants[i].type + '<br>');
                if(restaurants[i].opened == true) textDiv.append('open<br>');
                if(restaurants[i].opened == false) textDiv.append('closed<br>');
                let location = restaurants[i].location.address;
                let tokens = location.split(',');
                textDiv.append(tokens[0] + '<br>');
                textDiv.append(tokens[1] + ' ' + tokens[2] + '<br>');
                textDiv.append(restaurants[i].location.latitude + ', ').append(restaurants[i].location.longitude);

                categoriesDiv.append(img).append(textDiv);
                link.append(categoriesDiv);
                
                mainDiv.append(link);
            }
        }
    });
});