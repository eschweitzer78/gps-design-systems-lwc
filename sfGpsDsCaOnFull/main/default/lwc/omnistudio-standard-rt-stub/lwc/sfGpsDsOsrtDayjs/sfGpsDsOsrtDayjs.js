var SECONDS_A_MINUTE = 60;
var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
var MILLISECONDS_A_SECOND = 1e3;
var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND; // English locales

var MS = "millisecond";
var S = "second";
var MIN = "minute";
var H = "hour";
var D = "day";
var W = "week";
var M = "month";
var Q = "quarter";
var Y = "year";
var DATE = "date";
var FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ";
var INVALID_DATE_STRING = "Invalid Date"; // regex

var REGEX_PARSE =
  /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
var REGEX_FORMAT =
  /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

// English [en]
// We don't need weekdaysShort, weekdaysMin, monthsShort in en.js locale
var en = {
  name: "en",
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
    "_"
  ),
  months:
    "January_February_March_April_May_June_July_August_September_October_November_December".split(
      "_"
    )
};

var padStart = function padStart(string, length, pad) {
  var s = String(string);
  if (!s || s.length >= length) return string;
  return "" + Array(length + 1 - s.length).join(pad) + string;
};

var padZoneStr = function padZoneStr(instance) {
  var negMinutes = -instance.utcOffset();
  var minutes = Math.abs(negMinutes);
  var hourOffset = Math.floor(minutes / 60);
  var minuteOffset = minutes % 60;
  return (
    "" +
    (negMinutes <= 0 ? "+" : "-") +
    padStart(hourOffset, 2, "0") +
    ":" +
    padStart(minuteOffset, 2, "0")
  );
};

var monthDiff = function monthDiff(a, b) {
  // function from moment.js in order to keep the same result
  if (a.date() < b.date()) return -monthDiff(b, a);
  var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
  var anchor = a.clone().add(wholeMonthDiff, M);
  var c = b - anchor < 0;
  var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M);
  return +(
    -(
      wholeMonthDiff +
      (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)
    ) || 0
  );
};

var absFloor = function absFloor(n) {
  return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
};

var prettyUnit = function prettyUnit(u) {
  var special = {
    M: M,
    y: Y,
    w: W,
    d: D,
    D: DATE,
    h: H,
    m: MIN,
    s: S,
    ms: MS,
    Q: Q
  };
  return (
    special[u] ||
    String(u || "")
      .toLowerCase()
      .replace(/s$/, "")
  );
};

var isUndefined = function isUndefined(s) {
  return s === undefined;
};

var U = {
  s: padStart,
  z: padZoneStr,
  m: monthDiff,
  a: absFloor,
  p: prettyUnit,
  u: isUndefined
};

var L = "en"; // global locale

var Ls = {}; // global loaded locale

Ls[L] = en;

var isDayjs = function isDayjs(d) {
  return d instanceof Dayjs;
}; // eslint-disable-line no-use-before-define

var parseLocale = function parseLocale(preset, object, isLocal) {
  var l;
  if (!preset) return L;

  if (typeof preset === "string") {
    if (Ls[preset]) {
      l = preset;
    }

    if (object) {
      Ls[preset] = object;
      l = preset;
    }
  } else {
    var name = preset.name;
    Ls[name] = preset;
    l = name;
  }

  if (!isLocal && l) L = l;
  return l || (!isLocal && L);
};

var dayjs = function dayjs(date, c) {
  if (isDayjs(date)) {
    return date.clone();
  } // eslint-disable-next-line no-nested-ternary

  var cfg = typeof c === "object" ? c : {};
  cfg.date = date;
  cfg.args = arguments; // eslint-disable-line prefer-rest-params

  return new Dayjs(cfg); // eslint-disable-line no-use-before-define
};

var wrapper = function wrapper(date, instance) {
  return dayjs(date, {
    locale: instance.$L,
    utc: instance.$u,
    x: instance.$x,
    $offset: instance.$offset // todo: refactor; do not use this.$offset in you code
  });
};

var Utils = U; // for plugin use

Utils.l = parseLocale;
Utils.i = isDayjs;
Utils.w = wrapper;

var parseDate = function parseDate(cfg) {
  var date = cfg.date,
    utc = cfg.utc;
  if (date === null) return new Date(NaN); // null is invalid

  if (Utils.u(date)) return new Date(); // today

  if (date instanceof Date) return new Date(date);

  if (typeof date === "string" && !/Z$/i.test(date)) {
    var d = date.match(REGEX_PARSE);

    if (d) {
      var m = d[2] - 1 || 0;
      var ms = (d[7] || "0").substring(0, 3);

      if (utc) {
        return new Date(
          Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms)
        );
      }

      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }

  return new Date(date); // everything else
};

