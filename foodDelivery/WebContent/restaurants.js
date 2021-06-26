var restaurants = [];

$(document).ready(function(){
    $.get({
        url: "rest/userService/getRestaurants",
        success: function(data){
            //dodajem restorane u niz tako da prvo stavljam one koji su otvoreni (tako pise u specifikaciji)
            for(let i=0; i<data.length; i++){
                if(data[i].opened == true) restaurants.push(data[i]);
            }
            for(let i=0; i<data.length; i++){
                if(data[i].opened == false) restaurants.push(data[i]);
            }
            buildRestaurants(restaurants);
        }
    });

    $("#searchName").on('keyup', function(){
        filterRestaurants();
    });
    $("#searchType").on('keyup', function(){
        filterRestaurants();
    });
    $("#searchLocation").on('keyup', function(){
        filterRestaurants();
    });
    $('#typeSelect').on('change', function() {
        filterRestaurants();
    });
    $('#openedSelect').on('change', function() {
        filterRestaurants();
    });

    $("#reset").click(function(){
        $('#searchName').val('');
        $('#searchType').val('');
        $('#searchLocation').val('');
        $('#typeSelect').val('All').change();
        $('#openedSelect').val('All').change();
        //ne znam zasto se ovde ne bilduje kad promenim vrednost tekstualnih polja a kod tabele korisnika da
        //izgleda da se ne aktivira trigger
        buildRestaurants(restaurants);
    });
});

function buildRestaurants(restaurants){
    $('.container').html('');
    let mainDiv = $('.container');
    for(let i=0; i<restaurants.length; i++){
        var link = $('<a href="#home"></a>');
        var categoriesDiv = $('<div class="categories"></div>');

        var img = new Image();
        img.src = restaurants[i].image;
        img.classList.add('item-image');
        //var img = $('<img src="' + restaurants[i].image + '" class="item-image"></img>');

        var textDiv = $('<div class="image-title"></div>');
        textDiv.append('<b>' + restaurants[i].name + '</b>' + '<br>' + restaurants[i].type + '<br>');
        if(restaurants[i].opened == true) textDiv.append('opened<br>');
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

function filterRestaurants(){
    var nameInput = $('#searchName').val().toLowerCase();
    var typeInput = $('#searchType').val().toLowerCase();
    var locationInput = $('#searchLocation').val().toLowerCase();
    var typeSelect = $('#typeSelect').find(":selected").text().toLowerCase();
    var openedSelect = $('#openedSelect').find(":selected").text().toLowerCase();
    var allRestaurants = restaurants;
    var tmpRestaurants = [];
    //name
    for(var i=0; i<allRestaurants.length; i++){
        var name = allRestaurants[i].name.toLowerCase();
        if(name.includes(nameInput)) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //type
    for(var i=0; i<allRestaurants.length; i++){
        var type = allRestaurants[i].type.toLowerCase();
        if(type.includes(typeInput)) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //location, korisnik unosi grad
    for(var i=0; i<allRestaurants.length; i++){
        var location = allRestaurants[i].location.address.toLowerCase();
        var tokens = location.split(',');
        if(tokens[1].includes(locationInput)) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //type select
    if(typeSelect == 'type') tmpRestaurants = allRestaurants;
    for(var i=0; i<allRestaurants.length; i++){
        if(typeSelect == 'type') break;
        var typeSelectFromDatabase = allRestaurants[i].type.toLowerCase();
        if(typeSelectFromDatabase == typeSelect) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //opened select
    if(openedSelect == 'all') tmpRestaurants = allRestaurants;
    for(var i=0; i<allRestaurants.length; i++){
        if(openedSelect == 'all') break;
        var isOpened = allRestaurants[i].opened;
        if(isOpened) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    buildRestaurants(allRestaurants);
}
