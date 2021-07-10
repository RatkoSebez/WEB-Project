var orders;
var loggedInUser;

$(document).ready(function () {
    let form = $('form');
    setInputFieldsData();

    $.get({
        url: "rest/userService/getOrders",
        success: function (data) {
            //console.log(data.length);
            orders = data;
            if (data) {
                if (data.length > 0) $('#orders').show();
                if (data.length > 0) $('.filters').show();
                buildTable(data);
            }
        }
    });

    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function (user) {
            loggedInUser = user;
        }
    });

    form.submit(function (event) {
        event.preventDefault();
        let data = {
            'username': $('input[name="username"]').val(),
            'password': $('input[name="newPassword"]').val(),
            'name': $('input[name="name"').val(),
            'surname': $('input[name="surname"').val(),
            'birthDate': $('input[name="birthDate"]').val()
        }

        //proveri da li je uneo dobru sifru i ako jeste sacuvaj promene
        $.post({
            url: "rest/userService/checkPassword",
            data: JSON.stringify({ username: $('input[name="username"]').val(), password: $('input[name="oldPassword"]').val() }),
            contentType: "application/json",
            success: function (ok) {
                if (ok) {
                    $.post({
                        url: "rest/userService/editUser",
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (data2) {
                            if (data2 == true) window.location.replace("account.html");
                        }
                    });
                }
                else $('#errorMessage').text('*wrong password');
            }
        });
    });

    $("#reset").click(function () {
        setInputFieldsData();
    });

    $('#statusSelect').on('change', function () {
        filterTable();
    });
    $('#restaurantTypeSelect').on('change', function () {
        filterTable();
    });
    $("#searchRestaurant").on('keyup', function () {
        filterTable();
    });
    $("#searchPriceFrom").on('keyup', function () {
        filterTable();
    });
    $("#searchPriceTo").on('keyup', function () {
        filterTable();
    });
    $("#searchDateFrom").on('keyup', function () {
        filterTable();
    });
    $("#searchDateTo").on('keyup', function () {
        filterTable();
    });

    $(".sortColumn").mouseover(function () {
        $(this).css('cursor', 'pointer');
    });

    $("#resetTable").click(function () {
        $('#restaurantTypeSelect').val('All').change();
        $('#statusSelect').val('All').change();
        $('#searchRestaurant').val('');
        $('#searchPriceFrom').val('');
        $('#searchPriceTo').val('');
        $('#searchDateFrom').val('');
        $('#searchDateTo').val('');
        filterTable();
    });

    $('.sortColumn').on('click', function () {
        var ordersForSort = filterTable();
        var column = $(this).data('column');
        var order = $(this).data('order');
        var text = $(this).html();
        text = text.substring(0, text.length - 1);
        //console.log(column + " " + order);
        if (order == 'desc') {
            $(this).data('order', 'asc');
            ordersForSort = ordersForSort.sort((a, b) => a[column] > b[column] ? 1 : -1);
            text += '&#9660';
        }
        else {
            $(this).data('order', 'desc');
            ordersForSort = ordersForSort.sort((a, b) => a[column] < b[column] ? 1 : -1);
            text += '&#9650';
        }
        $(this).html(text);
        buildTable(ordersForSort);
    });
});


function setInputFieldsData() {
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function (user) {
            $('h1').text("Account " + user.username);
            $('input[name="username"').val(user.username);
            $('input[name="name"').val(user.name);
            $('input[name="surname"').val(user.surname);
            $('input[name="birthDate"]').val(new Date(user.birthDate).toISOString().slice(0, 10));
            $('input[name="oldPassword"]').val("");
            $('input[name="newPassword"]').val("");
        }
    });
}

