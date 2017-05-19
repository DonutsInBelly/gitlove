$(document).ready(function(){
      $(window).scroll(function() { 
        if ($(document).scrollTop() > 750) { 
          $(".navbar-default").css("background-color", "#595959").css("opacity", "0.9"); 
        } else {
          $(".navbar-default").css("background-color", "transparent");
        }
      });
    });