var Dayjs = /*#__PURE__*/ (function () {
  function Dayjs(cfg) {
    this.$L = parseLocale(cfg.locale, null, true);
    this.parse(cfg); // for plugin
  }

  var _proto = Dayjs.prototype;

  _proto.parse = function parse(cfg) {
    this.$d = parseDate(cfg);
    this.$x = cfg.x || {};
    this.init();
  };

  _proto.init = function init() {
    var $d = this.$d;
    this.$y = $d.getFullYear();
    this.$M = $d.getMonth();
    this.$D = $d.getDate();
    this.$W = $d.getDay();
    this.$H = $d.getHours();
    this.$m = $d.getMinutes();
    this.$s = $d.getSeconds();
    this.$ms = $d.getMilliseconds();
  }; // eslint-disable-next-line class-methods-use-this

  _proto.$utils = function $utils() {
    return Utils;
  };

  _proto.isValid = function isValid() {
    return !(this.$d.toString() === INVALID_DATE_STRING);
  };

  _proto.isSame = function isSame(that, units) {
    var other = dayjs(that);
    return this.startOf(units) <= other && other <= this.endOf(units);
  };

  _proto.isAfter = function isAfter(that, units) {
    return dayjs(that) < this.startOf(units);
  };

  _proto.isBefore = function isBefore(that, units) {
    return this.endOf(units) < dayjs(that);
  };

  _proto.$g = function $g(input, get, set) {
    if (Utils.u(input)) return this[get];
    return this.set(set, input);
  };

  _proto.unix = function unix() {
    return Math.floor(this.valueOf() / 1000);
  };

  _proto.valueOf = function valueOf() {
    // timezone(hour) * 60 * 60 * 1000 => ms
    return this.$d.getTime();
  };

  _proto.startOf = function startOf(units, _startOf) {
    var _this = this;

    // startOf -> endOf
    var isStartOf = !Utils.u(_startOf) ? _startOf : true;
    var unit = Utils.p(units);

    var instanceFactory = function instanceFactory(d, m) {
      var ins = Utils.w(
        _this.$u ? Date.UTC(_this.$y, m, d) : new Date(_this.$y, m, d),
        _this
      );
      return isStartOf ? ins : ins.endOf(D);
    };

    var instanceFactorySet = function instanceFactorySet(method, slice) {
      var argumentStart = [0, 0, 0, 0];
      var argumentEnd = [23, 59, 59, 999];
      return Utils.w(
        _this.toDate()[method].apply(
          // eslint-disable-line prefer-spread
          _this.toDate("s"),
          (isStartOf ? argumentStart : argumentEnd).slice(slice)
        ),
        _this
      );
    };

    var $W = this.$W,
      $M = this.$M,
      $D = this.$D;
    var utcPad = "set" + (this.$u ? "UTC" : "");

    switch (unit) {
      case Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);

      case M:
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);

      case W: {
        var weekStart = this.$locale().weekStart || 0;
        var gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      }

      case D:
      case DATE:
        return instanceFactorySet(utcPad + "Hours", 0);

      case H:
        return instanceFactorySet(utcPad + "Minutes", 1);

      case MIN:
        return instanceFactorySet(utcPad + "Seconds", 2);

      case S:
        return instanceFactorySet(utcPad + "Milliseconds", 3);

      default:
        return this.clone();
    }
  };

  _proto.endOf = function endOf(arg) {
    return this.startOf(arg, false);
  };

  _proto.$set = function $set(units, _int) {
    var _C$D$C$DATE$C$M$C$Y$C;

    // private set
    var unit = Utils.p(units);
    var utcPad = "set" + (this.$u ? "UTC" : "");
    var name = ((_C$D$C$DATE$C$M$C$Y$C = {}),
    (_C$D$C$DATE$C$M$C$Y$C[D] = utcPad + "Date"),
    (_C$D$C$DATE$C$M$C$Y$C[DATE] = utcPad + "Date"),
    (_C$D$C$DATE$C$M$C$Y$C[M] = utcPad + "Month"),
    (_C$D$C$DATE$C$M$C$Y$C[Y] = utcPad + "FullYear"),
    (_C$D$C$DATE$C$M$C$Y$C[H] = utcPad + "Hours"),
    (_C$D$C$DATE$C$M$C$Y$C[MIN] = utcPad + "Minutes"),
    (_C$D$C$DATE$C$M$C$Y$C[S] = utcPad + "Seconds"),
    (_C$D$C$DATE$C$M$C$Y$C[MS] = utcPad + "Milliseconds"),
    _C$D$C$DATE$C$M$C$Y$C)[unit];
    var arg = unit === D ? this.$D + (_int - this.$W) : _int;

    if (unit === M || unit === Y) {
      // clone is for badMutable plugin
      var date = this.clone().set(DATE, 1);
      date.$d[name](arg);
      date.init();
      this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
    } else if (name) this.$d[name](arg);

    this.init();
    return this;
  };

  _proto.set = function set(string, _int2) {
    return this.clone().$set(string, _int2);
  };

  _proto.get = function get(unit) {
    return this[Utils.p(unit)]();
  };

  _proto.add = function add(number, units) {
    var _this2 = this,
      _C$MIN$C$H$C$S$unit;

    number = Number(number); // eslint-disable-line no-param-reassign

    var unit = Utils.p(units);

    var instanceFactorySet = function instanceFactorySet(n) {
      var d = dayjs(_this2);
      return Utils.w(d.date(d.date() + Math.round(n * number)), _this2);
    };

    if (unit === M) {
      return this.set(M, this.$M + number);
    }

    if (unit === Y) {
      return this.set(Y, this.$y + number);
    }

    if (unit === D) {
      return instanceFactorySet(1);
    }

    if (unit === W) {
      return instanceFactorySet(7);
    }

    var step =
      ((_C$MIN$C$H$C$S$unit = {}),
      (_C$MIN$C$H$C$S$unit[MIN] = MILLISECONDS_A_MINUTE),
      (_C$MIN$C$H$C$S$unit[H] = MILLISECONDS_A_HOUR),
      (_C$MIN$C$H$C$S$unit[S] = MILLISECONDS_A_SECOND),
      _C$MIN$C$H$C$S$unit)[unit] || 1; // ms

    var nextTimeStamp = this.$d.getTime() + number * step;
    return Utils.w(nextTimeStamp, this);
  };

  _proto.subtract = function subtract(number, string) {
    return this.add(number * -1, string);
  };

  _proto.format = function format(formatStr) {
    var _this3 = this;

    var locale = this.$locale();
    if (!this.isValid()) return locale.invalidDate || INVALID_DATE_STRING;
    var str = formatStr || FORMAT_DEFAULT;
    var zoneStr = Utils.z(this);
    var $H = this.$H,
      $m = this.$m,
      $M = this.$M;
    var weekdays = locale.weekdays,
      months = locale.months,
      meridiem = locale.meridiem;

    var getShort = function getShort(arr, index, full, length) {
      return (
        (arr && (arr[index] || arr(_this3, str))) ||
        full[index].substr(0, length)
      );
    };

    var get$H = function get$H(num) {
      return Utils.s($H % 12 || 12, num, "0");
    };

    var meridiemFunc =
      meridiem ||
      function (hour, minute, isLowercase) {
        var m = hour < 12 ? "AM" : "PM";
        return isLowercase ? m.toLowerCase() : m;
      };

    var matches = {
      YY: String(this.$y).slice(-2),
      YYYY: this.$y,
      M: $M + 1,
      MM: Utils.s($M + 1, 2, "0"),
      MMM: getShort(locale.monthsShort, $M, months, 3),
      MMMM: getShort(months, $M),
      D: this.$D,
      DD: Utils.s(this.$D, 2, "0"),
      d: String(this.$W),
      dd: getShort(locale.weekdaysMin, this.$W, weekdays, 2),
      ddd: getShort(locale.weekdaysShort, this.$W, weekdays, 3),
      dddd: weekdays[this.$W],
      H: String($H),
      HH: Utils.s($H, 2, "0"),
      h: get$H(1),
      hh: get$H(2),
      a: meridiemFunc($H, $m, true),
      A: meridiemFunc($H, $m, false),
      m: String($m),
      mm: Utils.s($m, 2, "0"),
      s: String(this.$s),
      ss: Utils.s(this.$s, 2, "0"),
      SSS: Utils.s(this.$ms, 3, "0"),
      Z: zoneStr // 'ZZ' logic below
    };
    return str.replace(REGEX_FORMAT, function (match, $1) {
      return $1 || matches[match] || zoneStr.replace(":", "");
    }); // 'ZZ'
  };

  _proto.utcOffset = function utcOffset() {
    // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
    // https://github.com/moment/moment/pull/1871
    return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
  };

  _proto.diff = function diff(input, units, _float) {
    var _C$Y$C$M$C$Q$C$W$C$D$;

    var unit = Utils.p(units);
    var that = dayjs(input);
    var zoneDelta =
      (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
    var diff = this - that;
    var result = Utils.m(this, that);
    result =
      ((_C$Y$C$M$C$Q$C$W$C$D$ = {}),
      (_C$Y$C$M$C$Q$C$W$C$D$[Y] = result / 12),
      (_C$Y$C$M$C$Q$C$W$C$D$[M] = result),
      (_C$Y$C$M$C$Q$C$W$C$D$[Q] = result / 3),
      (_C$Y$C$M$C$Q$C$W$C$D$[W] = (diff - zoneDelta) / MILLISECONDS_A_WEEK),
      (_C$Y$C$M$C$Q$C$W$C$D$[D] = (diff - zoneDelta) / MILLISECONDS_A_DAY),
      (_C$Y$C$M$C$Q$C$W$C$D$[H] = diff / MILLISECONDS_A_HOUR),
      (_C$Y$C$M$C$Q$C$W$C$D$[MIN] = diff / MILLISECONDS_A_MINUTE),
      (_C$Y$C$M$C$Q$C$W$C$D$[S] = diff / MILLISECONDS_A_SECOND),
      _C$Y$C$M$C$Q$C$W$C$D$)[unit] || diff; // milliseconds

    return _float ? result : Utils.a(result);
  };

  _proto.daysInMonth = function daysInMonth() {
    return this.endOf(M).$D;
  };

  _proto.$locale = function $locale() {
    // get locale object
    return Ls[this.$L];
  };

  _proto.locale = function locale(preset, object) {
    if (!preset) return this.$L;
    var that = this.clone();
    var nextLocaleName = parseLocale(preset, object, true);
    if (nextLocaleName) that.$L = nextLocaleName;
    return that;
  };

  _proto.clone = function clone() {
    return Utils.w(this.$d, this);
  };

  _proto.toDate = function toDate() {
    return new Date(this.valueOf());
  };

  _proto.toJSON = function toJSON() {
    return this.isValid() ? this.toISOString() : null;
  };

  _proto.toISOString = function toISOString() {
    // ie 8 return
    // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
    // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    return this.$d.toISOString();
  };

  _proto.toString = function toString() {
    return this.$d.toUTCString();
  };

  return Dayjs;
})();

