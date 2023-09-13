import { LightningElement, api, track } from "lwc";
import { normaliseBoolean, debounce, arraysEqual } from "c/sfGpsDsHelpers";

const I18N = {
  optionsSelected: "options selected",
  cmpRequired: "required",
  selectedOptionsLabel: "Selected Options:",
  messageWhenValueMissing: "Message when value missing"
};

const NONE = "none";
const OPTION_ID_ATTRNAME = "data-option-id";
const QUERY_TIMEOUT = 700;
const PUB_SUB = null;
const DEBUG = true;

export default class SfGpsDsCombobox extends LightningElement {
  @api label;
  @api labelClasses;
  @api placeholder;
  @api name;
  @api tabIndex;
  @api iconUrl;
  @api channel;
  @api theme;
  @api disabled;
  @api getValue;
  @api setOptions;
  @api deleteMultiple;
  @api searchable;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api messageWhenValueMissing = I18N.messageWhenValueMissing;
  @api extraFooterClass;
  @api maxCount;

  @track _displayOptions;
  @track _displayValue;
  @track _inputLabels;
  @track _selectedOption;
  @track _isOpen;

  selectedVal;
  @track _activeDescendant = null;

  debounceHighlightWithQuery = debounce(this.highlightWithQuery, 100, {
    leading: true
  });

  searchDebounce = debounce((target) => {
    const searchKey = target.value;
    this._displayValue = searchKey;
    this.filterOptions(target, searchKey);
  }, 100);

  /* api: variant */

  @track _variant;
  @track _isLabelHidden;

  @api
  get variant() {
    return this._variant;
  }

  set variant(val) {
    if (val) {
      this._variant = val;
      this._isLabelHidden = val === "label-hidden";
    }
  }

  /* api: multiple */

  _multiple;
  _multipleOriginal;

  @api
  get multiple() {
    return this._multipleOriginal;
  }

  set multiple(value) {
    if (DEBUG) console.log("> set multiple ", JSON.stringify(value));

    this._multipleOriginal = value;
    this._multiple = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.log("< set multiple ", JSON.stringify(this._multiple));
  }

  /* api: value */

  _inputValue;
  @track _valueMap;

  @api
  get value() {
    if (DEBUG) console.log("> get value ");

    let rv = Object.assign([], this._inputValue).map((value) => {
      return value === NONE ? "" : value;
    });

    rv = rv.length === 1 ? rv[0] : rv;

    if (DEBUG) console.log("< get value ", JSON.stringify(rv));

    return rv;
  }

  set value(value) {
    if (DEBUG) console.log("> set value ", JSON.stringify(value));

    const validStr = (str) => {
      try {
        switch (typeof str) {
          case "string":
            if (str.indexOf("]") !== -1) {
              let parsed = JSON.parse(str);
              return Array.isArray(parsed)
                ? parsed.map((item) => {
                    return typeof item === "string" ? item : String(item);
                  })
                : parsed;
            }

            return this._multiple ? str.split(",") : [str];

          case "number":
          case "boolean":
            return [String(str)];

          default:
            return "";
        }
      } catch (e) {
        return "";
      }
    };

    if (value == null) {
      this._valueMap = ""; // TODO: why not []
    } else if (value === "") {
      this._valueMap = [NONE];
    } else if (["string", "number", "boolean"].includes(typeof value)) {
      this._valueMap = validStr(value);
    } else if (Array.isArray(value)) {
      this._valueMap = value.map((item) => {
        return typeof item === "string" ? item : String(item);
      });
    } else {
      this._valueMap = [...value];
    }

    if (value !== "") {
      this.reportValidity();
    }

    if (this._valueMap.length && this._internalOptions.length) {
      this._inputValue = [];
      this._internalOptions.forEach((item) => {
        if (this._valueMap.includes(item.value)) {
          this._inputValue.push(item.value);

          this.selectedOptionMap = {
            label: item.label,
            value: item.value,
            optId: item.optId
          };

          this._selectedOption = item.label;
          this._displayValue = this._selectedOption;

          if (this._multiple) {
            this.setMultiValue();
          }
        }
      });
    }

    if (DEBUG) console.log("< set value ", JSON.stringify(this._valueMap));
  }

