var utils = require('./utils');

/* Returns an array of all prefetchable resources on the current page. The array
 * contains objects which have two properties: original and absolute. original
 * contains the original, unmodified link. absolute contains the converted
 * absolute link. */

exports.findPrefetchableResources = function(bodyDoc) {
  var types = ['img', 'script', 'link'];
  var prefetchableResources = [];

  types.forEach(function(type) {
    var tags = utils.toArray(bodyDoc.getElementsByTagName(type));
    var foundLinks = {};

    // loop through all resources on the page, 
    // aggregating those that can be prefetched
    tags.forEach(function(tag) {
      // for tags with hyperlinks in href
      var link = tag.href;
      if (link && utils.isPrefetchable(link) && !foundLinks[link]) {
        prefetchableResources.push(link);
        foundLinks[link] = true;
      }

      // for tags with hyperlinks in src
      link = tag.src;
      if (link && utils.isPrefetchable(link) && !foundLinks[link]) {
        prefetchableResources.push(link);
        foundLinks[link] = true;
      }
    });
  });

  return prefetchableResources;
};
