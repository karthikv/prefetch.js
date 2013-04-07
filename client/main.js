(function(window, document, undefined) {
  // TODO: check if filesystem API is supported
  var linkScraper = require('./link-scraper.js');
  var linkPrefetcher = require('./link-prefetcher.js');
  var resourceScraper = require('./resource-scraper.js');
  var resourcePrefetcher = require('./resource-prefetcher.js');
  var resourceReplacer = require('./resource-replacer.js');
  var utils = require('./utils.js');

  // mapping from link to response body 
  var linkToResponseBody = {};

  // prefetch all links on the page
  var links = linkScraper.findPrefetchableLinks();
  linkPrefetcher.prefetch(links, function(url, body) {
    // prefetch all resources corresponding to those links
    var resources = resourceScraper.findPrefetchableResources(body);

    resourcePrefetcher.prefetch(resources, function(fsURL) {
      // rewrite URLs dynamically
      body = resourcePrefetcher.rewrite(body, url, fsURL);
      linkToResponseBody[url] = body;
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
