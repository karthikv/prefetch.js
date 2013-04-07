(function(window, document, undefined) {
  var requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;
  if (!requestFileSystem)
    // file system must be available for prefetcher
    return;

  var linkScraper = require('./link-scraper.js');
  var linkPrefetcher = require('./link-prefetcher.js');
  var resourceScraper = require('./resource-scraper.js');
  var resourcePrefetcher = require('./resource-prefetcher.js');
  var utils = require('./utils.js');

  // set up filesystem
  var filer = new Filer();
  filer.init({ size: 50 * 1024 * 1024 });

  // mapping from link to response body 
  var linkToResponseBody = {};
  var links = linkScraper.findPrefetchableLinks();

  // prefetch all links on the page
  linkPrefetcher.prefetch(links, function(link, body) {
    var bodyDoc = utils.parseHTMLFromString(body);

    // prefetch all resources corresponding to those links
    var resources = resourceScraper.findPrefetchableResources(link, bodyDoc);
    linkToResponseBody[link] = bodyDoc;

    resourcePrefetcher.prefetch(filer, resources, function(url, fsURL) {
      // rewrite URLs dynamically
      resourcePrefetcher.rewrite(link, bodyDoc, url, fsURL);
    });
  });

  window.addEventListener('click', function prefetchListener(event) {
    var target = event.target;
    if (target.nodeName == 'A') {
      // has link been prefetched?
      if (utils.isPrefetchable(target.href) &&
          target.href in linkToResponseBody) {
        // remove this event listener, as we're loading a new page
        window.removeEventListener('click', prefetchListener);
        console.log('Dynamically reloading...\n');

        // prefetchable link was clicked; load body directly!
        var docBody = linkToResponseBody[target.href];
        utils.setDocumentHTML(document, docBody.documentElement.innerHTML);

        // use history API to change relative URL
        window.history.pushState({}, "", target.pathname);
        event.preventDefault();
      }
    }
  });
})(window, document);