var proto = Dayjs.prototype;
dayjs.prototype = proto;
[
  ["$ms", MS],
  ["$s", S],
  ["$m", MIN],
  ["$H", H],
  ["$W", D],
  ["$M", M],
  ["$y", Y],
  ["$D", DATE]
].forEach(function (g) {
  proto[g[1]] = function (input) {
    return this.$g(input, g[0], g[1]);
  };
});

dayjs.extend = function (plugin, option) {
  if (!plugin.$i) {
    // install plugin only once
    plugin(option, Dayjs, dayjs);
    plugin.$i = true;
  }

  return dayjs;
};

dayjs.locale = parseLocale;
dayjs.isDayjs = isDayjs;

dayjs.unix = function (timestamp) {
  return dayjs(timestamp * 1e3);
};

dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};

var advancedFormat = function (o, c, d) {
  // locale needed later
  var proto = c.prototype;
  var oldFormat = proto.format;

  d.en.ordinal = function (number) {
    var s = ["th", "st", "nd", "rd"];
    var v = number % 100;
    return "[" + number + (s[(v - 20) % 10] || s[v] || s[0]) + "]";
  }; // extend en locale here

  proto.format = function (formatStr) {
    var _this = this;

    var locale = this.$locale();
    var utils = this.$utils();
    var str = formatStr || FORMAT_DEFAULT;
    var result = str.replace(
      /\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,
      function (match) {
        switch (match) {
          case "Q":
            return Math.ceil((_this.$M + 1) / 3);

          case "Do":
            return locale.ordinal(_this.$D);

          case "gggg":
            return _this.weekYear();

          case "GGGG":
            return _this.isoWeekYear();

          case "wo":
            return locale.ordinal(_this.week(), "W");
          // W for week

          case "w":
          case "ww":
            return utils.s(_this.week(), match === "w" ? 1 : 2, "0");

          case "W":
          case "WW":
            return utils.s(_this.isoWeek(), match === "W" ? 1 : 2, "0");

          case "k":
          case "kk":
            return utils.s(
              String(_this.$H === 0 ? 24 : _this.$H),
              match === "k" ? 1 : 2,
              "0"
            );

          case "X":
            return Math.floor(_this.$d.getTime() / 1000);

          case "x":
            return _this.$d.getTime();

          case "z":
            return "[" + _this.offsetName() + "]";

          case "zzz":
            return "[" + _this.offsetName("long") + "]";

          default:
            return match;
        }
      }
    );
    return oldFormat.bind(this)(result);
  };
};