  /* api: options */

  _internalOptions;

  @api
  get options() {
    if (DEBUG) console.log("> get options ");

    let rv = [...this._internalOptions].map((option) => {
      if (option.value === NONE) option.value = "";
      return option;
    });

    if (DEBUG) console.log("< get options ", JSON.stringify(rv));

    return rv;
  }

  set options(value) {
    if (DEBUG) console.log("> setOptions ", JSON.stringify(value));

    const validObj = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return [];
      }
    };

    if (value && value.length) {
      this._internalOptions = (
        typeof value === "string" ? validObj(value) : value
      ).map((option, index) => ({
        ...option,
        value:
          option.value === ""
            ? NONE
            : typeof option.value === "boolean"
            ? String(option.value)
            : option.value,
        optId: `option-${index + 1}`
      }));

      this.sortOptions();
    } else {
      this._internalOptions = [];
    }

    this._displayOptions = this._internalOptions;

    if (DEBUG)
      console.log("< setOptions ", JSON.stringify(this._displayOptions));
  }

  /* api: sorted */

  @track _sorted;
  _sortedOriginal;

  @api
  get sorted() {
    return this._sortedOriginal;
  }

  set sorted(value) {
    if (DEBUG) console.log("> set sorted ", JSON.stringify(value));

    this._sortedOriginal = value;
    this._sorted = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
    this.sortOptions();

    if (DEBUG)
      console.log("< set sorted ", JSON.stringify(this._internalOptions));
  }

  /* api: sortField */

  _sortField;
  _sortFieldOriginal;

  @api
  get sortField() {
    return this._sortFieldOriginal;
  }

  set sortField(value) {
    if (DEBUG) console.log("> set sortField ", JSON.stringify(value));

    this._sortFieldOriginal = value;
    this._sortField = typeof value === "string" ? value : null;
    this.sortOptions();

    if (DEBUG)
      console.log("< set sortField ", JSON.stringify(this._internalOptions));
  }

  /* api: sorted */

  _required;
  _requiredOriginal;

  @api
  get required() {
    return this._requiredOriginal;
  }

  set required(value) {
    if (DEBUG) console.log("> set required ", JSON.stringify(value));

    this._requiredOriginal = value;
    this._required = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.log("< set required ", JSON.stringify(this._required));
  }

  /* api: requiredLabel */

  _requiredLabel;

  @api
  get requiredLabel() {
    return this._requiredLabel;
  }

  set requiredLabel(value) {
    this._requiredLabel = value || I18N.cmpRequired;
  }

  /* api: readOnly */

  @track _readOnly;
  _readOnlyOriginal;

  @api
  get readOnly() {
    return this._readOnlyOriginal;
  }

  set readOnly(value) {
    this._readOnlyOriginal = value;
    this._readOnly = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* getters */
  /* ------- */

  get inputElement() {
    return null;
  }

  get triggerClickElement() {
    return null;
  }

  get selectedElements() {
    return null;
  }

  get isNotInput() {
    return this._readOnly || !this.searchable;
  }

  get _isError() {
    return this._errorMessage ? true : false;
  }

  get i18n() {
    return I18N;
  }

  /* methods */
  /* ------- */

  @api focus() {
    this.inputElement.focus();
  }

  /**
   * This function sorts the options in alphabetical order of value, or if any other sortField is defined
   */

  sortOptions() {
    if (DEBUG) console.log("> sortOptions");

    if (!this._sorted || !this._internalOptions.length) {
      if (DEBUG) console.log("< sortOptions noop");
      return;
    }

    let sortedOptions = this._internalOptions.sort((a, b) => {
      // If this.sortField is there then sort according to that
      const item1 = this._sortField ? a[this._sortField] : a.label;
      const item2 = this._sortField ? b[this._sortField] : b.label;
      return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
    });

    sortedOptions.forEach((option, index) => {
      option.optId = `option-${index + 1}`;
    });

    this._internalOptions = [...sortedOptions];

    if (DEBUG)
      console.log("< sortOptions", JSON.stringify(this._internalOptions));
  }

  groupOptions() {
    if (DEBUG) console.log("> groupOptions");

    for (let i = 0; i < this.groupArray.length; i++) {
      for (let j = 0; j < this._internalOptions.length; j++) {
        if (this._internalOptions[j].group === this.groupArray[i]) {
          this._internalOptions.splice(j, 1, {
            label: this._internalOptions[j].label,
            value: this._internalOptions[j].value,
            group: this._internalOptions[j].group,
            isGrouped: true,
            optId: this._internalOptions[j].group + `-${j}`
          });
          break;
        }
      }
    }

    if (DEBUG)
      console.log("< groupOptions", JSON.stringify(this._internalOptions));
  }

  setMultiValue() {
    if (DEBUG) console.log("< setMultivalue");

    if (this._valueMap) {
      this._valueMap.forEach((item) => {
        if (typeof item === "object") {
          item = item.value;
        }

        if (
          !this._internalOptions.find((option) => {
            // Need to check only for the value and not the type, so using ==
            // eslint-disable-next-line eqeqeq
            return option.value == item;
          })
        ) {
          this._inputValue = [];
          this._inputLabels = [];
        }
      });
    }

    if (this._inputValue[0] && this._multiple) {
      if (this._inputValue.length <= 0) {
        this._displayValue = "";
      } else if (this._inputValue.length > 1) {
        this._displayValue = `${this._inputValue.length} ${I18N.optionsSelected}`;
      } else {
        this._displayValue = this._inputLabels[0];
      }
    } else {
      // data set is returning value as string and if values are typeof number we need to
      // compare only value and not type
      let index = this._internalOption
        ? this._internalOptions.findIndex(
            // eslint-disable-next-line eqeqeq
            (x) => x.value == this._inputValue[0]
          )
        : -1;
      this._displayValue = index >= 0 ? this._internalOptions[index].label : "";
    }

    if (DEBUG)
      console.log("< setMultiValue ", JSON.stringify(this._displayValue));
  }

  setValue() {
    if (DEBUG) console.log("< setValue");

    this.groupArray = [];

    if (this.optionSelected) {
      this._inputValue = this._inputValue ? this._inputValue : [];
      this.optionSelected = false;
    } else {
      this._inputValue = [];
      this._inputLabels = [];
    }

    if (!this._internalOptions) return;

    this._internalOptions.forEach((option) => {
      if (this._valueMap) {
        this._valueMap.forEach((value, index) => {
          let item = typeof value === "object" ? value[index] : value;

          // data set is returning value as string and if values are typeof number we
          // need to compare only value and not type
          // eslint-disable-next-line eqeqeq
          if (item == option.value) {
            if (!this._inputValue.includes(item)) {
              this._inputValue.push(item);
            }

            if (!this._inputLabels.includes(option.label)) {
              this._inputLabels.push(option.label);
            }
          }

          return value;
        });
      }

      if (option.group) {
        if (!this.groupArray.includes(option.group)) {
          this.groupArray.push(option.group);
        }
      }

      this._valueCheck = this._valueMap;
      this._optionsCheck = this._internalOptions;

      return option;
    });

    this._inputValue.filter((value) =>
      // eslint-disable-next-line eqeqeq
      this._internalOptions.some((option) => option.value == value)
    );
    this.fireValueChangePubSub();

    if (this._inputValue && this._inputValue.length !== 0) {
      this.reportValidity();
    }
    if (!this._multiple && !this._inputValue) {
      this._inputLabels = "";
    } else if (this._multiple && this._inputValue.length === 0) {
      this._inputLabels = [];
    }

    if (DEBUG) console.log("< setValue ", JSON.stringify(this._inputValue));
  }

  lookupElementClose() {}

  lookupElementToggleOpen() {}

  lookupElementIsOpen() {
    return false;
  }

  showLookup(event) {
    if (DEBUG) console.log("> showLookup");

    if (this._readOnly && !this._alwaysShowLookup) {
      if (DEBUG) console.log("< showLookup noop");
      return;
    }

    if (event.type === "mouseup") {
      this.highlightIndex = this.selectedOptionMap
        ? this.selectedOptionMap.optId
        : 0;
      this.setAriaAttributes(this.highlightIndex);
    }

    if (event.type === "mouseup" || event.type === "keyup") {
      this.lookupElementToggleOpen();
      this._isOpen = this.lookupElementIsOpen();

      if (this._isOpen) {
        this.selectedVal = this._displayValue;
        this.filterOptions(false, event.target.value);
      }
    } else if (event.type === "blur") {
      if (this._preventBlur) {
        if (DEBUG) console.log("< showLookup prevevent blur");
        return;
      }

      if (!this._triggerBlur) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        window.setTimeout(() => {
          this.lookupElementClose();
        }, 100);

        this._triggerBlur = true;
      } else {
        this.lookupElementClose();
      }

      this._displayValue =
        this._displayValue || !this._inputValue.length
          ? this._displayValue
          : this.selectedVal;

      if (!this._multiple) {
        this._displayValue = this._selectedOption
          ? this._selectedOption
          : this.selectedVal
          ? this.selectedVal
          : this._displayValue;
      }

      this.reportValidity();
      this.hideOptions();
    }

    if (DEBUG) console.log("< showLookup end");
  }

  // eslint-disable-next-line no-unused-vars
  optionElementSetSelected(option, selected) {}

  /**
   *
   * @param {Integer} newIndex : null or a positive integer
   * All options will have the focus class removed
   * Valid newIndex option will have the focus class added
   */

  setAriaAttributes(newIndex) {
    if (DEBUG) console.log("> setAriaAttributes ", JSON.stringify(newIndex));
    this._activeDescendant = null;
    const options = this.selectedElements;

    if (options.length > 0) {
      options.forEach((option) => this.optionElementSetSelected(option, false));
    }

    const option = options[newIndex];

    if (option) {
      this.optionElementSetSelected(option, true);
      this._activeDescendant = this._displayOptions[newIndex].optId;
    }

    if (DEBUG) console.log("< setAriaAttributes");
  }

  _queryTimeout;
  _query = "";

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

  /**
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

  hideOptions() {
    this.lookupElementClose();
    this.setAriaAttributes(null);
    this._isOpen = false;
    this._activeDescendant = null;
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
      this._displayValue = event.currentTarget.dataset.label;
      this._selectedOption = event.currentTarget.dataset.label;
      const optId = parseInt(
        event.currentTarget.getAttribute(OPTION_ID_ATTRNAME),
        10
      );

      this.selectedOptionMap = {
        label: event.currentTarget.dataset.label,
        value,
        optId
      };
    } else if (selectedOption) {
      value = selectedOption.value;
      this._displayValue = selectedOption.label;
      this._selectedOption = selectedOption.label;
      this.selectedOptionMap = { ...selectedOption };
    }

    this.highlightIndex = this.selectedOptionMap
      ? this.selectedOptionMap.optId
      : this._displayOptions.findIndex((opt) => opt.value === value);

    if (this._multiple) {
      this.optionSelected = true;

      if (!this._inputValue.includes(value)) {
        this._inputValue.push(value);
        this._inputLabels.push(this._displayValue);
      } else {
        this._inputValue.splice(this._inputValue.indexOf(value), 1);
        this._inputLabels.splice(
          this._inputLabels.indexOf(this._displayValue),
          1
        );
      }

      this._valueMap = this._inputValue;
      this.setMultiValue();
    } else {
      // dataset is returning value as string and if values are typeof number we need to
      // compare only value and not type
      // eslint-disable-next-line eqeqeq
      let index = this._internalOptions.findIndex((x) => x.value == value);
      if (index > -1 && index < this._internalOptions.length) {
        this._valueMap = [this._internalOptions[index].value];
        this._inputValue = [this._internalOptions[index].value];
      }
    }

    this.hideOptions();
    this.fireValueChangePubSub();
    this.fireEvent("change");
  }

  searchOptions(event) {
    if (this.searchable && event?.target) {
      this.searchDebounce(event.target);
    }
  }

  filterOptions(target, searchKey) {
    if (typeof this._internalOptions === "string") {
      this._internalOptions = JSON.parse(this._internalOptions);
    }

    if (this.searchable) {
      this._displayOptions = this._internalOptions.filter((item) => {
        this._displayValue = target ? searchKey : "";
        if (this._displayValue) {
          return item.label
            .toLowerCase()
            .includes(this._displayValue.toLowerCase());
        }

        return this._displayValue !== item;
      });
    } else {
      this._displayOptions = this._internalOptions;
    }

    if (this.groupArray) {
      this.groupOptions();
    }
  }

  deleteThisLabel(event) {
    let deleteLabel = event?.currentTarget?.dataset
      ? event.currentTarget.dataset.label
      : "";
    this._inputLabels.splice(this._inputLabels.indexOf(deleteLabel), 1);
    this._inputValue.splice(this._inputValue.indexOf(deleteLabel), 1);

    this._displayValue =
      this._inputValue.length <= 0
        ? ""
        : this._inputValue.length > 1
        ? `${this._inputValue.length} ${I18N.optionsSelected}`
        : this._inputLabels[0];

    this.fireValueChangePubSub();
    this.fireEvent("remove", deleteLabel);
    this.fireEvent("change", deleteLabel);
  }

  /* lifecycle */
  /* --------- */

  _rendered = false;
  _valueCheck;
  _optionsCheck;

  renderedCallback() {
    if (DEBUG) console.log("> renderedCallback");

    let ae1 =
      (Array.isArray(this._valueMap) &&
        Array.isArray(this._valueCheck) &&
        arraysEqual(this._valueMap, this._valueCheck)) ||
      this._valueMap === this._valueCheck;
    let ae2 =
      (Array.isArray(this._internalOptions) &&
        Array.isArray(this._optionsCheck) &&
        arraysEqual(this._internalOptions, this._optionsCheck)) ||
      this._internalOptions === this._optionsCheck;

    if (DEBUG)
      console.log(
        "=1 renderedCallback",
        JSON.stringify(this._valueMap),
        JSON.stringify(this._valueCheck),
        ae1
      );
    if (DEBUG)
      console.log(
        "=2 renderedCallback",
        JSON.stringify(this._internalOptions),
        JSON.stringify(this._optionsCheck),
        ae2
      );

    if (!ae1 || !ae2) {
      //if (!lodash.isEqual(this._valueMap, this.valueCheck) || !lodash.isEqual(this.optionsCheck, this._internalOptions)) {
      this._valueCheck = this._valueMap;
      this._optionsCheck = this._internalOptions;
      this.setValue();
      this.setMultiValue();
    }

    const element = this.inputElement;

    if (element && !this._rendered) {
      element.addEventListener("blur", this.triggerEvent);
      element.addEventListener("focus", this.triggerEvent);
      this._rendered = true;
    }

    if (DEBUG) console.log("< renderedCallback");
  }

  disconnectedCallback() {
    if (DEBUG) console.log("> disconnectedCallback");

    const element = this.inputElement;

    if (element) {
      element.removeEventListener("blur", this.triggerEvent);
      element.removeEventListener("focus", this.triggerEvent);
    }

    if (DEBUG) console.log("< disconnectedCallback");
  }

  connectedCallback() {
    if (DEBUG) console.log("> connectedCallback");

    this.setValue();

    if (this.groupArray) {
      this.groupOptions();
    }

    this.setMultiValue();

    if (DEBUG) console.log("< connectedCallback");
  }

  /* event management */
  /* ---------------- */

  @track preventBlur;
  _triggerBlur = true;

  /**
   *
   * @param {Event} event : Keydown event
   * Using keyboard to focus and select the option
   */

  handleKeyDown(event) {
    const key = event.key;
    if (!this._isOpen) {
      if (key === "ArrowDown" || key === "Down" || key === "Enter") {
        this.highlightIndex = this.selectedOptionMap
          ? this.selectedOptionMap.optId
          : 0;
        this.showLookup(event);
        this.setAriaAttributes(this.highlightIndex);

        event.preventDefault();
      }
    } else {
      if (key === "ArrowUp" || key === "Up") {
        this.highlightIndex =
          this.highlightIndex === -1 ? 0 : this.highlightIndex;
        this.highlightIndex =
          (this.highlightIndex - 1 + this.options.length) % this.options.length;
        this.setAriaAttributes(this.highlightIndex);

        event.preventDefault();
      } else if (key === "ArrowDown" || key === "Down") {
        this.highlightIndex = (this.highlightIndex + 1) % this.options.length;
        this.setAriaAttributes(this.highlightIndex);

        event.preventDefault();
      } else if (key === "Enter") {
        //selecting the option
        const selectedOption = this._displayOptions.find(
          (option) => option.optId === this.highlightIndex
        );

        if (selectedOption) {
          this.selectOption(null, selectedOption);
          this.hideOptions();
        }

        event.preventDefault();
      } else if (key === "Escape" || key === "Esc") {
        this.hideOptions();

        event.preventDefault();
      } else if (
        !this.searchable &&
        ((this._isOpen && /^[a-zA-Z0-9]$/.test(event.key)) ||
          key === "Backspace")
      ) {
        // this creates a short window of time where a user can type in a query to jump to a specific option

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

  handleKeyUp(event) {
    this.handleKeyDown(event);
    this.searchOptions(event);
  }

  handleMouseOver(event) {
    event.stopPropagation();

    this.highlightIndex = parseInt(
      event.currentTarget.getAttribute(OPTION_ID_ATTRNAME),
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

    this._preventBlur = true;
  }

  preventLookupOpen(event) {
    event.stopPropagation();

    this.inputElement.focus();
    this._preventBlur = false;
  }

  preventKeyDown(event) {
    if (this.searchable) {
      return;
    }
    if (event.key !== "Tab") {
      event.preventDefault();
    }
  }

  preventTrigger(event) {
    event.stopPropagation();

    this._triggerBlur = false;
  }

  fireEvent(eventName, data) {
    let event = data
      ? new CustomEvent(eventName, {
          bubbles: true,
          composed: true,
          detail: {
            result: data
          }
        })
      : new CustomEvent(eventName, {
          bubbles: true,
          composed: true
        });

    this.dispatchEvent(event);
  }

  fireValueChangePubSub() {
    if (PUB_SUB) {
      PUB_SUB.fire(this.name, "valuechange", {
        name: this.name,
        value: this._inputValue.join(",")
      });
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

  /* validation */
  /* ---------- */

  @track _errorMessage;

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

  @api
  setValidity(showError) {
    if (DEBUG) console.log("> setValidity", showError);

    if (!this._validity.customError) {
      this._errorMessage = "";
    }
    if (
      (!this.value || this.value.length === 0) &&
      (!this._inputValue ||
        this._inputValue.length === 0 ||
        this._inputValue[0] === NONE ||
        this._inputValue[0] === "") &&
      this._required
    ) {
      this._validity.valueMissing = true;
      if (showError) {
        this._errorMessage = this.messageWhenValueMissing;
      }
    } else {
      // ideally we should also check against options
      this._validity.valueMissing = false;
    }
    this._validity.valid =
      !this._validity.customError && !this._validity.valueMissing;

    if (DEBUG) console.log("< setValidity", JSON.stringify(this._validity));
  }

  @api checkValidity() {
    this.setValidity(false);
    return this._validity && this._validity.valid;
  }

  @api reportValidity() {
    this.setValidity(true);
    return this._validity.valid;
  }

  @api setCustomValidity(message) {
    this._validity.customError = message === "" ? false : true;
    this._errorMessage = message;
  }

  @api showHelpMessageIfInvalid() {
    this.setValidity(true);
  }
}
