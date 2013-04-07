var utils = require('./utils');

/* Returns an array of all prefetchable links on the current page. The array
 * contains objects which have two properties: original and absolute. original
 * contains the original, unmodified link. absolute contains the converted
 * absolute link. */
exports.findPrefetchableLinks = function() {
  var anchors = document.getElementsByTagName('a');
  var foundLinks = {};
  var prefetchableLinks = [];

  // TODO: really need to resolve all links completely (e.g. ../../../)
  // loop through all links on the page, aggregating those that can be prefetched
  anchors.forEach(function(anchor) {
    var absoluteLink = utils.makeLinkAbsolute(anchor.href);

    // don't prefetch links already found
    if (utils.isPrefetchable(anchor.href) && !foundLinks[absoluteLink]) {
      prefetchableLinks.push({
        original: anchor.href,
        absolute: absoluteLink
      });

      foundLinks[absoluteLink] = true;
    }
  });

  return prefetchableLinks;
};
