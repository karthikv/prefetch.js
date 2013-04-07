var utils = require('./utils');

exports.findPrefetchableLinks = function() {
  var anchors = document.getElementsByTagName('a');
  var prefetchableLinks = [];

  // loop through all links on the page, aggregating those that can be prefetched
  anchors.forEach(function(anchor) {
    if (isPrefetchable(anchor.href)) {
      prefetchableLinks.push(utils.makeLinkAbsolute(anchor.href));
    }
  });

  return prefetchableLinks;
};
