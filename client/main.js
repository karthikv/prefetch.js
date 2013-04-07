(function(window, document, undefined) {
  // TODO: check if filesystem API is supported
  var linkScraper = require('./link-scraper.js');
  var linkPrefetcher = require('./link-prefetcher.js');
  var resourceScraper = require('./resource-scraper.js');
  var resourcePrefetcher = require('./resource-prefetcher.js');
  var utils = require('./utils.js');

  // set up filesystem
  var filer = new Filer();
  filer.init({ persistent: true, size: 24 * 1024 * 1024 }); // TODO: need callback for this and is 24MB enough?

  // mapping from link to response body 
  var linkToResponseBody = {};
  var links = linkScraper.findPrefetchableLinks();

  console.log('got links', links);

  // prefetch all links on the page
  linkPrefetcher.prefetch(links, function(link, body) {
    var bodyDoc = utils.parseHTMLFromString(body);

    // prefetch all resources corresponding to those links
    var resources = resourceScraper.findPrefetchableResources(link, bodyDoc);
    linkToResponseBody[link] = bodyDoc;
    console.log('resources are', resources);

    resourcePrefetcher.prefetch(filer, resources, function(url, fsURL) {
      console.log('prefetch callback', url, fsURL);
      // TODO: rewrite absolute link in rewrite()
      // rewrite URLs dynamically
      resourcePrefetcher.rewrite(link, bodyDoc, url, fsURL);
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
        
        // History API - potential issue with cross domains (not possible due to security issues)
        // TODO: is there anything wrong with just putting origin?
        if (document.location.origin === target.origin && 
            document.location.port === target.port &&
            document.location.protocol === target.protocol) {
          window.history.pushState({}, "", utils.toRelativeLink(target.href));
        }

        event.preventDefault();
      }
    }
  });
})(window, document);
