/**
 * This library module exports several utility functions to accommodate changing
 * the casing style of a given string. For example converting `my-component-name` to `myComponentName`
 * or the inverse. It also exposes a base generic `changeCase` function which empowers users to
 * create their own custom casing patterns.
 * @module ns/changeCase
 */

/**
 * Generic change case utility. Used to take a string with any or no particular casing pattern and normalize it.
 * Takes the input parameter and applies the replacer function to each part, joined with an optional separator.
 * Use this method to create custom case changes not provided by this component.
 * @example ``` JS
 * // Convert to constant case:
 * changeCase('some-Example_Constant', (part) => part.toUpperCase(), '_')
 * // outputs SOME_EXAMPLE_CONSTANT
 * ```
 * @example ``` JS
 * // Convert to pascal case:
 * changeCase('some-Example_Constant', (part) =>  part.charAt(0).toUpperCase() + part.substring(1))
 * ```
 * @param {string} input - A string to be converted from one casing to another.
 * @param {Function} replacer - A function applied to each part of the input. The function takes a part, and index parameter and should return a string[].
 * @param {string} [separator] - A string to use as a separator between parts.
 * @returns {string}
 */
export function changeCase(input, replacer, separator = "") {
  if (typeof input !== "string") return input;
  const parts = getParts(input);
  return parts.map(replacer).join(separator);
}

/**
 * Takes the given input and converts it to `camelCase`. Ideal for converting html or attribute names to their preferred JavaScript identifier casing.
 * @param {string} input - A string to be converted from one casing to `camelCase`.
 * @returns {string}
 */
export function camelCase(input) {
  return changeCase(input, (part, index) => {
    part = part.toLowerCase();
    if (index > 0) {
      part = part.charAt(0).toUpperCase() + part.substring(1);
    }
    return part;
  });
}

/**
 * Takes the given input and converts it to `kebab-case`. Ideal for converting camelCased JavaScript identifiers,
 * and converting them to their `tag-or-attribute` form.
 * @param {string} input - A string to be converted from one casing to `kebab-case`.
 * @returns {string}
 */
export function kebabCase(input) {
  return changeCase(input, (part) => part.toLowerCase(), "-");
}

/**
 * Takes the given input and converts it to `snake_case`.
 * @param {string} input - A string to be converted from one casing to `snake_case`.
 * @returns {string}
 */
export function snakeCase(input) {
  return changeCase(input, (part) => part.toLowerCase(), "_");
}

/**
 * Private function used to break the input string into logical parts.
 * @param {string} input
 * @private
 * @borrows {@link https://www.npmjs.com/package/change-case}
 * @returns {string[]}
 */
function getParts(input) {
  let result = replace(
    replace(input, [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g], "$1\0$2"),
    /[^A-Z0-9]+/gi,
    "\0"
  );

  let start = 0;
  let end = result.length;

  while (result.charAt(start) === "\0") start++;
  while (result.charAt(end - 1) === "\0") end--;

  return result.slice(start, end).split("\0");
}

/**
 * Private function used to apply the string replacement.
 * @param {string} input - String which replace will be applied to.
 * @param {(RegExp[]|RegExp)} re - RegExp to use as the searchValue.
 * @param {string} value - Value to use as the replaceValue.
 * @private
 * @borrows {@link https://www.npmjs.com/package/change-case}
 * @returns {string}
 */
function replace(input, re, value) {
  if (re instanceof RegExp) return input.replace(re, value);
  return re.reduce((input, re) => input.replace(re, value), input);
}
