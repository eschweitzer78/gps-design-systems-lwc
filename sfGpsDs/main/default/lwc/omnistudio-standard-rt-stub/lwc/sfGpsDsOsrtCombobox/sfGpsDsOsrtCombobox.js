import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./combobox_slds.html";
import ndsTemplate from "./combobox_nds.html";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { isEqual, findIndex, debounce } from "c/sfGpsDsOsrtLodash";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";
import { inputLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

let comboboxOptId = 0;
const QUERY_TIMEOUT = 700;
export default class VlocityCombobox extends LightningElement {
  @api label;
  @api labelClasses;
  @api placeholder;
  @api name;
  @api tabIndex;
  @api iconUrl;
  @api channel;
  @api messagewhenoptionsselected = translatedLabels.optionsSelected;
  @api isDisplayFlex = false;
  @track valueMap = [];
  labelValueMap = {};
  internalOptions = [];
  _requiredLabel = translatedLabels.cmpRequired;

  @track preventBlur;
  @track _sorted = false;
  @track _variant = "standard";
  @api get variant() {
    return this._variant;
  }
  set variant(val) {
    if (val) {
      this._variant = val;
      this.isLabelHidden = val === "label-hidden" ? true : false;
    }
  }
  @api
  get value() {
    let inputValObj = Object.assign([], this.inputValue);
    inputValObj = inputValObj.map((val) => {
      if (val === "none") {
        val = "";
      }
      return val;
    });
    return inputValObj && inputValObj.length === 1
      ? inputValObj[0]
      : inputValObj;
  }
  set value(val) {
    const validStr = (str) => {
      try {
        if (typeof str === "string") {
          return str.indexOf("]") !== -1
            ? Array.isArray(JSON.parse(str))
              ? JSON.parse(str).map((item) => {
                  return typeof item === "string" ? item : String(item);
                })
              : JSON.parse(str)
            : this.multiple
              ? str.split(",")
              : [str];
        } else if (typeof str === "number") {
          return [String(str)];
        } else if (typeof str === "boolean") {
          return [String(str)];
        }
      } catch (e) {
        return "";
      }
      return "";
    };

    this.valueMap =
      val != null
        ? val !== ""
          ? typeof val === "string" ||
            typeof val === "number" ||
            typeof val === "boolean"
            ? validStr(val)
            : Array.isArray(val)
              ? val.map((item) => {
                  return typeof item === "string" ? item : String(item);
                })
              : [...val]
          : ["none"]
        : "";
    if (val !== "") {
      this.reportValidity();
    }
    if (this.valueMap.length && this.internalOptions.length) {
      this.inputValue = [];
      this.internalOptions.forEach((item) => {
        if (this.valueMap.indexOf(item.value) >= 0) {
          this.inputValue.push(item.value);
          this.selectedOptionMap = {
            label: item.label,
            value: item.value,
            optId: item.optId
          };
          if (
            this.selectedOptionMap &&
            this.selectedOptionMap.label &&
            !this.labelValueMap[this.selectedOptionMap.label]
          ) {
            this.labelValueMap[this.selectedOptionMap.label] =
              this.selectedOptionMap.value;
          }
          this._selectedOption = item.label;
          this.valueCopy = this._selectedOption;
          if (this.multiple === "true" || this.multiple === true) {
            this.setMultiValue();
          }
        }
      });
    }
  }
  @api
  get options() {
    let optionsObj = [...this.internalOptions];
    optionsObj = optionsObj.map((opt) => {
      if (opt.value === "none") opt.value = "";
      return opt;
    });
    return optionsObj;
  }
  set options(val) {
    const validObj = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return [];
      }
    };
    this.internalOptions =
      val && val.length ? (typeof val === "string" ? validObj(val) : val) : [];
    this.internalOptions = this.internalOptions.map((opt, index) => {
      let optionObj = { ...opt };
      if (optionObj.value === "") optionObj.value = "none";
      // Handle incase optionObj.value is boolean
      if (typeof optionObj.value === "boolean")
        optionObj.value = String(optionObj.value);
      optionObj.optId = index;
      return optionObj;
    });
    this.sortOptions();
    this.internalOptionsCopy = this.internalOptions;
  }

  @api get sorted() {
    return this._sorted;
  }
  set sorted(val) {
    this._sorted = val === true || val === "true";
    this.sortOptions();
  }
  @api sortField;
  /** This function sorts the options in alphabetical order of value, or if any other sortField is defined  */
  sortOptions() {
    if (!this.sorted) return;
    if (!this.internalOptions.length) return;
    let sortedOptions = this.internalOptions.sort((a, b) => {
      // If this.sortField is there then sort according to that
      const item1 =
        this.sortField && typeof this.sortField === "string"
          ? a[this.sortField]
          : a.label;
      const item2 =
        this.sortField && typeof this.sortField === "string"
          ? b[this.sortField]
          : b.label;
      return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
    });
    sortedOptions.forEach((opt, index) => {
      opt.optId = index;
    });
    this.internalOptions = [...sortedOptions];
  }

  @api get requiredLabel() {
    return this._requiredLabel;
  }
  set requiredLabel(val) {
    if (val) {
      this._requiredLabel = val;
    } else {
      this._requiredLabel = translatedLabels.cmpRequired;
    }
  }

  @api theme = "slds";
  @api disabled;

  @api get readOnly() {
    return this._readOnly;
  }
  set readOnly(val) {
    this._readOnly = val;
  }

  @api required;
  @api getValue;
  @api setOptions;
  @api multiple;
  @api deleteMultiple;
  @api searchable;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api messageWhenValueMissing = translatedLabels.cmpFieldValueMissing;
  @api extraFooterClass = "";
  @api maxCount;
  @track internalOptionsCopy = [];
  @track valueCopy = "";
  @track isLabelHidden = false;
  @track isError = false;
  @track errorMessage;
  @track inputLabels = [];
  @track _readOnly = false;
  @track hidefooter = false;
  @track _selectedOption;
  @track isOpen = false;

  selectedVal;
  firstRender = true;
  _validity = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false
  };
  _triggerBlur = true;
  _alwaysShowLookup = false;
  // timeout for allowing a user to enter a sequence of chars for querying optons
  _queryTimeout = null;
  // string entered by user to query an option
  _query = "";
  activeDescendant = null;

  @track styleProperties = {
    label: {},
    value: {}
  };

  @api get styles() {
    return this._styles;
  }

  get showDelIcon() {
    return this.deleteMultiple && !this.disabled;
  }

  set styles(val) {
    const validObj = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return {};
      }
    };

    val = val ? (typeof val === "string" ? validObj(val) : val) : {};
    val = val.styles ? val.styles : val;
    this._styles = val;
    if (this._styles) {
      for (let key in this._styles) {
        if (this._styles.hasOwnProperty(key)) {
          this.styleProperties[key] = {};
          if (key === "label") {
            this.styleProperties.label.styles = "";
            this.updateStyles(this._styles[key], key);
            this.styleProperties.label.styles += "width:auto;";
          } else if (key === "value") {
            this.updateStyles(this._styles[key], key);
          }
        }
      }
    }
  }

  updateStyles(styleObj, styleKey) {
    let keys = Object.keys(styleObj);
    keys.forEach((key) => {
      if (key !== "textAlign" || styleKey !== "label") {
        if (!this.styleProperties[styleKey].styles) {
          this.styleProperties[styleKey].styles = "";
        }
        this.styleProperties[styleKey].styles += `${lwcPropertyNameConversion(
          key
        )}:${styleObj[key]};`;
      } else {
        let labelEles = this.template.querySelectorAll('[data-label="true"]');
        if (labelEles && labelEles.length) {
          labelEles[0].style.textAlign = styleObj[key];
          labelEles[0].style.display = "block";
        }
      }
    });
  }

  render() {
    return this.theme === "nds" ? ndsTemplate : sldsTemplate;
  }

  setMultiValue() {
    if (this.valueMap) {
      this.valueMap.forEach((item) => {
        if (typeof item === "object") {
          item = item.value;
        }
        if (
          !this.internalOptions.find((option) => {
            // Need to check only for the value and not the type, so using ==
            // eslint-disable-next-line eqeqeq
            return option.value == item;
          })
        ) {
          this.inputValue = [];
          this.inputLabels = [];
        }
      });
    }

    if (this.inputValue[0] && this.multiple) {
      this.valueCopy =
        this.inputValue.length <= 0
          ? ""
          : this.inputValue.length > 1
            ? `${this.messagewhenoptionsselected.replace(
                "{0}",
                this.inputValue.length
              )}`
            : this.inputLabels[0];
    } else {
      let index = findIndex(
        this.internalOptions,
        //data set is returning value as string and if values are typeof number we need to compare only value and not type
        // eslint-disable-next-line eqeqeq
        (x) => x.value == this.inputValue[0]
      );
      if (index >= 0) {
        this.valueCopy = this.internalOptions[index].label;
      } else {
        this.valueCopy = "";
      }
    }
  }

  setValue() {
    this.groupArray = [];
    if (this.optionSelected) {
      this.inputValue = this.inputValue ? this.inputValue : [];
      this.optionSelected = false;
    } else {
      this.inputValue = [];
      this.inputLabels = [];
    }
    this.internalOptions.map((obj) => {
      if (this.valueMap) {
        this.valueMap.map((val, i) => {
          let item = val;
          if (typeof val === "object") {
            item = val[i];
          }
          //data set is returning value as string and if values are typeof number we need to compare only value and not type
          // eslint-disable-next-line eqeqeq
          if (item == obj.value) {
            if (this.inputValue.indexOf(item) === -1) {
              this.inputValue.push(item);
            }
            if (this.inputLabels.indexOf(obj.label) === -1) {
              this.inputLabels.push(obj.label);
            }
          }
          return val;
        });
      }
      if (obj.group) {
        if (this.groupArray.indexOf(obj.group) === -1) {
          this.groupArray.push(obj.group);
        }
      }
      this.valueCheck = this.valueMap;
      this.optionsCheck = this.internalOptions;
      return obj;
    });

    let optionArr = "";
    for (let i = 0; i < this.internalOptions.length; i++) {
      optionArr = optionArr + this.internalOptions[i].value + ",";
    }
    for (let i = 0; i < this.inputValue.length; i++) {
      if (optionArr.indexOf(this.inputValue[i] + ",") === -1) {
        this.inputValue.splice(this.inputValue.indexOf(this.inputValue[i]), 1);
        i--;
      }
    }
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.inputValue.join(",")
    });
    if (this.inputValue && this.inputValue.length !== 0) {
      this.reportValidity();
    }

    if (!this.multiple && !this.inputValue) {
      this.inputLabels = "";
    } else if (this.multiple && this.inputValue.length === 0) {
      this.inputLabels = [];
    }
  }
  triggerEvent = (event) => {
    if (event) {
      this.dispatchEvent(
        new CustomEvent(event.type, {
          bubbles: true,
          composed: true
        })
      );
    }
  };
  get dropdownStyle() {
    if (this.maxCount && !isNaN(this.maxCount)) {
      return (
        "overflow-x:auto;max-height:" + parseInt(this.maxCount, 10) * 35 + "px;"
      );
    }
    return "";
  }
  renderedCallback() {
    if (
      !isEqual(this.valueMap, this.valueCheck) ||
      !isEqual(this.optionsCheck, this.internalOptions)
    ) {
      this.valueCheck = this.valueMap;
      this.optionsCheck = this.internalOptions;

      this.setValue();
      this.setMultiValue();
    }

    const input = this.template.querySelector("input");
    if (input && this.firstRender) {
      this.hidefooter = this.querySelector("[slot='footer']") ? false : true;
      input.addEventListener("blur", this.triggerEvent);
      input.addEventListener("focus", this.triggerEvent);
      this.firstRender = false;
    }
    if (this.theme === "nds") {
      if (input.value) input.classList.add("nds-not-empty", "nds-is-dirty");
      else input.classList.remove("nds-not-empty", "nds-is-dirty");
    }
  }
  disconnectedCallback() {
    const input = this.template.querySelector("input");
    if (input) {
      input.removeEventListener("blur", this.triggerEvent);
      input.removeEventListener("focus", this.triggerEvent);
      this.inputElm = null;
    }
  }
  groupOptions() {
    for (let i = 0; i < this.groupArray.length; i++) {
      for (let j = 0; j < this.internalOptions.length; j++) {
        if (this.internalOptions[j].group === this.groupArray[i]) {
          this.internalOptions.splice(j, 1, {
            label: this.internalOptions[j].label,
            value: this.internalOptions[j].value,
            group: this.internalOptions[j].group,
            isGrouped: "true",
            optId: this.internalOptions[j].group + comboboxOptId++
          });
          break;
        }
      }
    }
  }

  get extraLabelClasses() {
    return this.theme === "slds"
      ? `slds-form-element__label slds-show_inline ${this.labelClasses || ""}`
      : this.labelClasses || "";
  }

  connectedCallback() {
    this.isLabelHidden = this.variant === "label-hidden" ? true : false;
    if (typeof this.internalOptions === "string") {
      this.internalOptions = JSON.parse(this.internalOptions);
    }

    this.setValue();
    if (this.groupArray) {
      this.groupOptions();
    }
    this.setMultiValue();
    this._alwaysShowLookup = Boolean(this.getAttribute("data-show-lookup"));
  }

  get errorClass() {
    let classes = `${this.theme}-combobox ${this.theme}-dropdown-trigger ${
      this.theme
    }-dropdown-trigger_click ${this.isError ? this.theme + "-has-error" : ""}`;
    return classes;
  }

  get isNotInput() {
    if (this._readOnly || this.disabled) {
      return true;
    }
    return this.searchable !== undefined ? !this.searchable : false;
  }

  showLookup(event) {
    if ((this._readOnly && !this._alwaysShowLookup) || this.disabled) {
      return;
    }
    if (event.type === "click") {
      this.highlightIndex = this.selectedOptionMap
        ? this.selectedOptionMap.optId
        : 0;
      this.setAriaAttributes(this.highlightIndex);
    }
    if (event.type === "click" || event.type === "keyup") {
      this.template
        .querySelector(`.${this.theme}-dropdown-trigger_click`)
        .classList.toggle(`${this.theme}-is-open`);
      this.isOpen = this.template
        .querySelector(`.${this.theme}-dropdown-trigger_click`)
        .classList.contains(`${this.theme}-is-open`);
      if (this.isOpen) {
        this.selectedVal = this.valueCopy;
        this.filterOptions(false, event.target.value);
      } else if (
        this.theme === "nds" &&
        event.target.getAttribute("id") === null
      ) {
        // W-13668028 - combobox is closed by clicking nds dropdown, set focus on the input
        // this allows the blur event being fired when focus away from the combobox input
        event.stopPropagation();
        this.template.querySelector("input").focus();
      }
    } else if (event.type === "blur") {
      if (this.preventBlur) {
        return;
      }
      if (!this._triggerBlur) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        window.setTimeout(() => {
          this.template
            .querySelector(`.${this.theme}-dropdown-trigger_click`)
            .classList.remove(`${this.theme}-is-open`);
          this.closeTooltip();
        }, 100);
        this._triggerBlur = true;
      } else {
        this.template
          .querySelector(`.${this.theme}-dropdown-trigger_click`)
          .classList.remove(`${this.theme}-is-open`);
        this.closeTooltip();
      }

      if (
        Array.isArray(this.options) &&
        this.options.some(
          (option) =>
            (option.label &&
              this._selectedOption &&
              option.label.toString() === this._selectedOption.toString()) ||
            (option.label &&
              this.selectedVal &&
              option.label.toString() === this.selectedVal.toString())
        )
      ) {
        this.valueCopy =
          this.valueCopy || !this.inputValue.length
            ? this.valueCopy
            : this.selectedVal;
        if (!this.multiple) {
          this.valueCopy = this._selectedOption
            ? this._selectedOption
            : this.selectedVal
              ? this.selectedVal
              : this.valueCopy;
        }
      } else {
        this.valueMap = [];
        this._selectedOption = null;
      }

      this.reportValidity();
      this.hideOptions();
    }
  }

  /**
   *
   * @param {Integer} newIndex : null or a positive integer
   * All options will have the focus class removed
   * Valid newIndex option will have the focus class added
   */
  setAriaAttributes(newIndex) {
    this.activeDescendant = null;
    const options = this.template.querySelectorAll(
      `.${this.theme}-is-selected`
    );
    if (options.length > 0) {
      options.forEach((opt) => {
        opt.classList.remove(`${this.theme}-has-focus`);
        // set aria-checked attribute as false for the first time and later situations
        // just keep the previous value
        const ariaCheckValue = opt.getAttribute("aria-checked")
          ? opt.getAttribute("aria-checked")
          : false;
        opt.setAttribute("aria-checked", ariaCheckValue);
      });
    }

    const option = options[newIndex];

    if (option) {
      option.classList.add(`${this.theme}-has-focus`);
      this.activeDescendant = this.internalOptionsCopy[newIndex].optId;
      if (option.scrollIntoView) {
        option.scrollIntoView({ block: "nearest" });
      }
    }
  }

  /**
   *
   * @param {Integer} newIndex : null or a positive integer
   * All options will have the aria-checked attribute unset
   * Valid newIndex option will have the aria-checked set
   */
  setAriaCheckedAttribute(newIndex) {
    this.activeDescendant = null;
    const options = this.template.querySelectorAll(
      `.${this.theme}-is-selected`
    );
    if (options.length > 0) {
      options.forEach((opt) => {
        opt.setAttribute("aria-checked", "false");
      });
    }
    const option = options[newIndex];
    if (option) {
      option.setAttribute("aria-checked", "true");
    }
  }

  /**
   * @param {Number} ms: Number of milliseconds to wait before clearing the query.
   * Clears timeout and variables related to querying options.
   */
  setQueryTimeout(ms) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this._queryTimeout = setTimeout(() => {
      this._query = "";
      this._queryTimeout = null;
    }, ms);
  }

  /*
   * @param {String} query: String to search for.
   * Searches and highlights an option that starts with the given query.
   */
  highlightWithQuery(query) {
    let firstMatch = -1;
    let lastMatch = -1;

    for (const [index, option] of this.options.entries()) {
      if (
        typeof option.label === "string" &&
        option.label.toLowerCase().startsWith(query)
      ) {
        // always save the first match
        if (firstMatch === -1) {
          firstMatch = index;
        }
        // exit when a match is found after the currently highlighted index
        if (index > this.highlightIndex && lastMatch === -1) {
          lastMatch = index;
          break;
        }
      }
    }

    // if a match is found, highlight it
    if (firstMatch !== -1 || lastMatch !== -1) {
      this.highlightIndex = Math.max(firstMatch, lastMatch);
      this.setAriaAttributes(this.highlightIndex);
    }
  }

  debounceHighlightWithQuery = debounce(this.highlightWithQuery, 100, {
    leading: true
  });

  /**
   *
   * @param {Event} event : Keydown event
   * Using keyboard to focus and select the option
   */
  handleKeyDown(event) {
    const key = event.key;
    if (
      !this.isOpen &&
      (key === "ArrowDown" || key === "Down" || key === "Enter")
    ) {
      this.highlightIndex = this.selectedOptionMap
        ? this.selectedOptionMap.optId
        : 0;
      this.showLookup(event);
      this.setAriaAttributes(this.highlightIndex);
      event.preventDefault();
    } else {
      if (key === "ArrowUp" || key === "Up") {
        this.highlightIndex =
          this.highlightIndex === -1 ? 0 : this.highlightIndex;
        this.highlightIndex =
          (this.highlightIndex - 1 + this.options.length) %
          this.internalOptionsCopy.length;
        this.setAriaAttributes(this.highlightIndex);
        event.preventDefault();
      } else if (key === "ArrowDown" || key === "Down") {
        this.highlightIndex =
          (this.highlightIndex + 1) % this.internalOptionsCopy.length;
        this.setAriaAttributes(this.highlightIndex);
        event.preventDefault();
      } else if (key === "Enter") {
        //selecting the option
        const selectedOption = this.internalOptionsCopy[this.highlightIndex];
        if (selectedOption) {
          this.selectOption(null, selectedOption);
          this.hideOptions();
        }
        event.preventDefault();
      } else if (key === "Escape" || key === "Esc") {
        this.hideOptions();
        event.preventDefault();

        // this creates a short window of time where a user can type in a query to jump to a specific option
      } else if (
        !this.searchable &&
        ((this.isOpen && /^[a-zA-Z0-9]$/.test(event.key)) ||
          key === "Backspace")
      ) {
        const letter = event.key.toLowerCase();

        // reset the timeout if a query is already in progress
        if (this._queryTimeout) {
          clearTimeout(this._queryTimeout);
        }

        // update the query
        if (key === "Backspace") {
          if (this._query.length > 0) {
            this._query = this._query.slice(0, this._query.length - 1);
          }
        } else {
          this._query += letter;
        }

        // if a user deletes the query, remove the timeout to allow a new search
        if (this._query.length === 0) {
          this._queryTimeout = null;
          return;
        }

        // as long as an option matches the query, it should stay highlighted
        if (
          this._queryTimeout &&
          this.options[this.highlightIndex].label
            .toLowerCase()
            .startsWith(this._query)
        ) {
          this.setQueryTimeout(QUERY_TIMEOUT);
          return;
        }

        // otherwise try to highlight a new option
        this.debounceHighlightWithQuery(this._query);

        // set a timer to clear the query so a user can make a new query in the future
        this.setQueryTimeout(QUERY_TIMEOUT);
      }
    }
  }

  hideOptions() {
    this.template
      .querySelector(`.${this.theme}-dropdown-trigger_click`)
      .classList.remove(`${this.theme}-is-open`);
    this.setAriaAttributes(null);
    this.isOpen = false;
    this.activeDescendant = null;
  }

  handleMouseOver(event) {
    event.stopPropagation();
    this.highlightIndex = parseInt(
      event.currentTarget.getAttribute("data-option-id"),
      10
    );
    this.setAriaAttributes(this.highlightIndex);
  }

  handleMouseOut(event) {
    event.stopPropagation();
    this.setAriaAttributes(null);
    this.highlightIndex = -1;
  }

  preventLookupClose(event) {
    event.stopPropagation();
    this.preventBlur = true;
  }

  preventLookupOpen(event) {
    event.stopPropagation();
    this.template.querySelector("input").focus();
    this.preventBlur = false;
  }

  preventKeyDown(event) {
    if (this.searchable) {
      return;
    }
    if (event.key !== "Tab") {
      event.preventDefault();
    }
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments[0].target;
      let later = function () {
        timeout = null;
        if (!immediate) func.call(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  selectOption(event, selectedOption) {
    let value;
    if (event) {
      event.stopPropagation();
      value = event.currentTarget.dataset.value;
      this.valueCopy = event.currentTarget.dataset.label;
      this._selectedOption = event.currentTarget.dataset.label;
      const optId = parseInt(
        event.currentTarget.getAttribute("data-option-id"),
        10
      );
      this.selectedOptionMap = {
        label: event.currentTarget.dataset.label,
        value,
        optId
      };
    } else if (selectedOption) {
      value = selectedOption.value;
      this.valueCopy = selectedOption.label;
      this._selectedOption = selectedOption.label;
      this.selectedOptionMap = { ...selectedOption };
    }
    this.highlightIndex = this.selectedOptionMap
      ? this.selectedOptionMap.optId
      : this.internalOptionsCopy.findIndex((opt) => opt.value === value);
    if (this.multiple) {
      this.optionSelected = true;
      if (this.inputValue.indexOf(value) === -1) {
        this.inputValue.push(value);
        this.inputLabels.push(this.valueCopy);
      } else {
        this.inputValue.splice(this.inputValue.indexOf(value), 1);
        this.inputLabels.splice(this.inputLabels.indexOf(this.valueCopy), 1);
      }
      this.valueMap = this.inputValue;
      this.setMultiValue();
    } else {
      let index = findIndex(
        this.internalOptions,
        //dataset is returning value as string and if values are typeof number we need to compare only value and not type
        // eslint-disable-next-line eqeqeq
        (x) => x.value == value
      );
      if (index > -1 && index < this.internalOptions.length) {
        this.valueMap = [this.internalOptions[index].value];
        this.inputValue = [this.internalOptions[index].value];
      }
      // set the aria-checked attribute for selected as true and for rest all as false
      this.setAriaCheckedAttribute(index);
    }
    this.hideOptions();
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.inputValue.join(",")
    });
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );
  }

  searchDebounce = debounce((target) => {
    const searchKey = target.value;
    this.valueCopy = searchKey;
    this.filterOptions(target, searchKey);
  }, 100);

  searchOptions(event) {
    if (this.searchable && event?.target) {
      this.searchDebounce(event.target);
    }
  }

  handleKeyUp(event) {
    this.handleKeyDown(event);
    this.searchOptions(event);
  }

  filterOptions(target, searchKey) {
    if (typeof this.internalOptions === "string") {
      this.internalOptions = JSON.parse(this.internalOptions);
    }
    if (this.searchable) {
      this.internalOptionsCopy = this.internalOptions.filter((item) => {
        this.valueCopy = target ? searchKey : "";
        if (this.valueCopy) {
          return item.label
            .toLowerCase()
            .includes(this.valueCopy.toLowerCase());
        } else if (this.valueCopy === item) {
          return false;
        }
        return true;
      });
    } else {
      this.internalOptionsCopy = this.internalOptions;
    }

    if (this.groupArray) {
      this.groupOptions();
    }
  }

  preventTrigger(event) {
    event.stopPropagation();
    this._triggerBlur = false;
  }

  setValidity(showError) {
    if (!this._validity.customError) {
      this.isError = false;
      this.errorMessage = "";
    }
    if (
      (!this.value || this.value.length === 0) &&
      (!this.inputValue ||
        this.inputValue.length === 0 ||
        this.inputValue[0] === "none" ||
        this.inputValue[0] === "") &&
      this.required
    ) {
      this._validity.valueMissing = true;
      if (showError) {
        this.isError = true;
        this.errorMessage = this.messageWhenValueMissing;
      }
    } else {
      // ideally we should also check against options
      this._validity.valueMissing = false;
    }

    this._validity.valid =
      !this._validity.customError && !this._validity.valueMissing;
  }

  get footerClass() {
    return `${this.theme}-popover__footer ${this.theme}-popover__footer_form ${this.extraFooterClass}`;
  }

  get pillWrapperClass() {
    return `${
      this.isDisplayFlex === "true" || this.isDisplayFlex === true
        ? this.theme + "-listbox__flex"
        : ""
    } ${this.theme}-listbox ${this.theme}-listbox_horizontal`;
  }

  @api
  checkValidity() {
    this.setValidity(false);
    return this._validity && this._validity.valid;
  }

  @api
  reportValidity() {
    this.setValidity(true);
    return this._validity.valid;
  }

  @api
  setCustomValidity(message) {
    this._validity.customError = message === "" ? false : true;
    this.isError = message === "" ? false : true;
    this.errorMessage = message;
  }

  @api
  focus() {
    this.template.querySelector("input").focus();
  }

  @api
  showHelpMessageIfInvalid() {
    this.setValidity(true);
  }
  deleteThisLabel(event) {
    let deleteLabel =
      event && event.currentTarget && event.currentTarget.dataset
        ? event.currentTarget.dataset.label
        : "";
    const labelIndex = this.inputLabels.indexOf(deleteLabel);
    this.inputLabels.splice(labelIndex, 1);
    const valueToDelete = this.labelValueMap[deleteLabel];
    const valueIndex = this.inputValue.indexOf(valueToDelete);
    this.inputValue.splice(valueIndex, 1);
    this.valueCopy =
      this.inputValue.length <= 0
        ? ""
        : this.inputValue.length > 1
          ? `${this.messagewhenoptionsselected.replace(
              "{0}",
              this.inputValue.length
            )}`
          : this.inputLabels[0];
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.inputValue.join(",")
    });
    this.fireEvent("remove", deleteLabel);
    this.fireEvent("change", deleteLabel);
  }

  fireEvent(eventName, data) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        result: data
      }
    });
    this.dispatchEvent(event);
  }

  closeTooltip() {
    const tooltip = this.template.querySelector("[data-field-level-help]");
    if (tooltip) {
      tooltip.closeTooltip();
    }
  }
}
