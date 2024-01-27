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
