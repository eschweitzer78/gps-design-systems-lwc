import { evaluate } from "c/sfGpsDsOsrtExpressionEngine";
import { getElementValue, isRepeatNotation } from "./scriptHelpers";

/**
 * Utilizes the expressionEngine to handle inputs.
 * @param {*} input
 * @param {obj} element
 * @param {obj} jsonData
 * @param {obj} labelMap
 */
export function handleExpressionEngine(input, element, jsonData, labelMap) {
  if (input === undefined || input === null) {
    return "";
  }

  const expMatch = input.match(/^=/);

  if (expMatch) {
    let expValue = null;

    try {
      // Evaluates the expression
      expValue = evaluate(
        // substring to remove the `=` at the start
        input.substring(1).replace(/\\"/g, '"'),
        (token) => {
          return getElementValue(
            token,
            jsonData,
            labelMap,
            isRepeatNotation(token) ? element.JSONPath : null
          );
        },
        true
      );
    } catch (err) {
      console.error(err);
    }

    if (expValue === null || expValue === undefined) {
      return "";
    }
    return expValue;
  }

  return input;
}
