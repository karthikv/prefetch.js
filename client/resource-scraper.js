var utils = require('./utils');

exports.findPrefetchableResources = function() {
  var types = ['img', 'script', 'link'];

  types.forEach(function(type) {
    var prefetchableLinks = [];
    var tags = document.getElementsByTagName(type);

    // loop through all resources on the page, 
    // aggregating those that can be prefetched
    tags.forEach(function(tag) {
      // for tags with hyperlinks in href
      if (utils.isPrefetchable(tag.href)) {
        prefetchableLinks.push(tag.href);
      }

      // for tags with hyperlinks in src
      if (utils.isPrefetchable(tag.src)) {
        prefetchableLinks.push(tag.src);
      }
    });

    return prefetchableLinks;
  });
};
