# Prefetch.js
Prefetch.js prefetches links on the page via a prefetch server and XHR
requests. When a prefetched link is clicked, prefetch.js dynamically replaces
the DOM of the current page with the correct contents. It then uses the History
API to change the URL without incurring a page load. The overall effect is
hidden latency; when the user is viewing a page, the links are being
prefetched, and the user experiences quick load times throughout his/her visit.

To take it a step further, prefetch.js fetches and caches
resources&mdash;images, scripts, and stylesheets&mdash;in the local JavaScipt
file system. It then proceeds to replace each link to a resource (e.g. the
`href` attribute of `link` tags, the `src` attribute of `img`/`script` tags)
with a local filesystem url corresponding to the cached content. This
circumvents network latency for resources and makes page load times even
speedier.

Prefetch.js is a simple JavaScript file that you can include in your websites
to enable prefetching. You'll also need to run a prefetch server, which
prefetch.js communicates with to offload HTTP requests. More instructions will
be provided as the library matures, but as of now, see the status section for
more details.

## Status
Prefetch.js is still being developed and is not quite ready for production use.
Nevertheless, if you'd like to see it in action, you'll need to take the
following steps:

1. Clone this repository.
2. Run the node.js server in the `server` directory via `node app.js`.
   Alternatively, if you prefer [nodemon](https://github.com/remy/nodemon) for
   auto-reloading, run `nodemon app.js`.
3. Navigate to the `test` directory and serve the files there on a local server
   on port 3000. This can be done with various command-line tools, such as
   [nodefront](https://github.com/karthikv/nodefront) (run `nodefront serve
   3000` in the `test` directory after installation) or
   [node-static](https://github.com/cloudhead/node-static) (run `static -p
   3000` in the `test` directory after installation).
   
   
   If you'd like to use a different port, you'll need to update the absolute
   links in the
   [stylesheet](https://github.com/karthikv/prefetch.js/blob/master/test/stylesheets/styles.css)
   directly. Normally, we'd use relative links, but prefetch.js requires
   absolute links in CSS for filesystem caching to work properly.
4. Open up `localhost:3000` and wait a few seconds. Then, click on the
   `Contact` or `Blog` links to see prefetching in action (note: only the
   `About`, `Contact`, and `Blog` links work).
   
   I used some pages from my own website here to illustrate prefetching. Upon
   opening the console, you'll notice the message 'Dynamically reloading...' on
   each prefetch. This message should persist even across pages due to the
   dynamic DOM replacement and History API.
