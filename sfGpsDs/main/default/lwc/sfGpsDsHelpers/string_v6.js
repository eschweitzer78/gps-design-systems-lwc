export function formatTemplate(template, values = {}) {
  return template.replace(
    /{(\w+)}/g,
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

export function capitalize(str) {
  return typeof str === "string" && str.length > 0
    ? `${str.charAt(0).toUpperCase() + str.slice(1)}`
    : "";
}
