//locale - language locale, For eg: en-IN, ja-JP
//options - Please check https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat for available options
function formatNumber(number, locale, options) {
  return new Intl.NumberFormat(locale, options).format(number);
}

export default formatNumber;
