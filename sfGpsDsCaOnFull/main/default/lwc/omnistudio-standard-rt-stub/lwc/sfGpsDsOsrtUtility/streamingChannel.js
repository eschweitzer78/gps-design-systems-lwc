import {
  subscribe,
  unsubscribe,
  onError,
  setDebugFlag,
  isEmpEnabled
} from "lightning/empApi";

let subscription;
let isRendered;

let subscribeEMP = (channelName, replayId, callback, debugFlag) => {
  if (!isRendered) {
    isRendered = true;
    // Uncomment below line to enable debug logging (optional)
    if (debugFlag) setDebugFlag(true);
    // Invoke onError empApi method
    onError((error) => {
      console.error("Received error from server: ", JSON.stringify(error));
      // Error contains the server-side error
    });
  }
  isEmpEnabled().then((val) => {
    if (!val) console.error("LWC Emp api is not supported in this platform");
  });
  if (!subscription) {
    subscribe(channelName, replayId, callback).then((response) => {
      // Response contains the subscription information on successful subscribe call
      // eslint-disable-next-line no-console
      console.log(
        "Successfully subscribed to : ",
        JSON.stringify(response.channel)
      );
      subscription = response;
    });
  }
};

let unsubscribeEMP = () => {
  return new Promise((resolve, reject) => {
    if (subscription) {
      unsubscribe(subscription, (response) => {
        // eslint-disable-next-line no-console
        console.log("unsubscribe() response: ", JSON.stringify(response));
        subscription = null;
        // Response is true for successful unsubscribe
        resolve(response);
      });
    } else {
      reject();
    }
  });
};

export { subscribeEMP, unsubscribeEMP };
