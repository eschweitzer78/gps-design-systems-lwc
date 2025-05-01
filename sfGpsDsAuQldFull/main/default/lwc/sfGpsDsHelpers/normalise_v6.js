import { isString } from "./typeutil";

export function normaliseBoolean(v, options = {}) {
  const { acceptString: as = false, fallbackValue: fV = false } = options;

  if (!as || typeof v !== "string") {
    return v == null ? fV : !!v;
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
    trim: t = true,
    returnObjectValue: rOV = false
  } = options;

  let result = ("string" === typeof value && (t ? value.trim() : value)) || "";

  if (tLC) {
    result = result.toLowerCase();
  }

  if (vV && Array.isArray(vV)) {
    if (vV.indexOf(result) === -1) {
      result = fV;
    }
  } else if (vV && typeof vV === "object") {
    if (!Object.hasOwn(vV, result)) {
      result = rOV ? vV[fV] : fV;
    } else if (rOV) {
      result = vV[result];
    }
  }

  return result;
}

export function normaliseInteger(value, options = {}) {
  const {
    fallbackValue: fV = 0,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    acceptString: aS = true
  } = options;

  let intFV = parseInt(fV, 10);

  if (Number.isNaN(intFV)) {
    intFV = 0;
  }

  if (aS && isString(value)) {
    value = parseInt(value, 10);
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    value = intFV;
  }

  const intValue = value | 0; /* truncates floating point */

  if (intValue < min) {
    return min;
  }

  return intValue > max ? max : intValue;
}
