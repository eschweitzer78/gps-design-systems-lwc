/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const numericKeys = [1, 4, 5, 6, 7, 10, 11];

export function parseIso8601(date) {
  /*
   * © 2011 Colin Snover <http://zetafleet.com>
   * Released under MIT license.
   */

  let timestamp,
    struct,
    minutesOffset = 0;

  // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
  // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
  // implementations could be faster
  //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
  if (
    (struct =
      /^(\d{4}|[+-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+-])(\d{2})(?::(\d{2}))?)?)?$/.exec(
        date
      ))
  ) {
    // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
    for (let i = 0, k; (k = numericKeys[i]); ++i) {
      struct[k] = +struct[k] || 0;
    }

    // allow undefined days and months
    struct[2] = (+struct[2] || 1) - 1;
    struct[3] = +struct[3] || 1;

    if (struct[8] !== "Z" && struct[9] !== undefined) {
      minutesOffset = struct[10] * 60 + struct[11];

      if (struct[9] === "+") {
        minutesOffset = 0 - minutesOffset;
      }
    }

    timestamp = Date.UTC(
      struct[1],
      struct[2],
      struct[3],
      struct[4],
      struct[5] + minutesOffset,
      struct[6],
      struct[7]
    );
  } else {
    timestamp = Date.parse(date);
  }

  let rv = new Date(timestamp);
  return isNaN(rv) ? null : rv;
}

const DATE_STYLE_DEFAULT = "medium";

const MONTH_NAMES_LONG = [
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
];
const MONTH_NAMES_SHORT = [
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
];
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export function formatDate(
  date,
  dateStyle = DATE_STYLE_DEFAULT,
  userLocale = "en-AU"
) {
  let rv = null;

  try {
    rv = date.toLocaleDateString(userLocale, {
      dateStyle: dateStyle
    });
  } catch (error) {
    // TODO: improve toLocaleDateString polyfill
    // fallback, very likely that the browser does not support toLocaleDateString
    // will disregard locale and deliver in en-AU
    switch (dateStyle) {
      case "full":
        rv = `${WEEKDAY_NAMES[date.getDay()]} ${date.getDate()} ${
          MONTH_NAMES_LONG[date.getMonth()]
        } ${date.getFullYear()}`;
        break;

      case "long":
        rv = `${date.getDate()} ${
          MONTH_NAMES_LONG[date.getMonth()]
        } ${date.getFullYear()}`;
        break;

      case "medium":
        rv = `${date.getDate()} ${
          MONTH_NAMES_SHORT[date.getMonth()]
        } ${date.getFullYear()}`;
        break;

      default:
        rv = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  }

  return rv;
}

const fdrOptions = {
  full: {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  },
  long: {
    day: "numeric",
    month: "long",
    year: "numeric"
  },
  medium: {
    day: "numeric",
    month: "short",
    year: "numeric"
  },
  short: {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }
};

export function formatDateRange(
  dateStart,
  dateEnd,
  dateStyle = DATE_STYLE_DEFAULT,
  userLocale = "en-AU"
) {
  if (dateStart === null) {
    return formatDate(dateEnd, dateStyle, userLocale);
  }

  if (dateEnd === null) {
    return formatDate(dateStart, dateStyle, userLocale);
  }

  // eslint-disable-next-line @salesforce/lightning/prefer-i18n-service
  const fmt = new Intl.DateTimeFormat(
    userLocale,
    fdrOptions[dateStyle] || fdrOptions[DATE_STYLE_DEFAULT]
  );

  return fmt.formatRange(dateStart, dateEnd);
}

export function getUserLocale(
  useFallbackLocale = true,
  fallbackLocale = "en-AU"
) {
  return getUserLocales(useFallbackLocale, fallbackLocale)[0] || null;
}

export function getUserLocales(
  useFallbackLocale = true,
  fallbackLocale = "en-AU"
) {
  let languageList = [];

  if (typeof navigator !== "undefined") {
    languageList = languageList.concat(navigator.languages, navigator.language);
  }

  if (useFallbackLocale) {
    languageList.push(fallbackLocale);
  }

  return uniqDefined(languageList).map(normalizeLocale);
}

function uniqDefined(arr) {
  return arr.filter((el, index) => el && arr.indexOf(el) === index);
}

function isAllLowerCase(el) {
  return el.toLowerCase() === el;
}

function normalizeLocale(el) {
  if (!el || el.indexOf("-") === -1 || !isAllLowerCase(el)) {
    return el;
  }

  const [splitEl1 = "", splitEl2 = ""] = el.split("-");

  return `${splitEl1}-${splitEl2.toUpperCase()}`;
}
