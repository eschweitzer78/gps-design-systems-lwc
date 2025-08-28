/*!
 * currency.js - v1.2.2
 * http://scurker.github.io/currency.js
 *
 * Copyright (c) 2019 Jason Wilson
 * Released under MIT license
 */

var defaults = {
  symbol: "$",
  separator: ",",
  decimal: ".",
  formatWithSymbol: false,
  errorOnInvalid: false,
  precision: 2,
  pattern: "!#",
  negativePattern: "-!#"
};

var round = function round(v) {
  return Math.round(v);
};

var pow = function pow(p) {
  return Math.pow(10, p);
};

var rounding = function rounding(value, increment) {
  return round(value / increment) * increment;
};

var groupRegex = /(\d)(?=(\d{3})+\b)/g;
var vedicRegex = /(\d)(?=(\d\d)+\d\b)/g;
/**
 * Create a new instance of currency.js
 * @param {number|string|currency} value
 * @param {object} [opts]
 */

function currency(value, opts) {
  var that = this;

  if (!(that instanceof currency)) {
    return new currency(value, opts);
  }

  var settings = Object.assign({}, defaults, opts),
    precision = pow(settings.precision),
    v = parse(value, settings);
  that.intValue = v;
  that.value = v / precision; // Set default incremental value

  settings.increment = settings.increment || 1 / precision; // Support vedic numbering systems
  // see: https://en.wikipedia.org/wiki/Indian_numbering_system

  if (settings.useVedic) {
    settings.groups = vedicRegex;
  } else {
    settings.groups = groupRegex;
  } // Intended for internal usage only - subject to change

  this.s = settings;
  this.p = precision;
}

function parse(value, opts) {
  var useRounding =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var v = 0,
    decimal = opts.decimal,
    errorOnInvalid = opts.errorOnInvalid,
    decimals = opts.precision,
    precision = pow(decimals),
    isNumber = typeof value === "number";

  if (isNumber || value instanceof currency) {
    v = (isNumber ? value : value.value) * precision;
  } else if (typeof value === "string") {
    var regex = new RegExp("[^-\\d" + decimal + "]", "g"),
      decimalString = new RegExp("\\" + decimal, "g");
    v =
      value
        .replace(/\((.*)\)/, "-$1") // allow negative e.g. (1.99)
        .replace(regex, "") // replace any non numeric values
        .replace(decimalString, ".") * // convert any decimal values
      precision; // scale number to integer value

    v = v || 0;
  } else {
    if (errorOnInvalid) {
      throw Error("Invalid Input");
    }

    v = 0;
  } // Handle additional decimal for proper rounding.

  v = v.toFixed(4);
  return useRounding ? round(v) : v;
}

currency.prototype = {
  /**
   * Adds values together.
   * @param {number} number
   * @returns {currency}
   */
  add: function add(number) {
    var intValue = this.intValue,
      _settings = this.s,
      _precision = this.p;
    return currency(
      (intValue += parse(number, _settings)) / _precision,
      _settings
    );
  },

  /**
   * Subtracts value.
   * @param {number} number
   * @returns {currency}
   */
  subtract: function subtract(number) {
    var intValue = this.intValue,
      _settings = this.s,
      _precision = this.p;
    return currency(
      (intValue -= parse(number, _settings)) / _precision,
      _settings
    );
  },

  /**
   * Multiplies values.
   * @param {number} number
   * @returns {currency}
   */
  multiply: function multiply(number) {
    var intValue = this.intValue,
      _settings = this.s;
    return currency((intValue *= number) / pow(_settings.precision), _settings);
  },

  /**
   * Divides value.
   * @param {number} number
   * @returns {currency}
   */
  divide: function divide(number) {
    var intValue = this.intValue,
      _settings = this.s;
    return currency((intValue /= parse(number, _settings, false)), _settings);
  },

  /**
   * Takes the currency amount and distributes the values evenly. Any extra pennies
   * left over from the distribution will be stacked onto the first set of entries.
   * @param {number} count
   * @returns {array}
   */
  distribute: function distribute(count) {
    var intValue = this.intValue,
      _precision = this.p,
      _settings = this.s,
      distribution = [],
      split = Math[intValue >= 0 ? "floor" : "ceil"](intValue / count),
      pennies = Math.abs(intValue - split * count);

    for (; count !== 0; count--) {
      var item = currency(split / _precision, _settings); // Add any left over pennies

      pennies-- > 0 &&
        (item =
          intValue >= 0
            ? item.add(1 / _precision)
            : item.subtract(1 / _precision));
      distribution.push(item);
    }

    return distribution;
  },

  /**
   * Returns the dollar value.
   * @returns {number}
   */
  dollars: function dollars() {
    return ~~this.value;
  },

  /**
   * Returns the cent value.
   * @returns {number}
   */
  cents: function cents() {
    var intValue = this.intValue,
      _precision = this.p;
    return ~~(intValue % _precision);
  },

  /**
   * Formats the value as a string according to the formatting settings.
   * @param {boolean} useSymbol - format with currency symbol
   * @returns {string}
   */
  format: function format(useSymbol) {
    var _this$_settings = this.s,
      pattern = _this$_settings.pattern,
      negativePattern = _this$_settings.negativePattern,
      formatWithSymbol = _this$_settings.formatWithSymbol,
      symbol = _this$_settings.symbol,
      separator = _this$_settings.separator,
      decimal = _this$_settings.decimal,
      groups = _this$_settings.groups,
      values = (this + "").replace(/^-/, "").split("."),
      dollars = values[0],
      cents = values[1]; // set symbol formatting

    typeof useSymbol === "undefined" && (useSymbol = formatWithSymbol);
    return (this.value >= 0 ? pattern : negativePattern)
      .replace("!", useSymbol ? symbol : "")
      .replace(
        "#",
        ""
          .concat(dollars.replace(groups, "$1" + separator))
          .concat(cents ? decimal + cents : "")
      );
  },

  /**
   * Formats the value as a string according to the formatting settings.
   * @returns {string}
   */
  toString: function toString() {
    var intValue = this.intValue,
      _precision = this.p,
      _settings = this.s;
    return rounding(intValue / _precision, _settings.increment).toFixed(
      _settings.precision
    );
  },

  /**
   * Value for JSON serialization.
   * @returns {float}
   */
  toJSON: function toJSON() {
    return this.value;
  }
};

export default currency;
