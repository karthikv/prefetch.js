var utils = require('./utils'); 
var scraper = require('./resource-scraper');
var socket = io.connect('http://localhost:1875');

var filer = new Filer();
filer.init();

/* Rewrite the url in the given body with the link to the filesystem cache
 * Passes in the body, url, and response body as
 * arguments, in that order.
 *
 * Arguments:
 *  body - the html area to rewrite 
 *  url - the actual URL
 *  fsurl - the cached filesystem URL  
 */

exports.rewrite = function(body, url, fsurl) {
  // Are these all the resource tags?
  var types = ['img', 'script', 'link'];

  var parser = new DOMParser()
    , wrapBody = parser.parseFromString(body, "text/xml");
    , htmlBody = wrapBody.firstChild;

  types.forEach(function(type) {
    var elements = htmlBody.getElementsByTagName(type);
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

/* Prefetch all resources in the given array. Calls the provided callback for each
 * link successfully prefetched. Passes in the link and response body as
 * arguments, in that order.
 *
 * Arguments:
 * links -- An array of links to prefetch. All links should be absolute and on
 *  the same origin as the current location.
 */

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
