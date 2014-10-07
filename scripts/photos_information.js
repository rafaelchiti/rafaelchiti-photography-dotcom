var basePath = 'public/photos/';
var _ = require('underscore');

var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis facilisis est, vitae varius arcu. Vivamus sodales vestibulum metus nec hendrerit. Integer tellus sem, suscipit eget ultrices id, fringilla quis nibh. Aliquam ac adipiscing enim.'

function photo(set, folder, index) {
  return {
    location: basePath + folder + '/' + (index + 1) + '.jpg',
    set: set
  };
}

function addPhotos(count, set, folder) {
  _(count).times(function(index) {
    photos.push(photo(set, folder, index));
  }, this);
}

var photos = [];


// Fine Art
addPhotos(9, 'set1', 'fine_art');


module.exports = photos;