function buildTable(data) {
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function (user) {
            $("#orders > tbody").html("");
            for (let orders of data) {
                let tbody = $('#orders tbody');
                let restaurant = $('<td class="ordersTd">' + orders.restaurant + '</td>');
                //let date = $('<td class="ordersTd">' + orders.date + '</td>');
                let status = $('<td class="ordersTd">' + orders.status + '</td>');
                let price = $('<td class="ordersTd">' + orders.price + '$' + '</td>');
                //datum rodjenja
                let dateTmp = new Date(orders.date);
                var day = dateTmp.getDate();
                var month = dateTmp.getMonth() + 1;
                var year = dateTmp.getFullYear();
                formattedDate = day + "." + month + "." + year + ".";
                let date = ($('<td class="ordersTd">' + formattedDate + '</td>'));
                let items = ($('<td class="ordersTd"></td>'));
                for (let i = 0; i < orders.items.length; i++) {
                    items.append(orders.items[i].name);
                    if (i != orders.items.length - 1) items.append(' | ');
                }
                //kreiranje tabele
                let tr = $('<tr class="ordersTr"></tr>');

                if (user.role == "Customer" || user.role == "Deliverer") {
                    $("#restaurantName").show();
                    tr.append(restaurant).append(date).append(items).append(status).append(price);
                }
                else {
                    $("#restaurantName").hide();
                    tr.append(date).append(items).append(status).append(price);
                }
                if (loggedInUser.role == "Customer" && orders.status == "Processing") {
                    var button = $('<button onclick="cancelOrder(' + orders.orderId + "," + orders.price + ')">cancel</button>');
                    tr.append(button);
                }
                if (loggedInUser.role == "Manager" && orders.status == "Processing") {
                    var button = $('<button onclick="processedOrder(' + orders.orderId + ')">processed</button>');
                    tr.append(button);
                }
                if (loggedInUser.role == "Manager" && orders.status == "InPreparation") {
                    var button = $('<button onclick="prepareOrder(' + orders.orderId + ')">prepared</button>');
                    tr.append(button);
                }
                if (loggedInUser.role == "Manager" && orders.status == "WaitingForApproval") {
                    var button = $('<button onclick="waitingForApproval(' + orders.orderId + ')">approve</button>');
                    tr.append(button);
                }
                if (loggedInUser.role == "Deliverer" && orders.status == "WaitingForDeliveryMan") {
                    var button = $('<button onclick="waitingForDeliveryMan(' + orders.orderId + ')">send request</button>');
                    tr.append(button);
                }
                if (loggedInUser.role == "Deliverer" && orders.status == "InTransport") {
                    var button = $('<button onclick="inTransportOrder(' + orders.orderId + ')">processed</button>');
                    tr.append(button);
                }
                tbody.append(tr);
            }
        }
    });
}

function filterTable() {
    //console.log('filtriram');
    var restaurantTypeSelect = $('#restaurantTypeSelect').find(":selected").text().toLowerCase();
    var statusSelect = $('#statusSelect').find(":selected").text().toLowerCase();
    var restaurantInput = $('#searchRestaurant').val().toLowerCase();
    var searchPriceFromInput = parseInt($('#searchPriceFrom').val());
    var searchPriceToInput = parseInt($('#searchPriceTo').val());
    var searchDateFromInput = $('#searchDateFrom').val();
    var searchDateToInput = $('#searchDateTo').val();
    var allOrders = orders;
    var tmpOrders = [];
    //name
    for (var i = 0; i < allOrders.length; i++) {
        var name = allOrders[i].restaurant.toLowerCase();
        if (name.includes(restaurantInput)) tmpOrders.push(allOrders[i]);
    }
    allOrders = tmpOrders;
    tmpOrders = [];
    //order price
    for (var i = 0; i < allOrders.length; i++) {
        if (!Number.isInteger(searchPriceFromInput) || !Number.isInteger(searchPriceToInput) || searchPriceToInput < searchPriceFromInput) {
            tmpOrders = allOrders;
            break;
        }
        var price = allOrders[i].price;
        if (price >= searchPriceFromInput && price <= searchPriceToInput) tmpOrders.push(allOrders[i]);
    }
    allOrders = tmpOrders;
    tmpOrders = [];
    //order date
    for (var i = 0; i < allOrders.length; i++) {
        var tokensFrom = searchDateFromInput.toString().split('.');
        var tokensTo = searchDateToInput.toString().split('.');
        var fromDate = new Date(tokensFrom[2], tokensFrom[1] - 1, tokensFrom[0], 0, 0, 0, 0);
        var toDate = new Date(tokensTo[2], tokensTo[1] - 1, tokensTo[0], 0, 0, 0, 0);
        //ako je neki od datuma nevalidan onda necu filtrirati po datumu
        if (fromDate instanceof Date && !isNaN(fromDate) && toDate instanceof Date && !isNaN(toDate) && fromDate <= toDate);
        else {
            tmpOrders = allOrders;
            break;
        }
        //console.log(fromDate + ', ' + toDate);
        if (allOrders[i].date >= fromDate && allOrders[i].date <= toDate) tmpOrders.push(allOrders[i]);
    }
    allOrders = tmpOrders;
    tmpOrders = [];

    //restaurant type, get zahtev za tip restorana ne radi dobro, izgleda da se desila greska pa ne vraca success funkciju vec error
    /*//if(restaurantTypeSelect == 'restaurant Type') tmpUsers = allUsers;
    for(var i=0; i<allOrders.length; i++){
        //if(restaurantTypeSelect == 'restaurant Type') break;
        var type = getRestaurantType(allOrders[i].restaurant);
        //console.log(allOrders[i].restaurant);
        console.log(type);
        //if(role == roleInput) tmpUsers.push(allUsers[i]);
    }
    //allUsers = tmpUsers;
    //tmpUsers = [];*/

    //order status
    if (statusSelect == 'delivery status') tmpOrders = allOrders;
    for (var i = 0; i < allOrders.length; i++) {
        if (statusSelect == 'delivery status') break;
        var status = allOrders[i].status.toLowerCase();
        //console.log(allOrders[i].restaurant);
        //console.log(status);
        if (status == statusSelect) tmpOrders.push(allOrders[i]);
    }
    allOrders = tmpOrders;
    tmpOrders = [];

    buildTable(allOrders);
    return allOrders;
}

