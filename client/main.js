(function(window, document, undefined) {
  // TODO: check if filesystem API is supported
  var linkScraper = require('./link-scraper.js');
  var linkPrefetcher = require('./link-prefetcher.js');
  var resourceScraper = require('./resource-scraper.js');
  var resourcePrefetcher = require('./resource-prefetcher.js');
  var utils = require('./utils.js');

  // set up filesystem
  var filer = new Filer();
  filer.init(); // TODO: need callback for this?

  // mapping from link to response body 
  var linkToResponseBody = {};
  var links = linkScraper.findPrefetchableLinks();

  console.log('got links', links);

  // prefetch all links on the page
  linkPrefetcher.prefetch(links, function(link, body) {
    var bodyDoc = utils.parseHTMLFromString(body);
    // prefetch all resources corresponding to those links
    var resources = resourceScraper.findPrefetchableResources(bodyDoc);
    linkToResponseBody[link] = bodyDoc;

    resourcePrefetcher.prefetch(filer, resources, function(url, fsURL) {
      // TODO: rewrite absolute link in rewrite()
      // rewrite URLs dynamically
      resourcePrefetcher.rewrite(bodyDoc, url, fsURL);
    });
  });

  window.addEventListener('click', function(event) {
    var target = event.target;
    if (target.nodeName == 'A') {
      // has link been prefetched?
      if (utils.isPrefetchable(target.href) &&
          target.href in linkToResponseBody) {
        // prefetchable link was clicked; load body directly!
        var docBody = linkToResponseBody[target.href];
        utils.setDocumentHTML(document, docBody.documentElement.innerHTML);
        event.preventDefault();
      }
    }
  });
})(window, document);
