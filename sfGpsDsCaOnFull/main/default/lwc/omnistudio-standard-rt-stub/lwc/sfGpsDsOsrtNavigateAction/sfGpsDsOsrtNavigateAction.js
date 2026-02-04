import { api, LightningElement, track, wire } from "lwc";
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
import {
  pageReferenceTypes,
  ComponentPageReference,
  KnowledgeArticlePageReference,
  NavItemPageReference,
  ObjectPageReference,
  PageReference,
  RecordPageReference,
  RelationshipPageReference,
  NamedPageReference,
  CommNamedPageReference,
  WebPageReference,
  AppPageReference,
  LoginPageReference
} from "c/sfGpsDsOsrtNavigationUtils";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { get } from "c/sfGpsDsOsrtLodash";

export class StateChangeEvent extends CustomEvent {
  static type = "statechange";

  constructor(state) {
    super("statechange", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { ...state }
    });
  }
}

export default class NavigateAction extends NavigationMixin(LightningElement) {
  /**
   * The PageReference type to be navigated to,
   * see {ns/utils/pageReference.pageReferenceTypes} for details.
   * @type {PageReferenceType}
   * @scope api (public)
   */
  @api targetType;

  /**
   * The 18 character record ID.
   * @type {string}
   * @scope api (public)
   */
  @api targetId;

  /**
   * Name of the appm component, object, tab or record
   * @type {string}
   * @scope api (public)
   */
  @api targetName;

  /**
   * State params sent to the target page reference. In the case of an app type page reference, this can be a pageReference object.
   * @type {string}
   * @scope api (public)
   */
  @api get targetParams() {
    return this._targetParams;
  }

  set targetParams(value) {
    if (this.url && value !== this._targetParams) {
      this._targetParams = value;
      this.generateUrl();
    } else {
      this._targetParams = value;
    }
  }

  /**
   * Action passed to login, object, and record references.
   * @type {string}
   * @scope api (public)
   */
  @api targetAction;

  /**
   * The articleType API name of the Knowledge Article record. In Communities, articleType is ignored.
   * @type {string}
   * @scope api (public)
   */
  @api targetArticleType;

  /**
   * The relationship name of the record.
   * @type {string}
   * @scope api (public)
   */
  @api targetRelationship;

  /**
   * When replace is true, calling the navigate() will replace the current entry in window.history.
   * @type {boolean}
   * @scope api (public)
   */
  @api replace = false;

  /**
   * If true, wrap the slot with an anchor tag.
   * @type {boolean}
   * @scope api (public)
   */
  @api useHref = false;

  /**
   * To open the target in newTab/currentTab.
   * @enum
   * @type {"New Tab / Window"}
   * @scope api (public)
   */
  @api openTargetIn;

  /**
   * When useHref is true, the value of the generated url.
   * @type {string}
   * @scope track (private)
   */
  @track url;

  _readyTime; // Time when the navigate action begins

  @wire(CurrentPageReference) currentPageReference;

  get pageReference() {
    let pageReference;
    switch (this.targetType) {
      case pageReferenceTypes.APP:
        pageReference = new AppPageReference(
          this.targetName,
          this.targetParams
        );
        break;
      case pageReferenceTypes.COMPONENT:
        pageReference = new ComponentPageReference(
          this.targetName,
          this.targetParams
        );
        break;

      case pageReferenceTypes.KNOWLEDGE_ARTICLE:
        pageReference = new KnowledgeArticlePageReference(
          this.targetArticleType,
          this.targetName,
          this.targetParams
        );
        break;

      case pageReferenceTypes.LOGIN:
        pageReference = new LoginPageReference(
          this.targetAction,
          this.targetParams
        );
        break;

      case pageReferenceTypes.OBJECT:
        pageReference = new ObjectPageReference(
          this.targetName,
          this.targetAction,
          this.targetParams
        );
        break;

      case pageReferenceTypes.RECORD:
        pageReference = new RecordPageReference(
          this.targetId,
          this.targetName,
          this.targetAction,
          this.targetParams
        );
        break;

      case pageReferenceTypes.RELATIONSHIP:
        pageReference = new RelationshipPageReference(
          this.targetId,
          this.targetName,
          this.targetRelationship,
          this.targetAction,
          this.targetParams
        );
        break;

      case pageReferenceTypes.NAMED_PAGE:
        pageReference = new NamedPageReference(
          this.targetName,
          this.targetParams
        );
        break;

      case pageReferenceTypes.COMM_NAMED_PAGE:
        pageReference = new CommNamedPageReference(
          this.targetName,
          this.targetParams
        );
        break;

      case pageReferenceTypes.NAVIGATION_ITEM:
        pageReference = new NavItemPageReference(
          this.targetName,
          this.targetParams
        );
        break;

      case pageReferenceTypes.WEB_PAGE:
        pageReference = new WebPageReference(this.targetName);
        break;

      case pageReferenceTypes.CURRENT_PAGE:
      default:
        // In the default case, create an unfrozen
        pageReference = PageReference.unfreeze(
          this.currentPageReference,
          this.targetParams
        );
    }

    // Trim empty attributes
    if (pageReference.attributes) {
      Object.keys(pageReference.attributes).forEach((attribute) => {
        if (pageReference.attributes[attribute] === "")
          delete pageReference.attributes[attribute];
      });
    }

    // Trim empty state params
    if (pageReference.state) {
      Object.keys(pageReference.state).forEach((param) => {
        if (pageReference.state[param] === "")
          pageReference.state[param] = undefined;
      });
    }

    return pageReference;
  }

