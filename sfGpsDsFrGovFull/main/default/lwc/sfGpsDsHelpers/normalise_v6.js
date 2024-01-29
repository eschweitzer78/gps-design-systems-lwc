/* normaliseOps.js */

export function normaliseBoolean(v, options = {}) {
  const { acceptString: as = false, fallbackValue: fV = false } = options;

  if (!as || typeof v !== "string") {
    return !!v;
  }

  switch (v.trim().toLocaleLowerCase()) {
    case "true":
      return true;

    case "false":
      return false;

    default:
      return !!fV;
  }
}

export function normaliseArray(value, options = {}) {
  const { arrayfySingleton: as = false } = options;

  if (Array.isArray(value)) {
    return value;
  }

  return as ? [value] : [];
}

export function normaliseAriaAttribute(value) {
  let result = Array.isArray(value) ? value : [value];
  result = result
    .map((e) => ("string" === typeof e ? e.replace(/\s+/g, " ").trim() : ""))
    .filter((e) => !!e);

  return result.length > 0 ? result.join(" ") : null;
}

export function normaliseString(value, options = {}) {
  const {
    fallbackValue: fV = "",
    validValues: vV,
    toLowerCase: tLC = true,
    trim: t = true
  } = options;

  let result = ("string" === typeof value && (t ? value.trim() : value)) || "";

  if (tLC) {
    result = result.toLowerCase();
  }

  if (vV && vV.indexOf(result) === -1) {
    result = fV;
  }

  return result;
}
