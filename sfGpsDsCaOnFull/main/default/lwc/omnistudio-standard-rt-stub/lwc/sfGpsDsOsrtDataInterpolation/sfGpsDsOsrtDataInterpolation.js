import { get, cloneDeep, clone } from "c/sfGpsDsOsrtLodash";

let regexUniversal = /\{([a-zA-Z.0-9_[\]]*)\}/g;
function interpolate(objToInterpolate, obj) {
  let regex = /\{{(.*?)\}}/g;
  return interpolateWithRegex(objToInterpolate, obj, regex);
}

function interpolateWithRegex(objToInterpolate, obj, regex, type) {
  let objToInterpolateStr;
  if (!objToInterpolate) {
    return objToInterpolate;
  }
  let objType = typeof objToInterpolate;
  if (objType !== "string") {
    objToInterpolateStr = JSON.stringify(objToInterpolate);
  } else if (objType === "string") {
    objToInterpolateStr = objToInterpolate;
  }

  //if regex does mot match no need to interpolate
  if (
    (regex && !regex.test(objToInterpolateStr)) ||
    objToInterpolateStr === "{}"
  ) {
    return objType === "object" ? clone(objToInterpolate) : objToInterpolate;
  }

  //console.log("interpolate val",objToInterpolate,objToInterpolateStr,obj,JSON.stringify(obj));
  if (objToInterpolateStr) {
    //Copied changes from Components repo done by SIDD
    let interpolatedValue = objToInterpolateStr.replace(
      regex,
      function (match, expr) {
        let fieldValue;
        if (expr) {
          if (type === "element") {
            expr = expr.replace("element.", "");
            fieldValue = obj[expr];
            if (expr === "value" && Array.isArray(fieldValue)) {
              fieldValue = fieldValue.join(";");
            }
          } else {
            fieldValue = get(obj, expr);
          }
        }
        let fieldValueType = typeof fieldValue;
        return fieldValueType !== "undefined" &&
          (fieldValueType !== "object" || fieldValue === null)
          ? fieldValue
          : match;
      }
    );

    return type === "noparse"
      ? interpolatedValue
      : JSON.parse(replaceAllSpecialChar(interpolatedValue));
  }
  return objToInterpolate;
}

function replaceAllSpecialChar(str) {
  return str.replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r");
}

function interpolateElement(objToInterpolate, obj) {
  let regex = /\{(\belement.\b[a-zA-Z.]*)\}/g;
  return interpolateWithRegex(objToInterpolate, obj, regex, "element");
}

function interpolateKeyValue(obj, data) {
  if (typeof obj !== "object" || !obj) {
    return clone(obj);
  }
  obj = clone(obj);
  Object.keys(obj).forEach((key) => {
    let objVal = obj[key];
    let objType = typeof objVal;
    if (key && objVal) {
      if (objType === "string") {
        let val;
        let matched = objVal.match(regexUniversal);
        //if single mergefield interpolate if multiple use interpolatewithregex
        if (matched && matched.length === 1) {
          let exp = obj[key].replace(/[{}]/g, "");
          val = get(data, exp);
          if (!val) {
            val = interpolateWithRegex(
              obj[key],
              data,
              regexUniversal,
              "noparse"
            );
          }
        } else {
          val = interpolateWithRegex(obj[key], data, regexUniversal, "noparse");
        }
        obj[key] = typeof val !== "undefined" ? val : obj[key];
      } else if (objType === "object" && obj[key] !== null) {
        obj[key] = interpolateKeyValue(cloneDeep(obj[key]), data);
      }
    }
  });
  return obj;
}

export {
  interpolate,
  interpolateWithRegex,
  interpolateElement,
  interpolateKeyValue,
  replaceAllSpecialChar
};
