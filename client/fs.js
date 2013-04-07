// initialize Filer 
var filer = new Filer();
filer.init(); 

function storeFileSystem(url, body, callback) {
  var bb = new BlobBuilder();
  bb.append(body);

  filer.write("/tmp/" + url, 
      { data: bb.getBlob() },
      function(fileEntry, fileWriter) {
        // find the URL corresponding the certain url 
        // and replace it with the fileEntry.
        var fileSource = fileEntry.toURL();
        callback(fileSource); 
  });
}

fs.exports = storeFileSystem;
