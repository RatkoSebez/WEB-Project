$(document).ready(function(){
    $.get({
        url: "rest/userService/getUserItems",
        success: function(items){
            //ovaj rad sa tekstom je tu jer ne znam u kom tipu je items stiglo, proverio sam da je objekat
            //ali ne znam da li je mapa ili sta god jer nijednu funkciju nisam mogao iskoristiti
            //rucno cu isparsirati string i pretvoriti u neki tip
            let itemsJson = JSON.stringify(items);
            console.log(itemsJson);
            //skloni viticaste zagrade sa pocetka i kraja stringa
            itemsJson = itemsJson.substring(0, itemsJson.length - 1);
            itemsJson = itemsJson.substring(1, itemsJson.length);
            let pairs = itemsJson.split(',');
            let itemNames = [];
            let itemQuantity = [];
            //var data = [];
            for(let i=0; i<pairs.length; i++){
                itemNames[i] = pairs[i].split(':')[0];
                itemNames[i] = itemNames[i].substring(0, itemNames[i].length - 1);
                itemNames[i] = itemNames[i].substring(1, itemNames[i].length);
                itemQuantity[i] = pairs[i].split(':')[1];
                //data.push([itemNames[i], itemQuantity[i]]);
                //console.log(itemNames[i] + '---' + itemQuantity[i]);
                //console.log(data.length);
            }

            buildItems(itemNames, itemQuantity);
            
            /*for(let i=0; i<data.length; i++){
                console.log(data[i]);
            }*/

            //console.log(pairs[0]);
            //items.split(':');
            //var d = [];
            //d.push([label, value]);
            //console.log(items instanceof String)
            //console.log(typeof items);
        }
    });
});

function buildItems(itemNames, itemQuantity){
    //console.log('ovde sam' + items.length)
    $('.itemsContainer').html('');
    let mainDiv = $('.itemsContainer');
    let price = 0;
    for(let i=0; i<itemNames.length; i++){
        $.get({
            url: "rest/userService/getItem?name=" + itemNames[i],
            success: function(item){
                //console.log(item)
                var categoriesDiv = $('<div class="itemsCategories"></div>');
                var img = new Image();
                img.src = item.image;
                img.classList.add('itemsImage');
                var textDiv = $('<div class="itemImageTitle"></div>');
                textDiv.append('<b>' + item.name + '</b>' + '<br>' + item.type + '<br>' + item.price + '$<br>');
                if(item.type == 'Drink' && item.quantity) textDiv.append(item.quantity + 'ml<br>');
                if(item.type == 'Food' && item.quantity) textDiv.append(item.quantity + 'g<br>');
                if(item.description) textDiv.append(item.description + '<br>');
                var shoppingCartDiv = $('<div class="shoppingCartDiv" hidden></div>');
                shoppingCartDiv.append('quantity: <input type="text" name="quantity" id="' + i + '" size="2">');
                shoppingCartDiv.append('<button id="add" onclick="addItemToShoppingCart(\'' + item.name + ',' + i + '\')">add</button>');
                textDiv.append(shoppingCartDiv);
                categoriesDiv.append(img).append(textDiv);
                mainDiv.append(categoriesDiv);
                price += item.price;  
                if(i == itemNames.length - 1){
                    var infoDiv = $('<div class="info"></div>');
                    infoDiv.append('total price' + price + '$');
                    mainDiv.append(infoDiv);
                }
            }
        });
    }
}