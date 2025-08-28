import {
  getElementValue,
  handleMergeField,
  isRepeatNotation,
  getNamespaceDotNotation
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";

/**
 * Returns a configuration object to perform a remote call to get options for lookup element
 * @param jsonDef - json definition for Lookup element
 * @param jsonData - bpTree response data
 * @param namespace - namespace for managed package
 */
export function configureRemoteParams(comp) {
  let className;
  let methodName;
  let input = {};
  const jsonDef = comp.jsonDef;
  const jsonData = comp.jsonData;
  const namespace = getNamespaceDotNotation();
  const uiElements = comp.scriptHeaderDef.labelMap;
  const type = jsonDef.propSetMap.dataSource.type;
  const JSONPath = jsonDef.JSONPath;
  const option = {};

  if (type === "SObject") {
    className = namespace + "DefaultFetchPicklistOptionsImpl";
    methodName = "fetchLookupOptions";
    const mapItems = jsonDef.propSetMap.dataSource.mapItems;

    if (
      mapItems &&
      mapItems.phase1MapItems &&
      mapItems.phase2MapItems &&
      Array.isArray(mapItems.phase1MapItems) &&
      Array.isArray(mapItems.phase2MapItems) &&
      mapItems.phase1MapItems.length > 0 &&
      mapItems.phase2MapItems.length > 0
    ) {
      input.MapItems = mapItems.phase1MapItems.concat(mapItems.phase2MapItems);
      const inputParams =
        jsonDef.propSetMap.dataSource.mapItems.inputParameters;
      const queryCriteria = {};
      if (inputParams && Array.isArray(inputParams)) {
        for (let i = 0; i < inputParams.length; i++) {
          let eleName = inputParams[i].element;

          queryCriteria[inputParams[i].inputParam] = getElementValue(
            eleName,
            jsonData,
            uiElements,
            isRepeatNotation(eleName) ? JSONPath : null
          );
        }
        input.DRParams = queryCriteria;
      }
    }
  } else if (type === "Custom") {
    const source = jsonDef.propSetMap.dataSource.source;
    if (source) {
      let strArray = source.split(".");
      if (strArray) {
        if (strArray.length === 2) {
          className = strArray[0];
          methodName = strArray[1];
        } else if (strArray.length === 3) {
          className = strArray[0] + "." + strArray[1];
          methodName = strArray[2];
        }
      }
      input = jsonData;
      if (!input) input = {};
    }
  } else if (type === "PicklistFilteredbyRecordType") {
    className = namespace + "DefaultOmniScriptSObjectPicklist";
    methodName = "GetSObjectPicklistValues";
    const picklistObjectAndField =
      jsonDef.propSetMap.dataSource.picklistObjectAndField.split(".");
    option.picklistObject = picklistObjectAndField[0];
    option.picklistField = picklistObjectAndField[1];
    option.picklistRecordType = handleMergeField(
      jsonDef.propSetMap.dataSource.picklistRecordType,
      jsonData,
      uiElements,
      isRepeatNotation(jsonDef.propSetMap.dataSource.picklistRecordType)
        ? JSONPath
        : null
    );
    input = jsonData;
  }

  if (!className || !methodName) {
    return null;
  }

  return {
    sClassName: className,
    sMethodName: methodName,
    input: JSON.stringify(input),
    options: JSON.stringify(option),
    label: {
      label: jsonDef && jsonDef.name
    }
  };
}
