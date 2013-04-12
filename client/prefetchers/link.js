var socket = new SockJS('http://localhost:1875');

/* Prefetch all links in the given array. Calls the provided callback for each
 * link successfully prefetched. Passes in the link and response body as
 * arguments, in that order.
 *
 * Arguments:
 * links -- An array of links to prefetch. All links should be absolute and on
 *  the same origin as the current location.
 */
exports.prefetch = function(links, callback) {
  socket.addEventListener('message', function(event) {
    var response = JSON.parse(event.data);
    if (!response || !response.url || !response.body)
      return;

    // server transmitted response body for a URL; notify
    callback(response.url, response.body);
  });

  links.forEach(function(link) {
    socket.addEventListener('open', function() {
      // send each link the server needs to request
      socket.send(link);
    });
  });
};
