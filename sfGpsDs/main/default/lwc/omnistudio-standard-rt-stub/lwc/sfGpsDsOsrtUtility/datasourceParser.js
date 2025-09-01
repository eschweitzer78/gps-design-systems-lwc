function datasourceParser(datasource) {
  datasource = { ...datasource };
  datasource.value = { ...datasource.value };
  let replaceKeys = {};
  switch (datasource.type) {
    case "ApexRemote":
      replaceKeys = {
        remoteClass: "className",
        optionsMap: "optionsMap",
        remoteMethod: "methodName",
        inputMap: "inputMap"
      };
      break;
    case "DataRaptor":
      replaceKeys = {
        bundle: "bundleName",
        inputMap: "inputMap",
        optionsMap: "optionsMap"
      };
      break;
    case "IntegrationProcedures":
      replaceKeys = {
        ipMethod: "ipMethod",
        inputMap: "inputMap",
        optionsMap: "optionsMap"
      };
      break;
    case "REST":
      replaceKeys = {
        header: "headers",
        body: "data"
      };
      break;
    case "Dual":
      replaceKeys = {
        remoteClass: "className",
        optionsMap: "optionsMap",
        remoteMethod: "methodName",
        inputMap: "inputMap"
      };
      break;
    case "ApexRest":
      replaceKeys = {
        body: "payload"
      };
      break;
    default:
      break;
  }

  if (
    datasource.value &&
    datasource.value.header &&
    datasource.value.header.length > 0
  ) {
    let headerArray = datasource.value.header;
    datasource.value.header = headerArray.reduce(function (obj, item) {
      obj[item.name] = item.val;
      return obj;
    }, {});
  }

  Object.keys(replaceKeys).forEach(function (key) {
    let hasField = datasource.value[key];
    let newKey = replaceKeys[key];
    if (hasField) {
      datasource.value[newKey] =
        typeof hasField === "string" ? hasField : JSON.stringify(hasField);
      if (key !== newKey) {
        delete datasource.value[key];
      }
    }
  });

  return datasource;
}

export default datasourceParser;
