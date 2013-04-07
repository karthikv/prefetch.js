(function(window, document, undefined) {
  // TODO: check if filesystem API is supported
  var linkScraper = require('./link-scraper.js');
  var linkPrefetcher = require('./link-prefetcher.js');
  var resourceScraper = require('./resource-scraper.js');
  var resourcePrefetcher = require('./resource-prefetcher.js');
  var utils = require('./utils.js');

  // mapping from link to response body 
  var linkToResponseBody = {};
  var links = linkScraper.findPrefetchableLinks();

  // absolute link to original link mapping
  var absoluteToOriginalLink = {};
  var absoluteLinks = links.map(function(link) {
    absoluteToOriginalLink[link.absolute] = link.original;
    return link.absolute;
  });

  // prefetch all links on the page
  linkPrefetcher.prefetch(absoluteLinks, function(link, body) {
    // prefetch all resources corresponding to those links
    var resources = resourceScraper.findPrefetchableResources(body);
    var originalLink = absoluteToOriginalLink[link];

    resourcePrefetcher.prefetch(resources, function(fsURL) {
      // rewrite URLs dynamically
      // TODO: rewrite absolute link in rewrite()
      body = resourcePrefetcher.rewrite(body, originalLink, fsURL);
      linkToResponseBody[originalLink] = body;
    });
  });

  window.addEventListener('click', function(event) {
    var target = event.target;
    if (target.nodeName == 'A') {
      // has link been prefetched?
      if (utils.isPrefetchable(target.href) &&
          target.href in linkToResponseBody) {
        // prefetchable link was clicked
        var body = linkToResponseBody[url];
        // TODO: handle response
        console.log('link clicked', target.href, 'got data', body);
      }
    }
  });
})(this, this.document);
