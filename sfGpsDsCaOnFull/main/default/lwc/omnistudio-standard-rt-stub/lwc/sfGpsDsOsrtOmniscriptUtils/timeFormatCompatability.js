var time1224Ptrn = /(h)([^Aa]*?$)|'(.*)'/g;

var time1224Fn = function (match) {
  if (/(h)([^Aa]*?$)/.test(match)) return match.replace(/h/g, "H");
  if (/^'(.*)'$/.test(match)) return match.replace(/^'(.*)'$/, "[$1]");
  return match;
};

/**
 * Time Format Compatability - formats old angular pattern date formats to work with moment/dayjs
 * @param {string} method - Apex method that is to be invoked (needs to have @AuraEnabled)
 * @param {boolean} param - Parameters to be passed into the invoked apex class
 */
export function timeFormatCompatability(format) {
  return format.replace(time1224Ptrn, time1224Fn);
}
