var http = require('http');
var sockets = require('sockjs').createServer();
var request = require('request');

// regular expression used to match an HTTP(S) URL
var URL_REGEX = /(http|ftp|https):\/\/[\w\-_]+(\.?[\w\-_]+)+([\w\-\.,@?\^=%&amp;:\/~\+#]*[\w\-\@?\^=%&amp;\/~\+#])?/;

sockets.on('connection', function(connection) {
  /* Makes GET requests for URLs the client sends. Retrieves responses and
   * sends them back to the client. Each response is an object (in JSON form)
   * with two properties: url, the original URL sent, and data, the resultant
   * response data.
   *
   * Arguments:
   * url -- the URL to send back the GET response for
   */ 
  connection.on('data', function(url) {
    // ensure URL is in the appropriate form
    if (!URL_REGEX.test(url)) {
      return;
    }

    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // valid response; send it back to client
        connection.write(JSON.stringify({ url: url, body: body }));
      }
    });
  });
});

var server = http.createServer();
sockets.installHandlers(server);
server.listen(1875);
