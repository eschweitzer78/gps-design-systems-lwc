import { getInteractionObject } from "c/sfGpsDsOsrtSalesforceUtils";

let _interactionData = [];
let interactionPromise = {};
let InteractionList = {};

function getInteractionData(Id) {
  if (!_interactionData[Id]) {
    interactionPromise = new Promise((resolve) => {
      if (!InteractionList[Id]) {
        InteractionList[Id] = getInteractionObject({ interactionId: Id }).then(
          (data) => {
            _interactionData[Id] = data;
            return data;
          }
        );
      }
      resolve(InteractionList[Id]);
    });
  } else {
    interactionPromise = new Promise((resolve) => {
      resolve(_interactionData[Id]);
    });
  }
  return interactionPromise;
}

function setInteractionData(Id, obj) {
  if (_interactionData[Id]) {
    _interactionData[Id] = obj;
  }
}

export { getInteractionData, setInteractionData };
