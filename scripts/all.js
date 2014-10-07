var _ = require('underscore');
var photosContainer = require('./photos_container');
var toolbar = require('./toolbar');


$(document).ready(function() {
  photosContainer.initialize();
  toolbar.configure(photosContainer.showSet);
});


// Scrolling behaviour

var onScroll = _.throttle(function() {
  if ($(document).scrollTop() > 50) {
    $('body').addClass('is-page-scrolled');
  } else {
    $('body').removeClass('is-page-scrolled');
  }
}, 300, this);

$(window).scroll(onScroll);
