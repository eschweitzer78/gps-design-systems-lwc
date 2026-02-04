var dateFormatPtrn = /y(?!ear)|d(?!ate)|m|'.*'/g;
var dateTimeFormatPtrn = /y(?!ear)|d(?!ate)|'(.*)'/g;

var dateFormatFn = function (match) {
  if (/^[mdy]$/.test(match)) return match.toUpperCase();
  if (/^'(.*)'$/.test(match)) return match.replace(/^'(.*)'$/, "[$1]");
  return match;
};

/**
 * Date Format Compatability - formats old angular pattern date formats to work with moment/dayjs
 * @param {string} format - format string to be adapted
 * @param {boolean} isDateTime - override for strings that are datetimeformats (moslty used for formula at the moment)
 */
export function dateFormatCompatability(format, isDateTime) {
  var formatPtrn = !isDateTime ? dateFormatPtrn : dateTimeFormatPtrn;
  return format.replace(formatPtrn, dateFormatFn);
}
