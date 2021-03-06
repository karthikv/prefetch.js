var utils = require('../helpers/utils'); 
var uri = require('../helpers/uri');
var resourceFs = require('../helpers/resource-fs.js');

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
  // tags corresponding to resources
  var resourceTags = ['img', 'script', 'link'];

  resourceTags.forEach(function(resourceTag) {
    var tags = utils.toArray(bodyDoc.getElementsByTagName(resourceTag));

    tags.forEach(function(tag) {
      // tag has an href or src attribute which corresponds to the resource
      var link = tag.getAttribute('href');
      if (link) {
        // make URL absolute to ensure consistent comparison
        link = uri.absolutizeURI(url, tag.getAttribute('href'));

        if (link == resourceURL) {
          tag.href = fsURL;
        }
      }
  
      link = tag.getAttribute('src');
      if (link) {
        // make URL absolute to ensure consistent comparison
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
