$(()=> {
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    AOS.init();

    $('.close-icon').click(function() {
        $(this).closest('div.alert-box').fadeOut();
    });
});