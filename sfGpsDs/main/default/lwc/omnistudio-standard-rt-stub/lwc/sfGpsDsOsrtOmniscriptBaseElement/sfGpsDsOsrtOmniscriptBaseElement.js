import { api, track, LightningElement } from "lwc";
import {
  applyCallRespBase,
  queryOmniComp,
  dispatchOmniEvent
} from "c/sfGpsDsOsrtOmniscriptUtils";
import {
  handleMergeField,
  evalCondition,
  mergeJSONLogic,
  mergeJSONLogicOverwrite,
  OMNISCRIPTFORMATTEDDATAJSON,
  getDesignerHideElementFlag,
  RUN_MODES
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import * as _ from "c/sfGpsDsOsrtLodash";
import { debounce } from "c/sfGpsDsOsrtAsyncUtils";
import { handleMultiLangLabel } from "c/sfGpsDsOsrtOmniscriptCustomLabels";
import pubsub from "c/sfGpsDsOsrtPubsub";

/**
 * We use requestIdleCallback when available in the browser, but not all browsers
 * support this at the moment (Safari & IE), so fallback to requestAnimationFrame
 * if not available.
 */
const SUPPORTS_IDLE_CALLBACK = !!window.requestIdleCallback;
function scheduleAsync(callback) {
  // eslint-disable-next-line @lwc/lwc/no-async-operation
  return SUPPORTS_IDLE_CALLBACK
    ? requestIdleCallback(callback)
    : requestAnimationFrame(callback);
}

/**
 * Base Component for OmniScript element, this extends LightningElement,
 * empty html template
 */
export default class OmniscriptBaseElement extends LightningElement {
  // OWC-1044 (SFDC LWC proxy object performance issue with JSON.stringify, it hangs the browser)
  // we need a non-proxy object to be passed down to child LWCs, therefore it can only be a string
  @api jsonDataStr;
  // value of the OmniScript element that goes into data JSON
  @track elementValue;
  @track _propSetMap;

  /**
   * json definition to render the component
   * @type {OmniElementDefinition}
   */
  @api jsonDef;
  // collection of prefill + designer seedDataJSON + cachedJson from api call
  @api seedJson;
  // two layouts: lightning/newport
  @api layout;
  // resume mode or not - Save for later will be supported in 107 onwards
  @api resume;
  // script header info that needs to be passed down to child LWCs
  @api scriptHeaderDef;
  // runMode tells the component whether it is running in the `player` or `designer` and
  // allows it to customize it's behaviour based on the mode.
  @api runMode = RUN_MODES.PLAYER;
  get _isDesignMode() {
    return this.runMode === RUN_MODES.DESIGNER;
  }

  // utility function to apply json to Omniscipt for group element
  applyCallRespUtil = applyCallRespBase;
  // utility function to evaluate merge field
  handleMergeFieldUtil = handleMergeField;
  // utility function to query an OmniScript component
  queryOmniCompUtil = queryOmniComp;
  // utility function to dispatch OmniScript event
  dispatchOmniEventUtil = dispatchOmniEvent;
  // utility helper function for json merge
  mergeJSONLogicUtil = mergeJSONLogic;
  // utility helper function for json merge overwrite (not merging)
  mergeJSONLogicOverwriteUtil = mergeJSONLogicOverwrite;
  // lodash
  lodashUtil = _;
  evalConditionUtil = evalCondition;
  // private variables
  // stop renderedCallback from being called multiple times
  _initialRender = false;
  _elementId;
  _aggregateNodesPath = [];
  _jsonData;
  _omniShow;
  _theme = "nds";
  _elementFormattedValue;
  _dataJsonPath;
  // needed for special logic for Step show/hide
  // we can not initialize a boolean variable to true
  _initialWatch = "true";
  _omniSavedShow;
  _lastWidth;

  // needed to use different mergeLogic during aggregate
  _aggregateOverride = false;

  // Multi-Language or not
  _multiLang = false;

  // used to focus an element that was cloned via repeat
  _focusOnInitialRender = false;

  // Overridable, use this to represent the value of the element the json value is undefined
  get defaultValue() {
    return null;
  }
  // Overridable, use this to represent the value of the element when nullified
  get nullVal() {
    return null;
  }

  // data JSON watch ->
  // omniShow() --- show/hide watch
  // and stateRefresh() --- Formula/Text Block etc. watch
  @api
  get jsonData() {
    return this._jsonData;
  }
  set jsonData(jsonData) {
    if (jsonData) {
      this._jsonData = jsonData;
      // watch should be run after the comp is initialized
      if (this._elementId) {
        this.combinedWatch();
      }
    }
  }

  // show/hide, Formula/Text Block watch
  // gets called in (1) initial renderedCallback
  // (2) watch for data JSON change
  combinedWatch(ckValidity) {
    if (this.scriptHeaderDef && this.jsonDef && this._propSetMap) {
      if (this._propSetMap.show) {
        const conditionType = !this._propSetMap.conditionType
          ? "Hide if False"
          : this._propSetMap.conditionType;
        if (conditionType === "Hide if False") {
          this.omniShow();
        } else if (
          ["Readonly if False", "Optional if False"].includes(conditionType)
        ) {
          this.omniRORequired(ckValidity);
        }
      }
      this.stateRefresh();
    }
  }

  // Overridable in omniscriptAtomicElement and omniscriptGroupElement
  omniRORequired() {}

  // use this function to init comp private variables
  // it's getting called in connectedCallback
  // derived components can overwrite it
  initCompVariables() {
    this._theme = this.layout === "newport" ? "nds" : "slds";
  }

  // Overridable
  // gets called in combinedWatch
  // derived components can overwrite it (Text Block, Formula etc.)
  stateRefresh() {}

  // show/hide logic, gets called in combinedWatch
  omniShow() {
    // In design mode we can skip all show logic because we always need it to appear.
    if (this._isDesignMode) {
      this.validityHook(true);

      if (
        this._jsonData &&
        this.jsonDef &&
        this._propSetMap &&
        this._propSetMap.show &&
        this.designerHideElementFlag
      ) {
        this.classList.add(`${this._theme}-hide`);
      } else {
        this.classList.remove(`${this._theme}-hide`);
      }
      return true;
    }

    if (
      this._jsonData &&
      this.jsonDef &&
      this._propSetMap &&
      this._propSetMap.show
    ) {
      this._omniShow = this.evalConditionUtil(this.jsonDef, "show", this);

      if (!this._omniShow) {
        this.classList.add(`${this._theme}-hide`);
      } else {
        this.classList.remove(`${this._theme}-hide`);
      }

      // if show/hide changes
      const newShow = this._omniShow === undefined || this._omniShow === true;
      const oldShow = this.jsonDef.bShow === true;
      if (this.jsonDef.bShow === undefined || newShow !== oldShow) {
        // update root level element json - for step chart and step navigation
        this.dispatchOmniEventUtil(
          this,
          {
            path: this._jsonPath,
            elementId: this._elementId,
            value: this._omniShow ? true : false,
            node: "bShow"
          },
          "omnisetshow"
        );

        // update data JSON - hide elements should be nullified from data JSON
        // we only need to do this for the Element Type that should aggregate (excluding
        // Remote Action, Integration Procedure Action, etc.)
        if (
          (this.scriptHeaderDef.apiUiElements &&
            this.scriptHeaderDef.apiUiElements.hasOwnProperty(
              this._elementId
            )) ||
          (this.scriptHeaderDef.aggElements &&
            this.scriptHeaderDef.aggElements.hasOwnProperty(this._elementId))
        ) {
          this._aggregateNodesPath = [];
          this.dispatchOmniEventUtil(
            this,
            this.createAggregateNode(true),
            "omniaggregate"
          );
        }

        this._omniSavedShow = oldShow;
        this.validityHook(newShow);
      } else if (this._initialRender && this.jsonDef.bShow) {
        this.validityHook(newShow);
      }
    }

    return this._omniShow;
  }

  /**
   * Abstract overridable method. Performs element validity logic
   * implemented in HasValidation. Triggered in omniShow().
   * @param {boolean} newShow - Flag determining weather or not validation should be run.
   * @abstract
   * @scope private
   */
  // eslint-disable-next-line no-unused-vars
  validityHook(newShow) {}

  /**
   * Abstract overridable method. Focuses the element. Implemented in HasValidation.
   * @abstract
   * @scope private
   */
  focus() {}

  applyCtrlWidth() {
    // Control width applied to each element (N/A to root elements);
    if (this.jsonDef && this._propSetMap) {
      if (this._propSetMap.controlWidth != null && this.jsonDef.level !== 0) {
        if (this._theme === "slds") {
          this.classList.add(this._theme + "-p-right_small");
          this.classList.add(this._theme + "-m-bottom_xx-small");
          this.classList.add(this._theme + "-show_inline-block");
        }
        if (this._isDesignMode && this._theme === "nds") {
          this.classList.add(this._theme + "-p-right_small");
        }
        this.classList.add(this._theme + "-size_12-of-12");
        this.classList.add(
          this._theme +
            "-medium-size_" +
            this._propSetMap.controlWidth +
            "-of-12"
        );
      }
      // This is the UI hide, not show/hide hide
      // but don't hide in designer.
      if (!this._isDesignMode && this._propSetMap.hide === true) {
        this.classList.add(`${this._theme}-hide`);
      }
    }
  }

  constructor() {
    super();
    this._initialRender = true;
  }

  renderedCallback() {
    if (!this._elementId) {
      return;
    }

    // initial json apply
    if (this._initialRender) {
      // NOTE 1: in LWC, header _propSetMap.seedDataJSON keeps getting updated, it's bound to @api seedJson
      // It is a collection of prefill + designer seedDataJSON + cachedJson from api call
      // overwrite order: cachedJson overwrites prefill overwrites designer seedDataJSON
      // remove node from header _propSetMap.seedDataJSON that's already applied
      // the user needs to be careful about how they set up designer seedDataJSON
      // {Step1:{key02:['bbbOrig1', 'bbbOrig2']}} and key02:['bbbOrig1', 'bbbOrig2'] will have different results
      // NOTE 2: default value should only be applied for element bInit = false
      let sdata;
      // in the angular OmniScript, we don't support hierarchical designer seedDataJSON,
      // now in lwc, we do
      // example: designer seedDataJSON:{Step1:{key02:['bbbOrig1', 'bbbOrig2']}}
      // The above logic is move to OmniScriptStep initialRenderCallback
      // because 'api response to create repeatable Elements' can not be handled here

      // default value only applies when bInit !== true
      if (
        this.jsonDef &&
        !this.jsonDef.bInit &&
        sdata == null &&
        this.defaultValue != null
      ) {
        sdata = this.defaultValue;
      }

      if (sdata !== undefined && sdata !== "") {
        this.applyCallResp(sdata, true);
      }

      if (this.jsonDef.bInit !== true) {
        this.dispatchOmniEventUtil(
          this,
          {
            path: this._jsonPath,
            elementId: this._elementId,
            value: true,
            node: "bInit"
          },
          "omniupdatejsondef"
        );
      }

      if (this._initialWatch === "true") {
        this.combinedWatch(true);
      }

      if (this._isDesignMode) {
        this.setAttribute("tabindex", "0");
      }
      this.initialRenderCallback();
      this.setElementFormattedValue();
      this._initialRender = false;

      if (this._isDesignMode) {
        this._throttledDesignRender = debounce(
          this.dispatchDesignerRenderElementEvent.bind(this),
          250
        );
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        scheduleAsync(this._throttledDesignRender);
      }
    }
  }

  promiseQueueForChildren = [];
  triggerParentChain(event) {
    event.stopPropagation();
    event.preventDefault();
    const cachedDetail = _.cloneDeep(event.detail);
    cachedDetail.removalPromise = event.detail.removalPromise;
    Promise.resolve().then(() => {
      const didFire = this.dispatchDesignerRenderElementEvent();
      if (didFire) {
        this.promiseQueueForChildren = this.promiseQueueForChildren.filter(
          (detail) => {
            return detail.path !== cachedDetail.path;
          }
        );
        this.promiseQueueForChildren.push(cachedDetail);
        Promise.resolve().then(() => {
          if (this.promiseQueueForChildren.length > 0) {
            this.dispatchEvent(
              new CustomEvent("omnidesignerrenderelement", {
                bubbles: true,
                composed: true,
                detail: this.promiseQueueForChildren.pop()
              })
            );
          }
        });
      }
      this.dispatchEvent(
        new CustomEvent("omnidesignerrenderelement", {
          bubbles: true,
          composed: true,
          detail: cachedDetail
        })
      );
    });
  }

  isDisconnected = false;
  disconnectedCallback() {
    this.isDisconnected = true;
    if (this._pubsubConfig) {
      pubsub.unregister("omnidesigner", this._pubsubConfig);
    }
  }

  previousBounds;
  initRemovalCallback() {
    const removalPromise = new Promise((resolve) => {
      this.removalCallback = () => {
        resolve();
      };
    });
    this.removalPromise = removalPromise;
  }

  getBoundsForDesigner() {
    const boundingClientRect = this.getBoundingClientRect();

    const getBoundingClientRectClone = () => {
      const { top, right, bottom, left, width, height, x, y } =
        boundingClientRect;
      return { top, right, bottom, left, width, height, x, y };
    };
    return Object.assign({}, getBoundingClientRectClone(), {
      width:
        this._theme === "slds" && this.classList.contains("slds-p-right_small")
          ? boundingClientRect.width - 12
          : boundingClientRect.width,
      paddingTop: 0,
      paddingLeft: 0,
      paddingBottom: 0,
      paddingRight: 0
    });
  }

  safeParseStyleToNumber(value) {
    if (value === "" || value == null) {
      return 0;
    }
    return parseFloat(value);
  }

  dispatchDesignerRenderElementEvent() {
    let didFire = false;
    if (this.isDisconnected) {
      this.removalCallback();
      return didFire;
    }
    if (!this._throttledDesignRender || this._suspendEvents) {
      return didFire;
    }
    let cachedStyle = this.getAttribute("style");
    if (!/display/.test(cachedStyle)) {
      this.setAttribute(
        "style",
        `${cachedStyle ? cachedStyle + ";" : ""} display: block;`
      );
    }
    const currentBounds = this.getBoundsForDesigner();
    if (
      this.previousBounds &&
      JSON.stringify(this.previousBounds) === JSON.stringify(currentBounds)
    ) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      scheduleAsync(this._throttledDesignRender);
      return didFire;
    }

    if (this.jsonDef.JSONPath && this._elementId) {
      this.dispatchOmniEventUtil(
        this,
        {
          path: this.jsonDef.JSONPath,
          indexInParent: this.jsonDef.indexInParent,
          level: this.jsonDef.level,
          name: this._elementId,
          position: currentBounds,
          removalPromise: this.removalPromise
        },
        "omnidesignerrenderelement"
      );
      didFire = true;
    }
    this.previousBounds = currentBounds;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    scheduleAsync(this._throttledDesignRender);
    return didFire;
  }

  suspendEvents(state) {
    if (
      state.omniscriptId !==
      (this.jsonDef.sOmniScriptId || this.jsonData.recordId)
    )
      return;
    this._suspendEvents = true;
  }

  resumeEvents(state) {
    if (
      state.omniscriptId !==
      (this.jsonDef.sOmniScriptId || this.jsonData.recordId)
    )
      return;
    this._suspendEvents = false;
    // we want immediately redraw everything when scroll finishes, but we'll do it async
    // hence we don't do scheduleAsync() sync that would wait for an idle timeout which
    // might still take some time
    Promise.resolve().then(() => {
      this.dispatchDesignerRenderElementEvent();
    });
  }

  connectedCallback() {
    if (this._isDesignMode) {
      let elmNameEvent;
      if (this.jsonDef.type !== "Edit Block")
        elmNameEvent = this.jsonDef.name + "widthchange";

      if (elmNameEvent) {
        this._pubsubConfig = {
          toggleconditionalelements: this.handleActionShowHide.bind(this),
          [elmNameEvent]: this.handleActionElementWidth.bind(this),
          suspendevents: this.suspendEvents.bind(this),
          resumeevents: this.resumeEvents.bind(this)
        };
      } else {
        this._pubsubConfig = {
          toggleconditionalelements: this.handleActionShowHide.bind(this),
          suspendevents: this.suspendEvents.bind(this),
          resumeevents: this.resumeEvents.bind(this)
        };
      }
      pubsub.register("omnidesigner", this._pubsubConfig);
    }
    // we only want them to be called once
    if (this.jsonDef) {
      // after firstRender=true in Header, the component tree (Header and its child tree) will load
      this._propSetMap = this.jsonDef.propSetMap; // default value for propSetMap

      if (!this.jsonDef.sOmniScriptId) {
        this._elementId = this.jsonDef.name;
        this._dataJsonPath = this.jsonDef.JSONPath;
        this._multiLang = this.scriptHeaderDef.multiLang;
        this.allCustomLabelsUtil = this.scriptHeaderDef.allCustomLabels;
        if (this._multiLang) {
          this.propToMultiLang(this.jsonDef.propSetMap);
        }
        this.initCompVariables();
        this.applyCtrlWidth();
      } else {
        if (this._multiLang) {
          this.propToMultiLang(this.jsonDef.propSetMap);
        }
        this.initCompVariables();
      }

      // this is to support SFL or one-step-render approach
      if (this.jsonDef && this.jsonDef.response != null) {
        if (this.jsonDef.sOmniScriptId) {
          // header - jsonDataStr is private property
          this.jsonDataStr = JSON.stringify(this.jsonDef.response);
        }
        if (
          (this.jsonDef.children && this.jsonDef.children.length > 0) ||
          (this.jsonDef.childrenC && this.jsonDef.childrenC.length > 0)
        ) {
          // group element - _elementValueObj is private property, non proxy object
          if (this.jsonDef.sOmniScriptId) {
            this._elementValueObj = JSON.parse(this.jsonDataStr);
          } else {
            this._elementValueObj = _.cloneDeep(this.jsonDef.response);
          }
        } else {
          this.elementValue = this.jsonDef.response;
        }
      }

      // INS 107 repeat
      if (this.jsonDef.newClone) {
        this._focusOnInitialRender = true;
        this.dispatchOmniEventUtil(
          this,
          this.createAggregateNode(false, "add"),
          "omniaggregate"
        );
      }
    }

    if (this._isDesignMode) {
      this.template.addEventListener(
        "omnidesignerrenderelement",
        this.triggerParentChain.bind(this)
      );
      this.initRemovalCallback();
    }
  }

  get _jsonPath() {
    let jsonPath = "children|" + (this.jsonDef.indexInParent + 1);
    if (this.jsonDef.level > 0) {
      jsonPath += ":eleArray|" + (this.jsonDef.index + 1);
    }
    return jsonPath;
  }

  /**
   * Custom lifecycle hook. Called on first render cycle.
   */
  initialRenderCallback() {
    if (this.jsonDef["$Vlocity.seed"]) {
      this.applyCallResp(this.jsonDef["$Vlocity.seed"], true);
      this.dispatchOmniEventUtil(
        this,
        {
          path: this._jsonPath,
          elementId: this._elementId,
          node: "$Vlocity.seed",
          operation: "delete"
        },
        "omniupdatejsondef"
      );
    }
    if (this._focusOnInitialRender) {
      this.focus();
      this._focusOnInitialRender = false;
    }
  }

  // utility function for data JSON aggregation event
  createAggregateNode(bFixProxy, operation) {
    const detail = {};
    // we don't want to include the OmniScriptFmtData node
    if (this.jsonDef.sOmniScriptId) {
      let dataJson = _.cloneDeep(this.jsonDef.response);
      delete dataJson[OMNISCRIPTFORMATTEDDATAJSON];
      detail.data = dataJson;
    } else {
      if (
        (this.jsonDef.children && this.jsonDef.children.length > 0) ||
        (this.jsonDef.childrenC && this.jsonDef.childrenC.length > 0)
      ) {
        detail.data = this._elementValueObj;
      } else {
        detail.data = this.elementValue;
      }
    }
    detail.elementId = this._elementId;
    detail.index = this.jsonDef.index;
    detail.jsonPath = this._jsonPath;
    detail.repeat = this._propSetMap.repeat;
    detail.aggregateNodesPath = this._aggregateNodesPath;
    detail.show = this._omniShow === true || this._omniShow === undefined;
    detail.dataJsonPath = this._dataJsonPath;
    detail.aggregateOverride = this._aggregateOverride;
    if (operation) {
      detail.operation = operation;
    }
    return detail;
  }

  // overridable, logic to determine whether to override value with nullval
  shouldNullify(json) {
    return json === null && this.nullVal !== null;
  }

  // overridable, pre treats values for every call response and on init
  treatResp(json) {
    if (this.shouldNullify(json)) {
      return this.nullVal;
    }
    if (json === "") {
      json = null;
    }
    return json;
  }

  /**
   * Overridable
   * Sets the element value and triggers aggregation.
   * @param {*} json
   * @param {boolean} [bApi=false] - Denotes the method caller is an API response. False indicates user initiated.
   * @param {boolean} [bValidation=false] - Denotes a server side validation response.
   */
  @api applyCallResp(json, bApi = false, bValidation = false) {
    if (bValidation) {
      // set custom error considering json as error
      this.setCustomValidation(json);
    } else {
      // add second param bValidation back later
      // only if it changes, then aggregate
      json = this.treatResp(json);
      if (json !== undefined && !_.isEqual(this.elementValue, json)) {
        this.setElementValue(json, bApi, bValidation);
        this.dispatchOmniEventUtil(
          this,
          this.createAggregateNode(),
          "omniaggregate"
        );
      }
    }
  }

  // Overridable
  // eslint-disable-next-line no-unused-vars
  setElementValue(json, bApi, bValidation) {
    this.elementValue = json;
    this.setElementFormattedValue();
  }

  // use this to set the formatted ElementValue (for example, Currency/Number/Telephone, etc.)
  // the formatted ElementValue is aggregated to the script data JSON to be used for display, for example, in Text Block
  // derived components can overwrite it
  setElementFormattedValue() {}

  // use this to set the custom validation.
  setCustomValidation() {}

  get canRepeat() {
    // repeat = true AND
    // (1) repeatLimit = null OR (2) ct < repeatLimit
    let count = this.jsonDef.ct == null ? 0 : this.jsonDef.ct;
    return (
      this._propSetMap.repeat &&
      (this._propSetMap.repeatLimit == null ||
        count <= this._propSetMap.repeatLimit)
    );
  }

  get canRemove() {
    return this.jsonDef.ct > 1;
  }

  @api
  // eslint-disable-next-line no-unused-vars
  handleAdd(evt, seed) {
    if (this.canRepeat) {
      this.handleRepeat("update", seed);
    }
  }

  @api
  handleRemove() {
    // TODO: this functionality is not yet implemented
    if (this.canRemove) {
      this.handleRepeat("delete");
    }
  }

  handleRepeat(operation, seed) {
    let objToDispatch = {
      path: this._jsonPath,
      elementId: this._elementId,
      operation: operation
    };
    if (seed) {
      objToDispatch["$Vlocity.seed"] = seed;
    }

    if (operation === "delete" || operation === "eblastdel") {
      // first need to update data JSON
      this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(false, "delete"),
        "omniaggregate"
      );
      this.validityHook(false);
    }
    this.dispatchOmniEventUtil(this, objToDispatch, "omnirepeat");
  }

  /**
   * @private
   * @description Sends data to the debug console event handler.
   * @param {Object} params
   * @param {Object} resp
   * @param {String} label
   * @param {Object} [element]
   * @returns {void}
   */
  sendDataToDebugConsole(params, resp, label, element) {
    let sendParams = JSON.parse(JSON.stringify(params));
    if (sendParams && sendParams.options) {
      let optionNode = JSON.parse(sendParams.options);
      delete optionNode.options;
      delete optionNode.input;
      sendParams.options = optionNode;
    }
    let sendResp = JSON.parse(JSON.stringify(resp));
    if (sendResp && sendResp.responseResult) {
      sendResp.responseResult = JSON.parse(sendResp.responseResult);
    }

    const debugData = {
      params: sendParams,
      response: sendResp,
      element: { label: label, elementType: element && element.type }
    };

    if (element && element.stage) {
      debugData.element.stage = element.stage;
    }

    // dispatches action data to debug console
    this.dispatchOmniEventUtil(this, debugData, "omniactiondebug");
  }

  /**
   * clones propSetMap and translates all labels to specified language code
   * @param {object} properties the property set map for each element
   */
  propToMultiLang(properties) {
    if (!this._isDesignMode) {
      // root level object must not be a read-only proxy in order to make changes to descendants
      this._propSetMap = Object.assign({}, properties);
      handleMultiLangLabel(
        this.jsonDef.type,
        this._propSetMap,
        this.allCustomLabelsUtil
      );
    }
  }

  handleActionShowHide(state) {
    if (
      state.omniscriptId !==
      (this.jsonDef.sOmniScriptId || this.jsonData.recordId)
    )
      return;
    this.combinedWatch(this.designerHideElementFlag);
  }

  handleActionElementWidth(state) {
    if (
      state.omniscriptId !==
      (this.jsonDef.sOmniScriptId || this.jsonData.recordId)
    )
      return;
    this.classList.remove(
      this._theme + "-medium-size_" + this._propSetMap.controlWidth + "-of-12"
    );
    this.classList.remove(
      this._theme + "-medium-size_" + this._lastWidth + "-of-12"
    );
    this.classList.add(this._theme + "-medium-size_" + state.width + "-of-12");
    this._lastWidth = state.width;
    this.dispatchDesignerRenderElementEvent();
  }

  get designerHideElementFlag() {
    if (!this.jsonDef) {
      return false;
    }
    return getDesignerHideElementFlag(
      this.jsonDef.sOmniScriptId || this.jsonData.recordId
    );
  }
}