//probaj sa post zahtevom
function getRestaurantType(restaurant) {
    $.get({
        url: "rest/userService/getRestaurantType?restaurant=" + restaurant,
        success: function (data) {
            //console.log('data:' + data);
            return data;
        }
    });
}

function cancelOrder(id, price) {
    //console.log(id + ", " + price);
    $.post({
        url: "rest/userService/cancelOrder",
        data: JSON.stringify({ id: id, price: price }),
        contentType: "application/json",
        success: function () {
            $.get({
                url: "rest/userService/getOrders",
                success: function (data) {
                    orders = data;
                    if (data.length > 0) $('#orders').show();
                    if (data.length > 0) $('.filters').show();
                    buildTable(data);
                }
            });
        }
    });
}

function processedOrder(id) {
    $.post({
        url: "rest/userService/processedOrder",
        data: JSON.stringify({ id: id }),
        contentType: "application/json",
        success: function () {
            $.get({
                url: "rest/userService/getOrders",
                success: function (data) {
                    orders = data;
                    if (data.length > 0) $('#orders').show();
                    if (data.length > 0) $('.filters').show();
                    buildTable(data);
                }
            });
        }
    });
}

function prepareOrder(id) {
    $.post({
        url: "rest/userService/prepareOrder",
        data: JSON.stringify({ id: id }),
        contentType: "application/json",
        success: function () {
            $.get({
                url: "rest/userService/getOrders",
                success: function (data) {
                    orders = data;
                    if (data.length > 0) $('#orders').show();
                    if (data.length > 0) $('.filters').show();
                    buildTable(data);
                }
            });
        }
    });
}

function inTransportOrder(id) {
    $.post({
        url: "rest/userService/inTransportOrder",
        data: JSON.stringify({ id: id }),
        contentType: "application/json",
        success: function () {
            $.get({
                url: "rest/userService/getOrders",
                success: function (data) {
                    orders = data;
                    if (data.length > 0) $('#orders').show();
                    if (data.length > 0) $('.filters').show();
                    buildTable(data);
                }
            });
        }
    });
}

function waitingForDeliveryMan(id) {
    $.post({
        url: "rest/userService/waitingForDeliveryMan",
        data: JSON.stringify({ id: id, username: loggedInUser.username }),
        contentType: "application/json",
        success: function () {
            $.get({
                url: "rest/userService/getOrders",
                success: function (data) {
                    orders = data;
                    if (data.length > 0) $('#orders').show();
                    if (data.length > 0) $('.filters').show();
                    buildTable(data);
                }
            });
        }
    });
}

function waitingForApproval(id) {
    $.post({
        url: "rest/userService/waitingForApproval",
        data: JSON.stringify({ id: id }),
        contentType: "application/json",
        success: function () {
            $.get({
                url: "rest/userService/getOrders",
                success: function (data) {
                    orders = data;
                    if (data.length > 0) $('#orders').show();
                    if (data.length > 0) $('.filters').show();
                    buildTable(data);
                }
            });
        }
    });
}