var calendar = function (o, c, d) {
  var LT = "h:mm A";
  var L = "MM/DD/YYYY";
  var calendarFormat = {
    lastDay: "[Yesterday at] " + LT,
    sameDay: "[Today at] " + LT,
    nextDay: "[Tomorrow at] " + LT,
    nextWeek: "dddd [at] " + LT,
    lastWeek: "[Last] dddd [at] " + LT,
    sameElse: L
  };
  var proto = c.prototype;

  proto.calendar = function (referenceTime, formats) {
    var format = formats || this.$locale().calendar || calendarFormat;
    var referenceStartOfDay = d(referenceTime || undefined).startOf("d");
    var diff = this.diff(referenceStartOfDay, "d", true);
    var sameElse = "sameElse";
    /* eslint-disable no-nested-ternary */

    var retVal =
      diff < -6
        ? sameElse
        : diff < -1
          ? "lastWeek"
          : diff < 0
            ? "lastDay"
            : diff < 1
              ? "sameDay"
              : diff < 2
                ? "nextDay"
                : diff < 7
                  ? "nextWeek"
                  : sameElse;
    /* eslint-enable no-nested-ternary */

    var currentFormat = format[retVal] || calendarFormat[retVal];

    if (typeof currentFormat === "function") {
      return currentFormat.call(this, d());
    }

    return this.format(currentFormat);
  };
};

