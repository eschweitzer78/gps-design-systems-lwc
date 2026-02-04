/**
 * @module ns/navigationUtils
 * @description This module exposes a collection of utilities designed to simplify navigational functions.
 */

//#region URL Utilities

/**
 * Expands query params to an object
 * @param {string} queryString - key=value pairs separated by &
 */
export function parseParams(queryString) {
  if (!queryString) return {};
  if (queryString.charAt(0) === "?") queryString = queryString.substring(1);

  const pairs = queryString.split("&");
  const pageParams = {};

  pairs.forEach((pair) => {
    pair = pair.split("=");
    if (typeof pair[1] === "undefined") {
      // â†“ If first entry with this name
      pageParams[pair[0]] = undefined;
    } else if (typeof pageParams[pair[0]] === "undefined") {
      pageParams[pair[0]] = parseValue(pair[1]);
    } else if (typeof pageParams[pair[0]] === "string") {
      // â†“ If second entry with this name
      const arr = [pageParams[pair[0]], parseValue(pair[1])];
      pageParams[pair[0]] = arr;
    } else {
      // â†“ If third or later entry with this name
      pageParams[pair[0]].push(parseValue(pair[1]));
    }
  });

  return pageParams;
}

/**
 * Convert an object to a queryString.
 * @param {object} params - Dictionary of key value pairs.
 * @param {string} namespace - Specify the namespace to be prefixed to to key names.
 */
export function stringifyParams(params, namespace = "c__") {
  return Object.keys(params).reduce((queryString, key) => {
    const value = params[key];
    if (value !== undefined)
      return `${queryString}${
        queryString !== "?" ? "&" : ""
      }${namespace}${key}=${value}`;

    return queryString;
  }, "?");
}

/**
 * Parse the value of a url parameter.
 * @param {string} value
 * @scope private
 * @returns {string}
 */
function parseValue(value) {
  value = decodeURIComponent(value.replace(/\+/g, " "));
  if (value.indexOf(",") > -1) value = value.split(",");

  return value;
}

/**
 * Returns a copy of a params object with the namespace values removed. Duplicate values will be overwritten.
 * @param {object} namespacedParams - A collection of params derived from pageReference.state.
 * @returns {object}
 */
export function normalizeParams(namespacedParams) {
  if (!namespacedParams) return {};

  const clone = {};

  // eslint-disable-next-line array-callback-return
  Object.keys(namespacedParams).map((paramName) => {
    const [name] = deNamespace(paramName);
    clone[name] = namespacedParams[paramName];
  });

  return clone;
}

/**
 * Takes a namespaced symbol and splits it into a [name, namespace] tuple.
 * Handles lightning, aura, and apex style namespaces.
 * @example const [name, namespace] = deNamespace('c__navigateAction') /// => ['navigateAction', 'c']
 * @param {string} namespacedSymbol
 * @returns {string[]} A string tuple containing [name, namespace] in that order.
 */
export function deNamespace(namespacedSymbol) {
  if (!namespacedSymbol) return [undefined, undefined];

  const match = namespacedSymbol.replace(
    /(^[\w-]+)(?:__|:|\/)([\w-]+$)/,
    "$2\0$1"
  );
  return match.split("\0");
}

//#endregion URL utilities

//#region PageReference utilities
/** @type {'App'} */
const APP = "App";

/** @type {'Component'} */
const COMPONENT = "Component";

/** @type {'Knowledge Article'} */
const KNOWLEDGE_ARTICLE = "Knowledge Article";

/** @type {'Login'} */
const LOGIN = "Login";

/** @type {'Object'} */
const OBJECT = "Object";

/** @type {'Record'} */
const RECORD = "Record";

/** @type {'Record Relationship'} */
const RELATIONSHIP = "Record Relationship";

/** @type {'Named Page'} */
const NAMED_PAGE = "Named Page";

/** @type {'Community Named Page'} */
const COMM_NAMED_PAGE = "Community Named Page";

/** @type {'Navigation Item'} */
const NAVIGATION_ITEM = "Navigation Item";

/** @type {'Web Page'} */
const WEB_PAGE = "Web Page";

/** @type {'Current Page'} */
const CURRENT_PAGE = "Current Page";

/**
 * @enum {string}
 * @readonly
 */
export const pageReferenceTypes = Object.freeze({
  APP,
  COMPONENT,
  KNOWLEDGE_ARTICLE,
  LOGIN,
  OBJECT,
  RECORD,
  RELATIONSHIP,
  NAMED_PAGE,
  COMM_NAMED_PAGE,
  NAVIGATION_ITEM,
  WEB_PAGE,
  CURRENT_PAGE
});

