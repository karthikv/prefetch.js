var utils = require('./utils'); 
var scraper = require('./resource-scraper');

var filer = new Filer();
filer.init();

exports.prefetchResources = function(localLink) {
  var resources = scraper.findPrefetchableResources();
};
