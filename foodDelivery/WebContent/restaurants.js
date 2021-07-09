var restaurants = [];
var ratingMap = new Map();

$(document).ready(function () {
    $.get({
        url: "rest/userService/getRestaurants",
        success: function (data) {
            //dodajem restorane u niz tako da prvo stavljam one koji su otvoreni (tako pise u specifikaciji)
            for (let i = 0; i < data.length; i++) {
                if (data[i].opened == true) restaurants.push(data[i]);
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].opened == false) restaurants.push(data[i]);
            }
            buildRestaurants(restaurants);
        }
    });

    $("#searchName").on('keyup', function () {
        filterRestaurants();
    });
    $("#searchType").on('keyup', function () {
        filterRestaurants();
    });
    $("#searchLocation").on('keyup', function () {
        filterRestaurants();
    });
    $("#searchAverageRating").on('keyup', function () {
        filterRestaurants();
    });
    $('#typeSelect').on('change', function () {
        filterRestaurants();
    });
    $('#openedSelect').on('change', function () {
        filterRestaurants();
    });
    $('#sortSelect').on('change', function () {
        filterRestaurants();
    });
    $('#ascDescSelect').on('change', function () {
        filterRestaurants();
    });

    $("#reset").click(function () {
        $('#searchName').val('');
        $('#searchType').val('');
        $('#searchLocation').val('');
        $('#searchAverageRating').val('');
        $('#typeSelect').val('All').change();
        $('#openedSelect').val('All').change();
        $('#sortSelect').val('All').change();
        //ne znam zasto se ovde ne bilduje kad promenim vrednost tekstualnih polja a kod tabele korisnika da
        //izgleda da se ne aktivira trigger
        buildRestaurants(restaurants);
    });
});

function buildRestaurants(restaurants) {
    $('#container').html('');
    $('#container').empty();
    let mainDiv = $('.container');
    for (let i = 0; i < restaurants.length; i++) {
        //console.log(i);
        $.get({
            url: "rest/userService/getAverageRating?restaurant=" + restaurants[i].name,
            success: function (data) {
                ratingMap.set(restaurants[i].name, data);
            }
        });
    }
    //sacekaj da se pozivi od gore zavrse
    setTimeout(function () {
        for (let i = 0; i < restaurants.length; i++) {
            if (i == 0) {
                $('#container').html('');
                $('#container').empty();
                let mainDiv = $('.container');
            }
            var link = $('<a href="restaurant.html?name=' + restaurants[i].name + '"></a>');
            var categoriesDiv = $('<div class="categories"></div>');
            var img = new Image();
            img.src = restaurants[i].image;
            img.classList.add('item-image');
            var textDiv = $('<div class="image-title"></div>');
            textDiv.append('<b>' + restaurants[i].name + '</b>' + '<br>' + restaurants[i].type + '<br>');
            if (restaurants[i].opened == true) textDiv.append('opened<br>');
            if (restaurants[i].opened == false) textDiv.append('closed<br>');
            let location = restaurants[i].location.address;
            let tokens = location.split(',');
            textDiv.append(tokens[0] + '<br>');
            textDiv.append(tokens[1] + ' ' + tokens[2] + '<br>');
            textDiv.append(restaurants[i].location.latitude + ', ').append(restaurants[i].location.longitude + '<br>');
            //ratingMap.set(restaurants[i].name, ratingMap.get(restaurants[i].name).toFixed(1));
            //if(ratingMap.get(restaurants[i].name) == 0) ratingMap.set(restaurants[i].name, 0);
            //data = data.toFixed(1);
            //if(data == 0) data = 0;
            textDiv.append('average rating: ' + ratingMap.get(restaurants[i].name) + '/5<br>');
            categoriesDiv.append(img).append(textDiv);
            link.append(categoriesDiv);
            mainDiv.append(link);
        }
    }, 40);
}

