function toDate(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = Object.prototype.toString.call(e);
  return e instanceof Date || ("object" == typeof e && "[object Date]" === t)
    ? new Date(e.getTime())
    : "number" == typeof e || "[object Number]" === t
      ? new Date(e)
      : (("string" != typeof e && "[object String]" !== t) ||
          "undefined" == typeof console ||
          (console.warn(
            "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"
          ),
          console.warn(new Error().stack)),
        new Date(NaN));
}

function isWeekend(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e).getDay();
  return 0 === t || 6 === t;
}

function toInteger(e) {
  if (null === e || !0 === e || !1 === e) return NaN;
  var t = Number(e);
  return isNaN(t) ? t : t < 0 ? Math.ceil(t) : Math.floor(t);
}

function addBusinessDays(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  if (isNaN(n)) return new Date(NaN);
  var a = r.getHours(),
    o = n < 0 ? -1 : 1;
  for (
    r.setDate(r.getDate() + 7 * toInteger(n / 5)), n %= 5;
    n || isWeekend(r);

  )
    r.setDate(r.getDate() + o), isWeekend(r) || (n -= o);
  return r.setHours(a), r;
}

function addDays(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return r.setDate(r.getDate() + n), r;
}

function addMilliseconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e).getTime(),
    n = toInteger(t);
  return new Date(r + n);
}
var MILLISECONDS_IN_HOUR = 36e5;

function addHours(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMilliseconds(e, toInteger(t) * MILLISECONDS_IN_HOUR);
}

function startOfWeek(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = r.locale,
    a = n && n.options && n.options.weekStartsOn,
    o = null == a ? 0 : toInteger(a),
    i = null == r.weekStartsOn ? o : toInteger(r.weekStartsOn);
  if (!(i >= 0 && i <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var s = toDate(e),
    u = s.getDay(),
    l = (u < i ? 7 : 0) + u - i;
  return s.setDate(s.getDate() - l), s.setHours(0, 0, 0, 0), s;
}

function startOfISOWeek(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return startOfWeek(e, {
    weekStartsOn: 1
  });
}

function getISOWeekYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getFullYear(),
    n = new Date(0);
  n.setFullYear(r + 1, 0, 4), n.setHours(0, 0, 0, 0);
  var a = startOfISOWeek(n),
    o = new Date(0);
  o.setFullYear(r, 0, 4), o.setHours(0, 0, 0, 0);
  var i = startOfISOWeek(o);
  return t.getTime() >= a.getTime()
    ? r + 1
    : t.getTime() >= i.getTime()
      ? r
      : r - 1;
}

function startOfISOWeekYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = getISOWeekYear(e),
    r = new Date(0);
  return r.setFullYear(t, 0, 4), r.setHours(0, 0, 0, 0), startOfISOWeek(r);
}
var MILLISECONDS_IN_MINUTE = 6e4;

function getTimezoneOffsetInMilliseconds(e) {
  var t = new Date(e.getTime()),
    r = t.getTimezoneOffset();
  t.setSeconds(0, 0);
  var n = t.getTime() % MILLISECONDS_IN_MINUTE;
  return r * MILLISECONDS_IN_MINUTE + n;
}

function startOfDay(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setHours(0, 0, 0, 0), t;
}
var MILLISECONDS_IN_DAY = 864e5;

function differenceInCalendarDays(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfDay(e),
    n = startOfDay(t),
    a = r.getTime() - getTimezoneOffsetInMilliseconds(r),
    o = n.getTime() - getTimezoneOffsetInMilliseconds(n);
  return Math.round((a - o) / MILLISECONDS_IN_DAY);
}

function setISOWeekYear(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t),
    a = differenceInCalendarDays(r, startOfISOWeekYear(r)),
    o = new Date(0);
  return (
    o.setFullYear(n, 0, 4),
    o.setHours(0, 0, 0, 0),
    (r = startOfISOWeekYear(o)).setDate(r.getDate() + a),
    r
  );
}

function addISOWeekYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toInteger(t);
  return setISOWeekYear(e, getISOWeekYear(e) + r);
}
var MILLISECONDS_IN_MINUTE$1 = 6e4;

function addMinutes(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMilliseconds(e, toInteger(t) * MILLISECONDS_IN_MINUTE$1);
}

function getDaysInMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getFullYear(),
    n = t.getMonth(),
    a = new Date(0);
  return a.setFullYear(r, n + 1, 0), a.setHours(0, 0, 0, 0), a.getDate();
}

function addMonths(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t),
    a = r.getMonth() + n,
    o = new Date(0);
  o.setFullYear(r.getFullYear(), a, 1), o.setHours(0, 0, 0, 0);
  var i = getDaysInMonth(o);
  return r.setMonth(a, Math.min(i, r.getDate())), r;
}

function addQuarters(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMonths(e, 3 * toInteger(t));
}

function addSeconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMilliseconds(e, 1e3 * toInteger(t));
}

function addWeeks(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addDays(e, 7 * toInteger(t));
}

function addYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMonths(e, 12 * toInteger(t));
}

function areIntervalsOverlapping(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = e || {},
    n = t || {},
    a = toDate(r.start).getTime(),
    o = toDate(r.end).getTime(),
    i = toDate(n.start).getTime(),
    s = toDate(n.end).getTime();
  if (!(a <= o && i <= s)) throw new RangeError("Invalid interval");
  return a < s && i < o;
}

function closestIndexTo(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e);
  if (isNaN(r)) return NaN;
  var n,
    a,
    o = r.getTime();
  return (
    (null == t
      ? []
      : "function" == typeof t.forEach
        ? t
        : Array.prototype.slice.call(t)
    ).forEach(function (e, t) {
      var r = toDate(e);
      if (isNaN(r)) return (n = NaN), void (a = NaN);
      var i = Math.abs(o - r.getTime());
      (null == n || i < a) && ((n = t), (a = i));
    }),
    n
  );
}

function closestTo(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e);
  if (isNaN(r)) return new Date(NaN);
  var n,
    a,
    o = r.getTime();
  return (
    (null == t
      ? []
      : "function" == typeof t.forEach
        ? t
        : Array.prototype.slice.call(t)
    ).forEach(function (e) {
      var t = toDate(e);
      if (isNaN(t)) return (n = new Date(NaN)), void (a = NaN);
      var r = Math.abs(o - t.getTime());
      (null == n || r < a) && ((n = t), (a = r));
    }),
    n
  );
}

function compareAsc(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t),
    a = r.getTime() - n.getTime();
  return a < 0 ? -1 : a > 0 ? 1 : a;
}

function compareDesc(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t),
    a = r.getTime() - n.getTime();
  return a > 0 ? -1 : a < 0 ? 1 : a;
}

function isValid(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return !isNaN(t);
}

function isSameDay(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfDay(e),
    n = startOfDay(t);
  return r.getTime() === n.getTime();
}

function differenceInBusinessDays(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  if (!isValid(r) || !isValid(n)) return new Date(NaN);
  var a = differenceInCalendarDays(r, n),
    o = a < 0 ? -1 : 1,
    i = toInteger(a / 7),
    s = 5 * i;
  for (n = addDays(n, 7 * i); !isSameDay(r, n); )
    (s += isWeekend(n) ? 0 : o), (n = addDays(n, o));
  return 0 === s ? 0 : s;
}

function differenceInCalendarISOWeekYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return getISOWeekYear(e) - getISOWeekYear(t);
}
var MILLISECONDS_IN_WEEK = 6048e5;

function differenceInCalendarISOWeeks(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfISOWeek(e),
    n = startOfISOWeek(t),
    a = r.getTime() - getTimezoneOffsetInMilliseconds(r),
    o = n.getTime() - getTimezoneOffsetInMilliseconds(n);
  return Math.round((a - o) / MILLISECONDS_IN_WEEK);
}

function differenceInCalendarMonths(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return (
    12 * (r.getFullYear() - n.getFullYear()) + (r.getMonth() - n.getMonth())
  );
}

function getQuarter(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return Math.floor(t.getMonth() / 3) + 1;
}

function differenceInCalendarQuarters(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return (
    4 * (r.getFullYear() - n.getFullYear()) + (getQuarter(r) - getQuarter(n))
  );
}
var MILLISECONDS_IN_WEEK$1 = 6048e5;

function differenceInCalendarWeeks(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = startOfWeek(e, r),
    a = startOfWeek(t, r),
    o = n.getTime() - getTimezoneOffsetInMilliseconds(n),
    i = a.getTime() - getTimezoneOffsetInMilliseconds(a);
  return Math.round((o - i) / MILLISECONDS_IN_WEEK$1);
}

function differenceInCalendarYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return r.getFullYear() - n.getFullYear();
}

function differenceInDays(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t),
    a = compareAsc(r, n),
    o = Math.abs(differenceInCalendarDays(r, n));
  r.setDate(r.getDate() - a * o);
  var i = a * (o - (compareAsc(r, n) === -a));
  return 0 === i ? 0 : i;
}

function differenceInMilliseconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return r.getTime() - n.getTime();
}
var MILLISECONDS_IN_HOUR$1 = 36e5;

function differenceInHours(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = differenceInMilliseconds(e, t) / MILLISECONDS_IN_HOUR$1;
  return r > 0 ? Math.floor(r) : Math.ceil(r);
}

function subISOWeekYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addISOWeekYears(e, -toInteger(t));
}

function differenceInISOWeekYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t),
    a = compareAsc(r, n),
    o = Math.abs(differenceInCalendarISOWeekYears(r, n)),
    i = a * (o - (compareAsc((r = subISOWeekYears(r, a * o)), n) === -a));
  return 0 === i ? 0 : i;
}
var MILLISECONDS_IN_MINUTE$2 = 6e4;

function differenceInMinutes(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = differenceInMilliseconds(e, t) / MILLISECONDS_IN_MINUTE$2;
  return r > 0 ? Math.floor(r) : Math.ceil(r);
}

function differenceInMonths(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t),
    a = compareAsc(r, n),
    o = Math.abs(differenceInCalendarMonths(r, n));
  r.setMonth(r.getMonth() - a * o);
  var i = a * (o - (compareAsc(r, n) === -a));
  return 0 === i ? 0 : i;
}

function differenceInQuarters(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = differenceInMonths(e, t) / 3;
  return r > 0 ? Math.floor(r) : Math.ceil(r);
}

function differenceInSeconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = differenceInMilliseconds(e, t) / 1e3;
  return r > 0 ? Math.floor(r) : Math.ceil(r);
}

function differenceInWeeks(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = differenceInDays(e, t) / 7;
  return r > 0 ? Math.floor(r) : Math.ceil(r);
}

function differenceInYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t),
    a = compareAsc(r, n),
    o = Math.abs(differenceInCalendarYears(r, n));
  r.setFullYear(r.getFullYear() - a * o);
  var i = a * (o - (compareAsc(r, n) === -a));
  return 0 === i ? 0 : i;
}

function eachDayOfInterval(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = e || {},
    n = toDate(r.start),
    a = toDate(r.end).getTime();
  if (!(n.getTime() <= a)) throw new RangeError("Invalid interval");
  var o = [],
    i = n;
  i.setHours(0, 0, 0, 0);
  var s = t && "step" in t ? Number(t.step) : 1;
  if (s < 1 || isNaN(s))
    throw new RangeError("`options.step` must be a number greater than 1");
  for (; i.getTime() <= a; )
    o.push(toDate(i)), i.setDate(i.getDate() + s), i.setHours(0, 0, 0, 0);
  return o;
}

function eachWeekOfInterval(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = e || {},
    n = toDate(r.start),
    a = toDate(r.end),
    o = a.getTime();
  if (!(n.getTime() <= o)) throw new RangeError("Invalid interval");
  var i = startOfWeek(n, t),
    s = startOfWeek(a, t);
  i.setHours(15), s.setHours(15), (o = s.getTime());
  for (var u = [], l = i; l.getTime() <= o; )
    l.setHours(0), u.push(toDate(l)), (l = addWeeks(l, 1)).setHours(15);
  return u;
}

function isSunday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 0 === toDate(e).getDay();
}

function eachWeekendOfInterval(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  for (var t = eachDayOfInterval(e), r = [], n = 0; n < t.length; ) {
    var a = t[n++];
    isWeekend(a) && (r.push(a), isSunday(a) && (n += 5));
  }
  return r;
}

function startOfMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setDate(1), t.setHours(0, 0, 0, 0), t;
}

function endOfMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getMonth();
  return (
    t.setFullYear(t.getFullYear(), r + 1, 0), t.setHours(23, 59, 59, 999), t
  );
}

function eachWeekendOfMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 arguments required, but only " + arguments.length + " present"
    );
  var t = startOfMonth(e);
  if (isNaN(t)) throw new RangeError("The passed date is invalid");
  return eachWeekendOfInterval({
    start: t,
    end: endOfMonth(e)
  });
}

function startOfYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = new Date(0);
  return r.setFullYear(t.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}

function endOfYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getFullYear();
  return t.setFullYear(r + 1, 0, 0), t.setHours(23, 59, 59, 999), t;
}

function eachWeekendOfYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 arguments required, but only " + arguments.length + " present"
    );
  var t = startOfYear(e);
  if (isNaN(t)) throw new RangeError("The passed date is invalid");
  return eachWeekendOfInterval({
    start: t,
    end: endOfYear(e)
  });
}

function endOfDay(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setHours(23, 59, 59, 999), t;
}

function endOfDecade(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getFullYear(),
    n = 9 + 10 * Math.floor(r / 10);
  return t.setFullYear(n, 11, 31), t.setHours(23, 59, 59, 999), t;
}

function endOfHour(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setMinutes(59, 59, 999), t;
}

function endOfWeek(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = r.locale,
    a = n && n.options && n.options.weekStartsOn,
    o = null == a ? 0 : toInteger(a),
    i = null == r.weekStartsOn ? o : toInteger(r.weekStartsOn);
  if (!(i >= 0 && i <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var s = toDate(e),
    u = s.getDay(),
    l = 6 + (u < i ? -7 : 0) - (u - i);
  return s.setDate(s.getDate() + l), s.setHours(23, 59, 59, 999), s;
}

function endOfISOWeek(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return endOfWeek(e, {
    weekStartsOn: 1
  });
}

function endOfISOWeekYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = getISOWeekYear(e),
    r = new Date(0);
  r.setFullYear(t + 1, 0, 4), r.setHours(0, 0, 0, 0);
  var n = startOfISOWeek(r);
  return n.setMilliseconds(n.getMilliseconds() - 1), n;
}

function endOfMinute(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setSeconds(59, 999), t;
}

function endOfQuarter(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getMonth(),
    n = r - (r % 3) + 3;
  return t.setMonth(n, 0), t.setHours(23, 59, 59, 999), t;
}

function endOfSecond(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setMilliseconds(999), t;
}

function endOfToday() {
  return endOfDay(Date.now());
}

function endOfTomorrow() {
  var e = new Date(),
    t = e.getFullYear(),
    r = e.getMonth(),
    n = e.getDate(),
    a = new Date(0);
  return a.setFullYear(t, r, n + 1), a.setHours(23, 59, 59, 999), a;
}

function endOfYesterday() {
  var e = new Date(),
    t = e.getFullYear(),
    r = e.getMonth(),
    n = e.getDate(),
    a = new Date(0);
  return a.setFullYear(t, r, n - 1), a.setHours(23, 59, 59, 999), a;
}
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};

function formatDistance(e, t, r) {
  var n;
  return (
    (r = r || {}),
    (n =
      "string" == typeof formatDistanceLocale[e]
        ? formatDistanceLocale[e]
        : 1 === t
          ? formatDistanceLocale[e].one
          : formatDistanceLocale[e].other.replace("{{count}}", t)),
    r.addSuffix ? (r.comparison > 0 ? "in " + n : n + " ago") : n
  );
}

function buildFormatLongFn(e) {
  return function (t) {
    var r = t || {},
      n = r.width ? String(r.width) : e.defaultWidth;
    return e.formats[n] || e.formats[e.defaultWidth];
  };
}
var dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  },
  timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  },
  dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  },
  formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full"
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full"
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full"
    })
  },
  formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  };

function formatRelative(e, t, r, n) {
  return formatRelativeLocale[e];
}

function buildLocalizeFn(e) {
  return function (t, r) {
    var n,
      a = r || {};
    if (
      "formatting" === (a.context ? String(a.context) : "standalone") &&
      e.formattingValues
    ) {
      var o = e.defaultFormattingWidth || e.defaultWidth,
        i = a.width ? String(a.width) : o;
      n = e.formattingValues[i] || e.formattingValues[o];
    } else {
      var s = e.defaultWidth,
        u = a.width ? String(a.width) : e.defaultWidth;
      n = e.values[u] || e.values[s];
    }
    return n[e.argumentCallback ? e.argumentCallback(t) : t];
  };
}
var eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  },
  quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  },
  monthValues = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  },
  dayValues = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  },
  dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  },
  formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  };

function ordinalNumber(e, t) {
  var r = Number(e),
    n = r % 100;
  if (n > 20 || n < 10)
    switch (n % 10) {
      case 1:
        return r + "st";
      case 2:
        return r + "nd";
      case 3:
        return r + "rd";
    }
  return r + "th";
}
var localize = {
  ordinalNumber: ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: function (e) {
      return Number(e) - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};

function buildMatchPatternFn(e) {
  return function (t, r) {
    var n = String(t),
      a = r || {},
      o = n.match(e.matchPattern);
    if (!o) return null;
    var i = o[0],
      s = n.match(e.parsePattern);
    if (!s) return null;
    var u = e.valueCallback ? e.valueCallback(s[0]) : s[0];
    return {
      value: (u = a.valueCallback ? a.valueCallback(u) : u),
      rest: n.slice(i.length)
    };
  };
}

function buildMatchFn(e) {
  return function (t, r) {
    var n = String(t),
      a = r || {},
      o = a.width,
      i = (o && e.matchPatterns[o]) || e.matchPatterns[e.defaultMatchWidth],
      s = n.match(i);
    if (!s) return null;
    var u,
      l = s[0],
      d = (o && e.parsePatterns[o]) || e.parsePatterns[e.defaultParseWidth];
    return (
      (u =
        "[object Array]" === Object.prototype.toString.call(d)
          ? d.findIndex(function (e) {
              return e.test(n);
            })
          : findKey(d, function (e) {
              return e.test(n);
            })),
      (u = e.valueCallback ? e.valueCallback(u) : u),
      {
        value: (u = a.valueCallback ? a.valueCallback(u) : u),
        rest: n.slice(l.length)
      }
    );
  };
}

function findKey(e, t) {
  for (var r in e) if (e.hasOwnProperty(r) && t(e[r])) return r;
}
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i,
  parseOrdinalNumberPattern = /\d+/i,
  matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  },
  parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  },
  matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  },
  parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  },
  matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  },
  parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ]
  },
  matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  },
  parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  },
  matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  },
  parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  },
  match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: function (e) {
        return parseInt(e, 10);
      }
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any"
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: function (e) {
        return e + 1;
      }
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any"
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any"
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any"
    })
  },
  locale = {
    formatDistance: formatDistance,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };

function subMilliseconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMilliseconds(e, -toInteger(t));
}

function addLeadingZeros(e, t) {
  for (var r = e < 0 ? "-" : "", n = Math.abs(e).toString(); n.length < t; )
    n = "0" + n;
  return r + n;
}
var formatters = {
    y: function (e, t) {
      var r = e.getUTCFullYear(),
        n = r > 0 ? r : 1 - r;
      return addLeadingZeros("yy" === t ? n % 100 : n, t.length);
    },
    M: function (e, t) {
      var r = e.getUTCMonth();
      return "M" === t ? String(r + 1) : addLeadingZeros(r + 1, 2);
    },
    d: function (e, t) {
      return addLeadingZeros(e.getUTCDate(), t.length);
    },
    a: function (e, t) {
      var r = e.getUTCHours() / 12 >= 1 ? "pm" : "am";
      switch (t) {
        case "a":
        case "aa":
        case "aaa":
          return r.toUpperCase();
        case "aaaaa":
          return r[0];
        case "aaaa":
        default:
          return "am" === r ? "a.m." : "p.m.";
      }
    },
    h: function (e, t) {
      return addLeadingZeros(e.getUTCHours() % 12 || 12, t.length);
    },
    H: function (e, t) {
      return addLeadingZeros(e.getUTCHours(), t.length);
    },
    m: function (e, t) {
      return addLeadingZeros(e.getUTCMinutes(), t.length);
    },
    s: function (e, t) {
      return addLeadingZeros(e.getUTCSeconds(), t.length);
    },
    S: function (e, t) {
      var r = t.length,
        n = e.getUTCMilliseconds();
      return addLeadingZeros(Math.floor(n * Math.pow(10, r - 3)), t.length);
    }
  },
  MILLISECONDS_IN_DAY$1 = 864e5;

function getUTCDayOfYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getTime();
  t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  var n = r - t.getTime();
  return Math.floor(n / MILLISECONDS_IN_DAY$1) + 1;
}

function startOfUTCISOWeek(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getUTCDay(),
    n = (r < 1 ? 7 : 0) + r - 1;
  return t.setUTCDate(t.getUTCDate() - n), t.setUTCHours(0, 0, 0, 0), t;
}

function getUTCISOWeekYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getUTCFullYear(),
    n = new Date(0);
  n.setUTCFullYear(r + 1, 0, 4), n.setUTCHours(0, 0, 0, 0);
  var a = startOfUTCISOWeek(n),
    o = new Date(0);
  o.setUTCFullYear(r, 0, 4), o.setUTCHours(0, 0, 0, 0);
  var i = startOfUTCISOWeek(o);
  return t.getTime() >= a.getTime()
    ? r + 1
    : t.getTime() >= i.getTime()
      ? r
      : r - 1;
}

function startOfUTCISOWeekYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = getUTCISOWeekYear(e),
    r = new Date(0);
  return (
    r.setUTCFullYear(t, 0, 4), r.setUTCHours(0, 0, 0, 0), startOfUTCISOWeek(r)
  );
}
var MILLISECONDS_IN_WEEK$2 = 6048e5;

function getUTCISOWeek(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = startOfUTCISOWeek(t).getTime() - startOfUTCISOWeekYear(t).getTime();
  return Math.round(r / MILLISECONDS_IN_WEEK$2) + 1;
}

