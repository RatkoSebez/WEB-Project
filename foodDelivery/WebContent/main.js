$(document).ready(function(){
    // proveri da li je korisnik ulogovan i ako jeste koju ima ulogu pa mu prikazi njegove funkcionalnosti
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
            loadMenu(user);
            if(!user){
                $("#login").show();
                $("#register").show();
                $("#logout").hide();
                $("#account").hide();
                $("#users").hide();
                $("#adminRegister").hide();
                $("#newRestaurant").hide();
                $("#newItem").hide();
                $("#shoppingCart").hide();
                $("#searchRestaurant").hide();
                $("#restaurantTypeSelect").hide();
                $("#feedback").hide();
            }
            else{
                $("#login").hide();
                $("#register").hide();
                $("#logout").show();
                $("#account").show();
                if(user.role == "Admin"){
                    $("#users").show();
                    $("#adminRegister").show();
                    $("#newRestaurant").show();
                }
                else if(user.role == "Manager"){
                    //ako je menadzer zaduzen za restoran
                    if(user.restaurant) $("#newItem").show();
                    if(user.restaurant) $("#users").show();
                    if(user.restaurant) $("#feedback").show();
                    if(user.restaurant) $("#restaurant").show();
                }
                else if(user.role == "Customer"){
                    $("#shoppingCart").show();
                    $("#searchRestaurant").show();
                    $("#restaurantTypeSelect").show();
                    $("#feedback").show();
                }
                else if(user.role == "Deliverer"){
                    $("#searchRestaurant").show();
                    $("#restaurantTypeSelect").show();
                }
                else{
                    $("#users").hide();
                    $("#adminRegister").hide();
                    $("#newRestaurant").hide();
                    $("#newItem").hide();
                    $("#shoppingCart").hide();
                    $("#searchRestaurant").hide();
                    $("#restaurantTypeSelect").hide();
                    $("#feedback").hide();
                }
            }
        }
    });
    // funkcija za sticky menu
    function stickyMenu() {
        var sticky = document.getElementById('sticky');
        if (window.pageYOffset > 220) {
            sticky.classList.add('sticky');
        }
        else {
            sticky.classList.remove('sticky');
        }
    }
    window.onscroll = function () {
        stickyMenu();
    }
});

function loadMenu(user){
    let restaurantName = "";
    if(user){
        if(user.restaurant) restaurantName = user.restaurant.name;
    }
    let menu = $('.menuWrapper');
    var myvar = '<div class="parallax">'+
    '        <div class="page-title">Fast delivery</div>'+
    '    </div>'+
    '    <div class="menu" id="sticky">'+
    '        <ul class="menu-ul">'+
    '            <a href="index.html" class="a-menu"><li>Home</li></a>'+
    '            <a href="restaurant.html?name=' + restaurantName + '" class="a-menu" id="restaurant" hidden><li>My Restaurant</li></a>'+
    '            <a href="users.html" class="a-menu" id="users" hidden><li>Users</li></a>'+
    '            <a href="adminRegister.html" class="a-menu" id="adminRegister" hidden><li>Register User</li></a>'+
    '            <a href="newRestaurant.html" class="a-menu" id="newRestaurant" hidden><li>New Restaurant</li></a>'+
    '            <a href="login.html" class="a-menu" id="login" hidden><li>Login</li></a>'+
    '            <a href="register.html" class="a-menu" id="register" hidden><li>Register</li></a>'+
    '            <a href="newItem.html" class="a-menu" id="newItem" hidden><li>New Item</li></a>'+
    '            <a href="shoppingCart.html" class="a-menu" id="shoppingCart" hidden><li>Shopping Cart</li></a>'+
    '            <a href="feedback.html" class="a-menu" id="feedback" hidden><li>Feedback</li></a>'+
    '            <a href="rest/userService/logout" class="a-menu" id="logout" hidden><li>Logout</li></a>'+
    '            <a href="account.html" class="a-menu" id="account" hidden><li>Account</li></a>'+
    '        </ul>'+
    '    </div>';
    menu.append(myvar);
}