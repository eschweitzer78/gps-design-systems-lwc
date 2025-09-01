import { mergeWith, isEqual, xorWith } from "c/sfGpsDsOsrtLodash";
import { mergeJSONLogic } from "./mergeJSONLogic";

export const internalUrlKeyList = [
  "tabKey",
  "previewEmbedded",
  "designerPreviewId",
  "OmniScriptType",
  "OmniScriptSubType",
  "OmniScriptLang",
  "PrefillDataRaptorBundle",
  "scriptMode",
  "OmniScriptInstanceId",
  "OmniScriptId",
  "OmniScriptApplicationId",
  "loadWithPage",
  "timeStamp",
  "userId",
  "userName",
  "userProfile",
  "userTimeZone",
  "userTimeZoneName",
  "userCurrencyCode",
  "prefill",
  "isdtp",
  "sfdcIFrameOrigin",
  "sfdcIFrameHost",
  "ns",
  "id",
  "layout",
  "lwc",
  "omnidesignerChannelId"
];

export const OMNISCRIPTFORMATTEDDATAJSON = "OmniScriptFmtData";

function processPrefillValue(value) {
  try {
    if (typeof value === "string") {
      value = JSON.parse(value);
      return value;
    }
  } catch (ex) {
    return value;
  }

  return value;
}

/**
 * Use this function to get the url param (e.g. LanguageCode) in Language = Multi-Language
 * @param prefill - prefill Json
 */
export function getUrlParams(prefill, params) {
  if (prefill && params && Array.isArray(params) && params.length > 0) {
    if (typeof prefill === "string") {
      prefill = JSON.parse(prefill);
    }
    if (prefill) {
      let returnObj = {};
      for (let i = 0; i < params.length; i++) {
        returnObj[params[i]] = prefill[params[i]];
      }
      return returnObj;
    }
  }
  return {};
}

/**
 * If an os is multi-language, attempt to get the translated value, other return the propSetMapLabel.
 * @param {OmniElementDefinition} step
 * @param {Boolean} multiLang
 * @param {OmniScriptHeader.allCustomLabelsUtil} customLabels
 * @returns String
 */
export function getStepLabel(step, multiLang, customLabels) {
  const label = getStepPropSetLabel(step);

  if (multiLang === true && label) return customLabels[label];

  return label;
}

/**
 * Return the value of propSetMap.label otherwise return ''.
 * @param {OmniElementDefinition} step
 * @returns String
 */
function getStepPropSetLabel(step) {
  if (step && step.propSetMap && step.propSetMap.label)
    return step.propSetMap.label;

  return "";
}

/**
 * Use this function to load js from SFDC static resource only once
 * @param prefill - prefill Json,
 * @param scriptJson - script full Json
 */
export function scriptDataJsonInit(
  prefill,
  scriptJson,
  systemInfo,
  recordId,
  urlParams
) {
  // prefill currently is assumed to be key/value pair (where value is primitive type)
  // we need to delete those internal nodes from url params
  // TODO: we need to also sanitize key and value

  // overwrite order: url params (prefill) -> designer seedDataJSON
  // then merge nodes that do not match any OmniScript UI elements into data JSON
  // the remaining will be the cached json
  let prefillJson = {};

  if (prefill) {
    if (typeof prefill === "string") {
      prefill = JSON.parse(prefill);
    }

    Object.keys(prefill).forEach(function (item) {
      if (internalUrlKeyList.indexOf(item) < 0) {
        prefillJson[item] = processPrefillValue(prefill[item]);
      }
    });
  }

  if (recordId) {
    prefillJson.ContextId = recordId;
  }

  if (urlParams) {
    Object.keys(urlParams).forEach((item) => {
      if (internalUrlKeyList.indexOf(item) < 0) {
        prefillJson[item] = processPrefillValue(urlParams[item]);
      }
    });
  }

  // update full json with real time system fields
  scriptJson.timeStamp = systemInfo.timeStamp;
  scriptJson.userId = systemInfo.userId;
  scriptJson.userName = systemInfo.userName;
  scriptJson.userProfile = systemInfo.userProfile;
  scriptJson.userTimeZone = systemInfo.userTimeZone;
  scriptJson.userTimeZoneName = systemInfo.userTimeZoneName;
  scriptJson.userCurrencyCode = systemInfo.userCurrencyCode;

  mergeWith(scriptJson.propSetMap.seedDataJSON, prefillJson, mergeJSONLogic);

  // only keep nodes that matches uiElement
  // the rest of nodes will be merged into data JSON
  let keyList = [];
  let mergeIntoDataJson = {};
  const uiElements = scriptJson.labelMap;
  if (uiElements) {
    Object.keys(scriptJson.propSetMap.seedDataJSON).forEach(function (item) {
      if (!uiElements.hasOwnProperty(item)) {
        keyList.push(item);
      }
    });
    for (let i = 0; i < keyList.length; i++) {
      mergeIntoDataJson[keyList[i]] =
        scriptJson.propSetMap.seedDataJSON[keyList[i]];
      delete scriptJson.propSetMap.seedDataJSON[keyList[i]];
    }
    mergeWith(scriptJson.response, mergeIntoDataJson, mergeJSONLogic);
  }
}

