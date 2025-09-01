import omniMessageIn from "@salesforce/messageChannel/sfGpsDsOsrtOmniscriptMessageIn__c";
import omniMessageOut from "@salesforce/messageChannel/sfGpsDsOsrtOmniscriptMessageOut__c";
import {
  publish,
  subscribe,
  createMessageContext,
  APPLICATION_SCOPE
} from "lightning/messageService";

export default class OmniscriptActionsCoreUtils {
  constructor() {
    this._id = 0;
    this._actionTable = {};

    this.messageContext = createMessageContext();
    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        omniMessageOut,
        (message) => this.handleOmniActionPubsubUtil(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  publishToMessageChannel(data) {
    publish(this.messageContext, omniMessageIn, data);
  }

  /**
   * Handles the omniscript core action results and resolves the correct promise
   * @param {Object} event
   */
  handleOmniActionPubsubUtil(event) {
    // check action table and find id, otherwise do nothing
    if (event?.id != null && event.data != null) {
      this.callPromiseFromTable(event.id, event.data);
    }
  }

  /**
   * Sends data to the omniscript core action utility to handle calling the action
   * @param {Object} data
   * @param {Object} callback
   */
  sendOmniActionPubsub(data, callback) {
    const id = this.generateId();
    // include id in payload to know which callback is called
    data.id = id;
    this.addToActionTable(id, callback);

    this.publishToMessageChannel(data);
  }

  /**
   * Generates a unique id to be used as a hash for this action utility's instance
   * @returns a unique String
   */
  generateId() {
    // replace with better id generation later
    return this._id++;
  }

  /**
   * Store callback function into table mapped to id
   * @param {String} id
   * @param {Function} callback
   */
  addToActionTable(id, callback) {
    this._actionTable[id] = callback;
  }

  /**
   * After the action's is finished and returns the result,
   * call the correct promise based on the action id
   * @param {String} id
   * @param {Object} result
   */
  callPromiseFromTable(id, result) {
    try {
      // find promise in table based on id, then attempt to call the promise
      this._actionTable[id] && this._actionTable[id](result);
      delete this._actionTable[id];
    } catch (e) {
      window.console.error("omniscriptActionCoreUtils : " + e);
    }
  }

  createPromiseAction(data) {
    return new Promise((resolve) => {
      const callback = (result) => {
        resolve(result);
      };
      this.sendOmniActionPubsub(data, callback);
    });
  }

  runDataRaptorExtract(config) {
    const data = {
      config: config,
      actionType: "DataRaptor Extract"
    };
    return this.createPromiseAction(data);
  }

  runDataRaptorTurboExtract(config) {
    const data = {
      config: config,
      actionType: "DataRaptor Extract"
    };
    return this.createPromiseAction(data);
  }

  runDataRaptorPost(config) {
    const data = {
      config: config,
      actionType: "DataRaptor Post"
    };
    return this.createPromiseAction(data);
  }

  runDataRaptorTransform(config) {
    const data = {
      config: config,
      actionType: "DataRaptor Transform"
    };
    return this.createPromiseAction(data);
  }

  runIntegrationProcedure(config) {
    const data = {
      config: config,
      actionType: "Integration Procedure"
    };
    return this.createPromiseAction(data);
  }

  runApexRemote(config) {
    const data = {
      config: config,
      actionType: "Apex Remote"
    };
    return this.createPromiseAction(data);
  }
}
