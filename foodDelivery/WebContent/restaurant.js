$(document).ready(function(){
    let searchParams = new URLSearchParams(window.location.search);
    let restaurantsName = '';
    if(searchParams.has('name') == true){
        restaurantsName = searchParams.get('name')
        //console.log(restaurantsName);
    }
    $.get({
        url: "rest/userService/getRestaurant?name=" + restaurantsName,
        success: function(restaurant){
            //console.log(restaurant.name);
            buildRestaurant(restaurant);
            $.get({
                url: "rest/userService/getItems?name=" + restaurantsName,
                success: function(items){
                    //console.log(items.length)
                    buildItems(items);
                }
            });
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

function buildItems(items){
    //console.log('ovde sam' + items.length)
    $('.itemsContainer').html('');
    let mainDiv = $('.itemsContainer');
    for(let i=0; i<items.length; i++){
        //console.log(items[i].name)
        //var link = $('<a href="restaurant.html?name=' + restaurants[i].name + '"></a>');
        var categoriesDiv = $('<div class="itemsCategories"></div>');

        var img = new Image();
        img.src = items[i].image;
        img.classList.add('itemsImage');
        //var img = $('<img src="' + restaurants[i].image + '" class="item-image"></img>');

        var textDiv = $('<div class="itemImageTitle"></div>');
        textDiv.append('<b>' + items[i].name + '</b>' + '<br>' + items[i].type + '<br>' + items[i].price + '$<br>');
        if(items[i].type == 'Drink' && items[i].quantity) textDiv.append(items[i].quantity + 'ml<br>');
        if(items[i].type == 'Food' && items[i].quantity) textDiv.append(items[i].quantity + 'g<br>');
        if(items[i].description) textDiv.append(items[i].description + '<br>');
        categoriesDiv.append(img).append(textDiv);
        //link.append(categoriesDiv);
        
        mainDiv.append(categoriesDiv);
    }
}