const operatorMap = { AND: "&&", OR: "||" };
const conditionMap = {
  "=": "==",
  "<>": "!=",
  "<": "<",
  "<=": "<=",
  ">": ">",
  ">=": ">="
};

export function evalCondition(control, type, comp, noCache) {
  var ctrlShowExprData =
    type === "show" ? comp._showExprData : comp._validateExprData;
  var ctrlShowCondition =
    type === "show"
      ? control.propSetMap.show
      : control.propSetMap.validateExpression;
  if (ctrlShowCondition === null) {
    return true;
  }

  let result = false;

  // nullifies crtlShowExprData so that show condition always gets computed
  if (noCache) {
    ctrlShowExprData = null;
  }

  if (!ctrlShowExprData) {
    ctrlShowExprData = computed(ctrlShowCondition.group);

    if (!noCache) {
      if (type === "show") {
        comp._showExprData = ctrlShowExprData;
      } else {
        comp._validateExprData = ctrlShowExprData;
      }
    }
  }

  const ctrlShowExpression = ctrlShowExprData.expression;

  // change it to use deepClone
  let data = ctrlShowExprData.data;
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let eleName = key;
      // support |n syntax
      data[key] = getElementValue(
        eleName,
        comp._jsonData,
        comp.scriptHeaderDef.labelMap,
        isRepeatNotation(eleName) ? comp.jsonDef.JSONPath : null
      );
    }
  }

  // merge field - change it to use deepClone
  let mergeField = ctrlShowExprData.mergeField;
  for (let key in mergeField) {
    if (mergeField.hasOwnProperty(key)) {
      let elem = key;
      mergeField[key] = handleMergeField(
        elem,
        comp._jsonData,
        comp.scriptHeaderDef.labelMap,
        isRepeatNotation(elem) ? comp.jsonDef.JSONPath : null
      );
      if (mergeField[key] === "") {
        mergeField[key] = null;
      }
    }
  }

  if (ctrlShowExpression !== "()" && ctrlShowExpression !== "") {
    try {
      // eslint-disable-next-line no-new-func
      result = Function("data, mergeField", "return " + ctrlShowExpression)(
        data,
        mergeField
      );
    } catch (e) {
      window.console.error(
        `Invalid expression: function(data, mergeField) {\n\treturn ${ctrlShowExpression}(data, mergeField);\n}`
      );
    }
  }

  return result;
}

function computed(group) {
  var result = { expression: "", data: {}, mergeField: {} };
  if (!group || !group.rules) {
    return result;
  }
  let dataMap = {};
  let mfMap = {};
  let str = "(";
  for (let i = 0; i < group.rules.length; i++) {
    if (i > 0) {
      str += " " + operatorMap[group.operator] + " ";
    }

    if (group.rules[i].group) {
      const s = computed(group.rules[i].group);
      str += s.expression;
      for (let key in s.data) {
        if (s.data.hasOwnProperty(key)) {
          dataMap[key] = s.data[key];
        }
      }
      for (let key in s.mergeField) {
        if (s.mergeField.hasOwnProperty(key)) {
          mfMap[key] = s.mergeField[key];
        }
      }
      if (s.repeat && !result.repeat) {
        result.repeat = true;
      }
    } else {
      if (group.rules[i].field == null || group.rules[i].condition == null) {
        break;
      }
      const val = handleConditionData(group.rules[i].data, mfMap);
      dataMap[group.rules[i].field] = null;
      str +=
        "data['" +
        group.rules[i].field +
        "'] " +
        conditionMap[group.rules[i].condition] +
        " " +
        val;

      if (isRepeatNotation(group.rules[i].field)) {
        result.repeat = true;
      }

      if (!result.repeat && isRepeatNotation(group.rules[i].data)) {
        result.repeat = true;
      }
    }
  }

  result.expression = str + ")";
  result.data = dataMap;
  result.mergeField = mfMap;

  return result;
}