// eslint-disable-next-line import/prefer-default-export
var t = function t(format) {
  return format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function (_, a, b) {
    return a || b.slice(1);
  });
};
var englishFormats = {
  LTS: "h:mm:ss A",
  LT: "h:mm A",
  L: "MM/DD/YYYY",
  LL: "MMMM D, YYYY",
  LLL: "MMMM D, YYYY h:mm A",
  LLLL: "dddd, MMMM D, YYYY h:mm A"
};
var u = function u(formatStr, formats) {
  return formatStr.replace(
    /(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,
    function (_, a, b) {
      var B = b && b.toUpperCase();
      return a || formats[b] || englishFormats[b] || t(formats[B]);
    }
  );
};

var formattingTokens =
  /(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;
var match1 = /\d/; // 0 - 9

var match2 = /\d\d/; // 00 - 99

var match3 = /\d{3}/; // 000 - 999

var match4 = /\d{4}/; // 0000 - 9999

var match1to2 = /\d\d?/; // 0 - 99

var matchSigned = /[+-]?\d+/; // -inf - inf

var matchOffset = /[+-]\d\d:?(\d\d)?|Z/; // +00:00 -00:00 +0000 or -0000 +00 or Z

var matchWord = /\d*[^\s\d-_:/()]+/; // Word

var locale = {};

var parseTwoDigitYear = function parseTwoDigitYear(input) {
  input = +input;
  return input + (input > 68 ? 1900 : 2000);
};

function offsetFromString(string) {
  if (!string) return 0;
  if (string === "Z") return 0;
  var parts = string.match(/([+-]|\d\d)/g);
  var minutes = +(parts[1] * 60) + (+parts[2] || 0);
  return minutes === 0 ? 0 : parts[0] === "+" ? -minutes : minutes; // eslint-disable-line no-nested-ternary
}

var addInput = function addInput(property) {
  return function (input) {
    this[property] = +input;
  };
};

var zoneExpressions = [
  matchOffset,
  function (input) {
    var zone = this.zone || (this.zone = {});
    zone.offset = offsetFromString(input);
  }
];

var getLocalePart = function getLocalePart(name) {
  var part = locale[name];
  return part && (part.indexOf ? part : part.s.concat(part.f));
};

var meridiemMatch = function meridiemMatch(input, isLowerCase) {
  var isAfternoon;
  var _locale = locale,
    meridiem = _locale.meridiem;

  if (!meridiem) {
    isAfternoon = input === (isLowerCase ? "pm" : "PM");
  } else {
    for (var i = 1; i <= 24; i += 1) {
      // todo: fix input === meridiem(i, 0, isLowerCase)
      if (input.indexOf(meridiem(i, 0, isLowerCase)) > -1) {
        isAfternoon = i > 12;
        break;
      }
    }
  }

  return isAfternoon;
};

var expressions = {
  A: [
    matchWord,
    function (input) {
      this.afternoon = meridiemMatch(input, false);
    }
  ],
  a: [
    matchWord,
    function (input) {
      this.afternoon = meridiemMatch(input, true);
    }
  ],
  S: [
    match1,
    function (input) {
      this.milliseconds = +input * 100;
    }
  ],
  SS: [
    match2,
    function (input) {
      this.milliseconds = +input * 10;
    }
  ],
  SSS: [
    match3,
    function (input) {
      this.milliseconds = +input;
    }
  ],
  s: [match1to2, addInput("seconds")],
  ss: [match1to2, addInput("seconds")],
  m: [match1to2, addInput("minutes")],
  mm: [match1to2, addInput("minutes")],
  H: [match1to2, addInput("hours")],
  h: [match1to2, addInput("hours")],
  HH: [match1to2, addInput("hours")],
  hh: [match1to2, addInput("hours")],
  D: [match1to2, addInput("day")],
  DD: [match2, addInput("day")],
  Do: [
    matchWord,
    function (input) {
      var _locale2 = locale,
        ordinal = _locale2.ordinal;

      var _input$match = input.match(/\d+/);

      this.day = _input$match[0];
      if (!ordinal) return;

      for (var i = 1; i <= 31; i += 1) {
        if (ordinal(i).replace(/\[|\]/g, "") === input) {
          this.day = i;
        }
      }
    }
  ],
  M: [match1to2, addInput("month")],
  MM: [match2, addInput("month")],
  MMM: [
    matchWord,
    function (input) {
      var months = getLocalePart("months");
      var monthsShort = getLocalePart("monthsShort");
      var matchIndex =
        (
          monthsShort ||
          months.map(function (_) {
            return _.substr(0, 3);
          })
        ).indexOf(input) + 1;

      if (matchIndex < 1) {
        throw new Error();
      }

      this.month = matchIndex % 12 || matchIndex;
    }
  ],
  MMMM: [
    matchWord,
    function (input) {
      var months = getLocalePart("months");
      var matchIndex = months.indexOf(input) + 1;

      if (matchIndex < 1) {
        throw new Error();
      }

      this.month = matchIndex % 12 || matchIndex;
    }
  ],
  Y: [matchSigned, addInput("year")],
  YY: [
    match2,
    function (input) {
      this.year = parseTwoDigitYear(input);
    }
  ],
  YYYY: [match4, addInput("year")],
  Z: zoneExpressions,
  ZZ: zoneExpressions
};

function correctHours(time) {
  var afternoon = time.afternoon;

  if (afternoon !== undefined) {
    var hours = time.hours;

    if (afternoon) {
      if (hours < 12) {
        time.hours += 12;
      }
    } else if (hours === 12) {
      time.hours = 0;
    }

    delete time.afternoon;
  }
}

function makeParser(format) {
  format = u(format, locale && locale.formats);
  var array = format.match(formattingTokens);
  var length = array.length;

  for (var i = 0; i < length; i += 1) {
    var token = array[i];
    var parseTo = expressions[token];
    var regex = parseTo && parseTo[0];
    var parser = parseTo && parseTo[1];

    if (parser) {
      array[i] = {
        regex: regex,
        parser: parser
      };
    } else {
      array[i] = token.replace(/^\[|\]$/g, "");
    }
  }

  return function (input) {
    var time = {};

    for (var _i = 0, start = 0; _i < length; _i += 1) {
      var _token = array[_i];

      if (typeof _token === "string") {
        start += _token.length;
      } else {
        var _regex = _token.regex,
          _parser = _token.parser;
        var part = input.substr(start);

        var match = _regex.exec(part);

        var value = match[0];

        _parser.call(time, value);

        input = input.replace(value, "");
      }
    }

    correctHours(time);
    return time;
  };
}

var parseFormattedInput = function parseFormattedInput(input, format, utc) {
  try {
    if (["x", "X"].indexOf(format) > -1)
      return new Date((format === "X" ? 1000 : 1) * input);
    var parser = makeParser(format);

    var _parser2 = parser(input),
      year = _parser2.year,
      month = _parser2.month,
      day = _parser2.day,
      hours = _parser2.hours,
      minutes = _parser2.minutes,
      seconds = _parser2.seconds,
      milliseconds = _parser2.milliseconds,
      zone = _parser2.zone;

    var now = new Date();
    var d = day || (!year && !month ? now.getDate() : 1);
    var y = year || now.getFullYear();
    var M = 0;

    if (!(year && !month)) {
      M = month > 0 ? month - 1 : now.getMonth();
    }

    var h = hours || 0;
    var m = minutes || 0;
    var s = seconds || 0;
    var ms = milliseconds || 0;

    if (zone) {
      return new Date(Date.UTC(y, M, d, h, m, s, ms + zone.offset * 60 * 1000));
    }

    if (utc) {
      return new Date(Date.UTC(y, M, d, h, m, s, ms));
    }

    return new Date(y, M, d, h, m, s, ms);
  } catch (e) {
    return new Date(""); // Invalid Date
  }
};

var customParseFormat = function (o, C, d) {
  d.p.customParseFormat = true;

  if (o && o.parseTwoDigitYear) {
    parseTwoDigitYear = o.parseTwoDigitYear;
  }

  var proto = C.prototype;
  var oldParse = proto.parse;

  proto.parse = function (cfg) {
    var date = cfg.date,
      utc = cfg.utc,
      args = cfg.args;
    this.$u = utc;
    var format = args[1];

    if (typeof format === "string") {
      var isStrictWithoutLocale = args[2] === true;
      var isStrictWithLocale = args[3] === true;
      var isStrict = isStrictWithoutLocale || isStrictWithLocale;
      var pl = args[2];

      if (isStrictWithLocale) {
        pl = args[2];
      }

      locale = this.$locale();

      if (!isStrictWithoutLocale && pl) {
        locale = d.Ls[pl];
      }

      this.$d = parseFormattedInput(date, format, utc);
      this.init();
      if (pl && pl !== true) this.$L = this.locale(pl).$L;

      if (isStrict && date !== this.format(format)) {
        this.$d = new Date("");
      } // reset global locale to make parallel unit test

      locale = {};
    } else if (format instanceof Array) {
      var len = format.length;

      for (var i = 1; i <= len; i += 1) {
        args[1] = format[i - 1];
        var result = d.apply(this, args);

        if (result.isValid()) {
          this.$d = result.$d;
          this.$L = result.$L;
          this.init();
          break;
        }

        if (i === len) this.$d = new Date("");
      }
    } else {
      oldParse.call(this, cfg);
    }
  };
};

var dayOfYear = function (o, c, d) {
  var proto = c.prototype;

  proto.dayOfYear = function (input) {
    // d(this) is for badMutable
    var dayOfYear =
      Math.round((d(this).startOf("day") - d(this).startOf("year")) / 864e5) +
      1;
    return input == null ? dayOfYear : this.add(input - dayOfYear, "day");
  };
};

var isBetween = function (o, c, d) {
  c.prototype.isBetween = function (a, b, u, i) {
    var dA = d(a);
    var dB = d(b);
    i = i || "()";
    var dAi = i[0] === "(";
    var dBi = i[1] === ")";
    return (
      ((dAi ? this.isAfter(dA, u) : !this.isBefore(dA, u)) &&
        (dBi ? this.isBefore(dB, u) : !this.isAfter(dB, u))) ||
      ((dAi ? this.isBefore(dA, u) : !this.isAfter(dA, u)) &&
        (dBi ? this.isAfter(dB, u) : !this.isBefore(dB, u)))
    );
  };
};

var isLeapYear = function (o, c) {
  var proto = c.prototype;

  proto.isLeapYear = function () {
    return (this.$y % 4 === 0 && this.$y % 100 !== 0) || this.$y % 400 === 0;
  };
};

var isMoment = function (o, c, f) {
  f.isMoment = function (input) {
    return f.isDayjs(input);
  };
};

var isSameOrAfter = function (o, c) {
  c.prototype.isSameOrAfter = function (that, units) {
    return this.isSame(that, units) || this.isAfter(that, units);
  };
};

var isSameOrBefore = function (o, c) {
  c.prototype.isSameOrBefore = function (that, units) {
    return this.isSame(that, units) || this.isBefore(that, units);
  };
};

var localeData = function (o, c, dayjs) {
  // locale needed later
  var proto = c.prototype;

  var getLocalePart = function getLocalePart(part) {
    return part && (part.indexOf ? part : part.s);
  };

  var getShort = function getShort(ins, target, full, num, localeOrder) {
    var locale = ins.name ? ins : ins.$locale();
    var targetLocale = getLocalePart(locale[target]);
    var fullLocale = getLocalePart(locale[full]);
    var result =
      targetLocale ||
      fullLocale.map(function (f) {
        return f.substr(0, num);
      });
    if (!localeOrder) return result;
    var weekStart = locale.weekStart;
    return result.map(function (_, index) {
      return result[(index + (weekStart || 0)) % 7];
    });
  };

  var getDayjsLocaleObject = function getDayjsLocaleObject() {
    return dayjs.Ls[dayjs.locale()];
  };

  var getLongDateFormat = function getLongDateFormat(l, format) {
    return l.formats[format] || t(l.formats[format.toUpperCase()]);
  };

  var localeData = function localeData() {
    var _this = this;

    return {
      months: function months(instance) {
        return instance ? instance.format("MMMM") : getShort(_this, "months");
      },
      monthsShort: function monthsShort(instance) {
        return instance
          ? instance.format("MMM")
          : getShort(_this, "monthsShort", "months", 3);
      },
      firstDayOfWeek: function firstDayOfWeek() {
        return _this.$locale().weekStart || 0;
      },
      weekdays: function weekdays(instance) {
        return instance ? instance.format("dddd") : getShort(_this, "weekdays");
      },
      weekdaysMin: function weekdaysMin(instance) {
        return instance
          ? instance.format("dd")
          : getShort(_this, "weekdaysMin", "weekdays", 2);
      },
      weekdaysShort: function weekdaysShort(instance) {
        return instance
          ? instance.format("ddd")
          : getShort(_this, "weekdaysShort", "weekdays", 3);
      },
      longDateFormat: function longDateFormat(format) {
        return getLongDateFormat(_this.$locale(), format);
      },
      meridiem: this.$locale().meridiem,
      ordinal: this.$locale().ordinal
    };
  };

  proto.localeData = function () {
    return localeData.bind(this)();
  };

  dayjs.localeData = function () {
    var localeObject = getDayjsLocaleObject();
    return {
      firstDayOfWeek: function firstDayOfWeek() {
        return localeObject.weekStart || 0;
      },
      weekdays: function weekdays() {
        return dayjs.weekdays();
      },
      weekdaysShort: function weekdaysShort() {
        return dayjs.weekdaysShort();
      },
      weekdaysMin: function weekdaysMin() {
        return dayjs.weekdaysMin();
      },
      months: function months() {
        return dayjs.months();
      },
      monthsShort: function monthsShort() {
        return dayjs.monthsShort();
      },
      longDateFormat: function longDateFormat(format) {
        return getLongDateFormat(localeObject, format);
      },
      meridiem: localeObject.meridiem,
      ordinal: localeObject.ordinal
    };
  };

  dayjs.months = function () {
    return getShort(getDayjsLocaleObject(), "months");
  };

  dayjs.monthsShort = function () {
    return getShort(getDayjsLocaleObject(), "monthsShort", "months", 3);
  };

  dayjs.weekdays = function (localeOrder) {
    return getShort(
      getDayjsLocaleObject(),
      "weekdays",
      null,
      null,
      localeOrder
    );
  };

  dayjs.weekdaysShort = function (localeOrder) {
    return getShort(
      getDayjsLocaleObject(),
      "weekdaysShort",
      "weekdays",
      3,
      localeOrder
    );
  };

  dayjs.weekdaysMin = function (localeOrder) {
    return getShort(
      getDayjsLocaleObject(),
      "weekdaysMin",
      "weekdays",
      2,
      localeOrder
    );
  };
};

var localizedFormat = function (o, c, d) {
  var proto = c.prototype;
  var oldFormat = proto.format;
  d.en.formats = englishFormats;

  proto.format = function (formatStr) {
    if (formatStr === void 0) {
      formatStr = FORMAT_DEFAULT;
    }

    var _this$$locale = this.$locale(),
      _this$$locale$formats = _this$$locale.formats,
      formats = _this$$locale$formats === void 0 ? {} : _this$$locale$formats;

    var result = u(formatStr, formats);
    return oldFormat.call(this, result);
  };
};

var minMax = function (o, c, d) {
  var sortBy = function sortBy(method, dates) {
    if (
      !dates ||
      !dates.length ||
      !dates[0] ||
      (dates.length === 1 && !dates[0].length)
    ) {
      return null;
    }

    if (dates.length === 1 && dates[0].length > 0) {
      var _dates = dates;
      dates = _dates[0];
    }

    var result;
    var _dates2 = dates;
    result = _dates2[0];

    for (var i = 1; i < dates.length; i += 1) {
      if (!dates[i].isValid() || dates[i][method](result)) {
        result = dates[i];
      }
    }

    return result;
  };

  d.max = function () {
    var args = [].slice.call(arguments, 0); // eslint-disable-line prefer-rest-params

    return sortBy("isAfter", args);
  };

  d.min = function () {
    var args = [].slice.call(arguments, 0); // eslint-disable-line prefer-rest-params

    return sortBy("isBefore", args);
  };
};

var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
}; // Cache time-zone lookups from Intl.DateTimeFormat,
// as it is a *very* slow method.

var dtfCache = {};

var getDateTimeFormat = function getDateTimeFormat(timezone, options) {
  if (options === void 0) {
    options = {};
  }

  var timeZoneName = options.timeZoneName || "short";
  var key = timezone + "|" + timeZoneName;
  var dtf = dtfCache[key];

  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: timeZoneName
    });
    dtfCache[key] = dtf;
  }

  return dtf;
};

