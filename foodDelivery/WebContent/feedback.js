var loggedInUser;

$(document).ready(function(){    
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
            loggedInUser = user;
            if(user.role == 'Customer'){
                $.get({
                    url: "rest/userService/getLoggedInUser",
                    success: function(user){
                        $.get({
                            url: "rest/userService/getRestaurantsForComments?username=" + user.username,
                            success: function(restaurants){
                                if(restaurants.length > 0) $('#feedbackForm').show();
                                var restaurantsSelectList = $('#restaurants');
                                for (var i = 0; i < restaurants.length; i++) {
                                    restaurantsSelectList.append(new Option(restaurants[i], 'value'));
                                }
                            }
                        });
                    }
                });
                let form = $('form');
                form.submit(function(event){
                    event.preventDefault();
                    let data = {
                    'comment' : $('textarea#comment').val(),
                    'rating' : $('input[name="rating"]').val(),
                    'restaurant' : $('#restaurants').find(":selected").text()
                    }
                    $.post({
                        url: "rest/userService/newComment",
                        data: JSON.stringify(data),
                        contentType: "application/json",
                    });
                });
            }
            if(user.role == 'Manager'){
                $("#comments").show();
                $.get({
                    url: "rest/userService/getCommentsForRestaurant?name=" + user.restaurant.name,
                    success: function(comments){
                        //console.log(comments.length);
                        buildTable(comments);
                    }
                });
            }
        }
    });
});

function buildTable(data){
    $("#comments > tbody").html("");
    for(let comment of data){
        let tbody = $('#comments tbody');
        let user = $('<td class="commentTd">' + comment.user + '</td>');
        let restaurant = $('<td class="commentTd">' + comment.restaurant + '</td>');
        let rating = $('<td class="commentTd">' + comment.rating + '</td>');
        let restaurantComment = $('<td class="commentTd">' + comment.comment + '</td>');
        let accepted = comment.accepted;
        if(comment.accepted == null) accepted = "waiting";
        let isAccepted = $('<td class="commentTd">' + accepted + '</td>');
        let tr = $('<tr class="commentTr"></tr>');
        var buttonApprove = $('<td><button>approve</button></td>').find('button').click(function () {
            $.get({
                url: "rest/userService/updateCommentApproval?id=" + comment.id + "&approve=true",
                success: function(){
                    $.get({
                        url: "rest/userService/getCommentsForRestaurant?name=" + loggedInUser.restaurant.name,
                        success: function(comments){
                            buildTable(comments);
                        }
                    });
                }
            });
        }).end();
        var buttonReject = $('<td><button>reject</button></td>').find('button').click(function () {
            $.get({
                url: "rest/userService/updateCommentApproval?id=" + comment.id + "&approve=false",
                success: function(){
                    $.get({
                        url: "rest/userService/getCommentsForRestaurant?name=" + loggedInUser.restaurant.name,
                        success: function(comments){
                            buildTable(comments);
                        }
                    });
                }
            });
        }).end();
        //let buttonApprove = $('<button onclick="approveComment(' + comment.comment + "," + comment.user + ')">approve</button>');
        //let buttonReject = $('<td><button onclick="rejectComment(' + functionParameter + ')">reject</button></td>');
        tr.append(user).append(restaurant).append(rating).append(restaurantComment).append(isAccepted).append(buttonApprove).append(buttonReject);
        /*if(loggedInUser.role == "Customer" && comment.status == "Processing"){
            var button = $('<button onclick="cancelOrder(' + comment.orderId + "," + comment.price + ')">cancel</button>');
            tr.append(button);
        }
        //console.log(loggedInUser.role)
        if(loggedInUser.role == "Manager" && comment.status == "Processing"){
            //console.log('unutra');
            var button = $('<button onclick="processedOrder(' + comment.orderId + ')">processed</button>');
            tr.append(button);
        }
        if(loggedInUser.role == "Deliverer" && comment.status == "InTransport"){
            //console.log('unutra');
            var button = $('<button onclick="inTransportOrder(' + comment.orderId + ')">processed</button>');
            tr.append(button);
        }*/
        tbody.append(tr);
    }
}
