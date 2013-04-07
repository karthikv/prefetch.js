// regex to check whether a link is absolute
var ABSOLUTE_LINK_REGEX = /^(http|https):\/\//;
var RELATIVE_LINK_REGEX = /^(?:\/\/|[^\/]+)*\//;

var url = location.href;
var origin = location.origin;
var relativeURL = url.replace(origin, '');

/* Removes superfluous whitespace at the beginning and end of the given string.
 * Returns a new, trimmed string.
 *
 * Arguments:
 * str -- the string to remove whitespace from
 */
exports.trimString = function(str) {
  // replace whitespace at beginning and end of string
  return str.replace(/(^\s+|\s+$)/g, '');
};

/* Returns true if the given link is absolute or false otherwise.
 * 
 * Arguments:
 * link -- the link to test for absoluteness
 */
exports.isAbsoluteLink = function(link) {
  return ABSOLUTE_LINK_REGEX.test(link);
};

/* Returns the relative form of the provided absolute link
 * 
 * Arguments:
 * absLink - the input absolute link 
 */
exports.toRelativeLink = function(absLink) {
  return absLink.replace(RELATIVE_LINK_REGEX, "");
};

/* Make the given link absolute if it is relative. If it is already absolute,
 * this function does nothing. Return the new, absolute link.
 *
 * Arguments:
 * link -- the link to make absolute
 */
exports.makeLinkAbsolute = function(link) {
  if (exports.isAbsoluteLink(link)) {
    return link;
  }

  if (link[0] === '/') {
    // relative link from root; prepend origin
    link = origin + link;
  } else {
    // relative link from current location
    link = url.substring(0, url.lastIndexOf('/') + 1) + link;
  }

  return link;
};

/* Returns true if the given link has the appropriate format 
 * for prefetching.
 *
 * Arguments:
 * link -- the link to make absolute
 */
exports.isPrefetchable = function(link) {
  link = exports.trimString(link);

  if (!link || link[0] == '#') {
    // not a valid link to prefetch
    return false;
  }
  
  if (exports.isAbsoluteLink(link) && link.indexOf(origin) !== 0) {
    // absolute link that is not on this origin
    return false;
  }

  if (link == relativeURL || link == url) {
    // link goes to this same page
    return false;
  }

  return true;
};

/* Converts the array like parameter to an array.
 *
 * Arguments:
 * arrayLike - some object that is like an array
 */
exports.toArray = function(arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
};

/* Returns a document-like element, parsed from the given HTML string.
 *
 * Arguments:
 * str -- HTML string
 */
exports.parseHTMLFromString = function(str) {
  // create a blank HTML document
  var doc = document.implementation.createHTMLDocument("");
  exports.setDocumentHTML(doc, str);
  return doc; 
};

/* Sets the given doument's innerHTML to the provided string. Removes
 * superfluous HTML tags if entire document needs to be replaced.
 *
 * Arguments:
 * doc -- document to set HTML of
 * str -- string to set innerHTML to
 */
exports.setDocumentHTML = function(doc, str) {
  var docElement = doc.documentElement;
  docElement.innerHTML = str;
  var firstElement = docElement.firstElementChild;

  // replace nested HTML tag if necessary
  if (docElement.childElementCount === 1 &&
      firstElement.localName.toLowerCase() === "html") {  
    doc.replaceChild(firstElement, docElement);  
  }
};
