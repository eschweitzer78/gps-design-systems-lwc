/* eslint no-confusing-arrow: 0 */
export function formatTemplate(
  template: string, 
  values: Record<string, any> = {}, 
  options: {
    sep?: string
  }= {}
): string | null {
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

export function safeEqualsIgnoreCase(
  a: string, 
  b: string
): boolean {
  if (
    a == null ||
    b == null ||
    typeof a.toLowerCase !== "function" ||
    typeof b.toLowerCase !== "function"
  )
    return false;

  return a.toLowerCase() === b.toLowerCase();
}

export function truncateText(
  text: string, 
  stop = 150, 
  clamp?: string
): string {
  if (text && typeof text === "string" && stop > 0) {
    if (text.length > stop) {
      return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
    }
    return text;
  }
  return "";
}

const cacheStringFunction = (fn: (str: string) => string) => {
  const cache: Record<string, string> = Object.create(null);
  return (str: string): string => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

const camelizeRE = /-(\w)/g;

export const camelize = cacheStringFunction((str: string): string =>
  str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""))
);

const hyphenateRE = /\B([A-Z])/g;

export const hyphenate = cacheStringFunction((str: string): string =>
  str.replace(hyphenateRE, "-$1").toLowerCase()
);

export const capitalize = cacheStringFunction((str: string): string =>
  typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : ""
);

export const toHandlerKey = cacheStringFunction((str: string): string =>
  str ? `on${capitalize(str)}` : ``
);