function startOfUTCWeek(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = r.locale,
    a = n && n.options && n.options.weekStartsOn,
    o = null == a ? 0 : toInteger(a),
    i = null == r.weekStartsOn ? o : toInteger(r.weekStartsOn);
  if (!(i >= 0 && i <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var s = toDate(e),
    u = s.getUTCDay(),
    l = (u < i ? 7 : 0) + u - i;
  return s.setUTCDate(s.getUTCDate() - l), s.setUTCHours(0, 0, 0, 0), s;
}

function getUTCWeekYear(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = toDate(e, t),
    n = r.getUTCFullYear(),
    a = t || {},
    o = a.locale,
    i = o && o.options && o.options.firstWeekContainsDate,
    s = null == i ? 1 : toInteger(i),
    u =
      null == a.firstWeekContainsDate ? s : toInteger(a.firstWeekContainsDate);
  if (!(u >= 1 && u <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var l = new Date(0);
  l.setUTCFullYear(n + 1, 0, u), l.setUTCHours(0, 0, 0, 0);
  var d = startOfUTCWeek(l, t),
    c = new Date(0);
  c.setUTCFullYear(n, 0, u), c.setUTCHours(0, 0, 0, 0);
  var g = startOfUTCWeek(c, t);
  return r.getTime() >= d.getTime()
    ? n + 1
    : r.getTime() >= g.getTime()
      ? n
      : n - 1;
}

function startOfUTCWeekYear(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = r.locale,
    a = n && n.options && n.options.firstWeekContainsDate,
    o = null == a ? 1 : toInteger(a),
    i =
      null == r.firstWeekContainsDate ? o : toInteger(r.firstWeekContainsDate),
    s = getUTCWeekYear(e, t),
    u = new Date(0);
  return (
    u.setUTCFullYear(s, 0, i), u.setUTCHours(0, 0, 0, 0), startOfUTCWeek(u, t)
  );
}
var MILLISECONDS_IN_WEEK$3 = 6048e5;

function getUTCWeek(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = startOfUTCWeek(r, t).getTime() - startOfUTCWeekYear(r, t).getTime();
  return Math.round(n / MILLISECONDS_IN_WEEK$3) + 1;
}
var dayPeriodEnum = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  formatters$1 = {
    G: function (e, t, r) {
      var n = e.getUTCFullYear() > 0 ? 1 : 0;
      switch (t) {
        case "G":
        case "GG":
        case "GGG":
          return r.era(n, {
            width: "abbreviated"
          });
        case "GGGGG":
          return r.era(n, {
            width: "narrow"
          });
        case "GGGG":
        default:
          return r.era(n, {
            width: "wide"
          });
      }
    },
    y: function (e, t, r) {
      if ("yo" === t) {
        var n = e.getUTCFullYear(),
          a = n > 0 ? n : 1 - n;
        return r.ordinalNumber(a, {
          unit: "year"
        });
      }
      return formatters.y(e, t);
    },
    Y: function (e, t, r, n) {
      var a = getUTCWeekYear(e, n),
        o = a > 0 ? a : 1 - a;
      return "YY" === t
        ? addLeadingZeros(o % 100, 2)
        : "Yo" === t
          ? r.ordinalNumber(o, {
              unit: "year"
            })
          : addLeadingZeros(o, t.length);
    },
    R: function (e, t) {
      return addLeadingZeros(getUTCISOWeekYear(e), t.length);
    },
    u: function (e, t) {
      return addLeadingZeros(e.getUTCFullYear(), t.length);
    },
    Q: function (e, t, r) {
      var n = Math.ceil((e.getUTCMonth() + 1) / 3);
      switch (t) {
        case "Q":
          return String(n);
        case "QQ":
          return addLeadingZeros(n, 2);
        case "Qo":
          return r.ordinalNumber(n, {
            unit: "quarter"
          });
        case "QQQ":
          return r.quarter(n, {
            width: "abbreviated",
            context: "formatting"
          });
        case "QQQQQ":
          return r.quarter(n, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return r.quarter(n, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    q: function (e, t, r) {
      var n = Math.ceil((e.getUTCMonth() + 1) / 3);
      switch (t) {
        case "q":
          return String(n);
        case "qq":
          return addLeadingZeros(n, 2);
        case "qo":
          return r.ordinalNumber(n, {
            unit: "quarter"
          });
        case "qqq":
          return r.quarter(n, {
            width: "abbreviated",
            context: "standalone"
          });
        case "qqqqq":
          return r.quarter(n, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return r.quarter(n, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    M: function (e, t, r) {
      var n = e.getUTCMonth();
      switch (t) {
        case "M":
        case "MM":
          return formatters.M(e, t);
        case "Mo":
          return r.ordinalNumber(n + 1, {
            unit: "month"
          });
        case "MMM":
          return r.month(n, {
            width: "abbreviated",
            context: "formatting"
          });
        case "MMMMM":
          return r.month(n, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return r.month(n, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    L: function (e, t, r) {
      var n = e.getUTCMonth();
      switch (t) {
        case "L":
          return String(n + 1);
        case "LL":
          return addLeadingZeros(n + 1, 2);
        case "Lo":
          return r.ordinalNumber(n + 1, {
            unit: "month"
          });
        case "LLL":
          return r.month(n, {
            width: "abbreviated",
            context: "standalone"
          });
        case "LLLLL":
          return r.month(n, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return r.month(n, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    w: function (e, t, r, n) {
      var a = getUTCWeek(e, n);
      return "wo" === t
        ? r.ordinalNumber(a, {
            unit: "week"
          })
        : addLeadingZeros(a, t.length);
    },
    I: function (e, t, r) {
      var n = getUTCISOWeek(e);
      return "Io" === t
        ? r.ordinalNumber(n, {
            unit: "week"
          })
        : addLeadingZeros(n, t.length);
    },
    d: function (e, t, r) {
      return "do" === t
        ? r.ordinalNumber(e.getUTCDate(), {
            unit: "date"
          })
        : formatters.d(e, t);
    },
    D: function (e, t, r) {
      var n = getUTCDayOfYear(e);
      return "Do" === t
        ? r.ordinalNumber(n, {
            unit: "dayOfYear"
          })
        : addLeadingZeros(n, t.length);
    },
    E: function (e, t, r) {
      var n = e.getUTCDay();
      switch (t) {
        case "E":
        case "EE":
        case "EEE":
          return r.day(n, {
            width: "abbreviated",
            context: "formatting"
          });
        case "EEEEE":
          return r.day(n, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return r.day(n, {
            width: "short",
            context: "formatting"
          });
        case "EEEE":
        default:
          return r.day(n, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    e: function (e, t, r, n) {
      var a = e.getUTCDay(),
        o = (a - n.weekStartsOn + 8) % 7 || 7;
      switch (t) {
        case "e":
          return String(o);
        case "ee":
          return addLeadingZeros(o, 2);
        case "eo":
          return r.ordinalNumber(o, {
            unit: "day"
          });
        case "eee":
          return r.day(a, {
            width: "abbreviated",
            context: "formatting"
          });
        case "eeeee":
          return r.day(a, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return r.day(a, {
            width: "short",
            context: "formatting"
          });
        case "eeee":
        default:
          return r.day(a, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    c: function (e, t, r, n) {
      var a = e.getUTCDay(),
        o = (a - n.weekStartsOn + 8) % 7 || 7;
      switch (t) {
        case "c":
          return String(o);
        case "cc":
          return addLeadingZeros(o, t.length);
        case "co":
          return r.ordinalNumber(o, {
            unit: "day"
          });
        case "ccc":
          return r.day(a, {
            width: "abbreviated",
            context: "standalone"
          });
        case "ccccc":
          return r.day(a, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return r.day(a, {
            width: "short",
            context: "standalone"
          });
        case "cccc":
        default:
          return r.day(a, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    i: function (e, t, r) {
      var n = e.getUTCDay(),
        a = 0 === n ? 7 : n;
      switch (t) {
        case "i":
          return String(a);
        case "ii":
          return addLeadingZeros(a, t.length);
        case "io":
          return r.ordinalNumber(a, {
            unit: "day"
          });
        case "iii":
          return r.day(n, {
            width: "abbreviated",
            context: "formatting"
          });
        case "iiiii":
          return r.day(n, {
            width: "narrow",
            context: "formatting"
          });
        case "iiiiii":
          return r.day(n, {
            width: "short",
            context: "formatting"
          });
        case "iiii":
        default:
          return r.day(n, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    a: function (e, t, r) {
      var n = e.getUTCHours() / 12 >= 1 ? "pm" : "am";
      switch (t) {
        case "a":
        case "aa":
        case "aaa":
          return r.dayPeriod(n, {
            width: "abbreviated",
            context: "formatting"
          });
        case "aaaaa":
          return r.dayPeriod(n, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return r.dayPeriod(n, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    b: function (e, t, r) {
      var n,
        a = e.getUTCHours();
      switch (
        ((n =
          12 === a
            ? dayPeriodEnum.noon
            : 0 === a
              ? dayPeriodEnum.midnight
              : a / 12 >= 1
                ? "pm"
                : "am"),
        t)
      ) {
        case "b":
        case "bb":
        case "bbb":
          return r.dayPeriod(n, {
            width: "abbreviated",
            context: "formatting"
          });
        case "bbbbb":
          return r.dayPeriod(n, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return r.dayPeriod(n, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    B: function (e, t, r) {
      var n,
        a = e.getUTCHours();
      switch (
        ((n =
          a >= 17
            ? dayPeriodEnum.evening
            : a >= 12
              ? dayPeriodEnum.afternoon
              : a >= 4
                ? dayPeriodEnum.morning
                : dayPeriodEnum.night),
        t)
      ) {
        case "B":
        case "BB":
        case "BBB":
          return r.dayPeriod(n, {
            width: "abbreviated",
            context: "formatting"
          });
        case "BBBBB":
          return r.dayPeriod(n, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return r.dayPeriod(n, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    h: function (e, t, r) {
      if ("ho" === t) {
        var n = e.getUTCHours() % 12;
        return (
          0 === n && (n = 12),
          r.ordinalNumber(n, {
            unit: "hour"
          })
        );
      }
      return formatters.h(e, t);
    },
    H: function (e, t, r) {
      return "Ho" === t
        ? r.ordinalNumber(e.getUTCHours(), {
            unit: "hour"
          })
        : formatters.H(e, t);
    },
    K: function (e, t, r) {
      var n = e.getUTCHours() % 12;
      return "Ko" === t
        ? r.ordinalNumber(n, {
            unit: "hour"
          })
        : addLeadingZeros(n, t.length);
    },
    k: function (e, t, r) {
      var n = e.getUTCHours();
      return (
        0 === n && (n = 24),
        "ko" === t
          ? r.ordinalNumber(n, {
              unit: "hour"
            })
          : addLeadingZeros(n, t.length)
      );
    },
    m: function (e, t, r) {
      return "mo" === t
        ? r.ordinalNumber(e.getUTCMinutes(), {
            unit: "minute"
          })
        : formatters.m(e, t);
    },
    s: function (e, t, r) {
      return "so" === t
        ? r.ordinalNumber(e.getUTCSeconds(), {
            unit: "second"
          })
        : formatters.s(e, t);
    },
    S: function (e, t) {
      return formatters.S(e, t);
    },
    X: function (e, t, r, n) {
      var a = (n._originalDate || e).getTimezoneOffset();
      if (0 === a) return "Z";
      switch (t) {
        case "X":
          return formatTimezoneWithOptionalMinutes(a);
        case "XXXX":
        case "XX":
          return formatTimezone(a);
        case "XXXXX":
        case "XXX":
        default:
          return formatTimezone(a, ":");
      }
    },
    x: function (e, t, r, n) {
      var a = (n._originalDate || e).getTimezoneOffset();
      switch (t) {
        case "x":
          return formatTimezoneWithOptionalMinutes(a);
        case "xxxx":
        case "xx":
          return formatTimezone(a);
        case "xxxxx":
        case "xxx":
        default:
          return formatTimezone(a, ":");
      }
    },
    O: function (e, t, r, n) {
      var a = (n._originalDate || e).getTimezoneOffset();
      switch (t) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + formatTimezoneShort(a, ":");
        case "OOOO":
        default:
          return "GMT" + formatTimezone(a, ":");
      }
    },
    z: function (e, t, r, n) {
      var a = (n._originalDate || e).getTimezoneOffset();
      switch (t) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + formatTimezoneShort(a, ":");
        case "zzzz":
        default:
          return "GMT" + formatTimezone(a, ":");
      }
    },
    t: function (e, t, r, n) {
      var a = n._originalDate || e;
      return addLeadingZeros(Math.floor(a.getTime() / 1e3), t.length);
    },
    T: function (e, t, r, n) {
      return addLeadingZeros((n._originalDate || e).getTime(), t.length);
    }
  };

function formatTimezoneShort(e, t) {
  var r = e > 0 ? "-" : "+",
    n = Math.abs(e),
    a = Math.floor(n / 60),
    o = n % 60;
  if (0 === o) return r + String(a);
  var i = t || "";
  return r + String(a) + i + addLeadingZeros(o, 2);
}

function formatTimezoneWithOptionalMinutes(e, t) {
  return e % 60 == 0
    ? (e > 0 ? "-" : "+") + addLeadingZeros(Math.abs(e) / 60, 2)
    : formatTimezone(e, t);
}

function formatTimezone(e, t) {
  var r = t || "",
    n = e > 0 ? "-" : "+",
    a = Math.abs(e);
  return (
    n + addLeadingZeros(Math.floor(a / 60), 2) + r + addLeadingZeros(a % 60, 2)
  );
}

function dateLongFormatter(e, t) {
  switch (e) {
    case "P":
      return t.date({
        width: "short"
      });
    case "PP":
      return t.date({
        width: "medium"
      });
    case "PPP":
      return t.date({
        width: "long"
      });
    case "PPPP":
    default:
      return t.date({
        width: "full"
      });
  }
}

function timeLongFormatter(e, t) {
  switch (e) {
    case "p":
      return t.time({
        width: "short"
      });
    case "pp":
      return t.time({
        width: "medium"
      });
    case "ppp":
      return t.time({
        width: "long"
      });
    case "pppp":
    default:
      return t.time({
        width: "full"
      });
  }
}

function dateTimeLongFormatter(e, t) {
  var r,
    n = e.match(/(P+)(p+)?/),
    a = n[1],
    o = n[2];
  if (!o) return dateLongFormatter(e, t);
  switch (a) {
    case "P":
      r = t.dateTime({
        width: "short"
      });
      break;
    case "PP":
      r = t.dateTime({
        width: "medium"
      });
      break;
    case "PPP":
      r = t.dateTime({
        width: "long"
      });
      break;
    case "PPPP":
    default:
      r = t.dateTime({
        width: "full"
      });
  }
  return r
    .replace("{{date}}", dateLongFormatter(a, t))
    .replace("{{time}}", timeLongFormatter(o, t));
}
var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  },
  protectedDayOfYearTokens = ["D", "DD"],
  protectedWeekYearTokens = ["YY", "YYYY"];

function isProtectedDayOfYearToken(e) {
  return -1 !== protectedDayOfYearTokens.indexOf(e);
}

function isProtectedWeekYearToken(e) {
  return -1 !== protectedWeekYearTokens.indexOf(e);
}

function throwProtectedError(e) {
  if ("YYYY" === e)
    throw new RangeError(
      "Use `yyyy` instead of `YYYY` for formatting years; see: https://git.io/fxCyr"
    );
  if ("YY" === e)
    throw new RangeError(
      "Use `yy` instead of `YY` for formatting years; see: https://git.io/fxCyr"
    );
  if ("D" === e)
    throw new RangeError(
      "Use `d` instead of `D` for formatting days of the month; see: https://git.io/fxCyr"
    );
  if ("DD" === e)
    throw new RangeError(
      "Use `dd` instead of `DD` for formatting days of the month; see: https://git.io/fxCyr"
    );
}
var formattingTokensRegExp =
    /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  escapedStringRegExp = /^'(.*?)'?$/,
  doubleQuoteRegExp = /''/g,
  unescapedLatinCharacterRegExp = /[a-zA-Z]/;

function format(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = String(t),
    a = r || {},
    o = a.locale || locale,
    i = o.options && o.options.firstWeekContainsDate,
    s = null == i ? 1 : toInteger(i),
    u =
      null == a.firstWeekContainsDate ? s : toInteger(a.firstWeekContainsDate);
  if (!(u >= 1 && u <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var l = o.options && o.options.weekStartsOn,
    d = null == l ? 0 : toInteger(l),
    c = null == a.weekStartsOn ? d : toInteger(a.weekStartsOn);
  if (!(c >= 0 && c <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  if (!o.localize)
    throw new RangeError("locale must contain localize property");
  if (!o.formatLong)
    throw new RangeError("locale must contain formatLong property");
  var g = toDate(e);
  if (!isValid(g)) throw new RangeError("Invalid time value");
  var f = subMilliseconds(g, getTimezoneOffsetInMilliseconds(g)),
    h = {
      firstWeekContainsDate: u,
      weekStartsOn: c,
      locale: o,
      _originalDate: g
    };
  return n
    .match(longFormattingTokensRegExp)
    .map(function (e) {
      var t = e[0];
      return "p" === t || "P" === t
        ? (0, longFormatters[t])(e, o.formatLong, h)
        : e;
    })
    .join("")
    .match(formattingTokensRegExp)
    .map(function (e) {
      if ("''" === e) return "'";
      var t = e[0];
      if ("'" === t) return cleanEscapedString(e);
      var r = formatters$1[t];
      if (r)
        return (
          !a.useAdditionalWeekYearTokens &&
            isProtectedWeekYearToken(e) &&
            throwProtectedError(e),
          !a.useAdditionalDayOfYearTokens &&
            isProtectedDayOfYearToken(e) &&
            throwProtectedError(e),
          r(f, e, o.localize, h)
        );
      if (t.match(unescapedLatinCharacterRegExp))
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            t +
            "`"
        );
      return e;
    })
    .join("");
}

function cleanEscapedString(e) {
  return e.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}

function assign(e, t) {
  if (null == e)
    throw new TypeError(
      "assign requires that input parameter not be null or undefined"
    );
  for (var r in (t = t || {})) t.hasOwnProperty(r) && (e[r] = t[r]);
  return e;
}

function cloneObject(e) {
  return assign({}, e);
}
var MINUTES_IN_DAY = 1440,
  MINUTES_IN_ALMOST_TWO_DAYS = 2520,
  MINUTES_IN_MONTH = 43200,
  MINUTES_IN_TWO_MONTHS = 86400;

function formatDistance$1(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = r || {},
    a = n.locale || locale;
  if (!a.formatDistance)
    throw new RangeError("locale must contain formatDistance property");
  var o = compareAsc(e, t);
  if (isNaN(o)) throw new RangeError("Invalid time value");
  var i,
    s,
    u = cloneObject(n);
  (u.addSuffix = Boolean(n.addSuffix)),
    (u.comparison = o),
    o > 0
      ? ((i = toDate(t)), (s = toDate(e)))
      : ((i = toDate(e)), (s = toDate(t)));
  var l,
    d = differenceInSeconds(s, i),
    c =
      (getTimezoneOffsetInMilliseconds(s) -
        getTimezoneOffsetInMilliseconds(i)) /
      1e3,
    g = Math.round((d - c) / 60);
  if (g < 2)
    return n.includeSeconds
      ? d < 5
        ? a.formatDistance("lessThanXSeconds", 5, u)
        : d < 10
          ? a.formatDistance("lessThanXSeconds", 10, u)
          : d < 20
            ? a.formatDistance("lessThanXSeconds", 20, u)
            : d < 40
              ? a.formatDistance("halfAMinute", null, u)
              : d < 60
                ? a.formatDistance("lessThanXMinutes", 1, u)
                : a.formatDistance("xMinutes", 1, u)
      : 0 === g
        ? a.formatDistance("lessThanXMinutes", 1, u)
        : a.formatDistance("xMinutes", g, u);
  if (g < 45) return a.formatDistance("xMinutes", g, u);
  if (g < 90) return a.formatDistance("aboutXHours", 1, u);
  if (g < MINUTES_IN_DAY) {
    var f = Math.round(g / 60);
    return a.formatDistance("aboutXHours", f, u);
  }
  if (g < MINUTES_IN_ALMOST_TWO_DAYS) return a.formatDistance("xDays", 1, u);
  if (g < MINUTES_IN_MONTH) {
    var h = Math.round(g / MINUTES_IN_DAY);
    return a.formatDistance("xDays", h, u);
  }
  if (g < MINUTES_IN_TWO_MONTHS)
    return (
      (l = Math.round(g / MINUTES_IN_MONTH)),
      a.formatDistance("aboutXMonths", l, u)
    );
  if ((l = differenceInMonths(s, i)) < 12) {
    var m = Math.round(g / MINUTES_IN_MONTH);
    return a.formatDistance("xMonths", m, u);
  }
  var w = l % 12,
    p = Math.floor(l / 12);
  return w < 3
    ? a.formatDistance("aboutXYears", p, u)
    : w < 9
      ? a.formatDistance("overXYears", p, u)
      : a.formatDistance("almostXYears", p + 1, u);
}
var MINUTES_IN_DAY$1 = 1440,
  MINUTES_IN_MONTH$1 = 43200,
  MINUTES_IN_YEAR = 525600;

function formatDistanceStrict(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = r || {},
    a = n.locale || locale;
  if (!a.formatDistance)
    throw new RangeError(
      "locale must contain localize.formatDistance property"
    );
  var o = compareAsc(e, t);
  if (isNaN(o)) throw new RangeError("Invalid time value");
  var i,
    s,
    u = cloneObject(n);
  (u.addSuffix = Boolean(n.addSuffix)),
    (u.comparison = o),
    o > 0
      ? ((i = toDate(t)), (s = toDate(e)))
      : ((i = toDate(e)), (s = toDate(t)));
  var l,
    d = null == n.roundingMethod ? "round" : String(n.roundingMethod);
  if ("floor" === d) l = Math.floor;
  else if ("ceil" === d) l = Math.ceil;
  else {
    if ("round" !== d)
      throw new RangeError("roundingMethod must be 'floor', 'ceil' or 'round'");
    l = Math.round;
  }
  var c,
    g = differenceInSeconds(s, i),
    f = l(
      (g -
        (getTimezoneOffsetInMilliseconds(s) -
          getTimezoneOffsetInMilliseconds(i)) /
          1e3) /
        60
    );
  if (
    "second" ===
    (c =
      null == n.unit
        ? f < 1
          ? "second"
          : f < 60
            ? "minute"
            : f < MINUTES_IN_DAY$1
              ? "hour"
              : f < MINUTES_IN_MONTH$1
                ? "day"
                : f < MINUTES_IN_YEAR
                  ? "month"
                  : "year"
        : String(n.unit))
  )
    return a.formatDistance("xSeconds", g, u);
  if ("minute" === c) return a.formatDistance("xMinutes", f, u);
  if ("hour" === c) {
    var h = l(f / 60);
    return a.formatDistance("xHours", h, u);
  }
  if ("day" === c) {
    var m = l(f / MINUTES_IN_DAY$1);
    return a.formatDistance("xDays", m, u);
  }
  if ("month" === c) {
    var w = l(f / MINUTES_IN_MONTH$1);
    return a.formatDistance("xMonths", w, u);
  }
  if ("year" === c) {
    var p = l(f / MINUTES_IN_YEAR);
    return a.formatDistance("xYears", p, u);
  }
  throw new RangeError(
    "unit must be 'second', 'minute', 'hour', 'day', 'month' or 'year'"
  );
}

function formatDistanceToNow(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return formatDistance$1(e, Date.now(), t);
}

function formatRelative$1(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = toDate(e),
    a = toDate(t),
    o = r || {},
    i = o.locale || locale;
  if (!i.localize)
    throw new RangeError("locale must contain localize property");
  if (!i.formatLong)
    throw new RangeError("locale must contain formatLong property");
  if (!i.formatRelative)
    throw new RangeError("locale must contain formatRelative property");
  var s,
    u = differenceInCalendarDays(n, a);
  if (isNaN(u)) throw new RangeError("Invalid time value");
  s =
    u < -6
      ? "other"
      : u < -1
        ? "lastWeek"
        : u < 0
          ? "yesterday"
          : u < 1
            ? "today"
            : u < 2
              ? "tomorrow"
              : u < 7
                ? "nextWeek"
                : "other";
  var l = subMilliseconds(n, getTimezoneOffsetInMilliseconds(n)),
    d = subMilliseconds(a, getTimezoneOffsetInMilliseconds(a));
  return format(n, i.formatRelative(s, l, d, o), o);
}

function fromUnixTime(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(1e3 * toInteger(e));
}

function getDate(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getDate();
}

function getDay(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getDay();
}

function getDayOfYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return differenceInCalendarDays(t, startOfYear(t)) + 1;
}

function isLeapYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e).getFullYear();
  return t % 400 == 0 || (t % 4 == 0 && t % 100 != 0);
}

function getDaysInYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return isNaN(t) ? NaN : isLeapYear(t) ? 366 : 365;
}

function getDecade(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e).getFullYear();
  return 10 * Math.floor(t / 10);
}

function getHours(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getHours();
}

function getISODay(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e).getDay();
  return 0 === t && (t = 7), t;
}
var MILLISECONDS_IN_WEEK$4 = 6048e5;

function getISOWeek(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = startOfISOWeek(t).getTime() - startOfISOWeekYear(t).getTime();
  return Math.round(r / MILLISECONDS_IN_WEEK$4) + 1;
}
var MILLISECONDS_IN_WEEK$5 = 6048e5;

function getISOWeeksInYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = startOfISOWeekYear(e),
    r = startOfISOWeekYear(addWeeks(t, 60)).valueOf() - t.valueOf();
  return Math.round(r / MILLISECONDS_IN_WEEK$5);
}

function getMilliseconds(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getMilliseconds();
}

function getMinutes(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getMinutes();
}

function getMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getMonth();
}
var MILLISECONDS_IN_DAY$2 = 864e5;

function getOverlappingDaysInIntervals(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = e || {},
    n = t || {},
    a = toDate(r.start).getTime(),
    o = toDate(r.end).getTime(),
    i = toDate(n.start).getTime(),
    s = toDate(n.end).getTime();
  if (!(a <= o && i <= s)) throw new RangeError("Invalid interval");
  if (!(a < s && i < o)) return 0;
  var u = (s > o ? o : s) - (i < a ? a : i);
  return Math.ceil(u / MILLISECONDS_IN_DAY$2);
}

function getSeconds(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getSeconds();
}

function getTime(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getTime();
}

function getUnixTime(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return Math.floor(getTime(e) / 1e3);
}

function getWeekYear(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = r.getFullYear(),
    a = t || {},
    o = a.locale,
    i = o && o.options && o.options.firstWeekContainsDate,
    s = null == i ? 1 : toInteger(i),
    u =
      null == a.firstWeekContainsDate ? s : toInteger(a.firstWeekContainsDate);
  if (!(u >= 1 && u <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var l = new Date(0);
  l.setFullYear(n + 1, 0, u), l.setHours(0, 0, 0, 0);
  var d = startOfWeek(l, t),
    c = new Date(0);
  c.setFullYear(n, 0, u), c.setHours(0, 0, 0, 0);
  var g = startOfWeek(c, t);
  return r.getTime() >= d.getTime()
    ? n + 1
    : r.getTime() >= g.getTime()
      ? n
      : n - 1;
}

function startOfWeekYear(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = r.locale,
    a = n && n.options && n.options.firstWeekContainsDate,
    o = null == a ? 1 : toInteger(a),
    i =
      null == r.firstWeekContainsDate ? o : toInteger(r.firstWeekContainsDate),
    s = getWeekYear(e, t),
    u = new Date(0);
  return u.setFullYear(s, 0, i), u.setHours(0, 0, 0, 0), startOfWeek(u, t);
}
var MILLISECONDS_IN_WEEK$6 = 6048e5;

function getWeek(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = startOfWeek(r, t).getTime() - startOfWeekYear(r, t).getTime();
  return Math.round(n / MILLISECONDS_IN_WEEK$6) + 1;
}

function getWeekOfMonth(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = r.locale,
    a = n && n.options && n.options.weekStartsOn,
    o = null == a ? 0 : toInteger(a),
    i = null == r.weekStartsOn ? o : toInteger(r.weekStartsOn);
  if (!(i >= 0 && i <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var s = getDate(e);
  if (isNaN(s)) return s;
  var u = getDay(startOfMonth(e)),
    l = 0,
    d = 1;
  if (s > (l = u >= i ? i + 7 - u : i - u)) {
    var c = s - l;
    d += Math.ceil(c / 7);
  }
  return d;
}

function lastDayOfMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getMonth();
  return t.setFullYear(t.getFullYear(), r + 1, 0), t.setHours(0, 0, 0, 0), t;
}

function getWeeksInMonth(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return differenceInCalendarWeeks(lastDayOfMonth(e), startOfMonth(e), t) + 1;
}

function getYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getFullYear();
}

function isAfter(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return r.getTime() > n.getTime();
}

function isBefore(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return r.getTime() < n.getTime();
}

function isDate(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return (
    e instanceof Date ||
    ("object" == typeof e &&
      "[object Date]" === Object.prototype.toString.call(e))
  );
}

function isEqual(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return r.getTime() === n.getTime();
}

function isFirstDayOfMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 1 === toDate(e).getDate();
}

function isFriday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 5 === toDate(e).getDay();
}

function isFuture(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getTime() > Date.now();
}

function isLastDayOfMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return endOfDay(t).getTime() === endOfMonth(t).getTime();
}

function isMonday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 1 === toDate(e).getDay();
}

function isPast(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return toDate(e).getTime() < Date.now();
}

function startOfHour(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setMinutes(0, 0, 0), t;
}

function isSameHour(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfHour(e),
    n = startOfHour(t);
  return r.getTime() === n.getTime();
}

function isSameWeek(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = startOfWeek(e, r),
    a = startOfWeek(t, r);
  return n.getTime() === a.getTime();
}

function isSameISOWeek(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return isSameWeek(e, t, {
    weekStartsOn: 1
  });
}

function isSameISOWeekYear(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfISOWeekYear(e),
    n = startOfISOWeekYear(t);
  return r.getTime() === n.getTime();
}

function startOfMinute(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setSeconds(0, 0), t;
}

function isSameMinute(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfMinute(e),
    n = startOfMinute(t);
  return r.getTime() === n.getTime();
}

function isSameMonth(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return r.getFullYear() === n.getFullYear() && r.getMonth() === n.getMonth();
}

function startOfQuarter(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getMonth(),
    n = r - (r % 3);
  return t.setMonth(n, 1), t.setHours(0, 0, 0, 0), t;
}

function isSameQuarter(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfQuarter(e),
    n = startOfQuarter(t);
  return r.getTime() === n.getTime();
}

function startOfSecond(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e);
  return t.setMilliseconds(0), t;
}

function isSameSecond(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = startOfSecond(e),
    n = startOfSecond(t);
  return r.getTime() === n.getTime();
}

function isSameYear(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toDate(t);
  return r.getFullYear() === n.getFullYear();
}

function isSaturday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 6 === toDate(e).getDay();
}

function isThisHour(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameHour(Date.now(), e);
}

function isThisISOWeek(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameISOWeek(e, Date.now());
}

function isThisMinute(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameMinute(Date.now(), e);
}

function isThisMonth(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameMonth(Date.now(), e);
}

function isThisQuarter(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameQuarter(Date.now(), e);
}

function isThisSecond(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameSecond(Date.now(), e);
}

function isThisWeek(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameWeek(e, Date.now(), t);
}

function isThisYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameYear(e, Date.now());
}

function isThursday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 4 === toDate(e).getDay();
}

function isToday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameDay(e, Date.now());
}

function isTomorrow(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameDay(e, addDays(Date.now(), 1));
}

function isTuesday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 2 === toDate(e).getDay();
}

function isWednesday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return 3 === toDate(e).getDay();
}

function isWithinInterval(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = toDate(e).getTime(),
    a = toDate(r.start).getTime(),
    o = toDate(r.end).getTime();
  if (!(a <= o)) throw new RangeError("Invalid interval");
  return n >= a && n <= o;
}

function subDays(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addDays(e, -toInteger(t));
}

function isYesterday(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return isSameDay(e, subDays(Date.now(), 1));
}

function lastDayOfDecade(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getFullYear(),
    n = 9 + 10 * Math.floor(r / 10);
  return t.setFullYear(n + 1, 0, 0), t.setHours(0, 0, 0, 0), t;
}

function lastDayOfWeek(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n = r.locale,
    a = n && n.options && n.options.weekStartsOn,
    o = null == a ? 0 : toInteger(a),
    i = null == r.weekStartsOn ? o : toInteger(r.weekStartsOn);
  if (!(i >= 0 && i <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6");
  var s = toDate(e),
    u = s.getDay(),
    l = 6 + (u < i ? -7 : 0) - (u - i);
  return s.setHours(0, 0, 0, 0), s.setDate(s.getDate() + l), s;
}

function lastDayOfISOWeek(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  return lastDayOfWeek(e, {
    weekStartsOn: 1
  });
}

function lastDayOfISOWeekYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = getISOWeekYear(e),
    r = new Date(0);
  r.setFullYear(t + 1, 0, 4), r.setHours(0, 0, 0, 0);
  var n = startOfISOWeek(r);
  return n.setDate(n.getDate() - 1), n;
}

function lastDayOfQuarter(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getMonth(),
    n = r - (r % 3) + 3;
  return t.setMonth(n, 0), t.setHours(0, 0, 0, 0), t;
}

function lastDayOfYear(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getFullYear();
  return t.setFullYear(r + 1, 0, 0), t.setHours(0, 0, 0, 0), t;
}
var formattingTokensRegExp$1 = /(\w)\1*|''|'(''|[^'])+('|$)|./g,
  escapedStringRegExp$1 = /^'(.*?)'?$/,
  doubleQuoteRegExp$1 = /''/g,
  unescapedLatinCharacterRegExp$1 = /[a-zA-Z]/;

function lightFormat(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = String(t),
    n = toDate(e);
  if (!isValid(n)) throw new RangeError("Invalid time value");
  var a = subMilliseconds(n, getTimezoneOffsetInMilliseconds(n));
  return r
    .match(formattingTokensRegExp$1)
    .map(function (e) {
      if ("''" === e) return "'";
      var t = e[0];
      if ("'" === t) return cleanEscapedString$1(e);
      var r = formatters[t];
      if (r) return r(a, e, null, {});
      if (t.match(unescapedLatinCharacterRegExp$1))
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            t +
            "`"
        );
      return e;
    })
    .join("");
}

function cleanEscapedString$1(e) {
  return e.match(escapedStringRegExp$1)[1].replace(doubleQuoteRegExp$1, "'");
}

function max(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t, r;
  if (e && "function" == typeof e.forEach) t = e;
  else {
    if ("object" != typeof e || null === e) return new Date(NaN);
    t = Array.prototype.slice.call(e);
  }
  return (
    t.forEach(function (e) {
      var t = toDate(e);
      (void 0 === r || r < t || isNaN(t)) && (r = t);
    }),
    r || new Date(NaN)
  );
}

function min(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t, r;
  if (e && "function" == typeof e.forEach) t = e;
  else {
    if ("object" != typeof e || null === e) return new Date(NaN);
    t = Array.prototype.slice.call(e);
  }
  return (
    t.forEach(function (e) {
      var t = toDate(e);
      (void 0 === r || r > t || isNaN(t)) && (r = t);
    }),
    r || new Date(NaN)
  );
}

function setUTCDay(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = r || {},
    a = n.locale,
    o = a && a.options && a.options.weekStartsOn,
    i = null == o ? 0 : toInteger(o),
    s = null == n.weekStartsOn ? i : toInteger(n.weekStartsOn);
  if (!(s >= 0 && s <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var u = toDate(e),
    l = toInteger(t),
    d = (((l % 7) + 7) % 7 < s ? 7 : 0) + l - u.getUTCDay();
  return u.setUTCDate(u.getUTCDate() + d), u;
}

function setUTCISODay(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toInteger(t);
  r % 7 == 0 && (r -= 7);
  var n = toDate(e),
    a = (((r % 7) + 7) % 7 < 1 ? 7 : 0) + r - n.getUTCDay();
  return n.setUTCDate(n.getUTCDate() + a), n;
}

function setUTCISOWeek(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t),
    a = getUTCISOWeek(r) - n;
  return r.setUTCDate(r.getUTCDate() - 7 * a), r;
}

function setUTCWeek(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = toDate(e),
    a = toInteger(t),
    o = getUTCWeek(n, r) - a;
  return n.setUTCDate(n.getUTCDate() - 7 * o), n;
}
var MILLISECONDS_IN_HOUR$2 = 36e5,
  MILLISECONDS_IN_MINUTE$3 = 6e4,
  MILLISECONDS_IN_SECOND = 1e3,
  numericPatterns = {
    month: /^(1[0-2]|0?\d)/,
    date: /^(3[0-1]|[0-2]?\d)/,
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    week: /^(5[0-3]|[0-4]?\d)/,
    hour23h: /^(2[0-3]|[0-1]?\d)/,
    hour24h: /^(2[0-4]|[0-1]?\d)/,
    hour11h: /^(1[0-1]|0?\d)/,
    hour12h: /^(1[0-2]|0?\d)/,
    minute: /^[0-5]?\d/,
    second: /^[0-5]?\d/,
    singleDigit: /^\d/,
    twoDigits: /^\d{1,2}/,
    threeDigits: /^\d{1,3}/,
    fourDigits: /^\d{1,4}/,
    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/,
    twoDigitsSigned: /^-?\d{1,2}/,
    threeDigitsSigned: /^-?\d{1,3}/,
    fourDigitsSigned: /^-?\d{1,4}/
  },
  timezonePatterns = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
  };

function parseNumericPattern(e, t, r) {
  var n = t.match(e);
  if (!n) return null;
  var a = parseInt(n[0], 10);
  return {
    value: r ? r(a) : a,
    rest: t.slice(n[0].length)
  };
}

function parseTimezonePattern(e, t) {
  var r = t.match(e);
  if (!r) return null;
  if ("Z" === r[0])
    return {
      value: 0,
      rest: t.slice(1)
    };
  var n = "+" === r[1] ? 1 : -1,
    a = r[2] ? parseInt(r[2], 10) : 0,
    o = r[3] ? parseInt(r[3], 10) : 0,
    i = r[5] ? parseInt(r[5], 10) : 0;
  return {
    value:
      n *
      (a * MILLISECONDS_IN_HOUR$2 +
        o * MILLISECONDS_IN_MINUTE$3 +
        i * MILLISECONDS_IN_SECOND),
    rest: t.slice(r[0].length)
  };
}

function parseAnyDigitsSigned(e, t) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, e, t);
}

function parseNDigits(e, t, r) {
  switch (e) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, t, r);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, t, r);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, t, r);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, t, r);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + e + "}"), t, r);
  }
}

function parseNDigitsSigned(e, t, r) {
  switch (e) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, t, r);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, t, r);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, t, r);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, t, r);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + e + "}"), t, r);
  }
}

function dayPeriodEnumToHours(e) {
  switch (e) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}

function normalizeTwoDigitYear(e, t) {
  var r,
    n = t > 0,
    a = n ? t : 1 - t;
  if (a <= 50) r = e || 100;
  else {
    var o = a + 50;
    r = e + 100 * Math.floor(o / 100) - (e >= o % 100 ? 100 : 0);
  }
  return n ? r : 1 - r;
}
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYearIndex(e) {
  return e % 400 == 0 || (e % 4 == 0 && e % 100 != 0);
}
var parsers = {
    G: {
      priority: 140,
      parse: function (e, t, r, n) {
        switch (t) {
          case "G":
          case "GG":
          case "GGG":
            return (
              r.era(e, {
                width: "abbreviated"
              }) ||
              r.era(e, {
                width: "narrow"
              })
            );
          case "GGGGG":
            return r.era(e, {
              width: "narrow"
            });
          case "GGGG":
          default:
            return (
              r.era(e, {
                width: "wide"
              }) ||
              r.era(e, {
                width: "abbreviated"
              }) ||
              r.era(e, {
                width: "narrow"
              })
            );
        }
      },
      set: function (e, t, r, n) {
        return (
          (t.era = r), e.setUTCFullYear(r, 0, 1), e.setUTCHours(0, 0, 0, 0), e
        );
      },
      incompatibleTokens: ["R", "u", "t", "T"]
    },
    y: {
      priority: 130,
      parse: function (e, t, r, n) {
        var a = function (e) {
          return {
            year: e,
            isTwoDigitYear: "yy" === t
          };
        };
        switch (t) {
          case "y":
            return parseNDigits(4, e, a);
          case "yo":
            return r.ordinalNumber(e, {
              unit: "year",
              valueCallback: a
            });
          default:
            return parseNDigits(t.length, e, a);
        }
      },
      validate: function (e, t, r) {
        return t.isTwoDigitYear || t.year > 0;
      },
      set: function (e, t, r, n) {
        var a = e.getUTCFullYear();
        if (r.isTwoDigitYear) {
          var o = normalizeTwoDigitYear(r.year, a);
          return e.setUTCFullYear(o, 0, 1), e.setUTCHours(0, 0, 0, 0), e;
        }
        var i = "era" in t && 1 !== t.era ? 1 - r.year : r.year;
        return e.setUTCFullYear(i, 0, 1), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]
    },
    Y: {
      priority: 130,
      parse: function (e, t, r, n) {
        var a = function (e) {
          return {
            year: e,
            isTwoDigitYear: "YY" === t
          };
        };
        switch (t) {
          case "Y":
            return parseNDigits(4, e, a);
          case "Yo":
            return r.ordinalNumber(e, {
              unit: "year",
              valueCallback: a
            });
          default:
            return parseNDigits(t.length, e, a);
        }
      },
      validate: function (e, t, r) {
        return t.isTwoDigitYear || t.year > 0;
      },
      set: function (e, t, r, n) {
        var a = getUTCWeekYear(e, n);
        if (r.isTwoDigitYear) {
          var o = normalizeTwoDigitYear(r.year, a);
          return (
            e.setUTCFullYear(o, 0, n.firstWeekContainsDate),
            e.setUTCHours(0, 0, 0, 0),
            startOfUTCWeek(e, n)
          );
        }
        var i = "era" in t && 1 !== t.era ? 1 - r.year : r.year;
        return (
          e.setUTCFullYear(i, 0, n.firstWeekContainsDate),
          e.setUTCHours(0, 0, 0, 0),
          startOfUTCWeek(e, n)
        );
      },
      incompatibleTokens: [
        "y",
        "R",
        "u",
        "Q",
        "q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "i",
        "t",
        "T"
      ]
    },
    R: {
      priority: 130,
      parse: function (e, t, r, n) {
        return parseNDigitsSigned("R" === t ? 4 : t.length, e);
      },
      set: function (e, t, r, n) {
        var a = new Date(0);
        return (
          a.setUTCFullYear(r, 0, 4),
          a.setUTCHours(0, 0, 0, 0),
          startOfUTCISOWeek(a)
        );
      },
      incompatibleTokens: [
        "G",
        "y",
        "Y",
        "u",
        "Q",
        "q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    u: {
      priority: 130,
      parse: function (e, t, r, n) {
        return parseNDigitsSigned("u" === t ? 4 : t.length, e);
      },
      set: function (e, t, r, n) {
        return e.setUTCFullYear(r, 0, 1), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "G",
        "y",
        "Y",
        "R",
        "w",
        "I",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    Q: {
      priority: 120,
      parse: function (e, t, r, n) {
        switch (t) {
          case "Q":
          case "QQ":
            return parseNDigits(t.length, e);
          case "Qo":
            return r.ordinalNumber(e, {
              unit: "quarter"
            });
          case "QQQ":
            return (
              r.quarter(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.quarter(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "QQQQQ":
            return r.quarter(e, {
              width: "narrow",
              context: "formatting"
            });
          case "QQQQ":
          default:
            return (
              r.quarter(e, {
                width: "wide",
                context: "formatting"
              }) ||
              r.quarter(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.quarter(e, {
                width: "narrow",
                context: "formatting"
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 1 && t <= 4;
      },
      set: function (e, t, r, n) {
        return e.setUTCMonth(3 * (r - 1), 1), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "Y",
        "R",
        "q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    q: {
      priority: 120,
      parse: function (e, t, r, n) {
        switch (t) {
          case "q":
          case "qq":
            return parseNDigits(t.length, e);
          case "qo":
            return r.ordinalNumber(e, {
              unit: "quarter"
            });
          case "qqq":
            return (
              r.quarter(e, {
                width: "abbreviated",
                context: "standalone"
              }) ||
              r.quarter(e, {
                width: "narrow",
                context: "standalone"
              })
            );
          case "qqqqq":
            return r.quarter(e, {
              width: "narrow",
              context: "standalone"
            });
          case "qqqq":
          default:
            return (
              r.quarter(e, {
                width: "wide",
                context: "standalone"
              }) ||
              r.quarter(e, {
                width: "abbreviated",
                context: "standalone"
              }) ||
              r.quarter(e, {
                width: "narrow",
                context: "standalone"
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 1 && t <= 4;
      },
      set: function (e, t, r, n) {
        return e.setUTCMonth(3 * (r - 1), 1), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "Y",
        "R",
        "Q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    M: {
      priority: 110,
      parse: function (e, t, r, n) {
        var a = function (e) {
          return e - 1;
        };
        switch (t) {
          case "M":
            return parseNumericPattern(numericPatterns.month, e, a);
          case "MM":
            return parseNDigits(2, e, a);
          case "Mo":
            return r.ordinalNumber(e, {
              unit: "month",
              valueCallback: a
            });
          case "MMM":
            return (
              r.month(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.month(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "MMMMM":
            return r.month(e, {
              width: "narrow",
              context: "formatting"
            });
          case "MMMM":
          default:
            return (
              r.month(e, {
                width: "wide",
                context: "formatting"
              }) ||
              r.month(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.month(e, {
                width: "narrow",
                context: "formatting"
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 11;
      },
      set: function (e, t, r, n) {
        return e.setUTCMonth(r, 1), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "Y",
        "R",
        "q",
        "Q",
        "L",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    L: {
      priority: 110,
      parse: function (e, t, r, n) {
        var a = function (e) {
          return e - 1;
        };
        switch (t) {
          case "L":
            return parseNumericPattern(numericPatterns.month, e, a);
          case "LL":
            return parseNDigits(2, e, a);
          case "Lo":
            return r.ordinalNumber(e, {
              unit: "month",
              valueCallback: a
            });
          case "LLL":
            return (
              r.month(e, {
                width: "abbreviated",
                context: "standalone"
              }) ||
              r.month(e, {
                width: "narrow",
                context: "standalone"
              })
            );
          case "LLLLL":
            return r.month(e, {
              width: "narrow",
              context: "standalone"
            });
          case "LLLL":
          default:
            return (
              r.month(e, {
                width: "wide",
                context: "standalone"
              }) ||
              r.month(e, {
                width: "abbreviated",
                context: "standalone"
              }) ||
              r.month(e, {
                width: "narrow",
                context: "standalone"
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 11;
      },
      set: function (e, t, r, n) {
        return e.setUTCMonth(r, 1), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "Y",
        "R",
        "q",
        "Q",
        "M",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    w: {
      priority: 100,
      parse: function (e, t, r, n) {
        switch (t) {
          case "w":
            return parseNumericPattern(numericPatterns.week, e);
          case "wo":
            return r.ordinalNumber(e, {
              unit: "week"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 1 && t <= 53;
      },
      set: function (e, t, r, n) {
        return startOfUTCWeek(setUTCWeek(e, r, n), n);
      },
      incompatibleTokens: [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "i",
        "t",
        "T"
      ]
    },
    I: {
      priority: 100,
      parse: function (e, t, r, n) {
        switch (t) {
          case "I":
            return parseNumericPattern(numericPatterns.week, e);
          case "Io":
            return r.ordinalNumber(e, {
              unit: "week"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 1 && t <= 53;
      },
      set: function (e, t, r, n) {
        return startOfUTCISOWeek(setUTCISOWeek(e, r, n), n);
      },
      incompatibleTokens: [
        "y",
        "Y",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    d: {
      priority: 90,
      parse: function (e, t, r, n) {
        switch (t) {
          case "d":
            return parseNumericPattern(numericPatterns.date, e);
          case "do":
            return r.ordinalNumber(e, {
              unit: "date"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        var n = isLeapYearIndex(e.getUTCFullYear()),
          a = e.getUTCMonth();
        return n
          ? t >= 1 && t <= DAYS_IN_MONTH_LEAP_YEAR[a]
          : t >= 1 && t <= DAYS_IN_MONTH[a];
      },
      set: function (e, t, r, n) {
        return e.setUTCDate(r), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "Y",
        "R",
        "q",
        "Q",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    D: {
      priority: 90,
      parse: function (e, t, r, n) {
        switch (t) {
          case "D":
          case "DD":
            return parseNumericPattern(numericPatterns.dayOfYear, e);
          case "Do":
            return r.ordinalNumber(e, {
              unit: "date"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return isLeapYearIndex(e.getUTCFullYear())
          ? t >= 1 && t <= 366
          : t >= 1 && t <= 365;
      },
      set: function (e, t, r, n) {
        return e.setUTCMonth(0, r), e.setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "Y",
        "R",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "E",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    E: {
      priority: 90,
      parse: function (e, t, r, n) {
        switch (t) {
          case "E":
          case "EE":
          case "EEE":
            return (
              r.day(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "short",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "EEEEE":
            return r.day(e, {
              width: "narrow",
              context: "formatting"
            });
          case "EEEEEE":
            return (
              r.day(e, {
                width: "short",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "EEEE":
          default:
            return (
              r.day(e, {
                width: "wide",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "short",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting"
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 6;
      },
      set: function (e, t, r, n) {
        return (e = setUTCDay(e, r, n)).setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: ["D", "i", "e", "c", "t", "T"]
    },
    e: {
      priority: 90,
      parse: function (e, t, r, n) {
        var a = function (e) {
          var t = 7 * Math.floor((e - 1) / 7);
          return ((e + n.weekStartsOn + 6) % 7) + t;
        };
        switch (t) {
          case "e":
          case "ee":
            return parseNDigits(t.length, e, a);
          case "eo":
            return r.ordinalNumber(e, {
              unit: "day",
              valueCallback: a
            });
          case "eee":
            return (
              r.day(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "short",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "eeeee":
            return r.day(e, {
              width: "narrow",
              context: "formatting"
            });
          case "eeeeee":
            return (
              r.day(e, {
                width: "short",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "eeee":
          default:
            return (
              r.day(e, {
                width: "wide",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "short",
                context: "formatting"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting"
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 6;
      },
      set: function (e, t, r, n) {
        return (e = setUTCDay(e, r, n)).setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "E",
        "i",
        "c",
        "t",
        "T"
      ]
    },
    c: {
      priority: 90,
      parse: function (e, t, r, n) {
        var a = function (e) {
          var t = 7 * Math.floor((e - 1) / 7);
          return ((e + n.weekStartsOn + 6) % 7) + t;
        };
        switch (t) {
          case "c":
          case "cc":
            return parseNDigits(t.length, e, a);
          case "co":
            return r.ordinalNumber(e, {
              unit: "day",
              valueCallback: a
            });
          case "ccc":
            return (
              r.day(e, {
                width: "abbreviated",
                context: "standalone"
              }) ||
              r.day(e, {
                width: "short",
                context: "standalone"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "standalone"
              })
            );
          case "ccccc":
            return r.day(e, {
              width: "narrow",
              context: "standalone"
            });
          case "cccccc":
            return (
              r.day(e, {
                width: "short",
                context: "standalone"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "standalone"
              })
            );
          case "cccc":
          default:
            return (
              r.day(e, {
                width: "wide",
                context: "standalone"
              }) ||
              r.day(e, {
                width: "abbreviated",
                context: "standalone"
              }) ||
              r.day(e, {
                width: "short",
                context: "standalone"
              }) ||
              r.day(e, {
                width: "narrow",
                context: "standalone"
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 6;
      },
      set: function (e, t, r, n) {
        return (e = setUTCDay(e, r, n)).setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "E",
        "i",
        "e",
        "t",
        "T"
      ]
    },
    i: {
      priority: 90,
      parse: function (e, t, r, n) {
        var a = function (e) {
          return 0 === e ? 7 : e;
        };
        switch (t) {
          case "i":
          case "ii":
            return parseNDigits(t.length, e);
          case "io":
            return r.ordinalNumber(e, {
              unit: "day"
            });
          case "iii":
            return (
              r.day(e, {
                width: "abbreviated",
                context: "formatting",
                valueCallback: a
              }) ||
              r.day(e, {
                width: "short",
                context: "formatting",
                valueCallback: a
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting",
                valueCallback: a
              })
            );
          case "iiiii":
            return r.day(e, {
              width: "narrow",
              context: "formatting",
              valueCallback: a
            });
          case "iiiiii":
            return (
              r.day(e, {
                width: "short",
                context: "formatting",
                valueCallback: a
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting",
                valueCallback: a
              })
            );
          case "iiii":
          default:
            return (
              r.day(e, {
                width: "wide",
                context: "formatting",
                valueCallback: a
              }) ||
              r.day(e, {
                width: "abbreviated",
                context: "formatting",
                valueCallback: a
              }) ||
              r.day(e, {
                width: "short",
                context: "formatting",
                valueCallback: a
              }) ||
              r.day(e, {
                width: "narrow",
                context: "formatting",
                valueCallback: a
              })
            );
        }
      },
      validate: function (e, t, r) {
        return t >= 1 && t <= 7;
      },
      set: function (e, t, r, n) {
        return (e = setUTCISODay(e, r, n)).setUTCHours(0, 0, 0, 0), e;
      },
      incompatibleTokens: [
        "y",
        "Y",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "E",
        "e",
        "c",
        "t",
        "T"
      ]
    },
    a: {
      priority: 80,
      parse: function (e, t, r, n) {
        switch (t) {
          case "a":
          case "aa":
          case "aaa":
            return (
              r.dayPeriod(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "aaaaa":
            return r.dayPeriod(e, {
              width: "narrow",
              context: "formatting"
            });
          case "aaaa":
          default:
            return (
              r.dayPeriod(e, {
                width: "wide",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "narrow",
                context: "formatting"
              })
            );
        }
      },
      set: function (e, t, r, n) {
        return e.setUTCHours(dayPeriodEnumToHours(r), 0, 0, 0), e;
      },
      incompatibleTokens: ["b", "B", "H", "K", "k", "t", "T"]
    },
    b: {
      priority: 80,
      parse: function (e, t, r, n) {
        switch (t) {
          case "b":
          case "bb":
          case "bbb":
            return (
              r.dayPeriod(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "bbbbb":
            return r.dayPeriod(e, {
              width: "narrow",
              context: "formatting"
            });
          case "bbbb":
          default:
            return (
              r.dayPeriod(e, {
                width: "wide",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "narrow",
                context: "formatting"
              })
            );
        }
      },
      set: function (e, t, r, n) {
        return e.setUTCHours(dayPeriodEnumToHours(r), 0, 0, 0), e;
      },
      incompatibleTokens: ["a", "B", "H", "K", "k", "t", "T"]
    },
    B: {
      priority: 80,
      parse: function (e, t, r, n) {
        switch (t) {
          case "B":
          case "BB":
          case "BBB":
            return (
              r.dayPeriod(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "narrow",
                context: "formatting"
              })
            );
          case "BBBBB":
            return r.dayPeriod(e, {
              width: "narrow",
              context: "formatting"
            });
          case "BBBB":
          default:
            return (
              r.dayPeriod(e, {
                width: "wide",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "abbreviated",
                context: "formatting"
              }) ||
              r.dayPeriod(e, {
                width: "narrow",
                context: "formatting"
              })
            );
        }
      },
      set: function (e, t, r, n) {
        return e.setUTCHours(dayPeriodEnumToHours(r), 0, 0, 0), e;
      },
      incompatibleTokens: ["a", "b", "t", "T"]
    },
    h: {
      priority: 70,
      parse: function (e, t, r, n) {
        switch (t) {
          case "h":
            return parseNumericPattern(numericPatterns.hour12h, e);
          case "ho":
            return r.ordinalNumber(e, {
              unit: "hour"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 1 && t <= 12;
      },
      set: function (e, t, r, n) {
        var a = e.getUTCHours() >= 12;
        return (
          a && r < 12
            ? e.setUTCHours(r + 12, 0, 0, 0)
            : a || 12 !== r
              ? e.setUTCHours(r, 0, 0, 0)
              : e.setUTCHours(0, 0, 0, 0),
          e
        );
      },
      incompatibleTokens: ["H", "K", "k", "t", "T"]
    },
    H: {
      priority: 70,
      parse: function (e, t, r, n) {
        switch (t) {
          case "H":
            return parseNumericPattern(numericPatterns.hour23h, e);
          case "Ho":
            return r.ordinalNumber(e, {
              unit: "hour"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 23;
      },
      set: function (e, t, r, n) {
        return e.setUTCHours(r, 0, 0, 0), e;
      },
      incompatibleTokens: ["a", "b", "h", "K", "k", "t", "T"]
    },
    K: {
      priority: 70,
      parse: function (e, t, r, n) {
        switch (t) {
          case "K":
            return parseNumericPattern(numericPatterns.hour11h, e);
          case "Ko":
            return r.ordinalNumber(e, {
              unit: "hour"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 11;
      },
      set: function (e, t, r, n) {
        return (
          e.getUTCHours() >= 12 && r < 12
            ? e.setUTCHours(r + 12, 0, 0, 0)
            : e.setUTCHours(r, 0, 0, 0),
          e
        );
      },
      incompatibleTokens: ["a", "b", "h", "H", "k", "t", "T"]
    },
    k: {
      priority: 70,
      parse: function (e, t, r, n) {
        switch (t) {
          case "k":
            return parseNumericPattern(numericPatterns.hour24h, e);
          case "ko":
            return r.ordinalNumber(e, {
              unit: "hour"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 1 && t <= 24;
      },
      set: function (e, t, r, n) {
        var a = r <= 24 ? r % 24 : r;
        return e.setUTCHours(a, 0, 0, 0), e;
      },
      incompatibleTokens: ["a", "b", "h", "H", "K", "t", "T"]
    },
    m: {
      priority: 60,
      parse: function (e, t, r, n) {
        switch (t) {
          case "m":
            return parseNumericPattern(numericPatterns.minute, e);
          case "mo":
            return r.ordinalNumber(e, {
              unit: "minute"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 59;
      },
      set: function (e, t, r, n) {
        return e.setUTCMinutes(r, 0, 0), e;
      },
      incompatibleTokens: ["t", "T"]
    },
    s: {
      priority: 50,
      parse: function (e, t, r, n) {
        switch (t) {
          case "s":
            return parseNumericPattern(numericPatterns.second, e);
          case "so":
            return r.ordinalNumber(e, {
              unit: "second"
            });
          default:
            return parseNDigits(t.length, e);
        }
      },
      validate: function (e, t, r) {
        return t >= 0 && t <= 59;
      },
      set: function (e, t, r, n) {
        return e.setUTCSeconds(r, 0), e;
      },
      incompatibleTokens: ["t", "T"]
    },
    S: {
      priority: 30,
      parse: function (e, t, r, n) {
        return parseNDigits(t.length, e, function (e) {
          return Math.floor(e * Math.pow(10, 3 - t.length));
        });
      },
      set: function (e, t, r, n) {
        return e.setUTCMilliseconds(r), e;
      },
      incompatibleTokens: ["t", "T"]
    },
    X: {
      priority: 10,
      parse: function (e, t, r, n) {
        switch (t) {
          case "X":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalMinutes,
              e
            );
          case "XX":
            return parseTimezonePattern(timezonePatterns.basic, e);
          case "XXXX":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalSeconds,
              e
            );
          case "XXXXX":
            return parseTimezonePattern(
              timezonePatterns.extendedOptionalSeconds,
              e
            );
          case "XXX":
          default:
            return parseTimezonePattern(timezonePatterns.extended, e);
        }
      },
      set: function (e, t, r, n) {
        return t.timestampIsSet ? e : new Date(e.getTime() - r);
      },
      incompatibleTokens: ["t", "T", "x"]
    },
    x: {
      priority: 10,
      parse: function (e, t, r, n) {
        switch (t) {
          case "x":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalMinutes,
              e
            );
          case "xx":
            return parseTimezonePattern(timezonePatterns.basic, e);
          case "xxxx":
            return parseTimezonePattern(
              timezonePatterns.basicOptionalSeconds,
              e
            );
          case "xxxxx":
            return parseTimezonePattern(
              timezonePatterns.extendedOptionalSeconds,
              e
            );
          case "xxx":
          default:
            return parseTimezonePattern(timezonePatterns.extended, e);
        }
      },
      set: function (e, t, r, n) {
        return t.timestampIsSet ? e : new Date(e.getTime() - r);
      },
      incompatibleTokens: ["t", "T", "X"]
    },
    t: {
      priority: 40,
      parse: function (e, t, r, n) {
        return parseAnyDigitsSigned(e);
      },
      set: function (e, t, r, n) {
        return [
          new Date(1e3 * r),
          {
            timestampIsSet: !0
          }
        ];
      },
      incompatibleTokens: "*"
    },
    T: {
      priority: 20,
      parse: function (e, t, r, n) {
        return parseAnyDigitsSigned(e);
      },
      set: function (e, t, r, n) {
        return [
          new Date(r),
          {
            timestampIsSet: !0
          }
        ];
      },
      incompatibleTokens: "*"
    }
  },
  TIMEZONE_UNIT_PRIORITY = 10,
  formattingTokensRegExp$2 =
    /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  longFormattingTokensRegExp$1 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  escapedStringRegExp$2 = /^'(.*?)'?$/,
  doubleQuoteRegExp$2 = /''/g,
  notWhitespaceRegExp = /\S/,
  unescapedLatinCharacterRegExp$2 = /[a-zA-Z]/;

function parse(e, t, r, n) {
  if (arguments.length < 3)
    throw new TypeError(
      "3 arguments required, but only " + arguments.length + " present"
    );
  var a = String(e),
    o = String(t),
    i = n || {},
    s = i.locale || locale;
  if (!s.match) throw new RangeError("locale must contain match property");
  var u = s.options && s.options.firstWeekContainsDate,
    l = null == u ? 1 : toInteger(u),
    d =
      null == i.firstWeekContainsDate ? l : toInteger(i.firstWeekContainsDate);
  if (!(d >= 1 && d <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var c = s.options && s.options.weekStartsOn,
    g = null == c ? 0 : toInteger(c),
    f = null == i.weekStartsOn ? g : toInteger(i.weekStartsOn);
  if (!(f >= 0 && f <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  if ("" === o) return "" === a ? toDate(r) : new Date(NaN);
  var h,
    m = {
      firstWeekContainsDate: d,
      weekStartsOn: f,
      locale: s
    },
    w = [
      {
        priority: TIMEZONE_UNIT_PRIORITY,
        set: dateToSystemTimezone,
        index: 0
      }
    ],
    p = o
      .match(longFormattingTokensRegExp$1)
      .map(function (e) {
        var t = e[0];
        return "p" === t || "P" === t
          ? (0, longFormatters[t])(e, s.formatLong, m)
          : e;
      })
      .join("")
      .match(formattingTokensRegExp$2),
    y = [];
  for (h = 0; h < p.length; h++) {
    var T = p[h];
    !i.useAdditionalWeekYearTokens &&
      isProtectedWeekYearToken(T) &&
      throwProtectedError(T),
      !i.useAdditionalDayOfYearTokens &&
        isProtectedDayOfYearToken(T) &&
        throwProtectedError(T);
    var D = T[0],
      b = parsers[D];
    if (b) {
      var v = b.incompatibleTokens;
      if (Array.isArray(v)) {
        for (var I = void 0, O = 0; O < y.length; O++) {
          var E = y[O].token;
          if (-1 !== v.indexOf(E) || E === D) {
            I = y[O];
            break;
          }
        }
        if (I)
          throw new RangeError(
            "The format string mustn't contain `"
              .concat(I.fullToken, "` and `")
              .concat(T, "` at the same time")
          );
      } else if ("*" === b.incompatibleTokens && y.length)
        throw new RangeError(
          "The format string mustn't contain `".concat(
            T,
            "` and any other token at the same time"
          )
        );
      y.push({
        token: D,
        fullToken: T
      });
      var M = b.parse(a, T, s.match, m);
      if (!M) return new Date(NaN);
      w.push({
        priority: b.priority,
        set: b.set,
        validate: b.validate,
        value: M.value,
        index: w.length
      }),
        (a = M.rest);
    } else {
      if (D.match(unescapedLatinCharacterRegExp$2))
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            D +
            "`"
        );
      if (
        ("''" === T ? (T = "'") : "'" === D && (T = cleanEscapedString$2(T)),
        0 !== a.indexOf(T))
      )
        return new Date(NaN);
      a = a.slice(T.length);
    }
  }
  if (a.length > 0 && notWhitespaceRegExp.test(a)) return new Date(NaN);
  var S = w
      .map(function (e) {
        return e.priority;
      })
      .sort(function (e, t) {
        return t - e;
      })
      .filter(function (e, t, r) {
        return r.indexOf(e) === t;
      })
      .map(function (e) {
        return w
          .filter(function (t) {
            return t.priority === e;
          })
          .reverse();
      })
      .map(function (e) {
        return e[0];
      }),
    k = toDate(r);
  if (isNaN(k)) return new Date(NaN);
  var N = subMilliseconds(k, getTimezoneOffsetInMilliseconds(k)),
    C = {};
  for (h = 0; h < S.length; h++) {
    var Y = S[h];
    if (Y.validate && !Y.validate(N, Y.value, m)) return new Date(NaN);
    var W = Y.set(N, C, Y.value, m);
    W[0] ? ((N = W[0]), assign(C, W[1])) : (N = W);
  }
  return N;
}

function dateToSystemTimezone(e, t) {
  if (t.timestampIsSet) return e;
  var r = new Date(0);
  return (
    r.setFullYear(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()),
    r.setHours(
      e.getUTCHours(),
      e.getUTCMinutes(),
      e.getUTCSeconds(),
      e.getUTCMilliseconds()
    ),
    r
  );
}

function cleanEscapedString$2(e) {
  return e.match(escapedStringRegExp$2)[1].replace(doubleQuoteRegExp$2, "'");
}
var MILLISECONDS_IN_HOUR$3 = 36e5,
  MILLISECONDS_IN_MINUTE$4 = 6e4,
  DEFAULT_ADDITIONAL_DIGITS = 2,
  patterns = {
    dateTimeDelimiter: /[T ]/,
    timeZoneDelimiter: /[Z ]/i,
    timezone: /([Z+-].*)$/
  },
  dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,
  timeRegex =
    /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,
  timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;

function parseISO(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var r = t || {},
    n =
      null == r.additionalDigits
        ? DEFAULT_ADDITIONAL_DIGITS
        : toInteger(r.additionalDigits);
  if (2 !== n && 1 !== n && 0 !== n)
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  if (
    "string" != typeof e &&
    "[object String]" !== Object.prototype.toString.call(e)
  )
    return new Date(NaN);
  var a,
    o = splitDateString(e);
  if (o.date) {
    var i = parseYear(o.date, n);
    a = parseDate(i.restDateString, i.year);
  }
  if (isNaN(a) || !a) return new Date(NaN);
  var s,
    u = a.getTime(),
    l = 0;
  if (o.time && ((l = parseTime(o.time)), isNaN(l) || null === l))
    return new Date(NaN);
  if (o.timezone) {
    if (((s = parseTimezone(o.timezone)), isNaN(s))) return new Date(NaN);
  } else {
    var d = u + l,
      c = new Date(d);
    s = getTimezoneOffsetInMilliseconds(c);
    var g = new Date(d);
    g.setDate(c.getDate() + 1);
    var f = getTimezoneOffsetInMilliseconds(g) - s;
    f > 0 && (s += f);
  }
  return new Date(u + l + s);
}

function splitDateString(e) {
  var t,
    r = {},
    n = e.split(patterns.dateTimeDelimiter);
  if (
    (/:/.test(n[0])
      ? ((r.date = null), (t = n[0]))
      : ((r.date = n[0]),
        (t = n[1]),
        patterns.timeZoneDelimiter.test(r.date) &&
          ((r.date = e.split(patterns.timeZoneDelimiter)[0]),
          (t = e.substr(r.date.length, e.length)))),
    t)
  ) {
    var a = patterns.timezone.exec(t);
    a ? ((r.time = t.replace(a[1], "")), (r.timezone = a[1])) : (r.time = t);
  }
  return r;
}

function parseYear(e, t) {
  var r = new RegExp(
      "^(?:(\\d{4}|[+-]\\d{" +
        (4 + t) +
        "})|(\\d{2}|[+-]\\d{" +
        (2 + t) +
        "})$)"
    ),
    n = e.match(r);
  if (!n)
    return {
      year: null
    };
  var a = n[1] && parseInt(n[1]),
    o = n[2] && parseInt(n[2]);
  return {
    year: null == o ? a : 100 * o,
    restDateString: e.slice((n[1] || n[2]).length)
  };
}

function parseDate(e, t) {
  if (null === t) return null;
  var r = e.match(dateRegex);
  if (!r) return null;
  var n = !!r[4],
    a = parseDateUnit(r[1]),
    o = parseDateUnit(r[2]) - 1,
    i = parseDateUnit(r[3]),
    s = parseDateUnit(r[4]),
    u = parseDateUnit(r[5]) - 1;
  if (n)
    return validateWeekDate(t, s, u)
      ? dayOfISOWeekYear(t, s, u)
      : new Date(NaN);
  var l = new Date(0);
  return validateDate(t, o, i) && validateDayOfYearDate(t, a)
    ? (l.setUTCFullYear(t, o, Math.max(a, i)), l)
    : new Date(NaN);
}

function parseDateUnit(e) {
  return e ? parseInt(e) : 1;
}

function parseTime(e) {
  var t = e.match(timeRegex);
  if (!t) return null;
  var r = parseTimeUnit(t[1]),
    n = parseTimeUnit(t[2]),
    a = parseTimeUnit(t[3]);
  return validateTime(r, n, a)
    ? r * MILLISECONDS_IN_HOUR$3 + n * MILLISECONDS_IN_MINUTE$4 + 1e3 * a
    : NaN;
}

function parseTimeUnit(e) {
  return (e && parseFloat(e.replace(",", "."))) || 0;
}

function parseTimezone(e) {
  if ("Z" === e) return 0;
  var t = e.match(timezoneRegex);
  if (!t) return 0;
  var r = "+" === t[1] ? -1 : 1,
    n = parseInt(t[2]),
    a = (t[3] && parseInt(t[3])) || 0;
  return validateTimezone(n, a)
    ? r * (n * MILLISECONDS_IN_HOUR$3 + a * MILLISECONDS_IN_MINUTE$4)
    : NaN;
}

function dayOfISOWeekYear(e, t, r) {
  var n = new Date(0);
  n.setUTCFullYear(e, 0, 4);
  var a = 7 * (t - 1) + r + 1 - (n.getUTCDay() || 7);
  return n.setUTCDate(n.getUTCDate() + a), n;
}
var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYearIndex$1(e) {
  return e % 400 == 0 || (e % 4 == 0 && e % 100);
}

function validateDate(e, t, r) {
  return (
    t >= 0 &&
    t <= 11 &&
    r >= 1 &&
    r <= (daysInMonths[t] || (isLeapYearIndex$1(e) ? 29 : 28))
  );
}

function validateDayOfYearDate(e, t) {
  return t >= 1 && t <= (isLeapYearIndex$1(e) ? 366 : 365);
}

function validateWeekDate(e, t, r) {
  return t >= 1 && t <= 53 && r >= 0 && r <= 6;
}

function validateTime(e, t, r) {
  return 24 === e
    ? 0 === t && 0 === r
    : r >= 0 && r < 60 && t >= 0 && t < 60 && e >= 0 && e < 25;
}

function validateTimezone(e, t) {
  return t >= 0 && t <= 59;
}

function roundToNearestMinutes(e, t) {
  if (arguments.length < 1)
    throw new TypeError("1 argument required, but only none provided present");
  var r = t && "nearestTo" in t ? toInteger(t.nearestTo) : 1;
  if (r < 1 || r > 30)
    throw new RangeError("`options.nearestTo` must be between 1 and 30");
  var n = toDate(e),
    a = n.getSeconds(),
    o = n.getMinutes() + a / 60,
    i = Math.floor(o / r) * r,
    s = o % r,
    u = Math.round(s / r) * r;
  return new Date(
    n.getFullYear(),
    n.getMonth(),
    n.getDate(),
    n.getHours(),
    i + u
  );
}

function setDate(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return r.setDate(n), r;
}

function setDay(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = r || {},
    a = n.locale,
    o = a && a.options && a.options.weekStartsOn,
    i = null == o ? 0 : toInteger(o),
    s = null == n.weekStartsOn ? i : toInteger(n.weekStartsOn);
  if (!(s >= 0 && s <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var u = toDate(e, n),
    l = toInteger(t),
    d = u.getDay();
  return addDays(u, (((l % 7) + 7) % 7 < s ? 7 : 0) + l - d, n);
}

function setDayOfYear(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return r.setMonth(0), r.setDate(n), r;
}

function setHours(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return r.setHours(n), r;
}

function setISODay(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e);
  return addDays(r, toInteger(t) - getISODay(r));
}

function setISOWeek(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t),
    a = getISOWeek(r) - n;
  return r.setDate(r.getDate() - 7 * a), r;
}

function setMilliseconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return r.setMilliseconds(n), r;
}

function setMinutes(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return r.setMinutes(n), r;
}

function setMonth(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t),
    a = r.getFullYear(),
    o = r.getDate(),
    i = new Date(0);
  i.setFullYear(a, n, 15), i.setHours(0, 0, 0, 0);
  var s = getDaysInMonth(i);
  return r.setMonth(n, Math.min(o, s)), r;
}

function setQuarter(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t) - (Math.floor(r.getMonth() / 3) + 1);
  return setMonth(r, r.getMonth() + 3 * n);
}

function setSeconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return r.setSeconds(n), r;
}

function setWeek(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = toDate(e),
    a = toInteger(t),
    o = getWeek(n, r) - a;
  return n.setDate(n.getDate() - 7 * o), n;
}

function setWeekYear(e, t, r) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var n = r || {},
    a = n.locale,
    o = a && a.options && a.options.firstWeekContainsDate,
    i = null == o ? 1 : toInteger(o),
    s =
      null == n.firstWeekContainsDate ? i : toInteger(n.firstWeekContainsDate),
    u = toDate(e),
    l = toInteger(t),
    d = differenceInCalendarDays(u, startOfWeekYear(u, r)),
    c = new Date(0);
  return (
    c.setFullYear(l, 0, s),
    c.setHours(0, 0, 0, 0),
    (u = startOfWeekYear(c, r)).setDate(u.getDate() + d),
    u
  );
}

function setYear(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  var r = toDate(e),
    n = toInteger(t);
  return isNaN(r) ? new Date(NaN) : (r.setFullYear(n), r);
}

function startOfDecade(e) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  var t = toDate(e),
    r = t.getFullYear(),
    n = 10 * Math.floor(r / 10);
  return t.setFullYear(n, 0, 1), t.setHours(0, 0, 0, 0), t;
}

function startOfToday() {
  return startOfDay(Date.now());
}

function startOfTomorrow() {
  var e = new Date(),
    t = e.getFullYear(),
    r = e.getMonth(),
    n = e.getDate(),
    a = new Date(0);
  return a.setFullYear(t, r, n + 1), a.setHours(0, 0, 0, 0), a;
}

function startOfYesterday() {
  var e = new Date(),
    t = e.getFullYear(),
    r = e.getMonth(),
    n = e.getDate(),
    a = new Date(0);
  return a.setFullYear(t, r, n - 1), a.setHours(0, 0, 0, 0), a;
}

function subHours(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addHours(e, -toInteger(t));
}

function subMinutes(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMinutes(e, -toInteger(t));
}

function subMonths(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addMonths(e, -toInteger(t));
}

function subQuarters(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addQuarters(e, -toInteger(t));
}

function subSeconds(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addSeconds(e, -toInteger(t));
}

function subWeeks(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addWeeks(e, -toInteger(t));
}

function subYears(e, t) {
  if (arguments.length < 2)
    throw new TypeError(
      "2 arguments required, but only " + arguments.length + " present"
    );
  return addYears(e, -toInteger(t));
}
var maxTime = 24 * Math.pow(10, 8) * 60 * 60 * 1e3,
  minTime = -maxTime;
export {
  addBusinessDays,
  addDays,
  addHours,
  addISOWeekYears,
  addMilliseconds,
  addMinutes,
  addMonths,
  addQuarters,
  addSeconds,
  addWeeks,
  addYears,
  areIntervalsOverlapping,
  closestIndexTo,
  closestTo,
  compareAsc,
  compareDesc,
  differenceInBusinessDays,
  differenceInCalendarDays,
  differenceInCalendarISOWeekYears,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  differenceInCalendarQuarters,
  differenceInCalendarWeeks,
  differenceInCalendarYears,
  differenceInDays,
  differenceInHours,
  differenceInISOWeekYears,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInQuarters,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachWeekendOfInterval,
  eachWeekendOfMonth,
  eachWeekendOfYear,
  endOfDay,
  endOfDecade,
  endOfHour,
  endOfISOWeek,
  endOfISOWeekYear,
  endOfMinute,
  endOfMonth,
  endOfQuarter,
  endOfSecond,
  endOfToday,
  endOfTomorrow,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  format,
  formatDistance$1 as formatDistance,
  formatDistanceStrict,
  formatDistanceToNow,
  formatRelative$1 as formatRelative,
  fromUnixTime,
  getDate,
  getDay,
  getDayOfYear,
  getDaysInMonth,
  getDaysInYear,
  getDecade,
  getHours,
  getISODay,
  getISOWeek,
  getISOWeekYear,
  getISOWeeksInYear,
  getMilliseconds,
  getMinutes,
  getMonth,
  getOverlappingDaysInIntervals,
  getQuarter,
  getSeconds,
  getTime,
  getUnixTime,
  getWeek,
  getWeekOfMonth,
  getWeekYear,
  getWeeksInMonth,
  getYear,
  isAfter,
  isBefore,
  isDate,
  isEqual,
  isFirstDayOfMonth,
  isFriday,
  isFuture,
  isLastDayOfMonth,
  isLeapYear,
  isMonday,
  isPast,
  isSameDay,
  isSameHour,
  isSameISOWeek,
  isSameISOWeekYear,
  isSameMinute,
  isSameMonth,
  isSameQuarter,
  isSameSecond,
  isSameWeek,
  isSameYear,
  isSaturday,
  isSunday,
  isThisHour,
  isThisISOWeek,
  isThisMinute,
  isThisMonth,
  isThisQuarter,
  isThisSecond,
  isThisWeek,
  isThisYear,
  isThursday,
  isToday,
  isTomorrow,
  isTuesday,
  isValid,
  isWednesday,
  isWeekend,
  isWithinInterval,
  isYesterday,
  lastDayOfDecade,
  lastDayOfISOWeek,
  lastDayOfISOWeekYear,
  lastDayOfMonth,
  lastDayOfQuarter,
  lastDayOfWeek,
  lastDayOfYear,
  lightFormat,
  max,
  min,
  parse,
  parseISO,
  roundToNearestMinutes,
  setDate,
  setDay,
  setDayOfYear,
  setHours,
  setISODay,
  setISOWeek,
  setISOWeekYear,
  setMilliseconds,
  setMinutes,
  setMonth,
  setQuarter,
  setSeconds,
  setWeek,
  setWeekYear,
  setYear,
  startOfDay,
  startOfDecade,
  startOfHour,
  startOfISOWeek,
  startOfISOWeekYear,
  startOfMinute,
  startOfMonth,
  startOfQuarter,
  startOfSecond,
  startOfToday,
  startOfTomorrow,
  startOfWeek,
  startOfWeekYear,
  startOfYear,
  startOfYesterday,
  subDays,
  subHours,
  subISOWeekYears,
  subMilliseconds,
  subMinutes,
  subMonths,
  subQuarters,
  subSeconds,
  subWeeks,
  subYears,
  toDate,
  maxTime,
  minTime
};
