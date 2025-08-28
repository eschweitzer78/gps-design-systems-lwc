var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function (obj) {
        return typeof obj;
      }
    : function (obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

function isDate(value) {
  if (arguments.length < 1) {
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  }

  return (
    value instanceof Date ||
    ((typeof value === "undefined" ? "undefined" : _typeof(value)) ===
      "object" &&
      Object.prototype.toString.call(value) === "[object Date]")
  );
}

export default isDate;
