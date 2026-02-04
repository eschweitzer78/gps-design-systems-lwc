// ONLOAD INITIALIZATION
var localeDecimalSeperator = ".";
var sep;

try {
  // this works in FF, Chrome, IE, Safari and Opera
  sep = parseFloat(3 / 2)
    .toLocaleString()
    .substring(1, 2);
  if (sep === "." || sep === ",") {
    localeDecimalSeperator = sep;
  }
} catch (e) {
  //do nothing
}

// accepts masks strings as used by javascript-bumber-formatter and ViaMask as input and converts them for use by imask
export function iMaskParser(maskString, type) {
  if (type === "number" || type === Number) {
    return numberIMaskParser(maskString);
  }
  return maskString;
}

export function numberIMaskParser(mask) {
  var decimal,
    group,
    posLeadZero,
    posTrailZero,
    szSep,
    prefix,
    suffix,
    trailingZero;

  if (!mask) {
    return {
      mask: Number,
      radix: localeDecimalSeperator,
      signed: true
    }; // return as it is.
  }

  (function isolatePrefixSuffix() {
    var len, start, str, end, offset, indx;
    // find prefix/suffix
    len = mask.length;
    start = mask.search(/[0-9\-+#]/);
    prefix = start > 0 ? mask.substring(0, start) : "";
    // reverse string: not an ideal method if there are surrogate pairs
    str = mask.split("").reverse().join("");
    end = str.search(/[0-9\-+#]/);
    offset = len - end;
    indx = offset + (mask.substring(offset, offset + 1) === "." ? 1 : 0);
    suffix = end > 0 ? mask.substring(indx, len) : "";

    // mask with prefix & suffix removed
    mask = mask.substring(start, indx);
  })();

  (function findSeparators() {
    // search for separator for grp & decimal, anything not digit, not +/- sign, not #.
    var result = mask.match(/[^\d\-+#]/g);
    decimal = (result && result[result.length - 1]) || localeDecimalSeperator; // treat the right most symbol as decimal
    if (result && result.length === 1 && result[0] !== localeDecimalSeperator) {
      decimal = localeDecimalSeperator;
    }
    group = (result && result[1] && result[0]) || ""; // treat the left most symbol as group separator
  })();

  // split the decimal for the format string if any.
  mask = mask.split(decimal);

  // fill back any trailing zero according to format
  posTrailZero = mask[1] && mask[1].length; // look for last zero in format
  if (mask[1][posTrailZero - 1] === "0") {
    trailingZero = true;
  }

  szSep = mask[0].split(group); // look for separator
  mask[0] = szSep.join(""); // join back without separator for counting the pos of any leading 0.

  posLeadZero = mask[0] && mask[0].indexOf("0") === 0;

  let numMask = {
    mask: Number, // enable number mask

    // other options are optional with defaults below
    scale: posTrailZero, // digits after point, 0 for integers
    thousandsSeparator: group, // any single char
    padFractionalZeros: !!trailingZero, // if true, then pads zeros at end to the length of scale
    normalizeZeros: !posLeadZero && !trailingZero, // appends or removes zeros at ends
    signed: true,
    radix: decimal, // fractional delimiter
    mapToRadix: Array.from(new Set([decimal, localeDecimalSeperator])) // symbols to process as radix
  };

  if (prefix || suffix) {
    return {
      mask: (prefix || "") + "Number" + (suffix || ""),
      blocks: {
        Number: numMask
      },
      lazy: false
    };
  }
  return numMask;
}
