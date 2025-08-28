import dayjs from "c/sfGpsDsOsrtDayjs";

export function applyDateFormat(inData, options) {
  let data = JSON.parse(JSON.stringify(inData));
  for (let root in data) {
    if (typeof data[root] === "object") {
      for (let childs in data[root]) {
        if (typeof data[root][childs] === "object") {
          for (let prop in data[root][childs]) {
            if (typeof data[root][childs][prop] === "object") {
              for (let keys in data[root][childs][prop]) {
                if (typeof data[root][childs][prop][keys] === "string")
                  data[root][childs][prop][keys] = getAsDate(
                    data[root][childs][prop][keys],
                    options
                  );
              }
            } else if (
              typeof data[root][childs][prop] === "string" &&
              data[root][childs][prop].indexOf(":") > 0
            )
              data[root][childs][prop] = getAsDate(
                data[root][childs][prop],
                options
              );
          }
        } else if (
          typeof data[root][childs] === "string" &&
          data[root][childs].indexOf(":") > 0
        )
          data[root][childs] = getAsDate(data[root][childs], options);
      }
    }
  }
  return data;
}

export function getAsDate(date, options) {
  if (date === null) return null;
  let returnVal = date;
  //http://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  let matchArray = date.match(
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
  );

  if (matchArray != null) {
    // Default Date Time Formats from moment.js
    let DEFAULTS = {
        timeFormat: "h:mm a",
        dateFormat: "MM/DD/YYYY",
        dateTimeFormat: "MM/DD/YYYY h:mm a"
      },
      format = "dateTimeFormat",
      stringFormat,
      returnFormatted;
    const parsedDate = dayjs(date);

    if (parsedDate.dayOfYear() === 1 && parsedDate.year() === 1970)
      format = "timeFormat";
    else if (
      parsedDate.hour() === 0 &&
      parsedDate.minute() === 0 &&
      parsedDate.second() === 0 &&
      parsedDate.millisecond() === 0
    )
      format = "dateFormat";

    stringFormat = options != null ? options[format] : null;
    if (!stringFormat) stringFormat = DEFAULTS[format];
    returnFormatted = parsedDate.format(stringFormat.toUpperCase());

    if (returnFormatted === "Invalid Date") return date;

    returnVal = returnFormatted;
  }
  return returnVal;
}

/**
 * Run a timezone thru Int.DatetimeFormat to check wether or not it's actually valid.
 * @param {string|number} timeZone - Does it pass muster?
 * @returns
 */
export function isTimeZoneValid(timeZone) {
  let isValid;

  try {
    isValid = new Intl.DateTimeFormat(undefined, { timeZone }) != null;
  } catch {
    isValid = false;
  }

  return isValid;
}
