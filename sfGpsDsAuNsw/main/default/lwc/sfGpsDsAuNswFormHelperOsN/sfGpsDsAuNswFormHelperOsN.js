/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const helperClasses = {
  default: "nsw-form__helper",
  invalid: "nsw-form__helper nsw-form__helper--error",
  valid: "nsw-form__helper nsw-form__helper--valid"
};

const statusIcons = {
  default: "",
  invalid: "cancel",
  valid: "check_circle"
};

function getHelperClassName(status) {
  return helperClasses[status];
}

function getStatusIcon(status) {
  return statusIcons[status];
}

export { getHelperClassName, getStatusIcon };
