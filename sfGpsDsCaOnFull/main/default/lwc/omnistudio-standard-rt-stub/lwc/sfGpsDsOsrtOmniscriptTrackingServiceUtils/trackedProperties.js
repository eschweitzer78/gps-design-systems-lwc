/**
 * This file contains all of the mappings that are used to get the tracking payload for both the Vlocity Tracking
 * Service and Messaging.
 */

/**
 * @description JSON Definition mergefield mappings in accordance with the element's type that are common amongst all
 *              OmniScript elements.
 * @returns {Object}
 */
const trackedCommonTypeToJsonDefMap = {
  ElementLabel: "%label%",
  MessagingData: "%message%",
  BusinessCategory: "%businessCategory%",
  BusinessEvent: "%businessEvent%"
};

/**
 * @description JSON Definition mergefield mappings in accordance with the element's type. Each map should start from
 *              the trackedCommonTypeToJsonDefMap unless there is a specific reason why the common mergefield map values
 *              are not needed.
 * @returns {Object} Returns an object with a nested value that contains the mergefield syntax
 */
export const trackedTypeToJsonDefMap = {
  Step: trackedCommonTypeToJsonDefMap,
  "Remote Action": {
    ...trackedCommonTypeToJsonDefMap,
    RemoteClass: "%remoteClass%",
    RemoteMethod: "%remoteMethod%",
    SendJSONPath: "%sendJSONPath%",
    SendJSONNode: "%sendJSONNode%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%",
    UseContinuation: "%useContinuation%",
    PreTransformBundle: "%remoteOptions:preTransformBundle%",
    PostTransformBundle: "%remoteOptions:postTransformBundle%",
    InvokeMode: "%invokeMode%",
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%",
    ActionTargetName: "%remoteClass%",
    ActionTargetType: "Apex Class"
  },
  "Rest Action": {
    ...trackedCommonTypeToJsonDefMap,
    Type: "%type%",
    RestPath: "%restPath%",
    RestMethod: "%restMethod%",
    XmlPreTransformBundle: "%xmlPreTransformBundle%",
    XmlPostTransformBundle: "%xmlPostTransformBundle%",
    NamedCredential: "%namedCredentials%",
    SendJSONPath: "%sendJSONPath%",
    SendJSONNode: "%sendJSONNode%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%"
  },
  "DataRaptor Extract Action": {
    ...trackedCommonTypeToJsonDefMap,
    Bundle: "%bundle%",
    IgnoreCache: "%ignoreCache%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%",
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%",
    ActionTargetName: "%bundle%",
    ActionTargetType: "DataRaptor"
  },
  "DataRaptor Turbo Action": {
    ...trackedCommonTypeToJsonDefMap,
    Bundle: "%bundle%",
    IgnoreCache: "%ignoreCache%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%",
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%",
    ActionTargetName: "%bundle%",
    ActionTargetType: "DataRaptor"
  },
  "DataRaptor Post Action": {
    ...trackedCommonTypeToJsonDefMap,
    Bundle: "%bundle%",
    SendJSONPath: "%sendJSONPath%",
    SendJSONNode: "%sendJSONNode%",
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%",
    ActionTargetName: "%bundle%",
    ActionTargetType: "DataRaptor"
  },
  "DataRaptor Transform Action": {
    ...trackedCommonTypeToJsonDefMap,
    Bundle: "%bundle%",
    IgnoreCache: "%ignoreCache%",
    SendJSONPath: "%sendJSONPath%",
    SendJSONNode: "%sendJSONNode%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%",
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%",
    ActionTargetName: "%bundle%",
    ActionTargetType: "DataRaptor"
  },
  "Navigate Action": {
    ...trackedCommonTypeToJsonDefMap,
    ActionTargetName: "%targetName%",
    ActionTargetType: "%targetType%"
  },
  "Cancel Action": {
    ...trackedCommonTypeToJsonDefMap,
    ActionTargetName: "%targetName%",
    ActionTargetType: "%targetType%"
  },
  "Calculation Action": {
    ...trackedCommonTypeToJsonDefMap,
    RemoteClass: "%remoteClass%",
    RemoteMethod: "%remoteMethod%",
    ConfigurationName: "%remoteOptions:configurationName%",
    SendJSONPath: "%sendJSONPath%",
    SendJSONNode: "%sendJSONNode%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%",
    ActionTargetName: "%remoteClass%",
    ActionTargetType: "Apex Class"
  },
  "DocuSign Envelope Action": {
    ...trackedCommonTypeToJsonDefMap,
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%"
  },
  "DocuSign Signature Action": trackedCommonTypeToJsonDefMap,
  "Email Action": trackedCommonTypeToJsonDefMap,
  "Matrix Action": {
    ...trackedCommonTypeToJsonDefMap,
    MatrixName: "%remoteOptions:matrixName%",
    PostTransformBundle: "%remoteOptions:postTransformBundle%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%",
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%",
    ActionTargetName: "%remoteOptions:matrixName%"
  },
  "Integration Procedure Action": {
    ...trackedCommonTypeToJsonDefMap,
    Chainable: "%remoteOptions:chainable%",
    UseFuture: "%remoteOptions:useFuture%",
    UseQueueable: "%remoteOptions:useQueueable%",
    PreTransformBundle: "%remoteOptions:preTransformBundle%",
    PostTransformBundle: "%remoteOptions:postTransformBundle%",
    InvokeMode: "%invokeMode%",
    SendJSONPath: "%sendJSONPath%",
    SendJSONNode: "%sendJSONNode%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%",
    UseContinuation: "%useContinuation%",
    IntegrationProcedureKey: "%integrationProcedureKey%",
    ActionTargetName: "%integrationProcedureKey%",
    ActionTargetType: "Integration Procedure"
  },
  "Delete Action": {
    ...trackedCommonTypeToJsonDefMap,
    UseQueueableApexRemoting: "%remoteOptions:useQueueableApexRemoting%",
    ResponseJSONPath: "%responseJSONPath%",
    ResponseJSONNode: "%responseJSONNode%"
  },
  "PDF Action": {
    ...trackedCommonTypeToJsonDefMap,
    TemplateName: "%templateName%",
    SendJSONPath: "%sendJSONPath%",
    SendJSONNode: "%sendJSONNode%",
    PreTransformBundle: "%preTransformBundle%",
    ActionTargetName: "%templateName%"
  }
};

/**
 * @description Script Header mergefield mappings.
 * @type {Object}
 */
export const trackedScriptHeaderMap = {
  VlocityInteractionToken: "%uuid%",
  OmniScriptId: "%sOmniScriptId%",
  ComponentId: "%sOmniScriptId%",
  OmniScriptType: "%bpType%",
  OmniScriptSubType: "%bpSubType%",
  OmniScriptLanguage: "%bpLang%",
  OmniScriptVersion: "%bpVersion%",
  OmniScriptTypeSubTypeLang: "%omniscriptKey%",
  ScriptHeaderMessagingData: "%propSetMap:message%",
  TrackingCustomData: "%propSetMap:trackingCustomData%"
};

/**
 * @description Data JSON mergefield mappings.
 * @type {Object}
 */
export const trackedDataJsonMap = {
  OmniScriptContextId: "%ContextId%"
};

/**
 * @description Static Property mergefield mappings.
 * @type {Object}
 */
export const trackedStaticMap = {
  TrackingService: "OmniScript",
  TrackingCategory: "UI"
};
