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
