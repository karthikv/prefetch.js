/* Store the resource given by the provided URL in the JavaScript
 * filesystem. Call the given callback with the resultant
 * filesystem:// URL of the resource as the first argument.
 *
 * Arguments:
 * filer -- the file system instance
 * url -- the relative URL of the resource
 * callback -- the callback to call with the resource's filesystem:// URL
 *  once finished
 */
exports.storeResource = function(filer, url, callback) {
  // TODO: optimization: check if file already exists in filesystem
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.addEventListener('load', function(event) {
    if (this.status == 200) {
      var fileName = url.replace(/\//g, '%');
      console.log('file name is', fileName);

      // successfully loaded; blob in this.response
      filer.write(fileName, { data: this.response },
        function(fileEntry, fileWriter) {
          console.log('in callback, yo.');
          // find the URL corresponding the certain url 
          // and replace it with the fileEntry.
          var fileSource = fileEntry.toURL();
          callback(fileSource); 
        }, function(err) { console.log('fail ', err); });
    }
  });

  xhr.send();
};
