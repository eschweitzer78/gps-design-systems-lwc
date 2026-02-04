const regex = /[A-Z]/g;
const parser = (string: string) =>
  string.replace(regex, (match) => `-${match.toLowerCase()}`);

/**
 * Translate a style object into a CSS string
 * @param {Object} styleObj - The object to run against
 * @returns {string}
 */

export function styleToString(styleObj: {[index: string]: any} | string[]): string {
  if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
    throw new TypeError(
      `expected an argument of type object, but got ${typeof styleObj}`
    );
  }

  return Object.keys(styleObj)
    .map((property) => `${parser(property)}: ${styleObj[property]}`)
    .join(";");
}
