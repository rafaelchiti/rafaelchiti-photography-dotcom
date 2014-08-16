var $navLinks;

function configureToolbar(showSetCallback) {

  var $navLinks = $('.js-projectsNavigation a');

  $('.js-set-1').click(function(event) {
    event.preventDefault();
    showSetCallback('set1');
    $navLinks.removeClass('active');
    $(event.currentTarget).addClass('active');
  });

  $('.js-set-2').click(function(event) {
    event.preventDefault();
    showSetCallback('set2');
    $navLinks.removeClass('active');
    $(event.currentTarget).addClass('active');
  });
}

module.exports.configure = configureToolbar;