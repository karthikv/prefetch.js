var utils = require('./utils');
var origin = location.origin;
var url = location.href;
var relativeURL = url.replace(origin, '');

/* Returns whether the given link is prefetchable. Being prefetchable entails
 * that the link is on the same origin as the current location.
 *
 * Arguments:
 * link -- the link to prefetch
 */
function isPrefetchable(link) {
  link = utils.trimString(link);

  if (!link || link[0] == '#') {
    // not a valid link to prefetch
    return false;
  }
  
  if (utils.isAbsoluteLink(link) && link.indexOf(origin) !== 0) {
    // absolute link that is not on this origin
    return false;
  }

  if (link == relativeURL) {
    // link goes to this same page
    return false;
  }

  return true;
}

/* Returns all prefetchable links on the current page. Makes these links
 * absolute. */
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