var timezone = function (o, c, d) {
  var defaultTimezone;

  var makeFormatParts = function makeFormatParts(timestamp, timezone, options) {
    if (options === void 0) {
      options = {};
    }

    var date = new Date(timestamp);
    var dtf = getDateTimeFormat(timezone, options);
    return dtf.formatToParts(date);
  };

  var tzOffset = function tzOffset(timestamp, timezone) {
    var formatResult = makeFormatParts(timestamp, timezone);
    var filled = [];

    for (var i = 0; i < formatResult.length; i += 1) {
      var _formatResult$i = formatResult[i],
        type = _formatResult$i.type,
        value = _formatResult$i.value;
      var pos = typeToPos[type];

      if (pos >= 0) {
        filled[pos] = parseInt(value, 10);
      }
    }

    var hour = filled[3]; // Workaround for the same behavior in different node version
    // https://github.com/nodejs/node/issues/33027

    /* istanbul ignore next */

    var fixedHour = hour === 24 ? 0 : hour;
    var utcString =
      filled[0] +
      "-" +
      filled[1] +
      "-" +
      filled[2] +
      " " +
      fixedHour +
      ":" +
      filled[4] +
      ":" +
      filled[5] +
      ":000";
    var utcTs = d.utc(utcString).valueOf();
    var asTS = +timestamp;
    var over = asTS % 1000;
    asTS -= over;
    return (utcTs - asTS) / (60 * 1000);
  }; // find the right offset a given local time. The o input is our guess, which determines which
  // offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)
  // https://github.com/moment/luxon/blob/master/src/datetime.js#L76

  var fixOffset = function fixOffset(localTS, o0, tz) {
    // Our UTC time is just a guess because our offset is just a guess
    var utcGuess = localTS - o0 * 60 * 1000; // Test whether the zone matches the offset for this ts

    var o2 = tzOffset(utcGuess, tz); // If so, offset didn't change and we're done

    if (o0 === o2) {
      return [utcGuess, o0];
    } // If not, change the ts by the difference in the offset

    utcGuess -= (o2 - o0) * 60 * 1000; // If that gives us the local time we want, we're done

    var o3 = tzOffset(utcGuess, tz);

    if (o2 === o3) {
      return [utcGuess, o2];
    } // If it's different, we're in a hole time.
    // The offset has changed, but the we don't adjust the time

    return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)];
  };

  var proto = c.prototype;

  proto.tz = function (timezone, keepLocalTime) {
    if (timezone === void 0) {
      timezone = defaultTimezone;
    }

    var oldOffset = this.utcOffset();
    var date = this.toDate();
    var target = date.toLocaleString("en-US", {
      timeZone: timezone
    });
    var diff = Math.round((date - new Date(target)) / 1000 / 60);
    var ins = d(target)
      .$set(MS, this.$ms)
      .utcOffset(-Math.round(date.getTimezoneOffset() / 15) * 15 - diff, true);

    if (keepLocalTime) {
      var newOffset = ins.utcOffset();
      ins = ins.add(oldOffset - newOffset, MIN);
    }

    ins.$x.$timezone = timezone;
    return ins;
  };

  proto.offsetName = function (type) {
    // type: short(default) / long
    var zone = this.$x.$timezone || d.tz.guess();
    var result = makeFormatParts(this.valueOf(), zone, {
      timeZoneName: type
    }).find(function (m) {
      return m.type.toLowerCase() === "timezonename";
    });
    return result && result.value;
  };

  var oldStartOf = proto.startOf;

  proto.startOf = function (units, startOf) {
    if (!this.$x || !this.$x.$timezone) {
      return oldStartOf.call(this, units, startOf);
    }

    var withoutTz = d(this.format("YYYY-MM-DD HH:mm:ss:SSS"));
    var startOfWithoutTz = oldStartOf.call(withoutTz, units, startOf);
    return startOfWithoutTz.tz(this.$x.$timezone, true);
  };

  d.tz = function (input, arg1, arg2) {
    var parseFormat = arg2 && arg1;
    var timezone = arg2 || arg1 || defaultTimezone;
    var previousOffset = tzOffset(+d(), timezone);

    if (typeof input !== "string") {
      // timestamp number || js Date || Day.js
      return d(input).tz(timezone);
    }

    var localTs = d.utc(input, parseFormat).valueOf();

    var _fixOffset = fixOffset(localTs, previousOffset, timezone),
      targetTs = _fixOffset[0],
      targetOffset = _fixOffset[1];

    var ins = d(targetTs).utcOffset(targetOffset);
    ins.$x.$timezone = timezone;
    return ins;
  };

  d.tz.guess = function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  d.tz.setDefault = function (timezone) {
    defaultTimezone = timezone;
  };
};

var REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g;
var REGEX_OFFSET_HOURS_MINUTES_FORMAT = /([+-]|\d\d)/g;

function offsetFromString$1(value) {
  if (value === void 0) {
    value = "";
  }

  var offset = value.match(REGEX_VALID_OFFSET_FORMAT);

  if (!offset) {
    return null;
  }

  var _ref = ("" + offset[0]).match(REGEX_OFFSET_HOURS_MINUTES_FORMAT) || [
      "-",
      0,
      0
    ],
    indicator = _ref[0],
    hoursOffset = _ref[1],
    minutesOffset = _ref[2];

  var totalOffsetInMinutes = +hoursOffset * 60 + +minutesOffset;

  if (totalOffsetInMinutes === 0) {
    return 0;
  }

  return indicator === "+" ? totalOffsetInMinutes : -totalOffsetInMinutes;
}

var weekYear = function (option, Dayjs, dayjs) {
  var proto = Dayjs.prototype;

  dayjs.utc = function (date) {
    var cfg = {
      date: date,
      utc: true,
      args: arguments
    }; // eslint-disable-line prefer-rest-params

    return new Dayjs(cfg); // eslint-disable-line no-use-before-define
  };

  proto.utc = function (keepLocalTime) {
    var ins = dayjs(this.toDate(), {
      locale: this.$L,
      utc: true
    });

    if (keepLocalTime) {
      return ins.add(this.utcOffset(), MIN);
    }

    return ins;
  };

  proto.local = function () {
    return dayjs(this.toDate(), {
      locale: this.$L,
      utc: false
    });
  };

  var oldParse = proto.parse;

  proto.parse = function (cfg) {
    if (cfg.utc) {
      this.$u = true;
    }

    if (!this.$utils().u(cfg.$offset)) {
      this.$offset = cfg.$offset;
    }

    oldParse.call(this, cfg);
  };

  var oldInit = proto.init;

  proto.init = function () {
    if (this.$u) {
      var $d = this.$d;
      this.$y = $d.getUTCFullYear();
      this.$M = $d.getUTCMonth();
      this.$D = $d.getUTCDate();
      this.$W = $d.getUTCDay();
      this.$H = $d.getUTCHours();
      this.$m = $d.getUTCMinutes();
      this.$s = $d.getUTCSeconds();
      this.$ms = $d.getUTCMilliseconds();
    } else {
      oldInit.call(this);
    }
  };

  var oldUtcOffset = proto.utcOffset;

  proto.utcOffset = function (input, keepLocalTime) {
    var _this$$utils = this.$utils(),
      u = _this$$utils.u;

    if (u(input)) {
      if (this.$u) {
        return 0;
      }

      if (!u(this.$offset)) {
        return this.$offset;
      }

      return oldUtcOffset.call(this);
    }

    if (typeof input === "string") {
      input = offsetFromString$1(input);

      if (input === null) {
        return this;
      }
    }

    var offset = Math.abs(input) <= 16 ? input * 60 : input;
    var ins = this;

    if (keepLocalTime) {
      ins.$offset = offset;
      ins.$u = input === 0;
      return ins;
    }

    if (input !== 0) {
      var localTimezoneOffset = this.$u
        ? this.toDate().getTimezoneOffset()
        : -1 * this.utcOffset();
      ins = this.local().add(offset + localTimezoneOffset, MIN);
      ins.$offset = offset;
      ins.$x.$localOffset = localTimezoneOffset;
    } else {
      ins = this.utc();
    }

    return ins;
  };

  var oldFormat = proto.format;
  var UTC_FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ss[Z]";

  proto.format = function (formatStr) {
    var str = formatStr || (this.$u ? UTC_FORMAT_DEFAULT : "");
    return oldFormat.call(this, str);
  };

  proto.valueOf = function () {
    var addedOffset = !this.$utils().u(this.$offset)
      ? this.$offset + (this.$x.$localOffset || new Date().getTimezoneOffset())
      : 0;
    return this.$d.valueOf() - addedOffset * MILLISECONDS_A_MINUTE;
  };

  proto.isUTC = function () {
    return !!this.$u;
  };

  proto.toISOString = function () {
    return this.toDate().toISOString();
  };

  proto.toString = function () {
    return this.toDate().toUTCString();
  };

  var oldToDate = proto.toDate;

  proto.toDate = function (type) {
    if (type === "s" && this.$offset) {
      return dayjs(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate();
    }

    return oldToDate.call(this);
  };

  var oldDiff = proto.diff;

  proto.diff = function (input, units, _float) {
    if (input && this.$u === input.$u) {
      return oldDiff.call(this, input, units, _float);
    }

    var localThis = this.local();
    var localInput = dayjs(input).local();
    return oldDiff.call(localThis, localInput, units, _float);
  };
};

var weekday = function (o, c) {
  var proto = c.prototype;

  proto.weekday = function (input) {
    var weekStart = this.$locale().weekStart || 0;
    var $W = this.$W;
    var weekday = ($W < weekStart ? $W + 7 : $W) - weekStart;

    if (this.$utils().u(input)) {
      return weekday;
    }

    return this.subtract(weekday, "day").add(input, "day");
  };
};

var weekOfYear = function (o, c, d) {
  var proto = c.prototype;

  proto.week = function (week) {
    if (week === void 0) {
      week = null;
    }

    if (week !== null) {
      return this.add((week - this.week()) * 7, D);
    }

    var yearStart = this.$locale().yearStart || 1;

    if (this.month() === 11 && this.date() > 25) {
      // d(this) is for badMutable
      var nextYearStartDay = d(this).startOf(Y).add(1, Y).date(yearStart);
      var thisEndOfWeek = d(this).endOf(W);

      if (nextYearStartDay.isBefore(thisEndOfWeek)) {
        return 1;
      }
    }

    var yearStartDay = d(this).startOf(Y).date(yearStart);
    var yearStartWeek = yearStartDay.startOf(W).subtract(1, MS);
    var diffInWeek = this.diff(yearStartWeek, W, true);

    if (diffInWeek < 0) {
      return d(this).startOf("week").week();
    }

    return Math.ceil(diffInWeek);
  };

  proto.weeks = function (week) {
    if (week === void 0) {
      week = null;
    }

    return this.week(week);
  };
};

/**
 * This file is used to build a custom version of Day.JS that is compiled and optimized with
 * all the necessary functions we need in the Expression Engine to reproducd Moment.js
 * features.
 */

dayjs.extend(advancedFormat);
dayjs.extend(calendar);
dayjs.extend(customParseFormat);
dayjs.extend(dayOfYear);
dayjs.extend(isBetween);
dayjs.extend(isLeapYear);
dayjs.extend(isMoment);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(minMax);
dayjs.extend(timezone);
dayjs.extend(weekYear);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export default dayjs;
