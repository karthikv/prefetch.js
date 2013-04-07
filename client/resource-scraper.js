var utils = require('./utils');
var uri = require('./uri');

/* Returns an array of all prefetchable resources on the current page.
 *
 * Arguments:
 * url -- the URL of the page whose resources are being fetched
 * bodyDoc -- the document element of the response body
 */
exports.findPrefetchableResources = function(url, bodyDoc) {
  var types = ['img', 'script', 'link'];
  var prefetchableResources = [];
  var foundLinks = {};

  types.forEach(function(type) {
    var tags = utils.toArray(bodyDoc.getElementsByTagName(type));

    // loop through all resources on the page, 
    // aggregating those that can be prefetched
    tags.forEach(function(tag) {
      // for tags with hyperlinks in href
      var link = tag.getAttribute('href');
      if (link) {
        link = uri.absolutizeURI(url, link);
        if (utils.isPrefetchable(link) && !foundLinks[link]) {
          prefetchableResources.push(link);
          foundLinks[link] = true;
        }
      }

      // for tags with hyperlinks in src
      link = tag.getAttribute('src');
      if (link) {
        link = uri.absolutizeURI(url, link);
        if (link && utils.isPrefetchable(link) && !foundLinks[link]) {
          prefetchableResources.push(link);
          foundLinks[link] = true;
        }
      }
    });
  });

  return prefetchableResources;
};
