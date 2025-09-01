import dayjs from "c/sfGpsDsOsrtDayjs";

const methods = ["startOf", "endOf"];
const methodsPatternSrc = methods
  .map((x) => x.replace(/[A-Z]/, "\\s*$&"))
  .join("|");
const methodsPattern = new RegExp(methodsPatternSrc, "gi");

const additionPatternSrc = "[+-]\\s*[0-9]+";

const operationPatternSrc = additionPatternSrc + "|" + methodsPatternSrc;

const unitsFull = [
  "millisecond",
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "quarter",
  "year"
];
const unitsPatternSrc = "(" + unitsFull.join("|") + ")s?";

const DayExpOpPattern = new RegExp(
  "(" + operationPatternSrc + ")\\s*" + unitsPatternSrc,
  "i"
);

function parseChronoAttributes(val, key) {
  if (typeof val !== "string") {
    return val;
  }
  let result = val.match(/^today/i);
  let day = dayjs();
  if (result) {
    if (key === "minDate") {
      day = day.startOf("day");
    }
    if (key === "maxDate") {
      day = day.endOf("day");
    }
  } else {
    result = val.match(/^now/i);
    if (!result) {
      return val;
    }
  }
  let dayExpStr = val;
  let match = dayExpStr.match(DayExpOpPattern);
  let methodMatch;
  let methodName;
  while (match !== null) {
    let operation = match[1];
    let unit = match[2];
    if (operation.match(/^[+-]/)) {
      day = day.add(Number(operation.replace(/\s/, "")), unit);
    } else {
      methodMatch = operation.match(methodsPattern);
      if (methodMatch) {
        methodName = methodMatch[0].replace(/\s+[a-z]/i, (y) =>
          y.trim().toUpperCase()
        );
        if (
          methods.includes(methodName) &&
          typeof day[methodName] === "function"
        ) {
          day = day[methodName](unit);
        }
      }
    }
    dayExpStr = dayExpStr.substring(match[0].length + match.index);
    match = dayExpStr.match(DayExpOpPattern);
  }
  if (day.isValid()) {
    return day.toDate();
  }
  return undefined;
}

export { parseChronoAttributes };
