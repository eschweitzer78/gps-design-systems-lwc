"use strict";

import _index from "./toDate";

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function isValidDate(dirtyDate) {
  var date;
  if (arguments.length < 1) {
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  }

  date = (0, _index2.default)(dirtyDate);
  return !isNaN(date);
}

export default isValidDate;
