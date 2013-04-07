// regex to check whether a link is absolute
var ABSOLUTE_LINK_REGEX = /^(http|https):\/\//;

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

/* Make the given link absolute if it is relative. If it is already absolute,
 * this function does nothing. Return the new, absolute link.
 *
 * Arguments:
 * link -- the link to make absolute
 */
exports.makeLinkAbsolute = function(link) {
  if (utils.isAbsoluteLink) {
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
