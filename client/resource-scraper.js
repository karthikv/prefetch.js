function findPrefetchableResources() {
  var types = ['img', 'script', 'link'];
  types.forEach(function(type) {
    var prefetchableLinks = [];

    var tags = document.getElementsByTagName(type);

    // loop through all resources on the page, 
    // aggregating those that can be prefetched
    tags.forEach(function(tag) {
      if (isPrefetchable(tag.href)) {
        prefetchableLinks.push(tag.href);
      }
    });

    return prefetchableLinks;
  });
}

exports.findPrefetchableResources = findPrefetchableResources;