function filterRestaurants() {
    //console.log('vucicu pederu');
    var nameInput = $('#searchName').val().toLowerCase();
    var typeInput = $('#searchType').val().toLowerCase();
    var locationInput = $('#searchLocation').val().toLowerCase();
    var ratingInput = $('#searchAverageRating').val().toLowerCase();
    var typeSelect = $('#typeSelect').find(":selected").text().toLowerCase();
    var openedSelect = $('#openedSelect').find(":selected").text().toLowerCase();
    var sortSelect = $('#sortSelect').find(":selected").text().toLowerCase();
    var ascDescSelect = $('#ascDescSelect').find(":selected").text().toLowerCase();
    var allRestaurants = restaurants;
    var tmpRestaurants = [];
    //name
    for (var i = 0; i < allRestaurants.length; i++) {
        var name = allRestaurants[i].name.toLowerCase();
        if (name.includes(nameInput)) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //type
    for (var i = 0; i < allRestaurants.length; i++) {
        var type = allRestaurants[i].type.toLowerCase();
        if (type.includes(typeInput)) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //location, korisnik unosi grad
    for (var i = 0; i < allRestaurants.length; i++) {
        var location = allRestaurants[i].location.address.toLowerCase();
        var tokens = location.split(',');
        if (tokens[1].includes(locationInput)) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //rating
    for (var i = 0; i < allRestaurants.length; i++) {
        var rating = ratingMap.get(allRestaurants[i].name).toString();
        if (rating.includes(ratingInput)) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //type select
    if (typeSelect == 'type') tmpRestaurants = allRestaurants;
    for (var i = 0; i < allRestaurants.length; i++) {
        if (typeSelect == 'type') break;
        var typeSelectFromDatabase = allRestaurants[i].type.toLowerCase();
        if (typeSelectFromDatabase == typeSelect) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];
    //opened select
    //console.log(openedSelect);
    if (openedSelect == 'all') tmpRestaurants = allRestaurants;
    for (var i = 0; i < allRestaurants.length; i++) {
        if (openedSelect == 'all') break;
        var isOpened = allRestaurants[i].opened;
        if (isOpened) tmpRestaurants.push(allRestaurants[i]);
    }
    allRestaurants = tmpRestaurants;
    tmpRestaurants = [];

    //sortiram allRestaurants
    if (sortSelect == 'name') {
        function compareAscending1(a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        }
        function compareDescending1(a, b) {
            if (a.name > b.name) return -1;
            if (a.name < b.name) return 1;
            return 0;
        }
        if (ascDescSelect == 'ascending') {
            allRestaurants.sort(compareAscending1);
            //console.log('asc');
        }
        if (ascDescSelect == 'descending') {
            allRestaurants.sort(compareDescending1);
            //console.log('desc');
        }
    }
    //sortiram po rejtingu
    if (sortSelect == 'rating') {
        for (let i = 0; i < allRestaurants.length; i++) {
            for (let j = i + 1; j < allRestaurants.length; j++) {
                if (ratingMap.get(allRestaurants[i].name) > ratingMap.get(allRestaurants[j].name) && ascDescSelect == 'ascending') {
                    let tmp = allRestaurants[i];
                    allRestaurants[i] = allRestaurants[j];
                    allRestaurants[j] = tmp;
                }
                if (ratingMap.get(allRestaurants[i].name) < ratingMap.get(allRestaurants[j].name) && ascDescSelect == 'descending') {
                    let tmp = allRestaurants[i];
                    allRestaurants[i] = allRestaurants[j];
                    allRestaurants[j] = tmp;
                }
            }
        }
    }
    //za lokaciju sortira prvo po ulici, moza prebaciti da gleda grad, nisu napisali u specifikaciji detaljno
    if (sortSelect == 'location') {
        function compareAscending2(a, b) {
            if (a.location.address < b.location.address) return -1;
            if (a.location.address > b.location.address) return 1;
            return 0;
        }
        function compareDescending2(a, b) {
            if (a.location.address > b.location.address) return -1;
            if (a.location.address < b.location.address) return 1;
            return 0;
        }
        if (ascDescSelect == 'ascending') {
            allRestaurants.sort(compareAscending2);
            //console.log('asc');
        }
        if (ascDescSelect == 'descending') {
            allRestaurants.sort(compareDescending2);
            //console.log('desc');
        }
    }

    buildRestaurants(allRestaurants);
}
