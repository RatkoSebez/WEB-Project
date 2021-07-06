$(document).ready(function(){
    //console.log('oo');
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
            $.get({
                url: "rest/userService/getRestaurantsForComments?username=" + user.username,
                success: function(restaurants){
                    //console.log(restaurants.length)
                    if(restaurants.length > 0) $('#feedbackForm').show();
                    var restaurantsSelectList = $('#restaurants');
                    //console.log(managers.length);
                    for (var i = 0; i < restaurants.length; i++) {
                        restaurantsSelectList.append(new Option(restaurants[i], 'value'));
                    }
                }
            });
        }
    });
    //console.log('oo')
    let form = $('form');
    //console.log('oo')
    form.submit(function(event){
        console.log('oo')
        //console.log('poslata forma');
        event.preventDefault();
        let data = {
        'comment' : $('textarea#comment').val(),
        //'comment' : "komentttttae",
        'rating' : $('input[name="rating"]').val(),
        'restaurant' : $('#restaurants').find(":selected").text()
        }
        $.post({
            url: "rest/userService/newComment",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(){
                
            }
        });
    });
});