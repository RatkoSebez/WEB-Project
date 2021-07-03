$(document).ready(function(){
    // proveri da li je korisnik ulogovan i ako jeste koju ima ulogu pa mu prikazi njegove funkcionalnosti
    $.get({
        url: "rest/userService/getLoggedInUser",
        success: function(user){
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
                }
                else if(user.role == "Customer"){
                    $("#shoppingCart").show();
                    $("#searchRestaurant").show();
                    $("#restaurantTypeSelect").show();
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