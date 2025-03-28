/* eslint no-confusing-arrow: 0 */
export function formatTemplate(template, values = {}, options = {}) {
  if (template == null) {
    return null;
  }

  const { sep = "{}" } = options;
  const sepStart = sep.slice(0, 1);
  const sepEnd = sep.slice(1, 2) || sepStart;

  const re = new RegExp(
    "\\" + sepStart + "([^\\" + sepEnd + "]+)\\" + sepEnd,
    "g"
  );

  return template.replace(
    re,
    (placeholderWithDelimiters, placeholderWithoutDelimiters) => {
      return Object.prototype.hasOwnProperty.call(
        values,
        placeholderWithoutDelimiters
      )
        ? values[placeholderWithoutDelimiters]
        : placeholderWithDelimiters;
    }
  );
}

export function safeEqualsIgnoreCase(a, b) {
  if (
    a == null ||
    b == null ||
    typeof a.toLowerCase !== "function" ||
    typeof b.toLowerCase !== "function"
  )
    return false;

  return a.toLowerCase() === b.toLowerCase();
}

export function truncateText(text, stop = 150, clamp) {
  if (text && typeof text === "string") {
    if (text.length > stop) {
      return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
    }
    return text;
  }
  return "";
}

/*
export function capitalize(str) {
  return typeof str === "string" && str.length > 0
    ? `${str.charAt(0).toUpperCase() + str.slice(1)}`
    : "";
}
*/

const cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

const camelizeRE = /-(\w)/g;

export const camelize = cacheStringFunction((str) =>
  str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""))
);

const hyphenateRE = /\B([A-Z])/g;

export const hyphenate = cacheStringFunction((str) =>
  str.replace(hyphenateRE, "-$1").toLowerCase()
);

export const capitalize = cacheStringFunction((str) =>
  typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : ""
);

export const toHandlerKey = cacheStringFunction((str) =>
  str ? `on${capitalize(str)}` : ``
);
