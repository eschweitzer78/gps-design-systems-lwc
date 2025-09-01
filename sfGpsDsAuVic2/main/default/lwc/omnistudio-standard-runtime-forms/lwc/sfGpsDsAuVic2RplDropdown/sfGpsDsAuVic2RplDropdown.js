/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * Portions (c) VIC SDP DPC and the contributors of https://github.com/dpc-sdp/ripple-framework
 * included under Apache 2.0 licence.
 */

/* 
  Expectations for LWC used as a childInput for an Omni form element

  mandatory:
  - @api value
  - @api validaty, 
  - @api checkValidity()
  - @api reportValidity()
  - @api setCustomValidity(message)
  - @api validationMessage
  - @api focus()

  - @api isError
  - @api errorMessage

  optional:
  - @api customValidationMessage (apparently a fallback for setCustomValidity)
  - @api doCustomValidation
  - @api setValue(value) - instead for setting value attr
*/

import { api, track, LightningElement } from "lwc";
import {
  normaliseString,
  normaliseBoolean,
  withKeys,
  withModifiers,
  toArray,
  nextTick,
  isArray,
  isString,
  toNumber,
  debounce,
  computeClass
} from "c/sfGpsDsHelpers";
import OnClickOutside from "c/sfGpsDsOnClickOutside";
import salesforceUtils from "c/sfGpsDsOsrtSalesforceUtils";
import pubsub from "c/sfGpsDsOsrtPubsub";
import tmpl from "./sfGpsDsAuVic2RplDropdown.html";

const VARIANT_DEFAULT = "default";
const VARIANT_VALUES = {
  default: "rpl-form-dropdown--default",
  reverse: "rpl-form-dropdown--reverse"
};

const CLICK_OUTSIDE_REF = "containerRef";

const DEFAULT_OPTION_ID = "__default-option";
const LASTITEM_OPTION_ID = "last-item";
const UNSELECTED_VALUE = null;
const PLACEHOLDER_DEFAULT = "Select";
const MAXITEMSDISPLAYED_DEFAULT = 6;
const SORTED_DEFAULT = true;
const PROCESS_SEARCH_FREQUENCY = 250;

const I18N = {
  noResultsLabel: "No results found",
  messageWhenValueMissing: "You must provide a value.",
  messageWhenTooShort: "You must provide a longer value.",
  messageWhenTooLong: "You must provide a shorter value."
};

/** The different modes:
 * - Combobox allows to type any value or pick from the list of options
 * - Filtered allows to type for filtering purposes, one can only pick from the list of options
 * - Lookup does not allow typing
 * - Typeahead is similar to combobox but the search text is synced with the value and in the options label and value must be the same
 **/

const MODE_COMBOBOX_ALL =
  "combobox-all"; /* single - any value, non filtered options, automatically select if a single one remains */
const MODE_COMBOBOX_AUTO =
  "combobox-auto"; /* single - any value, filtered options, automatically select if a single one remains */
const MODE_COMBOBOX_MANUAL =
  "combobox-manual"; /* single - any value, filtered options, manually select */
const MODE_FILTERED_AUTO =
  "filtered-auto"; /* single or multi, search box but only picked value, filtered options, automatically select if a single one remains */
const MODE_FILTERED_MANUAL =
  "filtered-manual"; /* single or multi, search box but only picked value, filtered options, manually select */
const MODE_LOOKUP = "lookup"; // single or multi, no search box, manually select */
const MODE_TYPEAHEAD = "typeahead";

const MODE_VALUES = {
  [MODE_COMBOBOX_ALL]: {
    multi: false,
    searchable: true,
    any: true,
    filtering: false,
    autoselect: true
  },
  [MODE_COMBOBOX_AUTO]: {
    multi: false,
    searchable: true,
    any: true,
    filtering: true,
    autoselect: true
  },
  [MODE_COMBOBOX_MANUAL]: {
    multi: false,
    searchable: true,
    any: true,
    filtering: true,
    autoselect: false
  },
  [MODE_FILTERED_AUTO]: {
    multi: true,
    searchable: true,
    any: false,
    filtering: true,
    autoselect: true
  },
  [MODE_FILTERED_MANUAL]: {
    multi: true,
    searchable: true,
    any: false,
    filtering: true,
    autoselect: false
  },
  [MODE_LOOKUP]: {
    multi: true,
    searchable: false,
    any: false,
    filtering: false,
    autoselect: false
  },
  [MODE_TYPEAHEAD]: {
    multi: false,
    searchable: true,
    any: false,
    filtering: false,
    autoselect: false,
    syncvalue: true
  }
};

const MODE_DEFAULT = MODE_LOOKUP;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2RplBaseDropdown";

export default class extends LightningElement {
  @api label;
  @api fieldLevelHelp;
  @api unselectLabel = "-- Clear --";

  /* api: mode */

  _mode = MODE_VALUES[MODE_DEFAULT];
  _modeOriginal = MODE_DEFAULT;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: maxItemsDisplayed, height of the dropdown in number of rows */

  _maxItemsDisplayed = MAXITEMSDISPLAYED_DEFAULT;
  _maxItemsDisplayedOriginal = MAXITEMSDISPLAYED_DEFAULT;

  @api
  get maxItemsDisplayed() {
    return this._maxItemsDisplayedOriginal;
  }

