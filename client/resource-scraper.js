var utils = require('./utils');

exports.findPrefetchableResources = function() {
  var types = ['img', 'script', 'link'];

  types.forEach(function(type) {
    var prefetchableLinks = [];
    var tags = document.getElementsByTagName(type);
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
