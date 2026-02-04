import { api, track } from "lwc";
import {
  OmniscriptDrExtractActionUtil,
  OmniscriptHttpActionUtil,
  OmniscriptIpActionUtil,
  OmniscriptRemoteActionUtil
} from "c/sfGpsDsOsrtOmniscriptActionUtils";
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import {
  getJSONNode,
  preprocessElementInput,
  sendHttpDataToDebugConsole
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { debounce } from "c/sfGpsDsOsrtAsyncUtils";

import tmpl from "./sfGpsDsOsrtOmniscriptTypeahead.html";

const SPACE_BAR_KEY = " ";
const LEGACY_SPACE_BAR_KEY = "Spacebar";

/**
 * A typeahead allows a user to select an option from a list, but that list can be affected by what
 * the user types into the input of the Combobox. This can be useful when the list of options is very large,
 * as user input can start to display options that only match the text they have entered.
 * @module ns/omniscriptTypeahead
 * @typicalName OmniscriptTypeahead
 * @extends OmniscriptAtomicElement
 */
export default class OmniscriptTypeahead extends OmniscriptAtomicElement {
  /**
   * Options passed to base element.
   * @type {Array}
   * @scope track (private)
   */
  @track options = [];

  /**
   * Controls weather the elements following the typeahead will be visible.
   * Visibility is controlled by css classes found in: OmniLwcUtils.scss.
   * @type {Boolean}
   * @see {@link ./sass/OmniLwcUtils.scss}
   * @scope private
   */
  _isEditMode = false;

  /**
   * When true the options will not be filtered by the underlying typeahead component.
   * `_disableFilter` is always true when lookup mode is enabled, and for places search.
   * @type {Boolean}
   * @scope private
   */
  _disableFilter = false;

  /**
   * When true, a progress bar will be displayed while fetching options.
   * @type {Boolean}
   * @scope private
   */
  _useRemoteSource = true;

  /**
   * Local store of the remote source's JSON definition.
   * @type {object}
   * @scope private
   */
  _actionDef = {};

  /**
   * Set when an error message is returned from a remote response.
   * Displayed on the template. Not a validation error.
   * @type {string}
   * @scope track (private)
   */
  @track errorMessage;

  /**
   * Throttled handler to update jsonData, which source action will
   * depend on. Bound in connected callback.
   * @type {function}
   * @scope private.
   */
  typeaheadFn;

  /**
   * Alternative text for typeahaed icon
   * @type {string}
   * @scope private
   */
  _editLabel;

  /**
   * Flag which displays lookup options when typeahead is in lookup mode. Only used for typeahead lookup
   * mode.
   * @type {Boolean}
   */
  _showLookupOptions = false;

  /**
   * Flag which determines if typeahead is focused when in lookup mode. Only used for typeahead lookup mode.
   * @type {Boolean}
   */
  _lookupFocused = false;

  /**
   * When the input is blurred, Validation is run and jsonData is updated.
   * @param {FocusEvent} evt
   * @scope private
   * @returns {void}
   */
  handleBlur(evt) {
    this.applyCallResp(evt.target.value);

    // When lookup is enabled, blur event should close the lookup dropdown (i.e. flag reset state)
    if (this._propSetMap.enableLookup) {
      this._showLookupOptions = false;
      this._lookupFocused = false;
    }
  }

  /**
   * When the input is cleared, validation must be run.
   * @scope private
   * @returns {void}
   */
  handleClear() {
    this.checkValidity();
  }

  /**
   * Creates a throttled callback if `typeaheadFn` is not defined,
   * otherwise calls `typeaheadFn`.
   * Bound to keyup event in the {@link this#initCompVariables} lifecycle hook.
   * @param {KeyboardEvent} evt
   * @returns {void}
   */
  handleTypeahead(evt) {
    if (!this.typeaheadFn) {
      this.typeaheadFn = debounce((target) => {
        const value = target.value || null;
        if (this.elementValue !== value) {
          this.setElementValue(value, false, false);
          this.dispatchOmniEventUtil(
            this,
            this.createAggregateNode(),
            "omniaggregate"
          );
          if (value === null) {
            this.options = [];
          } else {
            if (this._propSetMap.useDataJson) {
              this.getOptionsDataJson();
            } else {
              Promise.resolve().then(() => {
                this.getOptions(this._propSetMap.taAction);
              });
            }
          }

          // Nullify child elements
          this.dispatchOmniEventUtil(
            this,
            { item: "$Vlocity.nullify" },
            "select"
          );
        }
      }, this._propSetMap.callFrequency);
    }

    this.typeaheadFn(evt);
  }

  /**
   * Lookup dropdown main component click handler for lookup typehead.
   * Only applicable in lookup typeahead.
   * @returns {void}
   */
  handleLookupButtonDropdownClick(event) {
    event.stopPropagation();
    this.delay(250).then(() => {
      this.handleLookupButtonClick();
    });
  }

  delay(waitFor, result) {
    return new Promise((resolve) => {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => resolve(result), waitFor);
    });
  }

  /**
   * Lookup dropdown arrow button click handler for lookup typehead.
   * Only applicable in lookup typeahead.
   * @returns {void}
   */
  handleLookupButtonClick() {
    // When typeahead is not focused and button is clicked, lookup needs to be focused and lookup options
    // should be viewable
    if (!this._lookupFocused) {
      this._showLookupOptions = true;
      this.handleLookup();
      this.childInput.focus();
      this._lookupFocused = true;
    }
    // When typeahead is already focused and button is clicked again, lookup should lose focus and options
    // should not be shown (i.e. reset state)
    else {
      this._lookupFocused = false;
      this._showLookupOptions = false;
    }
  }

  /**
   * Lookup dropdown arrow button handler for onkeydown for lookup typeahead.
   * Only applicable in lookup typeahead.
   * @param {*} event
   * @returns {void}
   */
  handleLookupButtonKeyDown(event) {
    switch (event.key) {
      case SPACE_BAR_KEY: // Flow through to "Enter"
      case LEGACY_SPACE_BAR_KEY: // Flow through to "Enter" (support for older browsers)
      case "Enter": {
        // "Enter" and "Space" should both trigger the same functionality as a button click
        this.handleLookupButtonClick();
        break;
      }
      default: // do nothing
    }
  }

  /**
   * Bound to focus event in the {@link this#initCompVariables} lifecycle hook.
   * @scope private
   * @returns {void}
   */
  handleLookup() {
    // Otherwise this is in lookup mode. Get the options.
    if (this._propSetMap.useDataJson) {
      this.getOptionsDataJson();
    } else {
      this.childInput.progressStart();
      this.getOptions(this._propSetMap.taAction);
    }
  }

  /**
   * Defines the promise chain used to get/filter/set typeahead options
   * when useDataJson is true.
   * @scope private
   * @returns {Promise<any>}
   */
  getOptionsDataJson() {
    return Promise.resolve(
      getJSONNode(
        JSON.parse(this.jsonDataStr),
        preprocessElementInput(this._propSetMap.dataJsonPath)
      )
    )
      .then((result) => this.dataProcessorHook(result))
      .then((result) => this.setOptions(result))
      .catch((reason) => this.handleError(reason));
  }

  /**
   * Defines the promise chain used to get/filter/set typeahead options
   * when useDataJson is false.
   * @param {*} action - Action definition retrieved from jsonDef.
   * @scope private
   * @returns {Promise<any>}
   */
  getOptions(action) {
    return this.hitEndPoint(action)
      .then((result) => this.handleResponse(result))
      .then((result) => this.dataProcessorHook(result))
      .then((result) => this.setOptions(result))
      .catch((reason) => this.handleError(reason));
  }

  /**
   * Link in the promise chain responsible for getting data from remote source.
   * @param {*} action - Action definition retrieved from jsonDef.
   * @scope private
   * @returns {Promise<any>}
   */
  hitEndPoint(action) {
    this._actionDef = action;
    let actionClass;

    switch (action.type) {
      case "Remote Action":
        actionClass = new OmniscriptRemoteActionUtil(action);
        break;
      case "Integration Procedure Action":
        actionClass = new OmniscriptIpActionUtil(action);
        break;
      case "DataRaptor Extract Action":
      case "DataRaptor Turbo Action":
        actionClass = new OmniscriptDrExtractActionUtil(action);
        break;
      case "Rest Action":
        actionClass = new OmniscriptHttpActionUtil(action);
        break;
      default:
        actionClass = null;
        break;
    }
    return actionClass.executeAction(
      null,
      null,
      this,
      this._propSetMap.enableLookup
        ? null
        : {
            [this.jsonDef.name]: this.jsonDef.response
          }
    );
  }

  /**
   * Sends data to the debug console event handler.
   * @param {object} params
   * @param {object} resp
   * @param {string} label
   * @scope private
   * @returns {void}
   */
  sendDataToDebugConsole(params, resp, label) {
    if (this._actionDef.type === "Rest Action") {
      sendHttpDataToDebugConsole(
        this,
        params,
        resp,
        label,
        this._actionDef,
        "omniactiondebug"
      );
    } else {
      super.sendDataToDebugConsole(params, resp, label);
    }
  }

  /**
   * Link in the getOptions promise chain responsible for ensuring
   * proper format of the remote response.
   * @param {*} data - Result from remote source.
   * @scope private
   * @returns {Promise<any>}
   */
  handleResponse(data) {
    if (data.error) throw data;

    this.errorMessage = "";
    let result = data.result;

    switch (true) {
      // Options array is found in data.result E.G. dataRaptor.
      case Array.isArray(result):
        break;
      // Options array is found in data.result.data E.G. http action.
      case Array.isArray(result.data):
        result = result.data;
        break;
      // Options array is found in the specified responseJSONNode
      case result[this._propSetMap.taAction.propSetMap.responseJSONNode] !==
        undefined:
        result = result[this._propSetMap.taAction.propSetMap.responseJSONNode];
        break;
      // Options array is found in the specified responseJSONPath
      case result[this._propSetMap.taAction.propSetMap.responseJSONPath] !==
        undefined:
        result = result[this._propSetMap.taAction.propSetMap.responseJSONPath];
        break;
      // Nothing returned.
      default:
      // no-op
    }

    if (!Array.isArray(result) && Object.keys(result).length > 0) {
      // Response was a single object.
      result = [result];
    }

    return result;
  }

  /**
   * A hook in the getOptions promise chain to allow components that inherit from omniscriptTypeahead
   * to define a custom filter.
   * @example
   * ``` js
   * dataProcessor(data) {
   *   // Matches items by name (case insensitive). **Default behavior**
   *   return data.filter(item => item.name.toLowerCase().includes(this.elementValue.toLowerCase()));
   *   // Matches items by name (case sensitive).
   *   return data.filter(item => item.name.includes(this.elementValue));
   *   // Items names must start with input value.
   *   return data.filter(item => new RegExp(`^${this.elementValue}`, 'i').test(item.name));
   * }
   * ```
   *
   * @param {Any[]} data - A list of items returned from handleResponse
   * @scope private
   * @returns {Promise<any>}
   */
  dataProcessorHook(data) {
    if (this.dataProcessor && typeof this.dataProcessor === "function")
      return this.dataProcessor(data);
    return data;
  }

  /**
   * Final link in the getOptions/getOptionsDataJson promise chain.
   * Responsible for setting the options array, and ensuring that the options items
   * are in a format that is digestible by the base c-sf-gps-ds-osrt-typeahead component.
   * @param {*} data - Array of items returned from dataProcessorHook.
   * @scope private
   * @returns {void}
   */
  setOptions(data) {
    // if there are no options returned, add an empty item to trigger the display of the dropdown (Add New).
    if (
      !this._propSetMap.enableLookup &&
      data !== null &&
      Object.keys(data).length === 0
    )
      data = [{ name: "" }];

    if (Array.isArray(data)) {
      this.options = data.map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (!this._propSetMap.typeAheadKey) {
          return (item = { name: JSON.stringify(item) || "", item: item });
        }

        return (item = {
          name: item[this._propSetMap.typeAheadKey] || "",
          item: item
        });
      });
    } else {
      this.options = [];
    }
    // In lookup mode, if selected value is not present in new set of options then clear typeahead input
    if (this._propSetMap.enableLookup && this.elementValue) {
      const optionsArray = JSON.parse(JSON.stringify(this.options));
      if (!optionsArray.some((item) => item.name === this.elementValue)) {
        this.setElementValue("");
      }
    }
  }

  /**
   * Error handler for the getOptions/getOptionsDataJson promise chain.
   * @param {(string|Object)} [reason] - Message or Error object containing details of the error.
   * @scope private
   * @returns {void}
   */
  handleError(reason) {
    this.options = [];

    if (reason && typeof reason.errorMsg === "string")
      this.errorMessage = reason.errorMsg;

    console.error("Error getting typeahead options:", reason);
  }

  /**
   * @param {CustomEvent} evt
   * Called when a selection is made from the base typeahead component.
   * Bound in template.
   * @scope private
   * @returns {void}
   */
  handleSelect(evt) {
    if (this._propSetMap.enableLookup && this._showLookupOptions) {
      this._showLookupOptions = false;
    }

    if (evt.detail.index === "last-item") {
      this.applyCallResp(null, true);
      this.childInput.focus();
      this.dispatchOmniEventUtil(this, { item: "$Vlocity.nullify" }, "select");
      this.toggleEditMode(true);
    } else {
      this.applyCallResp(evt.target.value, true);
      this.options = [];
    }
  }

  /**
   * If a boolean is specifically sent, that value will be set. Otherwise `_editMode` will be toggled.
   * @param {*} [isEditMode] - If passed, `_editMode` will set to passed value.
   * @scope private
   * @returns {void}
   */
  @api toggleEditMode(isEditMode) {
    this._isEditMode =
      typeof isEditMode === "boolean" ? isEditMode : !this._isEditMode;

    if (this._isEditMode) {
      this.dispatchEvent(
        new CustomEvent("hidevalidation", {
          bubbles: true,
          cancelable: true,
          composed: true
        })
      );
      this.classList.add("is-edit-mode");
    } else {
      this.classList.remove("is-edit-mode");
    }
  }

  @api getIsEditMode() {
    return this._isEditMode;
  }

  // Lifecycle Hooks
  initCompVariables() {
    super.initCompVariables();
    this.classList.add(`${this._theme === "nds" ? "nds-" : ""}omni-typeahead`);
    this._disableFilter = this._propSetMap.disableDataFilter;
    this._editLabel = this.allCustomLabelsUtil.OmniTypeAheadEditLabel;

    if (this._propSetMap.enableLookup) {
      this.classList.add(`${this._theme === "nds" ? "nds-" : ""}omni-lookup`);
      // For lookup mode, getOptions if funneled through click.
      this.template.addEventListener(
        "click",
        this.handleLookupButtonClick.bind(this)
      );
      this.template.addEventListener(
        "lookupfocus",
        this.handleLookupFocus.bind(this)
      );
      this.template.addEventListener("keydown", (evt) => {
        switch (true) {
          case evt.metaKey: // Mac command key.
          case evt.ctrlKey: // Windows ctrl key
          case evt.keyCode === 9: // Tab
            // Allow user to tab out, and copy.
            break;
          case evt.keyCode === 13: {
            // "Enter" should both trigger the same functionality as a button click
            this.handleLookupButtonClick();
            break;
          }
          default:
            // Prevent manual input entry!
            evt.preventDefault();
        }
      });
      // Don't alow the user to paste values into a lookup.
      this.template.addEventListener("paste", (evt) => evt.preventDefault());
      // Don't alow the user to cut values from a lookup.
      this.template.addEventListener("cut", (evt) => evt.preventDefault());
      this._disableFilter = true;
    }

    if (this.dataProcessor && typeof this.dataProcessor === "function")
      this._disableFilter = true;
    // Disable remote-source
    if (this._propSetMap.useDataJson) this._useRemoteSource = false;
    // For typeahead mode, getOptions if funneled through keyup.
    if (!this._propSetMap.enableLookup)
      this.template.addEventListener("input", this.handleTypeahead.bind(this));

    if (this._propSetMap.editMode && !this._propSetMap.enableLookup) {
      this.toggleEditMode(true);
    }
    this._newItemLabel = this._propSetMap.newItemLabel;
    // ignoring default "new" custom label
    if (this._multiLang && this.jsonDef.propSetMap.newItemLabel === "") {
      this._newItemLabel = "";
    }
  }

  applyCtrlWidth() {
    if (this._propSetMap.controlWidth != null && this.jsonDef.level !== 0) {
      if (this._theme === "slds") {
        this.classList.add(this._theme + "-p-right_small");
        this.classList.add(this._theme + "-m-bottom_xx-small");
        this.classList.add(this._theme + "-show_inline-block");
      }

      this.classList.add(this._theme + "-size_12-of-12");
    }
  }

  handleLookupFocus() {
    this._lookupFocused = true;
  }

  render() {
    return tmpl;
  }
}
