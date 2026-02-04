import dayjs from "c/sfGpsDsOsrtDayjs";
import { default as isDate } from "./isDate";

const ISOPattern = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d):(\d\d).(\d{3})Z)?$/;

let isValidDate = function (obj) {
  return isDate(obj) && !isNaN(obj.getTime());
};

let dateValueParser = function (val, format) {
  if (isDate(val) || val instanceof Number) {
    return new Date(val);
  }
  let result = val.match(ISOPattern);
  if (result) {
    result = new Date(val);
    if (result.toISOString() === val) {
      return result;
    }
  }
  result = dayjs(val);
  if (result && !isValidDate(result.toDate())) {
    result = dayjs(val, format);
  }
  if (result) return result.toDate();
  return null;
};

let parseValue = function (value, format) {
  let date;
  try {
    if (value == null || value === "") {
      date = null;
    } else {
      date = dateValueParser(value, format);
    }
  } catch (e) {
    console.error(e);
  }
  return date;
};

function setValue(value, dateFormat) {
  value = parseValue(value, dateFormat);
  dateFormat = dateFormat ? dateFormat : "YYYY-MM-DD";
  if (isValidDate(value)) {
    return dayjs(value).format(dateFormat);
  }
  return null;
}
export default setValue;
export { dateValueParser };
