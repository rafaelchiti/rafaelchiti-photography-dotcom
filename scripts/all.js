var imagesLoaded = require('imagesloaded');
var _ = require('underscore');

var onScroll = _.throttle(function() {
  if ($(document).scrollTop() > 50) {
    $('body').addClass('is-page-scrolled');
  } else {
    $('body').removeClass('is-page-scrolled');
  }
}, 300, this);

$(window).scroll(onScroll);

var $navLinks;

$(document).ready(function() {
  $navLinks = $('.js-projectsNavigation a');

  configureToolbar();

  configureMasonry();

  configurePhotoExpo();

  $('.js-everyday-chiswick').click();
});

function configureToolbar() {
  $('.js-everyday-chiswick').click(function(event) {
    event.preventDefault();
    clearMasonry();
    configureEverydayChiswick();
    $navLinks.removeClass('active');
    $(event.currentTarget).addClass('active');
  });

  $('.js-a-particular-pick').click(function(event) {
    event.preventDefault();
    clearMasonry();
    configureAParticularPick();
    $navLinks.removeClass('active');
    $(event.currentTarget).addClass('active');
  });
}

function clearMasonry() {
  var $photoWrapper = $('.js-photoSlider .photoWrapper');

  _($photoWrapper).each(function(photoWrapper) {
    $('.js-photoSlider').masonry('remove', photoWrapper);
  });

}

function configureEverydayChiswick() {
  configureImages('everyday_chiswick', 8);
}

function configureAParticularPick() {
  configureImages('a_particular_pick', 28);
}

function configureImages(projectFolderName, photosCount) {
  _(photosCount).times(function(index) {
    var imageSrc = 'public/photos/' + projectFolderName + '/photo-' + (index + 1) + '.jpg';

    var $photoWrapper = $('<div class="photoWrapper js-photoWrapper">');

    var $image = $('<img src="' + imageSrc + '">');

    $photoWrapper.append($image);

    $('.js-photoSlider').append($photoWrapper);

    $('.js-photoSlider').masonry('appended', $photoWrapper);

  });
}

function configureMasonry() {
  var $photoSlider = $('.js-photoSlider');

  var imgLoaded = imagesLoaded('.js-photoSlider');

  $photoSlider.masonry({
    itemSelector: '.js-photoWrapper',
    gutter: 20,
    columnWidth: 350,
    isFitWidth: true
  });

  masonryLayoutIntervalId = setInterval(function() {
    $photoSlider.masonry('layout');
  }, 700);
}

function loadEveryDayChiswick() {
  $('')
}


function configurePhotoExpo() {
  $('body').on('click', '.js-photoSlider .js-photoWrapper', function(event) {

    $('.js-backgroundBlocker').show();

    var imgLoaded = imagesLoaded('.js-photoExpo');

    imgLoaded.on('done', function(instance, image) {
      $('.js-photoExpo').removeClass('is-loading');
      imgLoaded.off();
    });


    $('.js-photoExpo').fadeIn();
    $('.js-photoExpo').addClass('is-loading');

    var src = $(event.currentTarget).children('img').attr('src');

    $('.js-photoExpo img').attr('src', src);

  });

  $('.js-backgroundBlocker').click(function(event) {
    $(event.currentTarget).hide();
    $('.js-photoExpo').hide();
  });

}