  set maxItemsDisplayed(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set maxItemsDisplayed", value);

    if (value == null) {
      this._maxItemsDisplayed = MAXITEMSDISPLAYED_DEFAULT;
    } else {
      const n = toNumber(value);
      this._maxItemsDisplayed =
        Number.isNaN(n) || n < 1 ? MAXITEMSDISPLAYED_DEFAULT : Math.round(n);
    }

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< set maxItemsDisplayed",
        this._maxItemsDisplayed
      );
  }

  /* api: placeholder, label that's shown when there is no selection or search text */

  _placeholder;

  @api
  get placeholder() {
    return this._placeholder == null ? PLACEHOLDER_DEFAULT : this._placeholder;
  }

  set placeholder(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set placeholder", value);

    this._placeholder = value;

    if (DEBUG)
      console.debug(CLASS_NAME, "< set placeholder", this._placeholder);
  }

  /* api: disabled, disables the whole element (which is also read only) */

  _disabled;
  _disabledOriginal;

  @api
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set disabled", value);

    this._disabledOriginal = value;
    this._disabled = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.debug(CLASS_NAME, "> set disabled", this._disabled);
  }

  /* api: disableLastItem, disables the last (non data) item which is used e.g. for New button or the Google copyright */

  _disableLastItem;
  _disableLastItemOriginal;

  @api
  get disableLastItem() {
    return this._disableLastItemOriginal;
  }

  set disableLastItem(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set disabled", value);

    this._disableLastItemOriginal = value;
    this._disableLastItem = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "> set disabled", this._disableLastItem);
  }

  /* api: multiple, allows to select multiple items */

  __multiple;
  _multipleOriginal;

  get _multiple() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> get _multiple",
        "__multiple",
        this.__multiple,
        "_mode.multi",
        this._mode.multi
      );
    }

    const rv = this.__multiple && this._mode.multi;

    if (DEBUG) console.debug(CLASS_NAME, "< get _multiple", rv);

    return rv;
  }

  @api
  get multiple() {
    return this._multipleOriginal;
  }

  set multiple(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set multiple", value);

    this._multipleOriginal = value;
    this.__multiple = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    this.updateValue(); // This may have an impact of the value that was set.

    if (DEBUG) console.debug(CLASS_NAME, "< set multiple", this._multiple);
  }

  /* api: sorted, the dropdown options will be sorted by label */

  _sorted = SORTED_DEFAULT;
  _sortedOriginal = SORTED_DEFAULT;

  @api
  get sorted() {
    return this._sortedOriginal;
  }

  set sorted(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set sorted", value);

    this._sortedOriginal = value;
    this._sorted = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SORTED_DEFAULT
    });

    this.setOptions(this._optionsOriginal);

    if (DEBUG) console.debug(CLASS_NAME, "< set multiple", this._multiple);
  }

  /* api: preventDeselect, does not show the "-- clear --" pseudo-option */

  _preventDeselect;
  _preventDeselectOriginal;

  @api
  get preventDeselect() {
    return this._preventDeselectOriginal;
  }

  set preventDeselect(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set preventDeselect", value);

    this._preventDeselectOriginal = value;
    this._preventDeselect = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "< set preventDeselect", this._preventDeselect);
  }

  /* api: required, validation will fail if no value has been set */

  _required;
  _requiredOriginal;

  @api
  get required() {
    return this._requiredOriginal;
  }

  set required(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set required", value);

    this._requiredOriginal = value;
    this._required = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set required", this._required);
  }

  /* api: requiredLabel, label of the "required" cue */

  _requiredLabel;

  @api
  get requiredLabel() {
    return this._requiredLabel || salesforceUtils.inputLabels.cmpRequired;
  }

  set requiredLabel(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set requiredLabel", value);

    this._requiredLabel = value;

    if (DEBUG)
      console.debug(CLASS_NAME, "< set requiredLabel", this._requiredLabel);
  }

  /* api: value */

  _valueOriginal;
  __value;

  get _value() {
    return this.__value;
  }

  set _value(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set _value", JSON.stringify(value));

    const oldValue = this.__value;
    this._valueOriginal = value; // if _value has been set, the original value should be replaced.
    this.__value = value;
    this.watchValue(oldValue, value);

    if (DEBUG)
      console.debug(CLASS_NAME, "< set _value", JSON.stringify(this.__value));
  }

  @api
  get value() {
    return this._value;
  }

  set value(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set value", JSON.stringify(value));

    this._valueOriginal = value;
    this.updateValue();

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< set value",
        "_value",
        JSON.stringify(this._value),
        "_valueOriginal",
        JSON.stringify(this._valueOriginal)
      );
    }
  }

  /* api: variant */

  _variant = VARIANT_VALUES[VARIANT_DEFAULT];
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set variant", value);

    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT,
      returnObjectValue: true
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set variant", this._variant);
  }

  /* api: minLength */

  _minLengthOriginal;
  _minLength;

  @api
  get minLength() {
    return this._minLengthOriginal;
  }

  set minLength(value) {
    this._minLengthOriginal = value;

    value = toNumber(value);
    this._minLength = Number.isNaN(value)
      ? null
      : Math.max(0, Math.round(value));
  }

  /* api: maxLength */

  _maxLengthOriginal;
  _maxLength;

  @api
  get maxLength() {
    return this._maxLengthOriginal;
  }

  set maxLength(value) {
    this._maxLengthOriginal = value;

    value = toNumber(value);
    this._maxLength = Number.isNaN(value)
      ? null
      : Math.max(0, Math.round(value));
  }

  /* omnistudio requirements */

  @api name;

  /* tracked */

  _optionsOriginal;
  @track _options;

  @track _searchCache = "";
  @track _searchValue = "";
  _searchFocused = false;
  @track _focusTag = 0;

  @track _isOpen = false;

  /* track: activeOptionId */

  @track __activeOptionId = null;

  get _activeOptionId() {
    return this.__activeOptionId;
  }

  set _activeOptionId(newId) {
    this.__activeOptionId = newId;
    this.watchActiveOptionId(newId);
  }

  /* internal config */

  _showNoResults = true;
  _loading = false;

  /* computed */

  get debug() {
    return DEBUG;
  }

  get i18n() {
    return I18N;
  }

  get lastItemOptionId() {
    return LASTITEM_OPTION_ID;
  }

  get _searchable() {
    return this._mode.searchable;
  }

  get _filtering() {
    return this._mode.filtering;
  }

  get _any() {
    return this._mode.any;
  }

  get _autoselect() {
    return this._mode.autoselect;
  }

  get _singleSearch() {
    return !this._multiple && this._searchable;
  }

  get _multiSearch() {
    return this._multiple && this._searchable;
  }

  get computedContainerClassName() {
    return {
      "rpl-form-dropdown": true,
      [this._variant]: this._variant,
      "rpl-form-dropdown--invalid": this._invalid,
      "rpl-form-dropdown--multi-search": this._multiSearch
    };
  }

  get computedContainerStyle() {
    return `--local-max-items: ${this._maxItemsDisplayed}`;
  }

  get computedComboboxTabIndex() {
    return this._disabled ? "-1" : "0";
  }

  get computedInputClassName() {
    return {
      "rpl-form-dropdown-input": true,
      "rpl-u-focusable-outline": true,
      "rpl-u-focusable--force-on": this._isOpen
    };
  }

  get computedInputActiveDescendant() {
    return this.getUniqueOptionId(this._activeOptionId);
  }

  get computedShowMultiValueTagList() {
    return this._multiple && this.hasValue;
  }

  get computedShowSearchablePlaceholder() {
    return !this._isOpen && !this.hasValue && !this.emptyOption;
  }

  get computedShowPlaceholder() {
    return !this.hasValue && !this.emptyOption;
  }

  get computedShowSingleValue() {
    return !this._isOpen && !this._multiple;
  }

  get computedSearchAriaLabel() {
    return `Search options ${this.label && "for " + this.label}`;
  }

  get computedShowNoResults() {
    return (
      this._searchable &&
      this._searchValue &&
      !this._processedOptions.length &&
      this._showNoResults
    );
  }

  get _hasOptions() {
    return this._options && this._options.length;
  }

  get computedLastItemStyle() {
    return computeClass(
      {
        "display:none": !this._hasLastItem,
        "pointer-events:none": this._disableLastItem
      },
      ";"
    );
  }

  /* processed options are the original options with the search filter applied 
     + eventually the -- clear -- pseudo-option */

  get _processedOptions() {
    if (DEBUG) console.debug(CLASS_NAME, "> get _processedOptions");

    let options = (this._options || []).map((option, index) => ({
      ...option,
      label: option.label,
      id: this.getUniqueOptionId(option.id || `opt-${index + 1}`)
    }));

    if (
      !this._preventDeselect &&
      !this.emptyOption &&
      !this._multiple /* && !this._searchable -- Rpl deviation */
    ) {
      options = [
        {
          id: DEFAULT_OPTION_ID,
          label: this.unselectLabel /* placeholder, */,
          value: UNSELECTED_VALUE
        },
        ...options
      ];
    }

    // Only return options matching search value when searching
    if (this._filtering && this._searchValue) {
      const searchQuery = this._searchValue.toLowerCase();

      options = options.filter((opt) =>
        opt.label?.toLowerCase().includes(searchQuery)
      );
    }

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< get _processedOptions",
        JSON.stringify(options)
      );

    return options;
  }

  /* decoratedProcessedOptions have all the required UX formatting */

  get _decoratedProcessedOptions() {
    if (DEBUG) console.debug(CLASS_NAME, "> get _decoratedProcessedOptions");

    const processedOptions = this._processedOptions;
    const isMultiple = this._multiple;
    const rv = processedOptions.map((option) => ({
      ...option,
      className: {
        "rpl-form-dropdown-option": true,
        "rpl-type-p": true,
        "rpl-u-focusable-block": true,
        "rpl-form-dropdown-option--highlight": this.isMatchingSearchResult(
          option.label,
          processedOptions
        ),
        "rpl-u-focusable--force-on": this.isMenuItemKeyboardFocused(option.id)
      },
      selected: this.isOptionSelected(option.value, isMultiple)
    }));

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< get _decoratedProcessedOptions",
        JSON.stringify(rv)
      );
    return rv;
  }

  get selectedOptions() {
    return this.getValueMatchingOptions(this._value);
  }

  get singleValueDisplay() {
    if (DEBUG) console.debug(CLASS_NAME, "> singleValueDisplay");

    let rv = "";

    if (this.emptyOption && !this._value) {
      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= singleValueDisplay empty option",
          JSON.stringify(this.emptyOption)
        );

      rv = this.emptyOption.label;
    } else {
      const selectedOption = (this._options || []).find(
        (opt) => this._value === opt.value
      );

      if (DEBUG) {
        console.debug(
          CLASS_NAME,
          "= singleValueDisplay selected option",
          "selectedOption",
          JSON.stringify(selectedOption),
          "_value",
          this._value
        );
      }

      rv = selectedOption?.label || this._value;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< singleValueDisplay", rv || "");
    return rv || "";
  }

  get hasValue() {
    if (DEBUG) console.debug(CLASS_NAME, "> hasValue");

    const rv = this._multiple
      ? !!this._value && !!this._value.length
      : !!this._value;

    if (DEBUG) console.debug(CLASS_NAME, "< hasValue", rv);
    return rv;
  }

  get emptyOption() {
    return (this._options || []).find(
      (opt) => opt.value === UNSELECTED_VALUE && opt.id !== DEFAULT_OPTION_ID
    );
  }

  /* methods */

  sortOptions(options) {
    return options.sort((a, b) => {
      const item1 = a.name;
      const item2 = b.name;
      return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
    });
  }

  @api setOptions(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> setOptions", JSON.stringify(value));

    this._options = this._sorted ? this.sortOptions(value) : value;

    if (DEBUG)
      console.debug(CLASS_NAME, "< setOptions", JSON.stringify(this._options));
  }

  /**
   * updateValue re-evaluates _value based on value and mode and leverages the original value as
   * set per api (which may be updated based on user interaction).
   */

  updateValue() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> updateValue",
        "_valueOriginal",
        JSON.stringify(this._valueOriginal),
        "_multiple",
        JSON.stringify(this._multiple)
      );
    }

    const value = this._valueOriginal;
    const matchingOptions = this.getValueMatchingOptions(value);

    if (this._multiple) {
      this._value = matchingOptions.map((option) => option.value);
      this._searchValue = null;
    } else if (matchingOptions.length) {
      /* keep the first one only */
      this._value = matchingOptions.length ? matchingOptions[0].value : null;
      this._searchValue = "";
    } else if (this._any && value != null) {
      this._value = isString(value) ? value : String(value);
      this._searchValue = this._value || "";
    } else {
      this._value = null;
      this._searchValue = "";
    }

    this._valueOriginal = value; // the operations above will have overwritten it...

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< updateValue",
        "_value",
        JSON.stringify(this._value),
        "_valueOriginal",
        JSON.stringify(this._valueOriginal)
      );
    }
  }

  /* called each time value changes */
  watchValue(newOptions, oldOptions) {
    if (
      this._isOpen &&
      this._multiSearch &&
      newOptions?.length > oldOptions?.length
    ) {
      nextTick(() =>
        this.refs.searchRef?.scrollIntoView({
          block: "nearest",
          inline: "start"
        })
      );
    }
  }

  getValueMatchingOptions(value) {
    return toArray(value)
      .map((singlevalue) =>
        (this._options || []).find((opt) => opt.value === singlevalue)
      )
      .filter(Boolean);
  }

  getLabelMatchingOptions(value, options) {
    return (options || []).filter((opt) => opt.label === value);
  }

  getOptionLabel(optionValue) {
    const option = (this._options || []).find(
      (opt) => opt.value === optionValue
    );

    return option?.label;
  }

  isOptionSelected(optionValue, isMultiple) {
    if (isMultiple === undefined ? this._multiple : isMultiple) {
      return (this._value || []).includes(optionValue);
    }

    return !optionValue && !this._value ? true : this._value === optionValue;
  }

  getUniqueOptionId(optionId) {
    // Nothing else is necessary if shadow DOM -- optionId ? `sfgpsdsauvic2rpldropdown-option-${optionId}` : ""
    return optionId;
  }

  isMatchingSearchResult(option, processedOptions = this._processedOptions) {
    return !this._searchable || processedOptions?.length > 1
      ? false
      : option?.toLowerCase().includes(this._searchValue.toLowerCase());
  }

  isMenuItemKeyboardFocused(optionId) {
    return this._activeOptionId === optionId;
  }

  getDefaultActiveId() {
    if (DEBUG) console.debug(CLASS_NAME, "> getDefaultActiveId");

    const processedOptions = this._processedOptions;
    const firstOptionId = processedOptions[0].id;
    let rv;

    if (this._multiple) {
      // Always start from the first option if we're in multi select mode
      rv = firstOptionId;
    } else {
      // In single select mode, try to start from the currently selected item
      const selectedOption = processedOptions.find(
        (opt) => opt.value === this._value
      );

      // Get the id of currently selected option, if we're in a single selection mode.
      rv = selectedOption ? selectedOption.id : firstOptionId;
    }

    if (DEBUG) console.debug(CLASS_NAME, "> getDefaultActiveId", rv);
    return rv;
  }

  watchActiveOptionId(newId) {
    if (newId != null) {
      nextTick(() => this.focusOption(newId));
    }
  }

  /* processSearch does the filtering, debounced so as to preserve user experience */
  processSearch = debounce(() => {
    let options = [...(this._options || [])];
    if (this._activeOptionId) {
      const index = options.map((o) => o.id).indexOf(this._activeOptionId);
      options = options.slice(index + 1).concat(options.slice(0, index + 1));
    }

    let found = options.find((o) =>
      o.label?.toLowerCase().startsWith(this._searchCache)
    );

    if (found) {
      this.handleOpen();
      this._activeOptionId = found.id;
    }

    this._searchCache = "";
  }, PROCESS_SEARCH_FREQUENCY);

  focusSearch() {
    if (DEBUG) console.debug(CLASS_NAME, "> focusSearch");

    this._activeOptionId = null;

    nextTick(() => {
      this.refs.searchRef?.focus();
      this._searchFocused = true;
      if (DEBUG) console.debug(CLASS_NAME, "~ focusSearch");
    });

    if (DEBUG) console.debug(CLASS_NAME, "< focusSearch");
  }

  focusOption(optionId) {
    if (DEBUG) console.debug(CLASS_NAME, "> focusOption", optionId);

    const menu = this.refs.menuRef;
    const optionEl = Array.from(menu.querySelectorAll("[data-option-id]")).find(
      (ref) => ref.dataset.optionId === optionId
    );

    // This makes the scrolling much nicer when using the arrow keys
    if (menu.scrollHeight > menu.clientHeight) {
      let scrollBottom = menu.clientHeight + menu.scrollTop;
      let elementBottom = optionEl.offsetTop + optionEl.offsetHeight;
      if (elementBottom > scrollBottom) {
        menu.scrollTop = elementBottom - menu.clientHeight;
      } else if (optionEl.offsetTop < menu.scrollTop) {
        menu.scrollTop = optionEl.offsetTop;
      }
    }

    if (optionEl) {
      optionEl.focus();
    }

    if (DEBUG) console.debug(CLASS_NAME, "< focusOption", optionEl);
  }

  showFirstLastSelected(isLast = false) {
    if (DEBUG) console.debug(CLASS_NAME, "> showFirstLastSelected", isLast);

    const optionRefs = Array.from(
      this.refs.menuRef.querySelectorAll("[data-option-id]")
    );
    const optionEl = isLast
      ? optionRefs.findLast((ref) => ref.ariaSelected === "true")
      : optionRefs.find((ref) => ref.ariaSelected === "true");

    if (optionEl) {
      optionEl.scrollIntoView(!isLast);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< showFirstLastSelected", optionEl);
  }

  /* Called when closing the dropdown in singleSearch mode, if not from selection
      Does nothing by default but subclasses can override to adjust as required, 
      e.g. searchValue must be formatted a certain way 
  */

  normaliseSearchValue() {
    if (DEBUG)
      console.debug(CLASS_NAME, "> normaliseSearchValue", this._searchValue);

    if (DEBUG)
      console.debug(CLASS_NAME, "< normaliseSearchValue", this._searchValue);
  }

  /* setAndDispatchValue leverages multiple methods in order to allow for subclass overrides */

  setAndDispatchValue(value) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> setAndDispatchValue", JSON.stringify(value));

    this._value = value; // ESC
    this.dispatchPubSub(value);
    this.dispatchChangeEvent();

    if (DEBUG) console.debug(CLASS_NAME, "< setAndDispatchValue");
  }

  dispatchPubSub(value) {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> dispatchPubSub",
        this.name,
        JSON.stringify(value)
      );

    if (this && this.name) {
      pubsub.fire(this.name, "valuechange", {
        name: this.name,
        value
      });
    }

    if (DEBUG) console.debug(CLASS_NAME, "< dispatchPubSub");
  }

  dispatchChangeEvent() {
    if (DEBUG) console.debug(CLASS_NAME, "> dispatchChangeEvent");

    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< dispatchChangeEvent");
  }

  clearSearch() {
    this._searchValue = "";
  }

  /* methods related to event management */

  handleTyping(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleTyping");

    if (event.key?.length === 1 && !this._searchFocused) {
      if (this._searchable && !this._isOpen) {
        // Open the menu so we can type into the search input straight away
        this.handleOpen();
      } else {
        // Native select style search; it'll jump to the matching option
        this._searchCache = this._searchCache + event.key.toLowerCase();
        this.processSearch();
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleTyping");
  }

  handleSearchSubmit() {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSearchSubmit");

    const processedOptions = this._processedOptions;

    if (
      processedOptions.length === 1 &&
      this.isMatchingSearchResult(processedOptions[0].label, processedOptions)
    ) {
      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= handleSearchSubmit single item list, matching"
        );

      this.selectOption(processedOptions[0]);

      if (this._multiSearch) {
        this.clearSearch();
      }
    } else {
      const matchingOptions = this.getLabelMatchingOptions(
        this._searchValue,
        processedOptions
      );

      if (DEBUG) {
        console.debug(
          CLASS_NAME,
          "= handleSearchSubmit multi item list",
          "_searchValue",
          this._searchValue,
          "matchingOptions=",
          JSON.stringify(matchingOptions)
        );
      }

      if (
        matchingOptions.length === 1 &&
        matchingOptions[0].label === this._searchValue
      ) {
        this.selectOption(matchingOptions[0]);

        if (this._multiSearch) {
          this.clearSearch();
        }
      } else if (this._any) {
        if (DEBUG)
          console.debug(
            CLASS_NAME,
            "= handleSearchSubmit any",
            "_searchValue",
            this._searchValue
          );

        // Close - focus back to input, not cancel, not selection
        this.handleClose(true, false, false, this._searchValue);
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleSearchSubmit");
  }

  handleSearchLeft() {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSearchLeft");

    if (
      this._multiSearch &&
      this.selectedOptions?.length &&
      this.refs.searchRef?.selectionStart === 0
    ) {
      this._focusTag = this._focusTag + 1;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleSearchLeft");
  }

  handleToggle(fromKeyboard = false, event) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> handleToggle fromKeyboard=", fromKeyboard);

    // Prevent the default action when we're not searching
    if (fromKeyboard && !this._searchFocused) {
      event.preventDefault();
    }

    // Only toggle (close) searchable dropdowns with the toggle
    if (
      !(
        this._isOpen &&
        this._searchable &&
        event?.target !== this.refs.toggleRef
      )
    ) {
      if (this._isOpen) {
        this.handleClose(fromKeyboard);
      } else {
        this.handleOpen(fromKeyboard);
      }
    }

    if (DEBUG)
      console.debug(CLASS_NAME, "< handleToggle fromKeyboard=", fromKeyboard);
  }

  handleOpen(fromKeyboard = false) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> handleOpen fromKeyboard=", fromKeyboard);

    this._isOpen = true;

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "= handleOpen",
        "fromKeyboard=",
        fromKeyboard,
        "_singleSearch",
        this._singleSearch,
        "_value",
        JSON.stringify(this._value),
        "_searchValue",
        JSON.stringify(this._searchValue)
      );
    }

    if (this._singleSearch && this._value && !this._searchValue) {
      this._searchValue = this.getOptionLabel(this._value) || "";
    }

    if (fromKeyboard && this._processedOptions?.length && !this._searchable) {
      this._activeOptionId = this.getDefaultActiveId();
    } else if (this._searchable) {
      this.focusSearch();
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< handleOpen",
        "_isOpen",
        this._isOpen,
        "_searchValue",
        this._searchValue
      );
    }
  }

  handleClose(
    focusBackOnInput = false,
    isCancel = false,
    fromSelection = false,
    selectionValue
  ) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleClose",
        "focusBackOnInput=",
        focusBackOnInput,
        "isCancel=",
        isCancel,
        "fromSelection=",
        fromSelection
      );
    }

    if (this._isOpen) {
      this._isOpen = false;
      this._activeOptionId = null;

      if (fromSelection) {
        this.setAndDispatchValue(selectionValue);
        this._searchValue = this._multi
          ? ""
          : this.getOptionLabel(this._value) || "";
      } else if (isCancel) {
        this._searchValue = this._multi
          ? ""
          : this.getOptionLabel(this._value) || "";
      } else {
        let wasSet = this.handleAutoSelect();
        if (!wasSet) wasSet = this.handleAny();
        if (!wasSet) {
          this._searchValue = this._multi
            ? ""
            : this.getOptionLabel(this._value) || "";
        }
      }

      if (focusBackOnInput) {
        // focus on input
        this.focus();
      } else {
        this.dispatchEvent(
          new CustomEvent("blur", {
            bubbles: true,
            composed: true
          })
        );
      }

      this._searchFocused = false;

      this.reportValidity();
    } else {
      if (DEBUG) console.debug(CLASS_NAME, "= handleClose was closed");
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleClose");
  }

  handleArrowDown() {
    if (DEBUG) console.debug(CLASS_NAME, "> handleArrowDown");

    const open = this._isOpen;

    if (!this._isOpen) {
      this._isOpen = true;
    }

    const processedOptions = this._processedOptions;

    if (processedOptions.length) {
      if (DEBUG) console.debug(CLASS_NAME, "= handleArrowDown has length");
      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= handleArrowDown findIndex=",
          processedOptions.findIndex
        );

      const currentActiveIndex = processedOptions.findIndex(
        (opt) => opt.id === this._activeOptionId
      );

      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= handleArrowDown currentActiveIndex=",
          currentActiveIndex
        );

      if (!open && this._searchable) {
        if (DEBUG) console.debug(CLASS_NAME, "= handleArrowDown focusSearch");
        nextTick(() => this.showFirstLastSelected(false));
        this.focusSearch();
      } else if (this._searchFocused && this._filtering) {
        if (DEBUG) console.debug(CLASS_NAME, "= handleArrowDown option 0");
        this._activeOptionId = processedOptions[0].id;
      } else if (currentActiveIndex < 0) {
        if (DEBUG)
          console.debug(CLASS_NAME, "= handleArrowDown default active id");
        this._activeOptionId = this.getDefaultActiveId();
      } else if (currentActiveIndex < processedOptions.length - 1) {
        if (DEBUG) console.debug(CLASS_NAME, "= handleArrowDown next");
        this._activeOptionId = processedOptions[currentActiveIndex + 1].id;
      }
    } else {
      if (DEBUG) console.debug(CLASS_NAME, "= handleArrowDown empty items");
    }

    if (DEBUG)
      console.debug(CLASS_NAME, "< handleArrowDown", this._activeOptionId);
  }

  handleArrowUp() {
    if (DEBUG) console.debug(CLASS_NAME, "> handleArrowUp");

    const open = this._isOpen;

    if (!open) {
      this._isOpen = true;
    }

    const processedOptions = this._processedOptions;

    if (processedOptions.length) {
      const currentActiveIndex = processedOptions.findIndex(
        (opt) => opt.id === this._activeOptionId
      );

      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= handleArrowUp currentActiveIndex=",
          currentActiveIndex
        );

      if (
        !open &&
        this._searchable /*||
        (this._searchable && currentActiveIndex < 1) */
      ) {
        if (DEBUG) console.debug(CLASS_NAME, "= handleArrowUp focusSearch");
        nextTick(() => this.showFirstLastSelected(true));
        this.focusSearch();
      } else if (currentActiveIndex < 0) {
        if (DEBUG)
          console.debug(CLASS_NAME, "= handleArrowUp default active id");
        this._activeOptionId = this.getDefaultActiveId();
      } else if (currentActiveIndex > 0) {
        if (DEBUG) console.debug(CLASS_NAME, "= handleArrowUp previous");
        this._activeOptionId = processedOptions[currentActiveIndex - 1].id;
      }
    }

    if (DEBUG)
      console.debug(CLASS_NAME, "< handleArrowUp", this._activeOptionId);
  }

  handleDeleteKey() {
    if (DEBUG) console.debug(CLASS_NAME, "> handleDeleteKey");

    // For searchable dropdowns open the input so the search text can be deleted
    if (this._searchable && !this._isOpen) {
      this.handleToggle();
    }

    // For multi search dropdowns without search text we can autofocus the last tag for deletion
    if (this._multiSearch && !this._searchValue) {
      nextTick(() => this.handleSearchLeft);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleDeleteKey");
  }

  selectLastItem() {
    if (DEBUG) console.debug(CLASS_NAME, "> selectLastItem");

    this._isOpen = false;
    this._activeOptionId = null;
    this.focus();
    this._searchFocused = false;

    if (DEBUG) console.debug(CLASS_NAME, "< selectLastItem");
  }

  /**
   * Handles the selection of an option from the UI, including closing the dropdown for single,
   * setting the dropdown value and dispatching an event.
   * @param {*} option the label/value tuple that's been selected
   * @returns {void}
   */

  selectOption(option) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> selectOption", JSON.stringify(option));

    const newValue = this.targetValueWithOption(option);

    if (this._multiple) {
      this.setAndDispatchValue(newValue);
    } else {
      if (this._searchable) {
        this._searchValue = option.label || "";
      }

      // This also sets and dispatches the value
      this.handleClose(true, false, true, newValue);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< selectOption");
  }

  /**
   * Return the current dropdown value + selecting an option
   * @param {*} option the selected option value
   * @returns what the dropdown value should be
   */

  targetValueWithOption(option) {
    if (DEBUG) console.debug(CLASS_NAME, "> targetValueWithOption", option);

    const optionValue = option.value;
    let newValue = option.value;

    if (this._multiple) {
      if (!isArray(this._value)) {
        // Value is empty, just create a new array
        newValue = [optionValue];
      } else if (this._value.includes(optionValue)) {
        // Value is already selected, so remove it from the list
        newValue = this._value.filter((existingOption) => {
          return existingOption !== optionValue;
        });
      } else {
        // Value is not selected, so add it to the list
        newValue = [...this._value, optionValue];
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< targetValueWithOption", newValue);
    return newValue;
  }

  handleAutoSelect() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleAutoSelect",
        "_searchValue",
        this._searchValue
      );
    }

    let rv = false;

    if (this._autoselect) {
      const matchingOptions = this.getLabelMatchingOptions(
        this._searchValue,
        this._processedOptions
      );

      if (DEBUG) {
        console.debug(
          CLASS_NAME,
          "> handleAutoSelect",
          "_searchValue",
          this._searchValue,
          "matchingOptions=",
          JSON.stringify(matchingOptions)
        );
      }

      if (
        matchingOptions.length === 1 &&
        matchingOptions[0].label === this._searchValue &&
        matchingOptions[0].value !== this._value
      ) {
        this.setAndDispatchValue(matchingOptions[0].value);
        rv = true;
      }
    }

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< handleAutoSelect",
        rv,
        JSON.stringify(this._value)
      );
    return rv;
  }

  handleAny() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleAny",
        "_searchValue",
        this._searchValue
      );
    }

    let rv = false;

    if (this._any) {
      this.normaliseSearchValue();
      this.setAndDispatchValue(this._searchValue);

      rv = true;
    }

    if (DEBUG)
      console.debug(CLASS_NAME, "< handleAny", rv, JSON.stringify(this._value));

    return rv;
  }

  @api focus() {
    if (DEBUG) console.debug(CLASS_NAME, "> focus");

    this.refs.comboboxRef.focus();

    if (DEBUG) console.debug(CLASS_NAME, "< focus");
  }

  propagateEvent(event) {
    if (event) {
      this.dispatchEvent(
        new CustomEvent(event.type, {
          bubbles: true,
          composed: true
        })
      );
    }
  }

  /* event management: container */

  handleContainerKeydown(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleContainerKeydown");

    withKeys(
      withModifiers(() => this.handleArrowDown(), ["prevent"]),
      ["down"]
    )(event);
    withKeys(
      withModifiers(() => this.handleArrowUp(), ["prevent"]),
      ["up"]
    )(event);
    withKeys(
      withModifiers(() => this.handleClose(true, true), ["prevent"]),
      ["esc"]
    )(event);
    withKeys(
      withModifiers(() => this.handleClose(false), ["exact"]),
      ["tab"]
    )(event);
    withKeys(
      withModifiers(() => this.handleClose(false), ["shift"]),
      ["tab"]
    )(event);
    withKeys(() => this.handleDeleteKey(), ["delete"])(event);
    withModifiers(() => this.handleTyping, ["exact"])(event);

    if (DEBUG) console.debug(CLASS_NAME, "< handleContainerKeydown");
  }

  /* event management: combobox */

  handleComboboxClick(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleComboboxClick");

    this._onClickOutside.forceTag(CLICK_OUTSIDE_REF, event);
    this.handleToggle(false, event);

    if (this._isOpen) nextTick(() => this.showFirstLastSelected(false));

    if (DEBUG) console.debug(CLASS_NAME, "< handleComboboxClick");
  }

  handleComboboxKeydown(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleComboboxKeydown");

    withKeys(
      withModifiers(() => this.handleToggle(true, event), ["exact"]),
      ["space"]
    )(event);

    if (DEBUG) console.debug(CLASS_NAME, "< handleComboboxKeydown");
  }

  /* event management: tag list */

  handleRemoveOption(event) {
    this.selectOption(event.detail);
  }

  /* event management: search */

  handleSearchKeydown(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSearchKeydown");

    withKeys(
      withModifiers(() => this.handleSearchSubmit(), ["prevent"]),
      ["enter"]
    )(event);
    withKeys(
      withModifiers(() => this.handleSearchLeft(), ["stop"]),
      ["left"]
    )(event);

    if (DEBUG) console.debug(CLASS_NAME, "< handleSearchKeydown");
  }

  handleSearchInput(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSearchInput");

    /* manually doing what vue v-model would do */
    this._searchValue = event.target.value || "";
    /* end v-model */

    // If the single search value is cleared the selected option should be cleared
    if (this._singleSearch && this._value && event.target?.value === "") {
      this.setAndDispatchValue(null); // emit event onchange null
      //
    } else if (this._autoselect) {
      this.handleAutoSelect();
    }

    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< handleSearchInput");
  }

  handleSearchChange(event) {
    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true
      })
    );
  }

  handleSearchFocus(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSearchFocus");

    this._searchFocused = true;
    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< handleSearchFocus");
  }

  handleSearchBlur(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSearchBlur");

    this._searchFocused = false;
    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true
      })
    );
    if (DEBUG) console.debug(CLASS_NAME, "< handleSearchBlur");
  }

  /* event management: option */

  handleOptionKeydown(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleOptionKeydown");

    const optionId = event.target.getAttribute("data-option-id");
    const isLastItem = optionId === LASTITEM_OPTION_ID;
    const currentOption = isLastItem
      ? null
      : this._processedOptions.find((option) => option.id === optionId);

    if (currentOption || isLastItem) {
      withKeys(
        withModifiers(() => {
          return isLastItem
            ? this.selectLastItem()
            : this.selectOption(currentOption);
        }, ["prevent"]),
        ["space", "enter"]
      )(event);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleOptionKeydown");
  }

  handleOptionClick(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleOptionClick");

    this._onClickOutside.forceTag(CLICK_OUTSIDE_REF, event);

    const optionId = event.currentTarget.getAttribute("data-option-id");
    const isLastItem = optionId === LASTITEM_OPTION_ID;
    const currentOption = isLastItem
      ? null
      : this._processedOptions.find((option) => option.id === optionId);

    if (DEBUG)
      console.debug(CLASS_NAME, "= handleOptionClick", optionId, currentOption);

    if (currentOption) {
      this.selectOption(currentOption);
    } else if (isLastItem) {
      this.selectLastItem();
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleOptionClick");
  }

  /* event management: last item */

  @track _hasLastItem;

  handleLastItemChange(event) {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> handleLastItemChange",
        event.target.assignedElements()
      );

    if (event.target) {
      if (event.target.assignedElements().length) {
        this._hasLastItem = true;
      } else {
        this._hasLastItem = false;
      }
    }

    if (DEBUG)
      console.debug(CLASS_NAME, "< handleLastItemChange", this._hasLastItem);
  }

  /* lifecycle */
  /* --------- */

  render() {
    return tmpl;
  }

  _onClickOutside;

  renderedCallback() {
    if (!this._onClickOutside) {
      this._onClickOutside = new OnClickOutside();
      this._onClickOutside.bind(this, CLICK_OUTSIDE_REF, () => {
        this.handleClose(false);
      });
    }
  }

  disconnectedCallback() {
    if (this._onClickOutside) {
      this._onClickOutside.unbind(this, CLICK_OUTSIDE_REF);
    }
  }

  /* validation */

  _messageWhenValueMissingOriginal;

  @api
  get messageWhenValueMissing() {
    return (
      this._messageWhenValueMissingOriginal || I18N.messageWhenValueMissing
    );
  }

  set messageWhenValueMissing(value) {
    this._messageWhenValueMissingOriginal = value;
  }

  _messageWhenTooShortOriginal;

  @api
  get messageWhenTooShort() {
    return this._messageWhenTooShortOriginal || I18N.messageWhenTooShort;
  }

  set messageWhenTooShort(value) {
    this._messageWhenTooShortOriginal = value;
  }

  _messageWhenValueTooLongOriginal;

  @api
  get messageWhenTooLong() {
    return this._messageWhenTooLongOriginal || I18N.messageWhenTooLong;
  }

  set messageWhenTooLong(value) {
    this._messageWhenTooLongOriginal = value;
  }

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

  get isError() {
    return this._invalid;
  }

  @api
  get validity() {
    return this._validity;
  }

  @api checkValidity() {
    if (DEBUG) console.debug(CLASS_NAME, "> checkValidity");

    this.assessValidity(false);
    const rv = this._validity && this._validity.valid;

    if (DEBUG) console.debug(CLASS_NAME, "< checkValidity", rv);

    return rv;
  }

  @api reportValidity() {
    if (DEBUG) console.debug(CLASS_NAME, "> reportValidity");

    this.assessValidity(true);
    this.setAttribute("data-invalid", !this._validity.valid);

    if (DEBUG)
      console.debug(CLASS_NAME, "< reportValidity", this._validity.valid);

    return this._validity.valid;
  }

  @api setCustomValidity(message) {
    if (DEBUG) console.debug(CLASS_NAME, "> setCustomValidity", message);

    const isError = message === "" ? false : true;
    this._validity.customError = isError;
    this._invalid = isError;
    this.errorMessage = message;

    if (DEBUG) console.debug(CLASS_NAME, "< setCustomValidity");
  }

  @api
  get validationMessage() {
    return this.errorMessage;
  }

  assessValidity(showError) {
    if (DEBUG) console.debug(CLASS_NAME, "> assessValidity", showError);

    if (!this._validity.customError) {
      this._invalid = false;
      this.errorMessage = "";
    }

    this._validity = {
      badInput: false,
      customError: this._validity.customError,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valid: false,
      valueMissing: false
    };

    if ((!this._value || this._value.length === 0) && this._required) {
      this._validity.valueMissing = true;

      if (showError) {
        this._invalid = true;
        this.errorMessage = this.messageWhenValueMissing;
      }
    } else if (
      this._value != null &&
      this._minLength &&
      this._value.length < this._minLength
    ) {
      this._validity.tooShort = true;

      if (showError) {
        this._invalid = true;
        this.errorMessage = this.messageWhenTooShort;
      }
    } else if (
      this._value &&
      this._maxLength &&
      this._value.length > this._maxLength
    ) {
      this._validity.tooLong = true;

      if (showError) {
        this._invalid = true;
        this.errorMessage = this.messageWhenTooLong;
      }
    }

    this._validity.valid =
      !this._validity.customError &&
      !this._validity.valueMissing &&
      !this._validity.tooShort &&
      !this._validity.tooLong;

    if (DEBUG)
      console.debug(CLASS_NAME, "< assessValidity", this._validity.valid);
  }
}