export class PageReference {
  /**
   * To navigate in Lightning Experience, Lightning Communities, or the Salesforce mobile app,
   * define a  PageReference object. The  PageReference type generates a unique URL format and
   * defines attributes that apply to all pages of that type.
   *
   * @param {PageReferenceType} type - Page reference type.
   * @param {Object} attributes - Page reference attributes.
   * @param {(string|any)} [stateParams] - State parameters passed to the target context.
   *                                       Can be in the form of a url query string or an object.
   */
  constructor(type, attributes, stateParams) {
    this.type = type;
    this.attributes = { ...attributes };
    if (typeof stateParams === "string") {
      this.state = { ...parseParams(stateParams) };
    } else if (stateParams) {
      this.state = { ...stateParams };
    }
  }

  /**
   * Utility method to unfreeze, and update PageReference object returned from @wire(CurrentPageReference) is frozen
   * @param {PageReference} pageReference - A page reference object received from @wire(CurrentPageReference)
   * @param {(string|any)} - [stateParams] - State parameters to be extended on the current reference.
   *                                         Can be in the form of a url query string or an object.
   */
  static unfreeze(pageReference, newParams) {
    if (pageReference == null) {
      pageReference = {};
    }
    return {
      ...pageReference,
      attributes: { ...pageReference.attributes },
      state: { ...pageReference.state, ...parseParams(newParams) }
    };
  }
}

export class AppPageReference extends PageReference {
  /**
   * A standard or custom app available from the App Launcher in an org. Use this type to create custom navigation
   * components that take users to a specific app or to a page within an app. Connected apps aren't supported.
   *
   * @param {string} appTarget - App that you are navigating to. Pass either the `appId` or `appDeveloperName` to the `appTarget`.
   * - The `appId` is the DurableId field on the AppDefinition object.
   * - To form the `appDeveloperName` value, concatenate the app's namespace with the developer name.
   * To find the app's developer name, navigate to the App Manager in Setup and look in the Developer Name column.
   * For standard apps, the namespace is `standard__`. For custom apps it's `c__`. For managed packages,
   * it's the namespace registered for the package.
   *
   * @param {PageReference} pageReference - Identifies a specific location in the app you are navigating to.
   * Pass in the `pageReference` and applicable attributes for that `pageReference` type.
   */
  constructor(appTarget, pageReference) {
    super("standard__app", { appTarget: appTarget, pageRef: pageReference });
  }
}

export class ComponentPageReference extends PageReference {
  /**
   * A Lightning component. To make an addressable Lightning web component,
   * embed it in an Aura component that implements the `lightning:isUrlAddressable` interface.
   *
   * @supports Lightning Experience, Salesforce Mobile App
   *
   * @param {string} name - The Lightning component name in the format  namespace__componentName
   * @param {(string|Object)} [stateParams] - State parameters passed to the target context.
   *                                          Can be in the form of a url query string or an object.
   */
  constructor(name, stateParams) {
    if (typeof stateParams === "string") stateParams = parseParams(stateParams);

    super("standard__component", { componentName: name }, stateParams);
  }
}

export class KnowledgeArticlePageReference extends PageReference {
  /**
   * A page that interacts with a Knowledge Article record.
   *
   * @param {string} articleType - The articleType API name of the Knowledge Article record. In Communities, articleType is ignored.
   * @param {string} urlName - The value of the urlName field on the target KnowledgeArticleVersion record. The urlName is the article's URL.
   * @param {(string|Object)} [stateParams] - State parameters passed to the target context.
   *                                          Can be in the form of a url query string or an object.
   */
  constructor(articleType, urlName, stateParams) {
    super(
      "standard__knowledgeArticlePage",
      {
        articleType: articleType,
        urlName: urlName
      },
      stateParams
    );
  }
}

export class ManagedContentPageReference extends PageReference {
  /**
   * A CMS content page in an Experience Builder site with a unique name.
   *
   * @param {string} contentTypeName - The name of the Salesforce CMS content type.
   * @param {string} contentKey - The unique content key that identifies CMS content.
   * @param {(string|Object)} [stateParams] - State parameters passed to the target context.
   *                                          Can be in the form of a url query string or an object.
   */
  constructor(contentTypeName, contentKey, stateParams) {
    super(
      "standard__managedContentPage",
      {
        contentTypeName: contentTypeName,
        contentKey: contentKey
      },
      stateParams
    );
  }
}