  /**
   * API method which calls lightning/navigation service.
   * @param {MouseEvent} evt - Used to prevent default on click handler of anchor tag when useHref is true.
   * @scope api (public)
   * @returns {(Promise<PageReference>|void)}
   */
  @api navigate(evt) {
    // Record the time when navigation ready to start execution
    this._readyTime = Date.now();

    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    if (this.disabled) {
      return null;
    }

    switch (true) {
      // The target in to be opened in a new tab,

      case this.openTargetIn === "New Tab/Window":
        if (this.targetType === pageReferenceTypes.WEB_PAGE) {
          this[NavigationMixin.Navigate](this.pageReference, this.replace);
          return Promise.resolve(this.pageReference).then(() => {
            this.dispatchTimeTrackingEvent();
            return this.pageReference;
          });
        }
        return this.generateUrl().then((url) => {
          window.open(url);

          return this.pageReference;
        });

      // When opening a URL and replace is true, the currrent page should be rplaced.
      case this.targetType === pageReferenceTypes.WEB_PAGE && this.replace:
        return this.generateUrl().then(() => {
          if (window.location?.href) {
            window.location.href = get(this.pageReference, "attributes.url");
          }
          // This line should never be hit, but returning for consistency.
          return this.pageReference;
        });

      // If the target is the current page reference, the state is updated.
      // Ancestors of the navigate action must listen to the statechange event.
      case this.targetType === pageReferenceTypes.CURRENT_PAGE:
        return this.generateUrl().then((url) => {
          if (this.replace) {
            window.history.replaceState({ ...history.state }, "", url);
          } else {
            window.history.pushState({ ...history.state }, "", url);
          }

          this.dispatchEvent(new StateChangeEvent(this.pageReference.state));

          pubsub.fire("statechange", this.targetType, this.pageReference.state);

          return this.pageReference;
        });

      // In the default case, the navigation service is called.
      default:
        this[NavigationMixin.Navigate](this.pageReference, this.replace);
        return Promise.resolve(this.pageReference).then(() => {
          this.dispatchTimeTrackingEvent();
          return this.pageReference;
        });
    }
  }

  /**
   * API method which calls the navigation service's generate url.
   * @scope api (public)
   * @returns {Promise<string>}
   */
  @api generateUrl() {
    return this[NavigationMixin.GenerateUrl](this.pageReference).then((url) => {
      this.dispatchTimeTrackingEvent();
      this.url = url;

      return url;
    });
  }

  /**
   * @description Dispatches time tracking event for the Navigate Action.
   * @returns {void}
   */
  dispatchTimeTrackingEvent() {
    let eventData = null;

    if (this._readyTime) {
      // Record the time when the navigation finishes
      const stopTime = Date.now();

      // Store time tracking event data
      eventData = {
        readyTime: this._readyTime,
        stopTime: stopTime,
        elapsedTime: stopTime - this._readyTime
      };
    }

    // Dispatch event for creating Tracking Entries
    this.dispatchEvent(
      new CustomEvent("navigate", {
        bubbles: true,
        composed: true,
        detail: eventData
      })
    );
  }

  connectedCallback() {
    this.generateUrl();
  }
}
