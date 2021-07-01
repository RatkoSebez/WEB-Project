var itemNames = [];
var itemQuantity = [];
var price = 0;
var infoDiv;
var items = [];
var mainDiv;

$(document).ready(function(){
    start();
});

function start(){
    $.get({
        url: "rest/userService/getUserItems",
        success: function(items){
            //ovaj rad sa tekstom je tu jer ne znam u kom tipu je items stiglo, proverio sam da je objekat
            //ali ne znam da li je mapa ili sta god jer nijednu funkciju nisam mogao iskoristiti
            //rucno cu isparsirati string i pretvoriti u neki tip
            let itemsJson = JSON.stringify(items);
            //console.log(items);
            if(itemsJson.length < 4){
                //console.log('ovde');
                //$('.itemsContainer').val('');
                //return;
            }
            //console.log(itemsJson);
            //skloni viticaste zagrade sa pocetka i kraja stringa
            itemNames = [];
            itemQuantity = [];
            itemsJson = itemsJson.substring(0, itemsJson.length - 1);
            itemsJson = itemsJson.substring(1, itemsJson.length);
            let pairs = itemsJson.split(',');
            //var data = [];
            for(let i=0; i<pairs.length; i++){
                itemNames[i] = pairs[i].split(':')[0];
                itemNames[i] = itemNames[i].substring(0, itemNames[i].length - 1);
                itemNames[i] = itemNames[i].substring(1, itemNames[i].length);
                itemQuantity[i] = pairs[i].split(':')[1];
            }
            //console.log('item names:' + itemNames.length);
            buildItems(itemNames, itemQuantity);
        }
    });
}

function buildItems(itemNames, itemQuantity){
    //console.log('ovde sam' + items.length)
    $('.itemsContainer').html('');
    mainDiv = $('.itemsContainer');
    $.post({
        url: "rest/userService/getItemsForShoppingCart",
        data: JSON.stringify({names: itemNames}),
        contentType: "application/json",
        success: function(data){
            items = data;
            //java ce vratiti null ako je prazna lista itema pa onda prekidam funkciju
            if(!items[0]) return;
            //console.log(data);
            price = 0;
            for(let i=0; i<items.length; i++){
                //console.log('i:' + i);
                var categoriesDiv = $('<div class="itemsCategories"></div>');
                var img = new Image();
                img.src = items[i].image;
                img.classList.add('itemsImage');
                var textDiv = $('<div class="itemImageTitle"></div>');
                textDiv.append('<b>' + items[i].name + '</b>' + '<br>' + items[i].type + '<br>' + items[i].price + '$<br>');
                if(items[i].type == 'Drink' && items[i].quantity) textDiv.append(items[i].quantity + 'ml<br>');
                if(items[i].type == 'Food' && items[i].quantity) textDiv.append(items[i].quantity + 'g<br>');
                if(items[i].description) textDiv.append(items[i].description + '<br>');
                var shoppingCartDiv = $('<div class="shoppingCartDiv"></div>');
                shoppingCartDiv.append('quantity: <input type="text" name="quantity" id="' + i + '" size="2" value="' + itemQuantity[i] + '" oninput="editItemQuantity(' + i + ')">');
                shoppingCartDiv.append('<button id="remove" onclick="removeItem(' + i + ')">remove</button>');
                textDiv.append(shoppingCartDiv);
                categoriesDiv.append(img).append(textDiv);
                mainDiv.append(categoriesDiv);
                price += items[i].price * itemQuantity[i];
                if(i == itemNames.length - 1){
                    infoDiv = $('<div class="info"></div>');
                    infoDiv.append('total price' + price + '$');
                    mainDiv.append(infoDiv);
                    mainDiv.append('<button id="createOrder" onclick="createOrder()">Create Order</button>');
                }
            }
        }
    });
}

function editItemQuantity(i){
    price -= itemQuantity[i] * items[i].price;
    let quantity = $('#' + i).val();
    itemQuantity[i] = quantity;
    price += itemQuantity[i] * items[i].price;
    infoDiv = $('<div class="info"></div>');
    infoDiv.append('total price' + price + '$');
    $('.itemsContainer').children().last().remove();
    mainDiv.append(infoDiv);
    $.get({
        url: "rest/userService/addItemToCart?name=" + items[i].name + "&quantity=" + itemQuantity[i] + "&flag=yes",
        success: function(){
        }
    });
}

function removeItem(i){
    price -= itemQuantity[i] * items[i].price;
    infoDiv = $('<div class="info"></div>');
    infoDiv.append('total price' + price + '$');
    $('.itemsContainer').children().last().remove();
    mainDiv.append(infoDiv);

    $.get({
        url: "rest/userService/removeItemFromCart?name=" + items[i].name,
        success: function(){
            start();
        }
    });
}

function createOrder(){
    let data = {
    'items' : items,
    'price' : price,
    'date' : new Date()
    }
    $.post({
        url: "rest/userService/createOrder",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(){
            //console.log('here');
            start();
        }
    });
}