var photos = require('./photos_information');
var imagesLoaded = require('imagesloaded');
var _ = require('underscore');

var _elements = {
  $photoExpo: null,
  $photoExpoWrapper: null,
  $photoExpoImg: null,
  $backgroundBlocker: null,
  $photoSlider: null,
  $body: null,
  $photoExpoTitle: null,
  $photoExpoDescription: null
};

var photosContainer = {
  initialize: function() {
    _cacheElements();
    _configureMasonry();
    _configureExpoScrollingBehaviour();

    this.showSet('set1');
  },

  showSet: function(set) {
    _clearMasonry();
    _configureMasonry();
    _configureImagesFor(set);
  }
}

function _cacheElements() {
  _elements.$body = $('body');
  _elements.$photoExpo = $('.js-photoExpo');
  _elements.$photoExpoTitle = $('.js-photoExpo-title');
  _elements.$photoExpoDescription = $('.js-photoExpo-description');
  _elements.$photoExpoWrapper = $('.js-photoExpoWrapper');
  _elements.$photoExpoImg = $('.js-photoExpo img');
  _elements.$backgroundBlocker = $('.js-backgroundBlocker');
  _elements.$photoSlider = $('.js-photoSlider');
};


function _configureMasonry() {
  _elements.$photoSlider.masonry({
    itemSelector: '.js-photoWrapper',
    gutter: 20,
    transitionDuration: 0,
    columnWidth: 400,
    isFitWidth: true
  });
}

function _clearMasonry() {
  var $photoWrapper = $('.js-photoSlider .photoWrapper');
  $photoWrapper.remove();
  _elements.$photoSlider.masonry('destroy');
}


function _configureImagesFor(set) {
  var identifier = _elements.$photoSlider.data('identifier');
  if (!identifier) {
    identifier = 1;
  } else {
    identifier++;
  }

  _elements.$photoSlider.data('identifier', identifier);

  var photosSet = _(photos).where({'set': set});

  _(photosSet).each(function(photo) {

    var $photo = _photoHTML(photo);
    var $img = $photo.find('img');

    $photo.addClass('is-loading');

    _elements.$photoSlider.append($photo);
    _elements.$photoSlider.masonry('appended', $photo);

    $img.one('load', function() {
      if (_elements.$photoSlider.data('identifier') == identifier) {
        _elements.$photoSlider.masonry('layout');
        $photo.removeClass('is-loading');
      }
    });

    $photo.on('click',  photo, _configurePhotoExpo.bind(this));

  });
}


function _photoHTML(photo) {
  var $photoWrapper = $('<div class="photoWrapper js-photoWrapper">');
  $photoWrapper.data('title', photo.title);
  $photoWrapper.data('description', photo.description);

  var $image = $('<img src="' + photo.location + '">');

  $photoWrapper.append($image);

  return $photoWrapper;
}


function _configurePhotoExpo(event) {
  var photoData = event.data;

  _elements.$backgroundBlocker.show();

  _elements.$body.addClass('is-exposing-photo');

  var imgLoaded = imagesLoaded('.js-photoExpo');

  imgLoaded.on('done', function(instance, image) {
    _elements.$photoExpo.removeClass('is-loading');
    imgLoaded.off();

    _setPhotoExpoSizeClass();
  });

  _elements.$photoExpoWrapper.css('top', $(document).scrollTop() + 70);

  _elements.$photoExpo.addClass('is-loading');
  _elements.$photoExpoWrapper.fadeIn();

  _elements.$photoExpoImg.attr('src', photoData.location);

  _elements.$photoExpoTitle.text(photoData.title);
  _elements.$photoExpoDescription.text(photoData.description);

  function hidePhotoExpo() {
    _elements.$backgroundBlocker.hide();
    _elements.$photoExpoWrapper.hide();
    _elements.$body.removeClass('is-exposing-photo');
    _elements.$backgroundBlocker.removeClass('has-scrolled-while-exposing');
  }

  _elements.$photoExpoWrapper.click(hidePhotoExpo);
  _elements.$backgroundBlocker.click(hidePhotoExpo);

}


function _setPhotoExpoSizeClass() {
  var width = _elements.$photoExpoImg.width();
  var height = _elements.$photoExpoImg.height();

  var delta = height - width;

  if (width > height) {
    _elements.$photoExpo.switchClass('is-tall is-really-tall', 'is-wider', 0);
  } else if (height / 2 > delta && width !== height) {
    _elements.$photoExpo.switchClass('is-tall is-wider', 'is-really-tall', 0);
  } else {
    _elements.$photoExpo.switchClass('is-really-tall is-wider', 'is-tall', 0);
  }
}

function _configureExpoScrollingBehaviour() {
  var onScroll = _.throttle(function() {
    if (_elements.$body.hasClass('is-exposing-photo')) {
      _elements.$backgroundBlocker.addClass('has-scrolled-while-exposing');
    }
  }, 300, this);

  $(window).scroll(onScroll);
}

module.exports = photosContainer;
