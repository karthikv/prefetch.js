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