function handleConditionData(data, mfMap) {
  if (data !== null && data !== undefined && typeof data === "string") {
    let fields;
    if (data.indexOf("%") >= 0) {
      fields = data.match(/%([^[%]+)%/g);
    }

    if (fields) {
      mfMap[data] = null;
      data = "mergeField['" + data + "']";
    } else {
      if (data === "true") {
        data = true;
      } else if (data === "false") {
        data = false;
      }

      if (
        data !== null &&
        data !== undefined &&
        typeof data === "string" &&
        data !== ""
      ) {
        data = "'" + data + "'";
      }

      if (data === "") {
        data = null;
      }
    }
  }

  return data;
}

export function handleMergeField(
  inputStr,
  jData,
  uiElements,
  JSONPath,
  bFormat,
  bNotEscape
) {
  if (inputStr == null) {
    return "";
  }

  let fields = inputStr.match(/%([^[%]+)%/g);
  let resultName = inputStr;
  let i, elem, elemValue;

  if (fields) {
    for (i = 0; i < fields.length; i++) {
      elem = fields[i].replace(/%/g, "");
      elemValue = getElementValue(
        elem,
        jData,
        uiElements,
        isRepeatNotation(elem) ? JSONPath : null,
        bFormat
      );
      {
        if (elemValue == null) {
          resultName = resultName.split(fields[i]).join("");
        } else {
          if (!bNotEscape && typeof elemValue === "string") {
            elemValue = elemValue.replace(/\\/g, "\\\\");
            elemValue = elemValue.replace(/["]/g, '\\"');
            elemValue = elemValue.replace(/[\r\n]+/gm, "\\n");
            elemValue = elemValue.replace(/\t/g, "\\t");
            elemValue = elemValue.replace(/\f/g, "\\f");
          }
          if (typeof elemValue === "string") {
            resultName = resultName.split(fields[i]).join(elemValue);
          } else if (
            elemValue.constructor === Object ||
            Array.isArray(elemValue)
          ) {
            resultName = resultName
              .split('"' + fields[i] + '"')
              .join(JSON.stringify(elemValue));
            resultName = resultName
              .split(fields[i])
              .join(JSON.stringify(elemValue));
          } else {
            if (
              fields.length === 1 &&
              inputStr.match("^%") &&
              inputStr.match("%$")
            ) {
              resultName = elemValue;
            } else {
              resultName = resultName
                .split('"' + fields[i] + '"')
                .join(elemValue);
              resultName = resultName.split(fields[i]).join(elemValue);
            }
          }
        }
      }
      // To be Done later
      // else if (!isNaN(index)) {
      //     if (elem != null) {
      //         resultName = resultName.split(fields[i]).join('%' + elem + '%');
      //     }
      // }
    }
  }

  if (
    resultName &&
    typeof resultName === "string" &&
    resultName.indexOf("$Vlocity.Percent") > -1
  ) {
    resultName = resultName.replace(/\$Vlocity.Percent/g, "%");
  }

  resultName = resultName == null ? "" : resultName;
  return resultName;
}

export function getElementValue(prop, jData, uiElements, JSONPath, bFormat) {
  // if the element is not found, return undefined instead of null
  try {
    // We want to support non-full-path merge field (because of backward compatiblity)
    // for example, if there is an Omni element called Text1
    // the current angular OS allows the user to just specify %Text1%, not '%
    if (uiElements) {
      let substrArray = prop.split(":");
      if (substrArray && substrArray.length > 0) {
        let idx = substrArray[0].indexOf("|");
        if (idx >= 0) {
          // Block1|n will be replaced by Step1:Block1|n so that it has the full path
          let saveStr = substrArray[0].slice(idx, substrArray[0].length);
          substrArray[0] = substrArray[0].slice(0, idx);
          if (uiElements.hasOwnProperty(substrArray[0])) {
            substrArray[0] = uiElements[substrArray[0]];
          }
          substrArray[0] += saveStr;
        } else if (uiElements.hasOwnProperty(substrArray[0])) {
          substrArray[0] = uiElements[substrArray[0]];
        }
      }
      prop = substrArray.join(":");
    }

    const propArray = preprocessElementInput(prop, JSONPath);
    prop = "";
    for (let i = 0; i < propArray.length; i++) {
      prop += propArray[i].join("|");
      if (i < propArray.length - 1) {
        prop += ":";
      }
    }

    // get formatted value
    if (
      bFormat &&
      jData.hasOwnProperty(OMNISCRIPTFORMATTEDDATAJSON) &&
      jData[OMNISCRIPTFORMATTEDDATAJSON] &&
      jData[OMNISCRIPTFORMATTEDDATAJSON].hasOwnProperty(prop)
    ) {
      return jData[OMNISCRIPTFORMATTEDDATAJSON][prop];
    }
    return getJSONNode(jData, propArray);
  } catch (err) {
    window.console.log("getElementValue: " + err);
    return null;
  }
}

export function getJSONNode(data, propArray) {
  var bArray = false;
  var returnData, idx1, i, tmp, rdata;
  data = [data];
  if (propArray && propArray.length > 0) {
    for (idx1 = 0; idx1 < propArray.length; idx1++) {
      returnData = [];
      for (i = 0; i < data.length; i++) {
        tmp = getJSONDataByPath(data[i], propArray[idx1]);
        if (tmp && Array.isArray(tmp)) {
          bArray = true;
        }
        if (tmp != null) {
          returnData = returnData.concat(tmp);
        }
      }
      data = returnData;
      if (!returnData || returnData.length === 0) {
        break;
      }
    }
    if (data) {
      if (data.length === 1) {
        if (data[0] != null && data[0].toLocaleString() !== "NaN") {
          if (!bArray) {
            rdata = data[0];
          } else {
            rdata = data;
          }
        } else {
          rdata = null;
        }
        return rdata === "" ? null : rdata;
      } else if (data.length > 1) {
        return data;
      }
    }

    return null;
  }

  return null;
}

export function isRepeatNotation(key) {
  var parseFlds;
  if (key != null && typeof key === "string") {
    parseFlds = key.match(/[|]( *)[n]/g);
    if (parseFlds && parseFlds.length > 0) {
      return true;
    }
  }
  return false;
}

export function preprocessElementInput(prop, JSONPath) {
  if (!prop) {
    return null;
  }

  let substrArray = prop.split(":");
  if (substrArray) {
    for (let ind = 0; ind < substrArray.length; ind++) {
      substrArray[ind] = substrArray[ind].split("|");
    }
  }

  if (isRepeatNotation(prop) && JSONPath) {
    let lstToken = JSONPath.split(":");
    if (lstToken) {
      for (let ind = 0; ind < lstToken.length; ind++) {
        lstToken[ind] = lstToken[ind].split("|");
      }
    }

    substrArray = comparePath(substrArray, lstToken);
  }

  return substrArray;
}

function comparePath(pathArray1, pathArray2) {
  // pathArray1 = Step1:Block1:Text2|n - |n syntax means to locate the corresponding parent/gparent...
  // block and evaluate Text2 in that context (so Step1:Block1|n:Text2 will be the same)
  // pathArray2 = Step1:Block1|1:Radio1
  // we need to compare Step1:Block1 and Step1:Block|1
  // pathArray1 = "Step1:Block1:Text1|n" and pathArray2 = "Step1:Block1|1:TextBlock1" --> Step1:Block1|1:Text1
  let returnArray = pathArray1;
  if (pathArray1 && pathArray2) {
    const minLength = Math.min(pathArray1.length, pathArray2.length);
    let index = minLength;
    for (let i = 0; i < minLength; i++) {
      if (pathArray1[i][0] !== pathArray2[i][0]) {
        index = i;
        break;
      }
    }

    if (index != null && index > 0) {
      index--;
      returnArray = [
        ...pathArray2.slice(0, index + 1),
        ...pathArray1.slice(index + 1, pathArray1.length)
      ];
    }

    if (
      returnArray[returnArray.length - 1].length > 1 &&
      returnArray[returnArray.length - 1][1] === "n"
    ) {
      returnArray[returnArray.length - 1].pop();
    }
  }

  return returnArray;
}

export function getJSONDataByPath(data, path) {
  var index;
  if (path.length === 0) {
    return null;
  }
  if (!data) {
    return null; //weird instance when this is called before the response is created
  }

  try {
    data = data[path[0]];

    if (data instanceof Date) {
      // formats Date data to ISO format
      data = data.toISOString();
    }

    if (data == null) {
      return null;
    }

    index = NaN;
    // data is not an array
    if (path.length === 1 && Array.isArray(data)) {
      return data;
    }
    if (path.length > 1 && !Array.isArray(data)) {
      data = [data];
    }

    // data is an array
    if (path.length > 1) {
      if (isDigit(path[1])) {
        index = parseInt(path[1], 10) - 1;
      } else {
        index = NaN;
      }
    }

    if (!isNaN(index)) {
      if (index < data.length && index >= 0) {
        data = data[index];
        if (data == null) {
          return null;
        }
        return data;
      }
      return null;
    }

    return data;
  } catch (err) {
    window.console.log("getJSONDataByPath: " + err);
    return null;
  }
}

export function isDigit(s) {
  return /[\d()+]/.test(s);
}

/**
 * Use this function to update a node in full json tree
 * @param scriptJson - example: full JSON of the script
 * @param aggregateNodesPath - it's an array of path/value
 * example - [{"value":{"key01":["funny1","funny2"],"Checkbox1":false},"path":"children|1"},{"value":false,"path":"children|4:eleArray|1"}]
 * this example represents this structure: Step1:Checkbox1, in full json def, it is
 * children[0].children[3].eleArray[0], and we want to update children[0].response (Step1 level)
 * children[0].children[3].eleArray[0].response
 * @param nodeName, the json node to update, in the above example, it's response
 * you can use this function to update any node in full json tree or update multile nodes while
 * traversing down the tree (aggregateNodesPath is an array of paths from the root of the tree)
 */
export function updateJsonDef(scriptJson, aggregateNodesPath, nodeName) {
  let jData = scriptJson;
  for (let i = 0; i < aggregateNodesPath.length; i++) {
    jData = updateJson(jData, aggregateNodesPath[i].path, "update", [
      {
        nodeName: nodeName,
        newData: aggregateNodesPath[i].value
      }
    ]);
  }
}

/**
 * Use this function to load js from SFDC static resource only once
 * @param json - input json
 * @param path - path to the node
 * example - xxx|2:yyy:zzz|3; xxx:yyy|1:yyy
 * @param operation: 'update', 'delete', 'new'
 * @param updateNodeList is array of the node you want to update/delete/add
 * example: response, or xxx|1
 */
export function updateJson(json, path, operation, updateNodeList) {
  let propArray = preprocessElementInput(path);
  let jData = json;
  if (propArray && jData) {
    for (let j = 0; j < propArray.length; j++) {
      if (jData) {
        if (propArray[j].length > 1 && jData[propArray[j][0]]) {
          jData = jData[propArray[j][0]][parseInt(propArray[j][1], 10) - 1];
        } else {
          jData = jData[propArray[j][0]];
        }
      } else {
        break;
      }
    }
  }

  if (jData) {
    for (let i = 0; i < updateNodeList.length; i++) {
      if (operation === "update") {
        jData[updateNodeList[i].nodeName] = updateNodeList[i].newData;
      } else if (operation === "delete") {
        delete jData[updateNodeList[i].nodeName];
      }
    }
  }

  return jData;
}

// get the prefix of lwcId, for example
// input = lwc01-0
// output = lwc01
function handleLWCId(lwcId) {
  if (lwcId) {
    const dashIndex = lwcId.indexOf("-");
    return lwcId.slice(0, dashIndex);
  }
  return lwcId;
}

/**
 * Use this function to process a cloned node when an element is repeated
 * @param node - cloned node (element)
 * @param totalSize - size of eleArray
 * OmniScript repeat - if the user clicks Add on the nth element, it'll insert
 * at the (n+1)th position
 */
export function processCloneNode(node, totalSize, maxCount, apiClone, rMap) {
  let oldJSONPath, newJSONPath;
  // example Step1:Block|2 ---> Step1:Block|3
  oldJSONPath = node.JSONPath + "|" + (node.index + 1);
  newJSONPath = node.JSONPath + "|" + (node.index + 2);

  // use this to trigger omniaggregate (operation = 'add') in omniscriptBaseElement:connectedCallback
  node.newClone = true;
  // (n+1)th
  node.index += 1;
  // lwcId has to be unique and new
  // example, if you clone 0th element (lwc01-0), the new node will (index=1, lwcId='lwc01-1')
  // then if you again clone 0th element, the new node will be inserted in between
  // 0th and 1th, so index = 1, lwcId='lwc01-2'
  // the one cloned before will be pushed to 2th --> index = 2, lwcId='lwc01-1'
  node.lwcId = handleLWCId(node.lwcId) + "-" + maxCount;
  // total count of eleArray, used to render Add/Delete, etc. in Block/Edit Block etc.
  node.ct = totalSize + 1; // count

  // repeatClone = false --> should NOT copy over the values of the sub elements
  let bNullifyResponse = !node.propSetMap.repeatClone;

  // also need to reset bInit so that defaultValue can be set in omniscriptBaseElement:connectedCallback
  if (bNullifyResponse) {
    node.response = nullifyResponse(node.response, rMap);
    node.bInit = false;
  }

  // need to recursively process child tree (if the element is a group element)
  if (node.children && node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      if (apiClone) {
        node.children[i].eleArray.splice(
          1,
          node.children[i].eleArray.length - 1
        );
      }
      for (let j = 0; j < node.children[i].eleArray.length; j++) {
        processChildNode(
          node.children[i].eleArray[j],
          bNullifyResponse,
          bNullifyResponse,
          true,
          oldJSONPath,
          newJSONPath,
          null,
          null,
          apiClone,
          rMap
        );
      }
    }
  }
}

function nullifyResponse(json, rMap) {
  if (json != null) {
    if (json.constructor === Object) {
      Object.keys(json).forEach(function (item) {
        if (rMap[item] !== undefined && Array.isArray(json[item])) {
          for (let i = 0; i < json[item].length; i++) {
            json[item][i] = nullifyResponse(json[item][i], rMap);
          }
        } else {
          json[item] = null;
        }
      });
    } else {
      return null;
    }
  }
  return json;
}

export function processChildNode(
  node,
  resetbInit,
  bNullifyResp,
  resetJSONPath,
  oldJSONPath,
  newJSONPath,
  newIndex,
  count,
  apiClone,
  rMap
) {
  if (count != null) {
    node.ct = count;
  }

  if (resetbInit) {
    node.bInit = false;
  }

  if (bNullifyResp) {
    node.response = nullifyResponse(node.response, rMap);
    // W-13542223 - comment out below line, as it causes two issues for node in block (grandchild and below) via Add button
    // 1. node value with default or formula are set and aggregated correctly after element rendered callback,
    //    they're overwritten with null from $Vlocity.seed after block rendered callback
    // 2. node without default values are displayed with null value in data json in UI,
    //    which is inconsist with the orginal block which the new block is cloned from
    //node['$Vlocity.seed'] = node.response;
  }

  if (resetJSONPath) {
    node.JSONPath = node.JSONPath.replace(oldJSONPath, newJSONPath);
    if (node.propSetMap.taAction && node.propSetMap.taAction.JSONPath) {
      node.propSetMap.taAction.JSONPath =
        node.propSetMap.taAction.JSONPath.replace(oldJSONPath, newJSONPath);
    }
  }

  if (newIndex != null) {
    node.index = newIndex;
  }

  if (node.children && node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      for (let j = 0; j < node.children[i].eleArray.length; j++) {
        processChildNode(
          node.children[i].eleArray[j],
          resetbInit,
          bNullifyResp,
          resetJSONPath,
          oldJSONPath,
          newJSONPath,
          null,
          null,
          apiClone,
          rMap
        );
      }
    }
  }
}

/**
 * @description Use this function to get the response depending on the jsonPath and jsonNode.
 * @param {Object} response
 * @param {Object} jsonPath
 * @param {Object} jsonNode
 * @param {Object} eleJSONPath
 * @param {Object} uiElements
 * @param {Boolean} [sendOnlyExtraPayload]
 * @returns {Object}
 */
export function getSendResponseJSON(
  response,
  jsonPath,
  jsonNode,
  eleJSONPath,
  uiElements,
  sendOnlyExtraPayload
) {
  if (sendOnlyExtraPayload === true) {
    return null;
  }

  let respDataJson = {},
    resp,
    rNode;

  if (jsonPath) {
    const propArray = preprocessElementInput(jsonPath);

    if (propArray && propArray.length > 0) {
      resp =
        getElementValue(
          jsonPath,
          response,
          uiElements,
          isRepeatNotation(jsonPath) ? eleJSONPath : null,
          false
        ) || {};
      rNode = propArray[propArray.length - 1][0];
    }
  } else {
    resp =
      response instanceof Array ? [...response] : Object.assign({}, response);
  }

  // No root node
  if ((!jsonPath && !jsonNode) || jsonNode === "VlocityNoRootNode") {
    respDataJson = resp;
  }
  // Nested root node
  else if (jsonNode.indexOf(":") > -1) {
    const nodeKeys = preprocessElementInput(jsonNode);

    if (nodeKeys && nodeKeys.length > 0) {
      respDataJson = {};
      let reference = respDataJson,
        ele;

      // Creates nested object
      // key1:key2:key3 will create a nested object {key1:{key2:{key3:resp}}}
      for (let i = 0; i < nodeKeys.length; i++) {
        if (ele) {
          reference = reference[ele];
        }
        ele = nodeKeys[i][0];
        reference[ele] = {};
      }
      // Innermost node
      reference[ele] = resp;
    }
  }
  // One root node
  else {
    // use jsonNode over path's node
    rNode = jsonNode ? jsonNode : rNode;
    respDataJson[rNode] = resp;
  }

  // we need to also strip off 'OmniScriptFmtData' node if any
  delete respDataJson[OMNISCRIPTFORMATTEDDATAJSON];
  return respDataJson;
}

/**
 * use this function to identify if a value exists in an array consisting of
 * objects
 * @param {string} property
 * @param {*} value
 * @param {array} array
 */
export function checkArrObjPropExists(property, value, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][property] === value) {
      return true;
    }
  }

  return false;
}

