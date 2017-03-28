$('body').scrollspy({ target: '#menu-buttons' });
$(".nav li a").on("click", function() {
  $(".nav li a").removeClass("active");
  $(this).addClass("active");
});
