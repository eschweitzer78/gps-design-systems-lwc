"use strict";

function toDate(argument) {
  var argStr;
  if (arguments.length < 1) {
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  }

  argStr = Object.prototype.toString.call(argument); // Clone the date

  if (
    argument instanceof Date ||
    (typeof argument === "object" && argStr === "[object Date]")
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  }
  if (
    (typeof argument === "string" || argStr === "[object String]") &&
    typeof console !== "undefined"
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"
    ); // eslint-disable-next-line no-console

    console.warn(new Error().stack);
  }

  return new Date(NaN);
}

export default toDate;
