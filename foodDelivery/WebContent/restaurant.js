$(document).ready(function(){
    let searchParams = new URLSearchParams(window.location.search);
    let restaurantsName = '';
    if(searchParams.has('name') == true){
        restaurantsName = searchParams.get('name')
        console.log(restaurantsName);
    }
    $.get({
        url: "rest/userService/getRestaurant?name=" + restaurantsName,
        success: function(restaurant){
            //console.log(restaurant.name);
            buildRestaurant(restaurant);
        }
    });
});

function buildRestaurant(restaurant){
    $('.container').html('');
    let mainDiv = $('.container');
    var categoriesDiv = $('<div class="categories"></div>');

    var img = new Image();
    img.src = restaurant.image;
    img.classList.add('item-image');
    //var img = $('<img src="' + restaurants[i].image + '" class="item-image"></img>');

    var textDiv = $('<div class="image-title"></div>');
    textDiv.append('<b>' + restaurant.name + '</b>' + '<br>' + restaurant.type + '<br>');
    if(restaurant.opened == true) textDiv.append('opened<br>');
    if(restaurant.opened == false) textDiv.append('closed<br>');
    let location = restaurant.location.address;
    let tokens = location.split(',');
    textDiv.append(tokens[0] + '<br>');
    textDiv.append(tokens[1] + ' ' + tokens[2] + '<br>');
    textDiv.append(restaurant.location.latitude + ', ').append(restaurant.location.longitude);

    categoriesDiv.append(img).append(textDiv);
    
    mainDiv.append(categoriesDiv);
}