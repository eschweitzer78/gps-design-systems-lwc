import { getCustomLabels } from "c/sfGpsDsOsrtSalesforceUtils";
import getUserProfile from "./userProfile";
import localStoreMethods from "./localStoreMethods";

let pendingLabels = [];
let labelMap = {};
let locale;

let fetchUserLanguage = function () {
  return new Promise(function (resolve) {
    locale = locale || localStoreMethods.getItem("userLocale");
    if (locale) resolve(locale);
    else {
      getUserProfile().then(function (userData) {
        locale = userData.language;
        localStoreMethods.setItem("userLocale", locale);

        resolve(locale);
      });
    }
  });
};

let getCustomLabel = function (pendingLabel, lang) {
  return getCustomLabels({ customLabels: pendingLabel, lang: lang });
};

let firstTimeRequesting = (reqLabels) => {
  return !pendingLabels[reqLabels.toString()];
};

let removeFromLabelQueue = (reqLabels) => {
  delete pendingLabels[reqLabels.toString()];
};

let storeInLabelQueue = (reqLabels, labelpromise) => {
  pendingLabels[reqLabels.toString()] = labelpromise;
};

let getLabelPromiseFromQueue = (reqLabels) => {
  return pendingLabels[reqLabels.toString()];
};

let checkLabelInlocalMap = (reqLabels, language) => {
  let cachedLabels =
    JSON.parse(localStoreMethods.getItem("customLabels")) || {};
  labelMap = { ...cachedLabels };
  let returnedLabels = {};
  let labels = [...reqLabels];
  // Nothing in cache, return
  if (!Object.keys(cachedLabels).length) {
    return {
      returnedLabels: returnedLabels,
      requestedLabels: labels
    };
  }
  labels.forEach((item) => {
    if (Object.keys(cachedLabels).indexOf(item) > -1) {
      let tempObj = cachedLabels[item];
      for (const key in tempObj) {
        if (key.toLowerCase() === language.toLowerCase()) {
          returnedLabels[item] = tempObj[key];
          labels = labels.filter((label) => label !== item);
        }
      }
    }
  });
  return {
    returnedLabels: returnedLabels,
    requestedLabels: labels
  };
};

let fetchLabels = (labelsArray, returnedLabels, defaultValuesObj, language) => {
  return new Promise(function (resolve, reject) {
    getCustomLabel(labelsArray, language)
      .then((res) => {
        let labels = JSON.parse(res).data;
        let messages = JSON.parse(res).messages || "";
        let isError = false;
        if (messages.length) {
          let messageObj = messages[0];
          if (messageObj.severity === "ERROR") {
            console.error(
              messageObj.message,
              ". Returning default values if any, else returning the keys."
            );
            labels = Object.keys(defaultValuesObj).length
              ? { ...defaultValuesObj }
              : labels;
            isError = true;
          }
        }
        for (const key in labels) {
          if (key !== "language" && key !== "totalSize") {
            returnedLabels[key] = labels[key];
            let lang = labels.language;
            labelMap[key] = { [lang]: labels[key] };
          }
        }
        // store localsMap to the storage if no error
        if (!isError)
          localStoreMethods.setItem("customLabels", JSON.stringify(labelMap));

        resolve(returnedLabels);
      })
      .catch(function (error) {
        console.error("error : ", error);
        reject(error);
      });
  });
};

let fetchCustomLabels = (labelsArray, language, defaultValues) => {
  defaultValues = defaultValues || [];
  let defaultValuesObj = {};
  // Store the default values in an obj
  if (labelsArray.length === defaultValues.length) {
    labelsArray.forEach(
      (item, index) => (defaultValuesObj[item] = defaultValues[index])
    );
  }
  return new Promise(function (resolve, reject) {
    fetchUserLanguage().then(function (lang) {
      language = language || lang;
      let returnedLabels;
      let labelsObj;
      let requestedLabels = [...labelsArray];
      labelsObj = checkLabelInlocalMap(requestedLabels, language);
      requestedLabels = labelsObj.requestedLabels;
      returnedLabels = labelsObj.returnedLabels;
      //if reqestedlabels are all available in localcopy and none in waiting stage resolve.
      if (Object.keys(returnedLabels).length && !requestedLabels.length) {
        resolve(returnedLabels);
      } else {
        // check is requested first  time
        if (firstTimeRequesting(requestedLabels)) {
          let labelpromise = fetchLabels(
            requestedLabels,
            returnedLabels,
            defaultValuesObj,
            language
          )
            .then((response) => {
              removeFromLabelQueue(requestedLabels);
              return response;
            })
            .catch((error) => {
              removeFromLabelQueue(requestedLabels);
              reject(error);
            });
          storeInLabelQueue(requestedLabels, labelpromise);
        }
        //resolve  from  queue
        resolve(getLabelPromiseFromQueue(requestedLabels));
      }
    });
  });
};

export default fetchCustomLabels;
