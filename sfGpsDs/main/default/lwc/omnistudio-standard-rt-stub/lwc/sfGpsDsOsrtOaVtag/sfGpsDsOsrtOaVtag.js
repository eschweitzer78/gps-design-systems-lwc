import * as utils from "./oaVtagUtils";
import pubsub from "c/sfGpsDsOsrtPubsub";

let bSendOAEventThroughWindow = false;

/**
 * track method lets you record the actions performed by user
 * @param {String} eventName  Required - Pass the event name you are tracking
 * @param {Object} properties Required - A property set for the event for tracking
 * Example:
 * vtag.track('Omniscript Step Load',{
 *      ComponentId: '10001', --> Required property
 *      ComponentName: 'Product List Component',
 *      ComponenType: 'Omniscript'
 * });
 */
const track = (eventName, properties) => {
  const trackingPayload = {
    event: eventName,
    value: properties,
    session: utils.getSessionDefaults.getInstance()
  };

  // Dispatches a custom window vtrack_cpckg event for cross namespace OA event handling
  if (bSendOAEventThroughWindow === true) {
    window.dispatchEvent(
      new CustomEvent("vtrack_cpckg", {
        detail: trackingPayload
      })
    );
  }
  // Utilizes same namespace pubsub for default scenarios which do not require cross
  // namespace event handling
  else {
    pubsub.fire("OmniAnalyticsChannel", "track", trackingPayload);
  }
};

const vtag = {
  track: track
};

export default vtag;
