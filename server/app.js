var io = require('socket.io').listen(1875);
var request = require('request');

// regular expression used to match an HTTP(S) URL
var URL_REGEX = /^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/;

io.sockets.on('connection', function(socket) {
  /* Client emits a request event when it wants to request the given URL. This
   * functions retrieves the response via a simple GET request.
   *
   * Arguments:
   * url -- the URL to return the GET response for
   */
  socket.on('url', function(url) {
    // ensure URL is in the appropriate form
    if (!URL_REGEX.test(url)) {
      return;
    }

    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // valid response; emit it back to client
        socket.emit('response', { url: url, body: body });
      }
    });
  });
});
