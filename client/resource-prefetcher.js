var utils = require('./utils'); 
var scraper = require('./resource-scraper');
var socket = io.connect('http://localhost:1875');

var filer = new Filer();
filer.init();

exports.rewrite = function(url, fsurl, body) {
  // Are these all the resource tags?
  var types = ['img', 'script', 'link'];

  types.forEach(function(type) {
    var elements = body.getElementsByTagName(type);
    elements.forEach(function(element) {
      if (element.src == url) {
        element.src = fsurl;
      }
  
      if (element.href == url) {
        element.href = fsurl;
      }
    }); 
  });
};

exports.prefetch = function(links, callback) {
  var resources = scraper.findPrefetchableResources();

  socket.on('response', function(response) {
    if (!response.url || !response.body)
      return;

    // server transmitted response body for a URL; notify
    callback(response.url, response.body);
  });

  links.forEach(function(link) {
    // emit a request event for every link on the page
    socket.emit('request', link);
  });
};
