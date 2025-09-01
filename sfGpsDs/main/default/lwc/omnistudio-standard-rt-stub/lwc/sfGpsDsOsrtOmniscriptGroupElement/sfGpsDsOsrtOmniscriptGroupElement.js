/**
 * @module vlocity_namespace/omniscriptGroupElement
 * @description The group element is an abstract component containing common functionality for the group elements. Step, Block, Edit Block, and Typeahead Block.
 */
import { api, track } from "lwc";
import OmniscriptBaseElement from "c/sfGpsDsOsrtOmniscriptBaseElement";
import {
  AggregatesValidation,
  VALIDATION_EVENTS
} from "c/sfGpsDsOsrtOmniscriptValidation";
import { dispatchOmniEvent } from "c/sfGpsDsOsrtOmniscriptUtils";
import {
  updateJsonDef,
  updateJson,
  sendErrorModal,
  preprocessElementInput,
  getJSONNode,
  processCloneNode,
  processChildNode,
  evalSpinnerCond,
  setSpinnerActionMessage,
  RUN_MODES
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import {
  sendOmniPubsubEvent,
  addPathToAPIJson,
  handleMessaging
} from "c/sfGpsDsOsrtOmniscriptUtils";
import { evaluateMessaging } from "c/sfGpsDsOsrtOmniscriptTrackingServiceUtils";

/**
 * Default exported class OmniscriptGroupElement.
 * @extends AggregatesValidation(OmniscriptBaseElement)
 * @typicalname OmniscriptGroupElement
 */
export default class OmniscriptGroupElement extends AggregatesValidation(
  OmniscriptBaseElement
) {
  /**
   * Local reference to imported updateJsonDef.
   * @type {function}
   * @scope private
   */
  updateJsonDefUtil = updateJsonDef;

  /**
   * Local reference to imported updateJson
   * @type {function}
   * @scope private
   */
  updateJsonUtil = updateJson;

  /**
   * Local reference to imported sendErrorModal.
   * @type {function}
   * @scope private
   */
  sendErrorModalUtil = sendErrorModal;

  /**
   * Local reference to imported sendOmniPubsubEvent.
   * @type {function}
   * @scope private
   */
  sendOmniPubsubEventUtil = sendOmniPubsubEvent;

  /**
   * @description Utility method that handles messaging events for wpm and ssm.
   * @type {Function}
   * @scope private
   */
  handleMessagingUtil = handleMessaging;

  /**
   * @description Utility method that evaluates if messaging is permitted.
   * @type {Function}
   * @scope private
   */
  evaluateMessagingUtil = evaluateMessaging;

  /**
   * Global spinner flag.
   * @type {Boolean}
   * @scope track (private)
   */
  @track isPageLoading = false;

  /**
   * Button spinner flag.
   * @type {Boolean}
   * @scope track (private)
   */
  @track isBtnLoading = false;

  /**
   * Message to be displayed accompanying the loading spinner.
   * @type {string}
   */
  @track spinnerActionMessage = "";
  spinnerAlternativeMessage = "";
  _elementValueObj = {};

  /**
   * Whether or not to show group level validation.
   * Updated in `reportValidity`.
   * @type {boolean}
   * @scope track (private)
   */
  @track showValidation;

  /**
   * Adds listeners/handlers for: omniaggregate, omnirefreshseeddata, omnisetshow, omnirepeat, and omniupdatejsondef events.
   */
  constructor() {
    super();
    this.template.addEventListener(
      "omniaggregate",
      this.handleOmniAggregate.bind(this)
    );
    this.template.addEventListener(
      "omnirefreshseeddata",
      this.handleOmniSeedDataRefresh.bind(this)
    );
    this.template.addEventListener(
      "omnisetshow",
      this.handleOmniSetShow.bind(this)
    );
    this.template.addEventListener(
      "omnirepeat",
      this.handleOmniRepeat.bind(this)
    );
    this.template.addEventListener(
      "omniupdatejsondef",
      this.handleOmniUpdateJsonDef.bind(this)
    );
  }

  /**
   * Overridable
   * Sets the element value and triggers aggregation.
   * @param {*} data
   * @param {boolean} [bApi=false] - Denotes the method caller is an API response. False indicates user initiated.
   * @param {boolean} [bValidation=false] - Denotes a server side validation response.
   * @scope api (public)
   * @returns {void}
   */
  @api applyCallResp(data, bApi = false, bValidation = false) {
    // implement logic to apply json
    if (
      data != null &&
      (!this.lodashUtil.isEqual(this._elementValueObj, data) || bValidation)
    ) {
      // OWC-182
      // when using the generic preview component, due to levels of Step and Group Elements
      // (e.g., nested Blocks), we need to unfortunately pre-process data
      if (!this.runServerCheck() && this.jsonDef.sOmniScriptId) {
        data = addPathToAPIJson(data, this.jsonDef.labelMap);
      }
      const leftOverJson = this.applyCallRespUtil(
        data,
        this,
        bApi,
        bValidation,
        !this.runServerCheck()
      );

      if (leftOverJson) {
        if (
          !bValidation &&
          leftOverJson.remainder &&
          Object.getOwnPropertyNames(leftOverJson.remainder).length > 0
        ) {
          try {
            this.lodashUtil.mergeWith(
              this._elementValueObj,
              leftOverJson.remainder,
              this.mergeJSONLogicUtil
            );
          } catch (error) {
            // error.message = Invalid Mutation
            this.lodashUtil.mergeWith(
              this._elementValueObj,
              leftOverJson.remainder,
              this.mergeJSONLogicUtil
            );
          }

          // header
          if (this.jsonDef.sOmniScriptId) {
            this.jsonDataStr = JSON.stringify(this._elementValueObj);
            this._jsonData = this.jsonDef.response = Object.assign(
              {},
              this._elementValueObj
            );
            this.headerRefresh();

            // Handles messaging for data JSON changes
            if (
              !this._isDesignMode &&
              this.evaluateMessagingUtil(this.scriptHeaderDef.propSetMap)
            ) {
              this.handleMessagingUtil(this, "omniscript_datajson");
            }
          }

          this.dispatchOmniEventUtil(
            this,
            this.createAggregateNode(),
            "omniaggregate"
          );
        }

        if (
          leftOverJson.cacheJson &&
          Object.getOwnPropertyNames(leftOverJson.cacheJson).length > 0
        ) {
          // header
          if (this.jsonDef.sOmniScriptId) {
            this.lodashUtil.mergeWith(
              this.jsonDef.propSetMap.seedDataJSON,
              leftOverJson.cacheJson,
              this.mergeJSONLogicUtil
            );
          } else {
            this.dispatchOmniEventUtil(
              this,
              { mergeJson: leftOverJson.cacheJson },
              "omnirefreshseeddata"
            );
          }
        }
      }

      if (bValidation && !this.checkValidity()) {
        // focus the first invalid element on the step when set errors is triggered
        this.handleInvalid();
      }
    }
  }

  // override
  headerRefresh() {}

  /**
   * This function will determine if we need to run server check for this OmniScript being active.
   * This can be overriden by any component to skip validation.
   * @returns {boolean}
   * @scope private
   */
  runServerCheck() {
    return true;
  }

  /**
   * @param {Array<any>} array
   * @scope private
   * @returns {Array<any>}
   */
  handleArray(array) {
    if (array && Array.isArray(array)) {
      if (array.length === 1) {
        return array[0] != null ? JSON.parse(JSON.stringify(array[0])) : null;
      } else if (array.length === 0) {
        return null;
      }
    }
    return array;
  }

  /**
   * Aggregate event handler at the parent component level, to be modified.
   * @param {CustomEvent} evt
   * @scope private
   * @returns {void}
   */
  handleOmniAggregate(evt) {
    // We only want aggregate event to bubble up one level
    if (
      evt.detail &&
      evt.detail.elementId &&
      evt.detail.elementId !== this._elementId
    ) {
      // formatted data flow through
      this._dataJsonPath = evt.detail.dataJsonPath;

      // aggregate logic needs to be modified
      const aggNodeVal = this._elementValueObj[evt.detail.elementId];
      const evtData =
        evt.detail.data != null
          ? JSON.parse(JSON.stringify(evt.detail.data))
          : evt.detail.data;
      let newNodeVal = evt.detail.show ? evtData : null;
      const index = evt.detail.index;
      this._aggregateNodesPath = [];
      this._aggregateOverride = evt.detail.aggregateOverride;
      if (index > 0) {
        if (evt.detail.operation === "delete" && Array.isArray(aggNodeVal)) {
          newNodeVal = aggNodeVal;
          newNodeVal = [
            ...newNodeVal.slice(0, index),
            ...newNodeVal.slice(index + 1, newNodeVal.length)
          ];
        } else {
          if (aggNodeVal == null) {
            newNodeVal = [];
          } else if (Array.isArray(aggNodeVal)) {
            newNodeVal = aggNodeVal;
          } else {
            newNodeVal = [];
            newNodeVal.push(aggNodeVal);
          }

          let bInserted = false;
          for (let j = 0; j < index - newNodeVal.length + 1; j++) {
            newNodeVal = [...newNodeVal, null];
            bInserted = true;
          }
          const insertInd =
            evt.detail.operation === "add" && !bInserted ? index : index + 1;
          // update index=evt.detai.index element
          newNodeVal = [
            ...newNodeVal.slice(0, index),
            evt.detail.show !== false ? evtData : null,
            ...newNodeVal.slice(insertInd)
          ];
        }
        newNodeVal = this.handleArray(newNodeVal);
      } else {
        // this can only be triggered from Edit Block/Block 0th element
        if (evt.detail.operation === "delete") {
          newNodeVal = aggNodeVal == null ? [null] : aggNodeVal;
          newNodeVal = Array.isArray(newNodeVal) ? newNodeVal : [newNodeVal];
          newNodeVal = [...newNodeVal.slice(1, newNodeVal.length)];
          newNodeVal = this.handleArray(newNodeVal);
        } else {
          if (evt.detail.repeat && aggNodeVal && Array.isArray(aggNodeVal)) {
            newNodeVal = aggNodeVal;
            // update index 0 element
            newNodeVal = [
              evt.detail.show !== false ? evtData : null,
              ...newNodeVal.slice(index + 1)
            ];
          }
        }
      }

      if (!this.jsonDef.sOmniScriptId) {
        this._elementValueObj = Object.assign({}, this._elementValueObj, {
          [evt.detail.elementId]: newNodeVal
        });
      }

      if (this.jsonDef.sOmniScriptId) {
        if (this._aggregateOverride === true) {
          this._elementValueObj = this.lodashUtil.mergeWith(
            this._elementValueObj,
            {
              [evt.detail.elementId]: newNodeVal
            },
            this.mergeJSONLogicOverwriteUtil
          );
        } else {
          this._elementValueObj = this.lodashUtil.mergeWith(
            this._elementValueObj,
            {
              [evt.detail.elementId]: newNodeVal
            },
            this.mergeJSONLogicUtil
          );
        }

        this.jsonDataStr = JSON.stringify(this._elementValueObj);
        this._jsonData = this.jsonDef.response = Object.assign(
          {},
          this._elementValueObj
        ); // trigger rerender
        this.headerRefresh();

        // we also need to update response at different levels
        this.updateJsonDefUtil(
          this.jsonDef,
          evt.detail.aggregateNodesPath,
          "response"
        );

        if (evt.detail.operation === "newClone") {
          let elePath = "";
          for (let i = 0; i < evt.detail.aggregateNodesPath.length; i++) {
            elePath += evt.detail.aggregateNodesPath[i].path;
            if (i < evt.detail.aggregateNodesPath.length - 1) {
              elePath += ":";
            }
          }
          this.updateJsonUtil(this.jsonDef, elePath, "delete", [
            { nodeName: "newClone", newData: null }
          ]);
        }

        // Handles messaging for data JSON changes
        if (
          !this._isDesignMode &&
          this.evaluateMessagingUtil(this.scriptHeaderDef.propSetMap)
        ) {
          this.handleMessagingUtil(this, "omniscript_datajson");
        }
      } else if (evt.detail.aggregateNodesPath) {
        if (evt.detail.aggregateNodesPath.length > 0) {
          evt.detail.aggregateNodesPath.unshift({
            value: this._elementValueObj,
            path: this._jsonPath
          });
          this._aggregateNodesPath = evt.detail.aggregateNodesPath.slice();
        } else {
          this._aggregateNodesPath.push({
            value: this._elementValueObj,
            path: this._jsonPath
          });
          this._aggregateNodesPath.push({
            value: evtData,
            path: evt.detail.jsonPath
          });
        }
      }

      evt.stopPropagation();
      // after aggregate happens at this level, send aggregate event to the parent
      // component with new data
      let operationBubbleUp =
        evt.detail.operation === "add" || evt.detail.operation === "newClone"
          ? "newClone"
          : undefined;
      // Propagate event when :
      // 1. not the root node (omniscriptHeader is the root node)
      // 2. running in debug mode (designer) and is the root node
      if (
        !this.jsonDef.sOmniScriptId ||
        (this.runMode === RUN_MODES.DEBUG && this.jsonDef.sOmniScriptId)
      ) {
        this.dispatchOmniEventUtil(
          this,
          this.createAggregateNode(false, operationBubbleUp),
          "omniaggregate"
        );
      }
    }
  }

  /**
   * Update header seedDataJSON to only keep the nodes that are not applied yet.
   * @param {CustomEvent} evt
   * @scope private
   * @returns {void}
   */
  handleOmniSeedDataRefresh(evt) {
    if (this.jsonDef.sOmniScriptId && evt.detail) {
      // when one node of seedDataJSON is applied (whether it succeeds or not, it shoule be deleted from the header seedDataJSON)
      if (evt.detail.path) {
        this.updateJsonUtil(
          this.jsonDef.propSetMap.seedDataJSON,
          "",
          "delete",
          [{ nodeName: evt.detail.path }]
        );
      }
      // this is to merge in cache json for each apply
      if (evt.detail.mergeJson) {
        this.lodashUtil.mergeWith(
          this.jsonDef.propSetMap.seedDataJSON,
          evt.detail.mergeJson,
          this.mergeJSONLogicUtil
        );
      }
    }
  }

  /**
   * Update full jsonDef of the script
   * @param {CustomEvent} evt
   * @scope private
   * @returns {void}
   */
  handleOmniUpdateJsonDef(evt) {
    if (
      evt.detail &&
      evt.detail.elementId &&
      evt.detail.elementId !== this._elementId
    ) {
      evt.stopPropagation();
      if (!this.jsonDef.sOmniScriptId) {
        let aggPath = this._jsonPath + ":" + evt.detail.path;
        this.dispatchOmniEventUtil(
          this,
          {
            path: aggPath,
            elementId: this._elementId,
            value: evt.detail.value,
            node: evt.detail.node,
            operation: evt.detail.operation
          },
          "omniupdatejsondef"
        );
      } else {
        if (evt.detail.operation === "delete") {
          this.updateJsonUtil(this.jsonDef, evt.detail.path, "delete", [
            { nodeName: evt.detail.node }
          ]);
        } else {
          updateJsonDef(
            this.jsonDef,
            [{ value: evt.detail.value, path: evt.detail.path }],
            evt.detail.node
          );
        }
      }
    }
  }

  /**
   * Event listener that updates bShow for all elements.
   * @param {CustomEvent} evt
   * @scope private
   * @returns {void}
   */
  handleOmniSetShow(evt) {
    if (
      evt.detail &&
      evt.detail.elementId &&
      evt.detail.elementId !== this._elementId
    ) {
      evt.stopPropagation();
      if (!this.jsonDef.sOmniScriptId) {
        let aggPath = this._jsonPath + ":" + evt.detail.path;
        this.dispatchOmniEventUtil(
          this,
          {
            path: aggPath,
            value: evt.detail.value,
            elementId: this._elementId
          },
          "omnisetshow"
        );
      }
    }
  }

  /**
   * Override OmniscriptBaseElement.createAggregateNode to handle Proxies that have ReadOnlyHandler.
   * @param {boolean} bFixProxy - Flag to indicate flattening of proxies.
   * @param {string} operation
   * @returns {Object}
   */
  createAggregateNode(bFixProxy, operation) {
    let detail = super.createAggregateNode(bFixProxy, operation);
    if (bFixProxy && !this.jsonDef.sOmniScriptId) {
      detail.data =
        detail.data != null ? JSON.parse(JSON.stringify(detail.data)) : null;
    }
    return detail;
  }

  handleOmniRepeat(evt) {
    evt.stopPropagation();

    if (
      evt.detail &&
      evt.detail.elementId &&
      evt.detail.elementId !== this._elementId
    ) {
      if (!this.jsonDef.sOmniScriptId) {
        const aggPath = this._jsonPath + ":" + evt.detail.path;
        let objToDispatch = {
          path: aggPath,
          elementId: this._elementId,
          operation: evt.detail.operation
        };
        if (evt.detail["$Vlocity.seed"]) {
          objToDispatch["$Vlocity.seed"] = evt.detail["$Vlocity.seed"];
        }

        this.dispatchOmniEventUtil(this, objToDispatch, "omnirepeat");
      } else {
        let pathSplit = evt.detail.path.split("|"),
          newIndex = parseInt(pathSplit.pop(), 10),
          elePath = pathSplit.join("|").slice(0, -9), // truncate ':eleArray'
          eleNode = getJSONNode(
            this.jsonDef,
            preprocessElementInput(evt.detail.path)
          ),
          eleArrHeader = getJSONNode(
            this.jsonDef,
            preprocessElementInput(elePath)
          ),
          operation = evt.detail.operation;
        let bUpdate = false;
        let midIndex;
        let offSet;

        let eleArrNodes = eleArrHeader.eleArray;
        if (eleArrHeader.mct == null) {
          eleArrHeader.mct = 0;
        }

        if (operation === "ebfirstadd") {
          eleNode.children = JSON.parse(JSON.stringify(eleNode.childrenC));
          eleNode.ct = 1;
          if (evt.detail["$Vlocity.seed"]) {
            eleNode["$Vlocity.seed"] = evt.detail["$Vlocity.seed"];
          }
        } else if (operation === "eblastdel") {
          eleNode.children = [];
          eleNode.ct = 0;
          eleNode.response = null;
        }

        if (operation === "update") {
          let eleNodeStr = JSON.stringify(eleNode);

          while (eleNodeStr.indexOf("vlcPlace") !== -1) {
            try {
              eleNodeStr = removeVlcPlace(eleNodeStr);
            } catch (err) {
              console.warn("Error removing vlcPlace:", err);
              eleNodeStr = JSON.stringify(eleNode);
              break;
            }
          }

          eleNode = JSON.parse(eleNodeStr);
          eleArrHeader.mct++;
          processCloneNode(
            eleNode,
            eleArrNodes.length,
            eleArrHeader.mct,
            evt.detail["$Vlocity.seed"] != null,
            this.scriptHeaderDef.rMap
          );
          if (evt.detail["$Vlocity.seed"]) {
            eleNode["$Vlocity.seed"] = evt.detail["$Vlocity.seed"];
            delete eleNode.newClone;
          }
          eleArrNodes = [
            ...eleArrNodes.slice(0, newIndex),
            eleNode,
            ...eleArrNodes.slice(newIndex)
          ];
          bUpdate = true;
          midIndex = newIndex + 1;
          offSet = 2;
        } else if (operation === "delete") {
          eleArrNodes = [
            ...eleArrNodes.slice(0, newIndex - 1),
            ...eleArrNodes.slice(newIndex)
          ];
          bUpdate = true;
          midIndex = newIndex - 1;
          offSet = 0;
        }

        if (bUpdate) {
          for (let i = 0; i < eleArrNodes.length; i++) {
            if (i >= midIndex) {
              processChildNode(
                eleArrNodes[i],
                false,
                false,
                true,
                eleArrNodes[i].JSONPath + "|" + (eleArrNodes[i].index + 1),
                eleArrNodes[i].JSONPath + "|" + (eleArrNodes[i].index + offSet),
                eleArrNodes[i].index + offSet - 1,
                eleArrNodes.length,
                false,
                this.scriptHeaderDef.rMap
              );
            } else {
              eleArrNodes[i].ct = eleArrNodes.length;
            }
          }
          // elePath = elePath.slice(0, -9); // truncate ':eleArray'
          this.updateJsonUtil(this.jsonDef, elePath, "update", [
            { nodeName: "eleArray", newData: eleArrNodes },
            { nodeName: "mct", newData: eleArrHeader.mct }
          ]);
        }

        /**
         * @type {OmniElementDefinition}
         */
        this.jsonDef = Object.assign({}, this.jsonDef); // refresh
      }
    }
  }

  /**
   * Evaluates spinner according to conditions.
   * @param {boolean} value
   * @param {object} element
   * @returns {void}
   * @scope private
   */
  evaluateSpinner(value, element) {
    if (this._isBtn || this._isBtn === undefined) {
      if (evalSpinnerCond(element)) {
        if (value === true) {
          // sets spinner action message
          const actionMessage = setSpinnerActionMessage(element);
          this.spinnerActionMessage =
            this?.allCustomLabelsUtil?.[actionMessage] || actionMessage;
          this.spinnerAlternativeMessage =
            actionMessage || this.allCustomLabelsUtil.OmniSpinnerTextLoading;
        }

        this.isPageLoading = value;
      } else {
        this.isBtnLoading = value;
      }
    }
  }

  /**
   * Called when a group element has it's visibility toggled 'conditional render'.
   * @param {boolean} newShow
   * @scope private
   * @returns {void}
   */
  validityHook(newShow) {
    if (
      this.jsonDef.level === 0 &&
      this.jsonDef.name !== this.scriptHeaderDef.asName
    )
      return;
    if (this.checkValidity()) return;

    if (newShow) {
      // If the block contains invalid elements, tell parents to
      //consider them invalid now that they are visible.
      dispatchOmniEvent(
        this,
        { jsonPath: this.jsonDef.lwcId },
        VALIDATION_EVENTS.INVALID
      );
    } else {
      // If the block contains invalid elements, tell parents to
      //consider them valid now that they are hidden.
      dispatchOmniEvent(
        this,
        { jsonPath: this.jsonDef.lwcId },
        VALIDATION_EVENTS.VALID
      );
    }
  }

  /**
   * Event listener fired when an input element becomes valid.
   * Fired from hasValidation mixin.
   * @param {CustomEvent} evt
   * @returns {void}
   */
  markInputAsValid(evt) {
    super.markInputAsValid(evt);
    evt.stopPropagation();

    if (Object.keys(this.invalidElements).length === 0) {
      dispatchOmniEvent(
        this,
        { jsonPath: this.jsonDef.lwcId },
        VALIDATION_EVENTS.VALID
      );
    }
  }

  /**
   * Event listener fired when an input element becomes invalid.
   * Fired from hasValidation mixin.
   * @param {CustomEvent} evt
   * @returns {void}
   */
  markInputAsInvalid(evt) {
    super.markInputAsInvalid(evt);
    evt.stopPropagation();

    if (
      this.jsonDef.bShow === true ||
      (!this.jsonDef.propSetMap.show && !this.jsonDef.bShow)
    ) {
      // If this group is visible, let the parent know.
      if (Object.keys(this.invalidElements).length > 0) {
        dispatchOmniEvent(
          this,
          { jsonPath: this.jsonDef.lwcId },
          VALIDATION_EVENTS.INVALID
        );
      }
    }
  }

  @api reportValidity() {
    const isValid = super.reportValidity();
    this.showValidation = !isValid;
    return isValid;
  }
}

function removeVlcPlace(elementString) {
  const open = '"vlcPlace":';
  const skipCase = '"vlcPlace":null';
  let start = elementString.indexOf(open) || 0;
  let end = 0;
  let level = 0;

  if (elementString.substring(start, start + skipCase.length) === skipCase) {
    end = start + skipCase.length;
  } else {
    for (
      let current = start + open.length;
      current < elementString.length;
      current++
    ) {
      if (elementString.charAt(current) === "{") {
        level++;
      } else if (elementString.charAt(current) === "}") {
        level--;
        if (level === 0) {
          end = current + 1;
          break;
        }
      }
    }
  }

  if (elementString.charAt(start - 1) === ",") start--;
  else if (elementString.charAt(end) === ",") end++;
  if (end === 0) end = elementString.length;

  return (
    elementString.slice(0, start) +
    elementString.slice(end, elementString.length)
  );
}
