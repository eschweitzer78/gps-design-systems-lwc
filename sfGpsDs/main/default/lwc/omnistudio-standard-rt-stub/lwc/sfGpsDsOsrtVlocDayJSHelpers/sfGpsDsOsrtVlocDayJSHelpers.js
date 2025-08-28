/**
 * Helpers for dayJS by vlocity. This is a singleton, since everything is context independent
 *
 * @author Zachary Sohn.
 * @since  INS107
 */

// Array of pretty unit names sorted by granularity in ascending order.
const units = [
  "year",
  "quarter",
  "month",
  "week",
  "date",
  "hour",
  "minute",
  "second",
  "millisecond"
];

// Acts as a map between unit key characters and granularities.
const formatGranularity = {
  Y: 0,
  M: 2,
  D: 4,
  d: 4,
  H: 5,
  h: 5,
  m: 6,
  s: 7,
  S: 8,
  Q: 1,
  k: 5,
  X: 7,
  x: 8,
  w: 3
};

// RegEx patttern to loosely identify contiguous unit blocks from dayjs formatting string.
const unitPattern = /(\w)\1*o?/g;

/**
 * Determines highest granularity for dayJS formatting string.
 * @access public
 * @param {string} format - dayJS formatting string to be processed
 * @returns {number} - granularity, corresponds with index on units, if fornat is not a string
 *                     the highest granularity value of 8 will be returned;
 */
function determineMaxGranularity(format) {
  if (typeof format !== "string") {
    return 8;
  }
  const unitBlocks = format.match(unitPattern);
  let max = 0;
  let tmp;
  for (let i = 0; i < unitBlocks.length; i++) {
    tmp = resolveUnitGranularity(unitBlocks[i]);
    if (!isNaN(tmp) && tmp > max) {
      max = tmp;
    }
  }
  return Number(max) || 0;
}

/**
 * Determines highest granularity for unit substring of dayJS formatting string.
 * @access public
 * @param {string} key - dayJS format substring to be processed
 * @returns {number} - granularity, corresponds with index on units
 */
function resolveUnitGranularity(key) {
  let out;
  if (formatGranularity.hasOwnProperty(key[0])) {
    out = formatGranularity[key[0]];
  }
  return Number(out) || 0;
}

/**
 * Determines highest granularity for unit substring of dayJS formatting string.
 * @access public
 * @param {int} granularity - granularity as an index as returned by determineMaxGranularity and resolveUnitGranularity
 * @returns {string} - pretty name of unit for granularity index provided
 */
function unitName(granularity) {
  return units[granularity];
}

export { unitName, determineMaxGranularity, resolveUnitGranularity };