/**
 * Checks to see if the browser is a mobile browser
 * @returns {Boolean}
 */
export function checkIfMobileView() {
  let isMobile = false;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true;
  }

  return isMobile;
}

/**
 * Use this function to auto Advance to the destination step
 * @param options - input json
 * @param index - index of the driving value
 * @param comp - component
 */

export function autoAdvance(options, index, comp) {
  const itemResult = options[index];
  if (itemResult && itemResult.autoAdv != null) {
    comp.dispatchOmniEventUtil(
      comp,
      { moveToStep: itemResult.autoAdv },
      "omniautoadvance"
    );
  }
}

/**
 * Checks to see if the arrays inputted in the arguments are the same. This method performs a deep comparison on the
 * array's elements.
 * - ex:
 * - arr1 [{a:1, b:2}, {c:3, d:4}]
 * - arr2 [{b:2, a:1}, {d:4, c:3}]
 * - returns true
 * @param {arr} arr1 - first array to be compared
 * @param {arr} arr2 - second array to be compared
 * @returns {boolean}
 */
export function isArrayEqual(arr1, arr2) {
  return xorWith(arr1, arr2, isEqual).length === 0;
}

/**
 * Generates a universally unique identifier (UUID)
 * @returns {string}
 */
export function generateUUID() {
  let d = Date.now();

  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);

    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
}

/**
 * Beforeunload handler bound to omniscriptHeader.
 * @this {OmniScriptHeader}
 * @param {Event} evt
 */
export function beforeUnloadHandler(evt) {
  if (this._isOsVisible) {
    evt.preventDefault();
    evt.returnValue = "";
  }
}

/**
 * Method used to determine if the script is running in the App or Community Builders.
 * @returns {boolean}
 */
export function isInBuilder() {
  return (
    location.pathname.indexOf("flexipageEditor") > -1 ||
    location.host.indexOf("livepreview") > -1
  );
}
