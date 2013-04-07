// initialize filesystem
var filer = new Filer();
filer.init(); 

/* Store the resource given by the provided URL in the JavaScript
 * filesystem. Call the given callback with the resultant
 * filesystem:// URL of the resource as the first argument.
 *
 * Arguments:
 * url -- the relative URL of the resource
 * callback -- the callback to call with the resource's filesystem:// URL
 *  once finished
 */
exports.storeResource = function(url, callback) {
  // TODO: optimization: check if file already exists in filesystem
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.addEventListener('load', function(event) {
    if (this.status == 200) {
      // successfully loaded; blob in this.response
      filer.write('/tmp/' + url, { data: this.response },
        function(fileEntry, fileWriter) {
          // find the URL corresponding the certain url 
          // and replace it with the fileEntry.
          var fileSource = fileEntry.toURL();
          callback(fileSource); 
      });
    }
  });

  xhr.send();
};
