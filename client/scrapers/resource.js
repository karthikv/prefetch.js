var utils = require('../helpers/utils');
var uri = require('../helpers/uri');

/* Returns an array of all prefetchable resources on the current page.
 *
 * Arguments:
 * url -- the URL of the page whose resources are being fetched
 * bodyDoc -- the document element of the response body
 */
exports.findPrefetchableResources = function(url, bodyDoc) {
  // tags corresponding to resources
  var resourceTags = ['img', 'script', 'link'];
  var prefetchableResources = [];

  // keep track of which resources have already been processed
  var foundResources = {};

  resourceTags.forEach(function(resourceTag) {
    var tags = utils.toArray(bodyDoc.getElementsByTagName(resourceTag));

    // process resources, aggregating those that are prefetchable
    tags.forEach(function(tag) {
      // for tags with hyperlinks in href attribute
      var link = tag.getAttribute('href');
      if (link) {
        // make URL absolute to ensure consistency
        link = uri.absolutizeURI(url, link);

        if (utils.isPrefetchable(link) && !foundLinks[link]) {
          prefetchableResources.push(link);
          foundResources[link] = true;
        }
      }

      // for tags with hyperlinks in src attribute
      link = tag.getAttribute('src');
      if (link) {
        // make URL absolute to ensure consistency
        link = uri.absolutizeURI(url, link);

        if (link && utils.isPrefetchable(link) && !foundLinks[link]) {
          prefetchableResources.push(link);
          foundResource[link] = true;
        }
      }
    });
  });

  return prefetchableResources;
};
