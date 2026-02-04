import { get } from "c/sfGpsDsOsrtLodash";

function groupFilter(group, obj, context) {
  var evalString = "";
  group.forEach((condition) => {
    condition = { ...condition };
    if (
      condition.operator === "===" &&
      condition.field === "$scope.data.status"
    ) {
      if (condition.value && condition.value.indexOf("active") !== -1) {
        evalString = obj && Object.keys(obj).length ? "true" : "false";
      } else if (
        condition.value &&
        condition.value.indexOf("non-existent") !== -1
      ) {
        evalString = !obj || !Object.keys(obj).length ? "true" : "false";
      } else if (
        condition.value &&
        condition.value.indexOf("edit-mode") !== -1
      ) {
        evalString = "true";
      }
      return;
    }
    if (condition.group) {
      if (condition.logicalOperator) {
        evalString += " " + condition.logicalOperator + " ";
      }
      evalString += groupFilter(condition.group, obj, context);
      return;
    }
    if (condition.operator) {
      let realVal = get(obj, condition.field);
      if (condition.field.indexOf("$scope") > -1) {
        realVal =
          get(context, condition.field.substr(7)) ||
          context[condition.field.substr(7)];
      }
      if (condition.logicalOperator) {
        evalString += " " + condition.logicalOperator + " ";
      }

      //Special cases
      realVal = typeof realVal === "boolean" ? realVal.toString() : realVal;
      realVal = typeof realVal === "undefined" ? "undefined" : realVal;
      condition.value =
        condition.value && condition.value.toLowerCase() === "null"
          ? null
          : condition.value;

      // End Special cases
      if (realVal) {
        let flag;
        switch (condition.operator) {
          case "==":
            // eslint-disable-next-line eqeqeq
            flag = realVal == condition.value;
            break;
          case ">":
            // eslint-disable-next-line eqeqeq
            flag = realVal !== "undefined" && realVal > condition.value;
            break;
          case "<":
            // eslint-disable-next-line eqeqeq
            flag = realVal !== "undefined" && realVal < condition.value;
            break;
          case ">=":
            // eslint-disable-next-line eqeqeq
            flag = realVal !== "undefined" && realVal >= condition.value;
            break;
          case "<=":
            // eslint-disable-next-line eqeqeq
            flag = realVal !== "undefined" && realVal <= condition.value;
            break;
          case "!=":
            // eslint-disable-next-line eqeqeq
            flag = realVal != condition.value;
            break;
          default:
            break;
        }
        evalString += ` ${flag} `;
      } else {
        evalString += "false";
      }
    }
  });
  // eslint-disable-next-line no-eval
  return eval(evalString);
}

function isEditMode(group) {
  var isEdit = false;
  group.forEach((condition) => {
    if (
      condition.operator === "===" &&
      condition.field === "$scope.data.status"
    ) {
      if (condition.value && condition.value.indexOf("edit-mode") !== -1) {
        isEdit = true;
      }
    }
  });
  // eslint-disable-next-line no-eval
  return isEdit;
}

export { groupFilter, isEditMode };
