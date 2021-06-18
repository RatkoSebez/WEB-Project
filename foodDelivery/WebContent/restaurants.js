$(document).ready(function(){
    $.get({
        url: "rest/userService/getRestaurants",
        success: function(restaurants){
            /*$('#restaurants').html("");
            let mainDiv = $('#restaurants');
            for(let i=0; i<restaurants.length; i++){
                //mainDiv.append(restaurants[i].name);
                //mainDiv.html("hello");
                //mainDiv.innerHTML += 'Extra stuff';
                //console.log(i);
                let subRestaurantsDiv = $('<div class="subRestaurant"></div>');
                let subDiv = $('<div class="restaurant"></div>');
                //subDiv.append('<img src="' + restaurants[i].image + '" class="item-image"></img>');
                subDiv.append(restaurants[i].name + '<br>');
                subDiv.append(restaurants[i].type + '<br>');
                if(restaurants[i].opened == true) subDiv.append('open<br>');
                if(restaurants[i].opened == false) subDiv.append('closed<br>');
                let location = restaurants[i].location.address;
                let tokens = location.split(',');

                subDiv.append(tokens[0] + '<br>');
                subDiv.append(tokens[1] + tokens[2]);
                subRestaurantsDiv.append('<img src="' + restaurants[i].image + '" class="item-image"></img>');
                subRestaurantsDiv.append(subDiv);
                //mainDiv.append('<img src="' + restaurants[i].image + '" class="item-image"></img>');
                mainDiv.append(subRestaurantsDiv);
                //subDiv.append(restaurants[i].name);
                //mainDiv.append(subDiv);
                //alert(restaurants[i].name);
            }*/
            $('.container').html('');
            let mainDiv = $('.container');
            for(let i=0; i<restaurants.length; i++){
                var link = $('<a href="#home"></a>');
                var categoriesDiv = $('<div class="categories"></div>');
                //subDiv.append('<img src="' + restaurants[i].image + '" class="item-image"></img>');
                //var img = $('<img src="images/restaurant.jpg" class="item-image">');
                var img = $('<img src="' + restaurants[i].image + '" class="item-image"></img>');

                var textDiv = $('<div class="image-title"></div>');
                textDiv.append('<b>' + restaurants[i].name + '</b>' + '<br>' + restaurants[i].type + '<br>');
                if(restaurants[i].opened == true) textDiv.append('open<br>');
                if(restaurants[i].opened == false) textDiv.append('closed<br>');
                let location = restaurants[i].location.address;
                let tokens = location.split(',');
                textDiv.append(tokens[0] + '<br>');
                textDiv.append(tokens[1] + tokens[2] + '<br>');
                textDiv.append(restaurants[i].location.latitude + ', ').append(restaurants[i].location.longitude);

                categoriesDiv.append(img).append(textDiv);
                link.append(categoriesDiv);
                
                mainDiv.append(link);
                // mainDiv.append('<a href="#home"></a>');
                // mainDiv.append('<div class="categories"></div>');
                // mainDiv.append('<img src="images/restaurant.jpg" class="item-image">');
                // mainDiv.append('<div class="image-title">restaurant1</div>');
                //mainDiv.append('');
            }
        }
    });
});