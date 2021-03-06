var imagesLoaded = require('imagesloaded');

var _ = require('underscore');

var onScroll = _.throttle(function() {
  if ($(document).scrollTop() > 50) {
    $('body').addClass('is-page-scrolled');
  } else {
    $('body').removeClass('is-page-scrolled');
  }

  if ($('body').hasClass('is-exposing-photo')) {
    $('.js-backgroundBlocker').addClass('has-scrolled-while-exposing');
  }
}, 300, this);

$(window).scroll(onScroll);

var $navLinks;

$(document).ready(function() {
  $navLinks = $('.js-projectsNavigation a');

  configureToolbar();

  configureMasonry();

  configurePhotoExpo();

  $('.js-a-particular-pick').click();
});

function configureToolbar() {
  $('.js-everyday-chiswick').click(function(event) {
    event.preventDefault();
    clearMasonry();
    configureMasonry();
    configureEverydayChiswick();
    $navLinks.removeClass('active');
    $(event.currentTarget).addClass('active');
  });

  $('.js-a-particular-pick').click(function(event) {
    event.preventDefault();
    clearMasonry();
    configureMasonry();
    configureAParticularPick();
    $navLinks.removeClass('active');
    $(event.currentTarget).addClass('active');
  });
}

function clearMasonry() {
  var $photoWrapper = $('.js-photoSlider .photoWrapper');
  $photoWrapper.remove();
  $('.js-photoSlider').masonry('destroy');
}

function configureEverydayChiswick() {
  configureImages('everyday_chiswick', 8);
}

function configureAParticularPick() {
  configureImages('a_particular_pick', 26);
}

function configureImages(projectFolderName, photosCount) {
  $photoSlider = $('.js-photoSlider');
  var identifier = $photoSlider.data('identifier');
  if (!identifier) {
    identifier = 1;
  } else {
    identifier++;
  }

  $photoSlider.data('identifier', identifier);

  _(photosCount).times(function(index) {
    var imageSrc = 'public/photos/' + projectFolderName + '/photo-' + (index + 1) + '.jpg';

    var $photoWrapper = $('<div class="photoWrapper js-photoWrapper">');

    var $image = $('<img src="' + imageSrc + '">');
    $photoWrapper.append($image);

    $image.one('load', function() {
      if ($photoSlider.data('identifier') == identifier) {
        $('.js-photoSlider').append($photoWrapper);
        $('.js-photoSlider').masonry('appended', $photoWrapper);
        $('.js-photoSlider').masonry('layout');
      }
    });


  });
}

function configureMasonry() {
  var $photoSlider = $('.js-photoSlider');
  $photoSlider.masonry({
    itemSelector: '.js-photoWrapper',
    gutter: 20,
    transitionDuration: 0,
    columnWidth: 350,
    isFitWidth: true
  });
}


function configurePhotoExpo() {
  var $photoExpo = $('.js-photoExpo');
  var $photoExpoWrapper = $('.js-photoExpoWrapper');
  var $photoExpoImg = $('.js-photoExpo img');
  var $backgroundBlocker = $('.js-backgroundBlocker');

  $('body').on('click', '.js-photoSlider .js-photoWrapper', function(event) {

    $('.js-backgroundBlocker').show();

    $('body').addClass('is-exposing-photo');

    var imgLoaded = imagesLoaded('.js-photoExpo');

    imgLoaded.on('done', function(instance, image) {
      $photoExpo.removeClass('is-loading');
      imgLoaded.off();

      setPhotoExpoSizeClass($photoExpoImg, $photoExpo);
    });

    $photoExpoWrapper.css('top', $(document).scrollTop() + 30);

    $photoExpo.addClass('is-loading');
    $photoExpoWrapper.fadeIn();

    var src = $(event.currentTarget).children('img').attr('src');

    $photoExpoImg.attr('src', src);


  });

  function hidePhotoExpo() {
    $backgroundBlocker.hide();
    $photoExpoWrapper.hide();
    $('body').removeClass('is-exposing-photo');
    $backgroundBlocker.removeClass('has-scrolled-while-exposing');
  }

  $photoExpoWrapper.click(hidePhotoExpo);
  $backgroundBlocker.click(hidePhotoExpo);

}

function setPhotoExpoSizeClass($photoExpoImg, $photoExpo) {
  var width = $photoExpoImg.width();
  var height = $photoExpoImg.height();

  var delta = height - width;

  if (width > height) {
    $photoExpo.switchClass('is-tall is-really-tall', 'is-wider', 0);
  } else if (height / 2 > delta && width !== height) {
    $photoExpo.switchClass('is-tall is-wider', 'is-really-tall', 0);
  } else {
    $photoExpo.switchClass('is-really-tall is-wider', 'is-tall', 0);
  }
}




