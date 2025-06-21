/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export function uniqueId(
  prefix: string = "sfGpsDs"
): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 18)}`;
};

export function isIPadPro(): boolean {
  // No good way to tell iPad Pro, this may well not work after years.
  // https://stackoverflow.com/a/58017456/1212791
  // TODO revisit
  if (
    navigator.userAgent.match(/Mac/) &&
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2
  ) {
    return true;
  }
  return false;
};

export function isMacPlatform(): boolean {
  return !!navigator.userAgent.match(/Mac/);
};
