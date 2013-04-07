var utils = require('./utils');

/* Returns an array of all prefetchable links on the current page. */
exports.findPrefetchableLinks = function() {
  var anchors = utils.toArray(document.getElementsByTagName('a'));
  var foundLinks = {};
  var prefetchableLinks = [];

  // TODO: really need to resolve all links completely (e.g. ../../../)
  // loop through all links on the page, aggregating those that can be prefetched
  anchors.forEach(function(anchor) {
    var link = anchor.href;

    // don't prefetch links already found
    if (utils.isPrefetchable(link) && !foundLinks[link]) {
      prefetchableLinks.push(link);
      foundLinks[link] = true;
    }
  });

  return prefetchableLinks;
};
