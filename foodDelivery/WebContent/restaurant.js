var isOpened = false;

$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search);
    let restaurantsName = '';
    if (searchParams.has('name') == true) {
        restaurantsName = searchParams.get('name')
        //console.log(restaurantsName);
    }
    $.get({
        url: "rest/userService/getRestaurant?name=" + restaurantsName,
        success: function (restaurant) {
            isOpened = restaurant.opened;
            //console.log(restaurant.name);
            buildRestaurant(restaurant);
            $.get({
                url: "rest/userService/getItems?name=" + restaurantsName,
                success: function (items) {
                    //console.log(items.length)
                    buildItems(items);
                    $.get({
                        url: "rest/userService/getComments?restaurant=" + restaurantsName,
                        success: function (comments) {
                            //console.log(comments.length)
                            if (comments.length > 0) {
                                $("#comments").show();
                                buildTable(comments);
                            }
                        }
                    });
                }
            });
        }
    });
});

function buildRestaurant(restaurant) {
    $.get({
        url: "rest/userService/getAverageRating?restaurant=" + restaurant.name,
        success: function (data) {
            $('.container').html('');
            let mainDiv = $('.container');
            var categoriesDiv = $('<div class="categories"></div>');
            var img = new Image();
            img.src = restaurant.image;
            img.classList.add('item-image');
            var textDiv = $('<div class="image-title"></div>');
            textDiv.append('<b>' + restaurant.name + '</b>' + '<br>' + restaurant.type + '<br>');
            if (restaurant.opened == true) textDiv.append('opened<br>');
            if (restaurant.opened == false) textDiv.append('closed<br>');
            let location = restaurant.location.address;
            let tokens = location.split(',');
            textDiv.append(tokens[0] + '<br>');
            textDiv.append(tokens[1] + ' ' + tokens[2] + '<br>');
            textDiv.append(restaurant.location.latitude + ', ').append(restaurant.location.longitude + '<br>');
            data = data.toFixed(1);
            if (data == 0) data = 0;
            textDiv.append('average rating: ' + data + '/5<br>');
            categoriesDiv.append(img).append(textDiv);
            mainDiv.append(categoriesDiv);
        }
    });
}

function buildItems(items) {
    //console.log('ovde sam' + items.length)
    $('.itemsContainer').html('');
    let mainDiv = $('.itemsContainer');
    for (let i = 0; i < items.length; i++) {
        //console.log(items[i].name)
        //var link = $('<a href="restaurant.html?name=' + restaurants[i].name + '"></a>');
        var categoriesDiv = $('<div class="itemsCategories"></div>');

        var img = new Image();
        img.src = items[i].image;
        img.classList.add('itemsImage');
        //var img = $('<img src="' + restaurants[i].image + '" class="item-image"></img>');

        var textDiv = $('<div class="itemImageTitle"></div>');
        textDiv.append('<b>' + items[i].name + '</b>' + '<br>' + items[i].type + '<br>' + items[i].price + '$<br>');
        if (items[i].type == 'Drink' && items[i].quantity) textDiv.append(items[i].quantity + 'ml<br>');
        if (items[i].type == 'Food' && items[i].quantity) textDiv.append(items[i].quantity + 'g<br>');
        if (items[i].description) textDiv.append(items[i].description + '<br>');
        var shoppingCartDiv = $('<div class="shoppingCartDiv" hidden></div>');
        shoppingCartDiv.append('quantity: <input type="text" name="quantity" id="' + i + '" size="2">');
        //shoppingCartDiv.append('<form action="rest/userService/addItemToCart?name=Pepsi&quantity=2" style="display: inline;" onsubmit="return prevent(event)"><input type="submit" value="add"></form>');
        //shoppingCartDiv.append('<form action="rest/userService/addItemToCart"><input type="hidden" name="name" value="pepsi"/><input type="hidden" name="quantity" value="2" /><input type="submit" value="add" onsubmit="prevent(event)" style="display: inline;"></form>');
        //shoppingCartDiv.append('<iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>');
        //shoppingCartDiv.append('<form action="rest/userService/addItemToCart" target="dummyframe" onsubmit="prevent(event);"><input type="hidden" name="name" value="' + items[i].name + '" /><input type="hidden" name="quantity" value="2" /><input type="submit" value="add" style="display: inline;"></form>');
        //funkciji saljem parametre ime artikla injegov indeks, ovo ce raditi jer za artikle nije predvidjeno filtriranje itd. tako da ce svaki item uvek biti na ocekivanoj poziciji
        shoppingCartDiv.append('<button id="add" onclick="addItemToShoppingCart(\'' + items[i].name + ',' + i + '\')">add</button>');
        //$('#' + i).val()

        //shoppingCartDiv.append('<button id="remove">remove</button>');
        textDiv.append(shoppingCartDiv);
        categoriesDiv.append(img).append(textDiv);
        //link.append(categoriesDiv);
        mainDiv.append(categoriesDiv);
        //show ili hide opcije za kupovinu, pokazi samo ako je kupac ulogovan
        $.get({
            url: "rest/userService/getLoggedInUser",
            success: function (user) {
                if (!user) {
                    $(".shoppingCartDiv").hide();
                }
                else {
                    if (user.role == "Customer" && isOpened) {
                        $(".shoppingCartDiv").show();
                    }
                    else {
                        $(".shoppingCartDiv").hide();
                    }
                }
            }
        });
    }
}

function addItemToShoppingCart(params) {
    //console.log(params);
    let name = params.split(',')[0];
    let index = params.split(',')[1];
    let quantity = $('#' + index).val();
    //console.log(name + ' ' + quantity);

    $.get({
        url: "rest/userService/addItemToCart?name=" + name + "&quantity=" + quantity + "&flag=no",
        success: function () {
            //korisnik dobija obavestenje kad se item doda u korpu
            if (Notification.permission === "granted") showNotification();
            else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") showNotification();
                });
            }
            //console.log('check');
            //console.log(restaurant.name);
        }
    });
}

function prevent(event) {
    event.preventDefault();
    console.log('hello');
    //console.log($('#quantity').val());
}

function buildTable(data) {
    $("#comments > tbody").html("");
    for (let comment of data) {
        let tbody = $('#comments tbody');
        let rating = $('<td class="commentTd">' + comment.rating + '</td>');
        let restaurantComment = $('<td class="commentTd">' + comment.comment + '</td>');
        let tr = $('<tr class="commentTr"></tr>');
        tr.append(rating).append(restaurantComment);
        tbody.append(tr);
    }
}

function showNotification() {
    const notification = new Notification("Item added successfully", {
        //body: "dodat artikal"
    });
}