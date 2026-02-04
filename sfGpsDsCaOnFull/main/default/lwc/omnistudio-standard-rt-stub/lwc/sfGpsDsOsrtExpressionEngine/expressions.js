import dayjs from "c/sfGpsDsOsrtDayjs";

const EXPRESSIONS = {
  NULL: null,

  EQUALS: function (left, right) {
    if (
      Object.prototype.toString.call(left) === "[object Date]" &&
      Object.prototype.toString.call(right) === "[object Date]"
    ) {
      return EXPRESSIONS.EQUALS(left.getTime(), right.getTime());
    }
    // eslint-disable-next-line eqeqeq
    return left == right;
  },
  NOTEQUALS: function (left, right) {
    return !EXPRESSIONS.EQUALS(left, right);
  },
  COMPARE: function (operator, left, right) {
    /* jshint eqnull:true */
    if ((left == null && right) || (right == null && left)) {
      return false;
    }
    switch (operator) {
      case "<":
        return left < right;
      case "<=":
        return left <= right;
      case ">":
        return left > right;
      case ">=":
        return left >= right;
      default:
        return false;
    }
  },

  AND: function (left, right) {
    // eslint-disable-next-line eqeqeq
    if (arguments.length == 0) {
      return false;
    }
    for (let i = 0; i < arguments.length; i++) {
      if (!arguments[i]) {
        return false;
      }
    }
    return true;
  },

  OR: function (left, right) {
    // eslint-disable-next-line eqeqeq
    if (arguments.length == 0) {
      return false;
    }
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i]) {
        return true;
      }
    }
    return false;
  },

  /* TEXT FUNCTIONS */
  STRING: function (value) {
    /* jshint eqnull:true */
    if (value == null) {
      return "";
    }
    return "" + value;
  },
  NUMBER: function (value, handleDate) {
    /* jshint eqnull:true */
    if (isNaN(value) || value == null) {
      return 0;
    }
    if (Object.prototype.toString.call(value) === "[object Date]") {
      return handleDate ? value : null;
    }
    return parseFloat(value);
  },
  INTEGER: function (value) {
    /* jshint eqnull:true */
    if (isNaN(value) || value == null) {
      return 0;
    }
    return parseInt(value, 10);
  },
  CURRENCY: function (value) {
    return EXPRESSIONS.NUMBER(value);
  },
  BOOLEAN: function (value) {
    if (typeof value === "boolean") {
      return value;
    } else if (typeof value === "string") {
      return /^true$/i.test(value);
    } else if (typeof value === "number") {
      return value === 1;
    }
    return false;
  },
  RANDOM: function () {
    return EXPRESSIONS.NUMBER(Math.random());
  },
  DATE: function (value) {
    if (Object.prototype.toString.call(value) === "[object Date]") {
      return value;
    } else if (dayjs.isMoment(value)) {
      return value.toDate();
    } else if (arguments.length > 1) {
      const array = EXPRESSIONS.ARRAY(arguments);
      if (array[0] == null || array[1] == null || array[2] == null) {
        return null;
      }
      array[1] = array[1] - 1; // increase month by 1
      return new (Function.prototype.bind.apply(Date, [null].concat(array)))();
    } else if (typeof value === "string" || value instanceof String) {
      return new Date(value);
    }
    return NaN;
  },
  ARRAY: function (values) {
    if (values === undefined) {
      return [];
    } else if (values === null) {
      return [null];
    } else if (values._array) {
      return values._array;
    }
    // if args we need to see how many items - if one assume pass in
    if (Object.prototype.toString.call(values) === "[object Arguments]") {
      if (values.length === 1) {
        return EXPRESSIONS.ARRAY(values[0]);
      }
      return [].slice.call(values, 0);
    }
    if (Object.prototype.toString.call(values) !== "[object Array]") {
      return [values];
    }

    return values;
  },
  MOMENT: dayjs,
  CONCATENATE: function (array) {
    var array = arguments;
    if (arguments.length === 1) {
      array = EXPRESSIONS.ARRAY(arguments[0]);
    }
    return [].reduce.call(
      array,
      function (currentValue, next) {
        return (
          currentValue +
          EXPRESSIONS.STRING(next && next._array ? next._array : next)
        );
      },
      ""
    );
  },
  CASE: function (text, case_type) {
    text = EXPRESSIONS.STRING(text);
    switch (case_type) {
      case EXPRESSIONS.UPPER:
        return text.toUpperCase();
      case EXPRESSIONS.LOWER:
        return text.toLowerCase();
      case EXPRESSIONS.SENTENCE:
        return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
      case EXPRESSIONS.TITLE:
        return text.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      default:
        throw new Error("Invalid argument to CASE: " + case_type);
    }
  },
  SUBSTRING: function (text, startIndex, endIndex) {
    text = EXPRESSIONS.STRING(text);
    return text.substring(startIndex, endIndex);
  },
  SPLIT: function (text, splitToken, limit) {
    text = EXPRESSIONS.STRING(text);
    if (limit != null) {
      return text.split(splitToken, limit);
    }
    return text.split(splitToken);
  },
  UPPER: "UPPER",
  LOWER: "LOWER",
  SENTENCE: "SENTENCE",
  TITLE: "TITLE",
  upper: "UPPER",
  lower: "LOWER",
  sentence: "SENTENCE",
  title: "TITLE",

  /* AGGREGATE ARRAY FUNCTIONS */
  SUM: function (array) {
    return EXPRESSIONS.ARRAY(arguments).reduce(function (currentVal, next) {
      /* jshint eqnull:true */
      if (next == null) {
        next = 0;
      }
      return (
        EXPRESSIONS.NUMBER(currentVal, true) + EXPRESSIONS.NUMBER(next, true)
      );
    }, 0);
  },
  SUMIF: function (values, expression_or_value) {
    if (typeof expression_or_value !== "function") {
      const isEqualTo = expression_or_value;
      expression_or_value = function (element) {
        // eslint-disable-next-line eqeqeq
        return element == isEqualTo;
      };
    }
    return EXPRESSIONS.SUM(
      EXPRESSIONS.ARRAY(values).filter(expression_or_value)
    );
  },
  COUNT: function (values) {
    if (values == null) {
      return 0;
    }
    return EXPRESSIONS.ARRAY(arguments).length;
  },
  COUNTIF: function (values, expression_or_value) {
    if (typeof expression_or_value !== "function") {
      const isEqualTo = expression_or_value;
      expression_or_value = function (element) {
        // eslint-disable-next-line eqeqeq
        return element == isEqualTo;
      };
    }
    return EXPRESSIONS.COUNT(
      EXPRESSIONS.ARRAY(values).filter(expression_or_value)
    );
  },
  AVERAGE: function (array) {
    if (
      EXPRESSIONS.COUNT(arguments) === 0 ||
      (arguments.length === 1 && arguments[0] === null)
    ) {
      return 0;
    }
    return EXPRESSIONS.SUM(arguments) / EXPRESSIONS.COUNT(arguments);
  },
  MAX: function (array) {
    const arr = EXPRESSIONS.ARRAY(arguments);
    if (arr.length === 0 || (arguments.length === 1 && arguments[0] === null))
      return 0;
    let currentMax = EXPRESSIONS.NUMBER(arr[0], true);
    arr.forEach(function (val) {
      /* jshint eqnull:true */
      if (val == null) return;
      currentMax =
        currentMax < EXPRESSIONS.NUMBER(val, true)
          ? EXPRESSIONS.NUMBER(val, true)
          : currentMax;
    });
    return currentMax;
  },
  MIN: function (array) {
    const arr = EXPRESSIONS.ARRAY(arguments);
    if (arr.length === 0 || (arguments.length === 1 && arguments[0] === null))
      return 0;
    let currentMin = EXPRESSIONS.NUMBER(arr[0], true);
    arr.forEach(function (val) {
      /* jshint eqnull:true */
      if (val == null) return;
      currentMin =
        currentMin > EXPRESSIONS.NUMBER(val, true)
          ? EXPRESSIONS.NUMBER(val, true)
          : currentMin;
    });
    return currentMin;
  },
  EXISTS: function (values, expression_or_value) {
    if (typeof expression_or_value === "function") {
      return EXPRESSIONS.ARRAY(values).some(expression_or_value);
    }
    return EXPRESSIONS.ARRAY(values).includes(expression_or_value);
  },
  CONTAINS: function (input_string, value) {
    return EXPRESSIONS.STRING(input_string).indexOf(value) > -1;
  },

  /* MATH FUNCTIONS */
  ROUND: function (number, num_digits) {
    if (typeof num_digits === "undefined") return EXPRESSIONS.ROUND(number, 0);

    number = EXPRESSIONS.NUMBER(number);
    num_digits = EXPRESSIONS.NUMBER(num_digits);

    if (
      isNaN(number) ||
      !(typeof num_digits === "number" && num_digits % 1 === 0)
    )
      return NaN;

    // Shift
    number = number.toString().split("e");
    number = Math.round(
      +(number[0] + "e" + (number[1] ? +number[1] + num_digits : num_digits))
    );

    // Shift back
    number = number.toString().split("e");
    return +(
      number[0] +
      "e" +
      (number[1] ? +number[1] - num_digits : -num_digits)
    );
  },
  ABS: function (number) {
    /* jshint eqnull:true */
    if (number == null) {
      number = 0;
    }
    return Math.abs(EXPRESSIONS.NUMBER(number));
  },
  POW: function (base, exponent) {
    /* jshint eqnull:true */
    if (base == null) {
      base = 0;
    }
    /* jshint eqnull:true */
    if (exponent == null) {
      exponent = 0;
    }
    return Math.pow(EXPRESSIONS.NUMBER(base), EXPRESSIONS.NUMBER(exponent));
  },

  /* DATE FUNCTIONS */
  NOW: function () {
    // to not cause infinite digest in OmniScript we strip the milliseconds
    var now = new Date();
    now.setMilliseconds(0);
    return now;
  },
  TODAY: function () {
    var now = EXPRESSIONS.NOW();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
  },
  AGE: function (birth_date) {
    return EXPRESSIONS.AGEON(birth_date, EXPRESSIONS.NOW());
  },
  AGEON: function (birth_date, on_date) {
    birth_date = EXPRESSIONS.DATE(birth_date);
    on_date = EXPRESSIONS.DATE(on_date);
    if (isNaN(birth_date) || isNaN(on_date)) {
      return EXPRESSIONS.NULL;
    }
    if (birth_date >= on_date) {
      return 0;
    }
    let age = on_date.getFullYear() - birth_date.getFullYear();
    const m = on_date.getMonth() - birth_date.getMonth();
    if (m < 0 || (m === 0 && on_date.getDate() < birth_date.getDate())) {
      age--;
    }
    return age;
  },
  DATEDIFF: function (date1, date2) {
    /* jshint eqnull:true */
    if (date1 == null || date2 == null) {
      return null;
    }
    return EXPRESSIONS.ROUND(
      (EXPRESSIONS.DATE(date2) - EXPRESSIONS.DATE(date1)) /
        (1000 * 60 * 60 * 24)
    );
  },
  DAYOFMONTH: function (date) {
    /* jshint eqnull:true */
    if (date == null) {
      return null;
    }
    return EXPRESSIONS.DATE(date).getDate();
  },
  DAYOFWEEK: function (date) {
    /* jshint eqnull:true */
    if (date == null) {
      return null;
    }
    let dayOfWeek = EXPRESSIONS.DATE(date).getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    return dayOfWeek;
  },
  MONTH: function (date) {
    /* jshint eqnull:true */
    if (date == null) {
      return null;
    }
    return EXPRESSIONS.DATE(date).getMonth() + 1;
  },
  YEAR: function (date) {
    /* jshint eqnull:true */
    if (date == null) {
      return null;
    }
    return EXPRESSIONS.DATE(date).getFullYear();
  },
  HOUR: function (date) {
    /* jshint eqnull:true */
    if (date == null) {
      return null;
    }
    return EXPRESSIONS.DATE(date).getHours();
  },
  MINUTE: function (date) {
    /* jshint eqnull:true */
    if (date == null) {
      return null;
    }
    return EXPRESSIONS.DATE(date).getMinutes();
  },

  /* IF/THEN/ELSE */
  IF: function (expression, thenValue, elseValue) {
    if (expression) {
      return thenValue;
    }
    return elseValue;
  },

  REPLACE: function (inputString, textToReplace, replacementText) {
    return inputString?.replaceAll(textToReplace, replacementText);
  },
  SANITIZE: function (textToSanitize) {
    return EXPRESSIONS.REPLACE(textToSanitize, "%", "$Vlocity.percent");
  }
};

export default EXPRESSIONS;
