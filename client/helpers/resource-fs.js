// 1000 ms/s * 60 s/min * 30 min
var NUM_MILLIS_IN_HALF_HOUR = 1000 * 60 * 30;

/* Convert the given URL to a valid file name. */
exports.urlToFileName = function(url) {
  // replace invalid / character with %; note that % is not valid in a URL, so
  // this won't cause collisions
  return url.replace(/\//g, '%');
};

/* Checks if the given file is already stored. Calls the provided callback with
 * one argument, which will be true if it is stored and false otherwise.
 *
 * Arguments:
 * filer -- the file system instance
 * fileName -- the file to check
 * callback -- the callback to call with the boolean result
 */
exports.isStored = function(filer, fileName, callback) {
  filer.open(fileName, function(fileEntry) {
    fileEntry.file(function(file) {
      var now = new Date();
      var diff = Math.abs(now.getTime() - file.lastModifiedDate.getTime());

      if (diff > NUM_MILLIS_IN_HALF_HOUR) {
        // cache expired
        callback(false);
      } else {
        // file found and cache not expired; success!
        callback(true, fileEntry);
      }
    }, function(error) {
      // file object could not be found
      callback(false);
    });
  }, function(error) {
    // no file could be opened
    callback(false);
  });
};

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
  var fileName = exports.urlToFileName(url);
  
  exports.isStored(filer, fileName, function(stored, fileEntry) {
    if (stored) {
      // file system already has this resource
      callback(fileEntry.toURL());
    } else {
      // file system doesn't have resource; retrieve it
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
    
      xhr.addEventListener('load', function(event) {
        if (this.status == 200) {
          // successfully loaded; blob in this.response
          filer.write(fileName, { data: this.response },
            function(fileEntry, fileWriter) {
              callback(fileEntry.toURL()); 
            }, function(err) {
              console.log('Filesystem error', err);
            });
        }
      });
    
      xhr.send();
    }
  });
};
