import { Parser } from "c/sfGpsDsOsrtNearley";
import grammar from "./expressionEngineGrammar";
import {
  setTemplateResolverFn,
  setRandomGenerator
} from "./expressionEngineGrammar";
export { default as EXPRESSIONS } from "./expressions.js";

export function evaluate(
  expression,
  templateResolverFn,
  reportErrors,
  randomGeneratorFn
) {
  const p = new Parser(grammar.ParserRules, grammar.ParserStart);
  setTemplateResolverFn(templateResolverFn);
  if (typeof randomGeneratorFn === "function") {
    setRandomGenerator(randomGeneratorFn);
  } else {
    setRandomGenerator(null);
  }
  p.feed(expression);
  if (p.results.length > 1 && reportErrors) {
    let previousResult = p.results[0];
    p.results.forEach(function (result) {
      if (previousResult !== result) {
        console.warn(JSON.stringify(p.results, null, 2));
      }
      previousResult = result;
    });
    throw new Error("Ambiguous Grammar: \n" + p.results.length);
  } else if (expression && expression.trim() && p.results.length === 0) {
    throw new Error("Unexpected end of expression");
  }
  let result = p.results[0];
  if (
    typeof result == "undefined" ||
    Number.isNaN(result) ||
    result === Infinity
  ) {
    return null;
  }
  return result;
}
