// strUtils.js

/**
 * Truncates a string at the nearest word boundary within a specified limit.
 * Appends " ..." if the string exceeds the limit.
 *
 * @param {string} str - The string to truncate.
 * @param {number} limit - The maximum number of characters allowed.
 * @returns {string} - The truncated string with ellipsis if necessary.
 */
export function truncateStringAtWordBoundary(str, limit) {
  if (typeof str !== "string") {
    console.error("Input is not a string:", str);
    return str;
  }

  if (str.length <= limit) return str; // Return the string as-is if it's within the limit

  // Slice the string up to the limit and find the last space within that range
  const truncated = str.slice(0, limit);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  // If a space exists within the truncated part, cut off at the last space
  const result =
    lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated;

  return result + " ..."; // Append ellipsis to indicate truncation
}
