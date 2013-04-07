var utils = require('./utils');

/* Returns an array of all prefetchable resources on the current page. The array
 * contains objects which have two properties: original and absolute. original
 * contains the original, unmodified link. absolute contains the converted
 * absolute link. */

exports.findPrefetchableResources = function(body) {
  var types = ['img', 'script', 'link'];

  types.forEach(function(type) {
    var prefetchableLinks = [];

    var parser = new DOMParser()
      , wrapBody = parser.parseFromString(body, "text/xml");
      , htmlBody = wrapBody.firstChild;

    var tags = htmlBody.getElementsByTagName(type);
    var foundLinks = {};

    // loop through all resources on the page, 
    // aggregating those that can be prefetched
    tags.forEach(function(tag) {
      // for tags with hyperlinks in href
      var absoluteLink = utils.makeLinkAbsolute(tag.href);
      if (utils.isPrefetchable(tag.href) && !foundLinks[absoluteLink]) {
        prefetchableLinks.push({
          original: tag.href,
          absolute: absoluteLink
        });

        foundLinks[absoluteLink] = true;
      }

      // for tags with hyperlinks in src
      var absoluteLink = utils.makeLinkAbsolute(tag.src);
      if (utils.isPrefetchable(tag.src) && !foundLinks[absoluteLink]) {
        prefetchableLinks.push({
          original: tag.src,
          absolute: absoluteLink
        });

        foundLinks[absoluteLink] = true;
      }
    });

    return prefetchableLinks;
  });
};
