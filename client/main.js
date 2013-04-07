(function(window, document, undefined) {
  // TODO: check if filesystem API is supported
  var linkScraper = require('./link-scraper.js');
  var linkPrefetcher = require('./link-prefetcher.js');
  var resourceScraper = require('./resource-scraper.js');
  var resourcePrefetcher = require('./resource-prefetcher.js');
  var resourceReplacer = require('./resource-replacer.js');

  // prefetch all links on the page
  var links = linkScraper.findPrefetchableLinks();
  linkPrefetcher.prefetch(links, function(url, body) {
    // prefetch all resources corresponding to those links
    var resources = resourceScraper.findPrefetchableResources(body);

    resourcePrefetcher.prefetch(resources, function(fsURL) {
      // rewrite URLs dynamically
      body = resourcePrefetcher.rewrite(body, url, fsURL);
    });
  });
})(this, this.document);
