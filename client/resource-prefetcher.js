var utils = require('./utils'); 
var uri = require('./uri');
var resourceFs = require('./resource-fs.js');

/* Rewrite the given resource url in the provided resource body document with
 * the link to the filesystem cache.
 *
 * Arguments:
 * url -- URL of the current page
 * bodyDoc -- the document of the response body
 * resourceUrl -- the actual resource URL
 * fsURL -- the link to the filesystem cache
 */
exports.rewrite = function(url, bodyDoc, resourceURL, fsURL) {
  // Are these all the resource tags?
  var types = ['img', 'script', 'link'];

  types.forEach(function(type) {
    var tags = utils.toArray(bodyDoc.getElementsByTagName(type));

    tags.forEach(function(tag) {
      var link = tag.getAttribute('href');
      if (link) {
        link = uri.absolutizeURI(url, tag.getAttribute('href'));
        if (link == resourceURL) {
          tag.href = fsURL;
        }
      }
  
      link = tag.getAttribute('src');
      if (link) {
        link = uri.absolutizeURI(url, tag.getAttribute('src'));
        if (link == resourceURL) {
          tag.src = fsURL;
        }
      }
    }); 
  });
};

/* Prefetch all resources in the given array. Calls the provided callback for
 * each link successfully prefetched. Passes in the link and response body as
 * arguments, in that order.
 *
 * Arguments:
 * filer -- the file system instance
 * resources -- An array of resources to prefetch. All resources
 * should be absolute and on the same origin as the current location.
 */
exports.prefetch = function(filer, resources, callback) {
  resources.forEach(function(resource) {
    resourceFs.storeResource(filer, resource, function(fsURL) {
      callback(resource, fsURL);
    });
  });
};