export class LoginPageReference extends PageReference {
  /**
   * A page for authentication into a community.
   *
   * @param {'login'|'logout'} action - A login-related action to be performed. Possible values are: 'login' or 'logout'.
   * @param {(string|Object)} [stateParams] - State parameters passed to the target context.
   * Can be in the form of a url query string or an object.
   */
  constructor(action, stateParams) {
    super("comm__loginPage", { actionName: action }, stateParams);
  }
}

export class NamedPageReference extends PageReference {
  /**
   * A standard page with a unique name. If an error occurs, the error view loads and the URL isn't updated.
   *
   * @param {string} pageName - The unique name of the page.
   * @param {(string|any)} [stateParams] - State parameters passed to the target context.
   * Can be in the form of a url query string or an object.
   */
  constructor(pageName, stateParams) {
    super("standard__namedPage", { pageName: pageName }, stateParams);
  }
}

export class CommNamedPageReference extends PageReference {
  /**
   * A standard page with a unique name, for use in communities. If an error occurs, the error view loads and the URL isn't updated.
   *
   * @param {string} name - The unique name of the page.
   * @param {(string|any)} [stateParams] - State parameters passed to the target context.
   * Can be in the form of a url query string or an object.
   */
  constructor(name, stateParams) {
    super("comm__namedPage", { name: name }, stateParams);
  }
}

export class NavItemPageReference extends PageReference {
  /**
   * A page that displays the content mapped to a CustomTab. Visualforce tabs, Web tabs, Lightning Pages, and Lightning Component tabs are supported.
   *
   * @param {string} tabName - The unique name of the CustomTab.
   * @param {(string|any)} [stateParams] - State parameters passed to the target context.
   *                                    Can be in the form of a url query string or an object.
   */
  constructor(tabName, stateParams) {
    super("standard__navItemPage", { apiName: tabName }, stateParams);
  }
}

export class ObjectPageReference extends PageReference {
  /**
   * A page that interacts with a standard or custom object in the org and supports standard actions for that object.
   *
   * @param {string} objectName - The API name of the standard or custom object. For custom objects that are part of a managed package, prefix the custom object with ns__
   * @param {string} [action=home] - The action name to invoke. Valid values include `home`,  `list`, and `new`. In Communities, `list` and `home` are the same.
   * @param {string} [filter=Recent] - Id of the object page. Default is Recent.
   * @param {(string|Object)} [stateParams] - State parameters passed to the target context.
   *                                          Can be in the form of a url query string or an object.
   */
  constructor(objectName, action = "home", stateParams) {
    super(
      "standard__objectPage",
      {
        objectApiName: objectName,
        actionName: action
      },
      stateParams
    );
  }
}
export class RecordPageReference extends PageReference {
  /**
   * A page that interacts with a relationship on a particular record in the org. Only related lists are supported.
   *
   * @param {string} id - The 18 character record ID.
   * @param {string} [objectName] - The API name of the record's object. Optional for lookups.
   * @param {string} [action=view] - The action name to invoke. Valid values include `clone`,  `edit`, and `view`.
   *                                 Communities doesn't support the values `clone` or `edit`.
   * @param {(string|Object)} [stateParams] - State parameters passed to the target context.
   *                                          Can be in the form of a url query string or an object.
   */
  constructor(id, objectName, action = "view", stateParams) {
    super(
      "standard__recordPage",
      {
        recordId: id,
        objectApiName: objectName,
        actionName: action
      },
      stateParams
    );
  }
}

export class RelationshipPageReference extends PageReference {
  /**
   * A page that interacts with a relationship on a particular record in the org. Only related lists are supported.
   *
   * @param {string} recordId - The 18 character record ID of the record that defines the relationship.
   * @param {string} [objectApiName] - The API name of the object that defines the relationship. Optional for lookups.
   * @param {string} [relationshipApiName] - The API name of the object's relationship field.
   * @param {string} [actionName] - The action name to invoke. Only view is supported.
   * @param {(string|Object)} [stateParams] - State parameters passed to the target context.
   *                                          Can be in the form of a url query string or an object.
   */
  constructor(
    recordId,
    objectApiName,
    relationshipApiName,
    actionName = "view",
    stateParams
  ) {
    super(
      "standard__recordRelationshipPage",
      {
        recordId: recordId,
        objectApiName: objectApiName,
        relationshipApiName: relationshipApiName,
        actionName: actionName
      },
      stateParams
    );
  }
}

export class WebPageReference extends PageReference {
  /**
   * An external URL.
   * @param {string} url - The URL of the page you are navigating to.
   * @param {any} stateParams - State parameters passed to the target context.
   */
  constructor(url, stateParams) {
    super("standard__webPage", { url: url }, stateParams);
  }
}

//#endregion PageReference utilities
