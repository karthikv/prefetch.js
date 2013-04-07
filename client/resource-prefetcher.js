var utils = require('./utils'); 
var filer = require('./filer.min.js').filer;
var resourceFs = require('./resource-fs.js');

/* Rewrite the url in the given body with the link to the filesystem cache
 * Passes in the body, url, and response body as
 * arguments, in that order.
 *
 * Arguments:
 * body - the html area to rewrite 
 * url - the actual URL
 * fsurl - the cached filesystem URL  
 */
exports.rewrite = function(bodyDoc, url, fsurl) {
  // Are these all the resource tags?
  var types = ['img', 'script', 'link'];

  types.forEach(function(type) {
    var elements = utils.toArray(bodyDoc.getElementsByTagName(type));
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

/* Prefetch all resources in the given array. Calls the provided callback for
 * each link successfully prefetched. Passes in the link and response body as
 * arguments, in that order.
 *
 * Arguments:
 *  filer -- the file system instance
 *  resources -- An array of resources to prefetch. All resources
 *  should be absolute and on the same origin as the current location.
 */
exports.prefetch = function(filer, resources, callback) {
  resources.forEach(function(resource) {
    resourceFs.storeResource(filer, resource, function(fsURL) {
      callback(resource, fsURL);
    });
  });
};
