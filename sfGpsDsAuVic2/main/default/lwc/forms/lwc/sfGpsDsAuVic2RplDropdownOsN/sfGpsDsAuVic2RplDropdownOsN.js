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
  Expectations for LWC used as a childInput

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
  debounce
} from "c/sfGpsDsHelpersOs";
import OnClickOutside from "c/sfGpsDsOnClickOutsideOs";
import salesforceUtils from "omnistudio/salesforceUtils";
import pubsub from "omnistudio/pubsub";
import tmpl from "./sfGpsDsAuVic2RplDropdownOsN.html";

const VARIANT_DEFAULT = "default";
const VARIANT_VALUES = {
  default: "rpl-form-dropdown--default",
  reverse: "rpl-form-dropdown--reverse"
};

const CLICK_OUTSIDE_REF = "containerRef";

const DEFAULT_OPTION_ID = "__default-option";
const UNSELECTED_VALUE = null;
const PLACEHOLDER_DEFAULT = "Select";
const NORESULTLABEL_DEFAULT = "No results found";
const MAXITEMSDISPLAYED_DEFAULT = 6;

const DEBUG = true;
const CLASS_NAME = "SfGpsDsAuVic2RplDropdownOsN";

export default class extends LightningElement {
  @api label;
  @api acceptAnySingleValue;

  @api fieldLevelHelp;
  @api unselectLabel = "-- Clear --";

  /* api: maxItemsDisplayed */

  _maxItemsDisplayed;

  @api
  get maxItemsDisplayed() {
    return this._maxItemsDisplayed || MAXITEMSDISPLAYED_DEFAULT;
  }

  set maxItemsDisplayed(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set maxItemsDisplayed", value);

    if (value == null) {
      this._maxItemsDisplayed = null;
    } else {
      this._maxItemsDisplayed = isString(value)
        ? parseInt(value, 10)
        : Number(value).round();
    }

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< set maxItemsDisplayed",
        this._maxItemsDisplayed
      );
  }

  /* api: placeholder */

  _placeholder;

  @api
  get placeholder() {
    return this._placeholder == null ? PLACEHOLDER_DEFAULT : this._placeholder;
  }

  set placeholder(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set placeholder", value);

    this._placeholder = value;

    if (DEBUG) console.log(CLASS_NAME, "< set placeholder", this._placeholder);
  }

  /* api: noResultLabel */

  _noResultLabel;

  @api
  get noResultLabel() {
    return this._noResultLabel || NORESULTLABEL_DEFAULT;
  }

  set noResultLabel(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set noResultLabel", value);

    this._noResultLabel = value;

    if (DEBUG)
      console.log(CLASS_NAME, "< set noResultLabel", this._noResultLabel);
  }

  /* api: disabled */

  _disabled;
  _disabledOriginal;

  @api
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set disabled", value);

    this._disabledOriginal = value;
    this._disabled = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.log(CLASS_NAME, "> set disabled", this._disabled);
  }

  /* api: multiple */

  _multiple;
  _multipleOriginal;

  @api
  get multiple() {
    return this._multipleOriginal;
  }

  set multiple(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set multiple", value);

    this._multipleOriginal = value;
    this._multiple = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.log(CLASS_NAME, "< set multiple", this._multiple);
  }

  /* api: preventDeselect */

  _preventDeselect;
  _preventDeselectOriginal;

  @api
  get preventDeselect() {
    return this._preventDeselectOriginal;
  }

  set preventDeselect(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set preventDeselect", value);

    this._preventDeselectOriginal = value;
    this._preventDeselect = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG)
      console.log(CLASS_NAME, "< set preventDeselect", this._preventDeselect);
  }

  /* api: searchable */

  _searchable;
  _searchableOriginal;

  @api
  get searchable() {
    return this._searchableOriginal;
  }

  set searchable(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set searchable", value);

    this._searchableOriginal = value;
    this._searchable = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.log(CLASS_NAME, "< set searchable", this._searchable);
  }

  /* api: required */

  _required;
  _requiredOriginal;

  @api
  get required() {
    return this._requiredOriginal;
  }

  set required(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set required", value);

    this._requiredOriginal = value;
    this._required = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG) console.log(CLASS_NAME, "< set required", this._required);
  }

  /* api: requiredLabel */

  _requiredLabel;

  @api
  get requiredLabel() {
    return this._requiredLabel || salesforceUtils.inputLabels.cmpRequired;
  }

  set requiredLabel(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set requiredLabel", value);

    this._requiredLabel = value;

    if (DEBUG)
      console.log(CLASS_NAME, "< set requiredLabel", this._requiredLabel);
  }

  /* api: value */

  __value;

  get _value() {
    return this.__value;
  }

  set _value(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set _value", value);

    const oldValue = this.__value;
    this.__value = value;
    this.watchValue(oldValue, value);

    if (DEBUG) console.log(CLASS_NAME, "< set _value", this.__value);
  }

  @api
  get value() {
    return this._value;
  }

  set value(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set value", value);

    this._value = value;

    if (DEBUG) console.log(CLASS_NAME, "< set variant", this._value);
  }

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_VALUES[VARIANT_DEFAULT];

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set variant", value);

    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT,
      returnObjectValue: true
    });

    if (DEBUG) console.log(CLASS_NAME, "< set variant", this._variant);
  }

  /* omnistudio requirements */

  @api name;

  /* tracked */

  @track _searchCache = "";
  @track _searchValue = "";
  /*@track*/ _searchFocused = false;
  @track _filtering = false;
  @track _focusTag = 0;
  @track _isOpen = false;
  @track _options;

  /* track: activeOptionId */

  @track __activeOptionId = null;

  get _activeOptionId() {
    return this.__activeOptionId;
  }

  set _activeOptionId(newId) {
    this.__activeOptionId = newId;
    this.watchActiveOptionId(newId);
  }

  /* computed */

  get debug() {
    return DEBUG;
  }

  get computedContainerClassName() {
    return {
      "rpl-form-dropdown": true,
      [this._variant]: this._variant,
      "rpl-form-dropdown--invalid": this._invalid,
      "rpl-form-dropdown--multi-search": this.multiSearch
    };
  }

  get computedContainerStyle() {
    return `--local-max-items: ${this.maxItemsDisplayed}`;
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

  get computedInputTabIndex() {
    return this._disabled ? "-1" : "0";
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
      this._searchable && this._searchValue && !this.processedOptions.length
    );
  }

  get processedOptions() {
    if (DEBUG) console.log(CLASS_NAME, "> get processedOptions");

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
    if (this._searchValue && this._filtering) {
      const searchQuery = this._searchValue.toLowerCase();

      options = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery)
      );
    }

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< get processedOptions",
        JSON.stringify(options)
      );

    return options;
  }

  get decoratedProcessedOptions() {
    if (DEBUG) console.log(CLASS_NAME, "> get decoratedProcessedOptions x");

    const processedOptions = this.processedOptions;
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
      selected: this.isOptionSelected(option.value)
    }));

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< get decoratedProcessedOptions",
        JSON.stringify(rv)
      );
    return rv;
  }

  get selectedOptions() {
    const values = toArray(this._value);

    return values
      .map((value) => {
        return (this._options || []).find((opt) => opt.value === value);
      })
      .filter(Boolean);
  }

  get singleValueDisplay() {
    if (this.emptyOption && !this._value) {
      return this.emptyOption.label;
    }

    const selectedOption = (this._options || []).find(
      (opt) => this._value === opt.value
    );
    return (
      selectedOption?.label || (this.acceptAnySingleValue ? this._value : "")
    );
  }

  get hasValue() {
    return this._multiple
      ? !!this._value && !!this._value.length
      : !!this._value;
  }

  get emptyOption() {
    return this._options.find(
      (opt) => opt.value === UNSELECTED_VALUE && opt.id !== DEFAULT_OPTION_ID
    );
  }

  get singleSearch() {
    return !this._multiple && this._searchable;
  }

  get multiSearch() {
    return this._multiple && this._searchable;
  }

  /* methods */

  getOptionLabel(optionValue) {
    const option = (this._options || []).find(
      (opt) => opt.value === optionValue
    );

    return option?.label;
  }

  getDefaultActiveId() {
    if (DEBUG) console.log(CLASS_NAME, "> getDefaultActiveId");

    const processedOptions = this.processedOptions;
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

    if (DEBUG) console.log(CLASS_NAME, "> getDefaultActiveId", rv);
    return rv;
  }

  getUniqueOptionId(optionId) {
    return optionId; // Nothing else is necessary if shadow DOM -- optionId ? `sfgpsdsauvic2rpldropdown-option-${optionId}` : ""
  }

  processSearch = debounce(() => {
    let options = [...(this._options || [])];
    if (this._activeOptionId) {
      const index = options.map((o) => o.id).indexOf(this._activeOptionId);
      options = options.slice(index + 1).concat(options.slice(0, index + 1));
    }

    let found = options.find((o) =>
      o.label.toLowerCase().startsWith(this._searchCache)
    );

    if (found) {
      this.handleOpen();
      this._activeOptionId = found.id;
    }

    this._searchCache = "";
  }, 250);

  focusSearch() {
    if (DEBUG) console.log(CLASS_NAME, "> focusSearch");

    this._activeOptionId = null;

    nextTick(() => {
      this.refs.searchRef?.focus();
      this._searchFocused = true;
      if (DEBUG) console.log(CLASS_NAME, "< focusSearch");
    });
  }

  watchValue(newOptions, oldOptions) {
    if (
      this._isOpen &&
      this.multiSearch &&
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

  isOptionSelected(optionValue) {
    if (this._multiple) {
      return (this._value || []).includes(optionValue);
    }

    return !optionValue && !this._value ? true : this._value === optionValue;
  }

  focusOption(optionId) {
    if (DEBUG) console.log(CLASS_NAME, "> focusOption", optionId);

    const optionRefs = Array.from(
      this.template.querySelectorAll("[data-option-id]")
    );
    const optionEl = optionRefs.find(
      (ref) => ref.dataset.optionId === optionId
    );
    const menu = this.refs.menuRef;

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

    if (DEBUG) console.log(CLASS_NAME, "< focusOption", optionEl);
  }

  showFirstLastSelected(isLast = false) {
    if (DEBUG) console.log(CLASS_NAME, "> showFirstLastSelected", isLast);

    const optionRefs = Array.from(
      this.template.querySelectorAll("[data-option-id]")
    );
    const optionEl = isLast
      ? optionRefs.findLast((ref) => ref.ariaSelected === "true")
      : optionRefs.find((ref) => ref.ariaSelected === "true");

    if (optionEl) {
      optionEl.scrollIntoView(!isLast);
    }

    if (DEBUG) console.log(CLASS_NAME, "< showFirstLastSelected", optionEl);
  }

  watchActiveOptionId(newId) {
    if (newId != null) {
      nextTick(() => this.focusOption(newId));
    }
  }

  isMatchingSearchResult(option, processedOptions = this.processedOptions) {
    return !this._searchable || processedOptions?.length > 1
      ? false
      : option.toLowerCase().includes(this._searchValue.toLowerCase());
  }

  isMenuItemKeyboardFocused(optionId) {
    return this._activeOptionId === optionId;
  }

  normaliseSearchValue() {
    if (DEBUG)
      console.log(CLASS_NAME, "> normaliseSearchValue", this._searchValue);

    /* Called when closing the dropdown in singleSearch mode, if not from selection */
    /* Does nothing by default but subclasses can override to adjust as required, 
       e.g. searchValue must be formatted a certain way */

    if (DEBUG)
      console.log(CLASS_NAME, "< normaliseSearchValue", this._searchValue);
  }

  setTime(value) {
    if (this && this.name) {
      pubsub.fire(this.name, "valuechange", {
        name: this.name,
        value
      });
    }

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this._value = value; // ESC
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );
  }

  /* methods related to event management */

  handleTyping(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleTyping");

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

    if (DEBUG) console.log(CLASS_NAME, "< handleTyping");
  }

  handleSearchSubmit() {
    if (DEBUG) console.log(CLASS_NAME, "> handleSearchSubmit");

    const processedOptions = this.processedOptions;

    if (
      processedOptions.length === 1 &&
      this.isMatchingSearchResult(processedOptions[0].label, processedOptions)
    ) {
      this.handleSelectOption(processedOptions[0]);

      if (this.multiSearch) {
        this._searchValue = "";
      }
    } else if (this.singleSearch && this.acceptAnySingleValue) {
      this.handleClose(true, false, false);
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleSearchSubmit");
  }

  handleSearchLeft() {
    if (DEBUG) console.log(CLASS_NAME, "> handleSearchLeft");

    if (
      this.multiSearch &&
      this.selectedOptions?.length &&
      this.refs.searchRef?.selectionStart === 0
    ) {
      this._focusTag = this._focusTag + 1;
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleSearchLeft");
  }

  handleSearchUpdate(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleSearchUpdate");

    /* manually doing what vue v-model would do */
    this._searchValue = event.target.value || "";
    /* end v-model */

    this._filtering = true;

    // If the single search value is cleared the selected option should be cleared
    if (this.singleSearch && this._value && event.target?.value === "") {
      this.setTime("");
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleSearchUpdate");
  }

  handleSearchFocus() {
    if (DEBUG) console.log(CLASS_NAME, "> handleSearchFocus");

    this._searchFocused = true;

    if (DEBUG) console.log(CLASS_NAME, "< handleSearchFocus");
  }

  handleSearchBlur() {
    if (DEBUG) console.log(CLASS_NAME, "> handleSearchBlur");

    this._searchFocused = false;

    if (DEBUG) console.log(CLASS_NAME, "< handleSearchBlur");
  }

  handleToggle(fromKeyboard = false, event) {
    if (DEBUG)
      console.log(CLASS_NAME, "> handleToggle fromKeyboard=", fromKeyboard);

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
      console.log(CLASS_NAME, "< handleToggle fromKeyboard=", fromKeyboard);
  }

  handleOpen(fromKeyboard = false) {
    if (DEBUG)
      console.log(CLASS_NAME, "> handleOpen fromKeyboard=", fromKeyboard);

    this._isOpen = true;

    if (this.singleSearch && this._value && !this._searchValue) {
      this._searchValue = this.getOptionLabel(this._value) || "";
    }

    if (fromKeyboard && this.processedOptions?.length && !this._searchable) {
      this._activeOptionId = this.getDefaultActiveId();
    } else if (this._searchable) {
      this.focusSearch();
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleOpen", fromKeyboard);
  }

  handleClose(
    focusBackOnInput = false,
    isCancel = false,
    fromSelection = false,
    selectionValue
  ) {
    if (DEBUG) {
      console.log(
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

      if (focusBackOnInput) {
        this.refs.inputRef.focus();
      }

      if (this.multiSearch) {
        // For a multi search we always remove the search value
        this._searchValue = "";
      } else if (this.singleSearch) {
        if (
          !fromSelection &&
          this.singleSearch &&
          this._searchValue &&
          this._searchValue !== this._value
        ) {
          if (this.acceptAnySingleValue && !isCancel) {
            // ESC - Adding acceptAnySingleValue
            /* for a single search with acceptAnySingleValue, we keep the current search value and select it on close */
            this.normaliseSearchValue();
            selectionValue = this._searchValue;
          } else {
            // For a single search we restore the search value if it wasn't fully deleted
            this._searchValue = this.getOptionLabel(this._value) || "";
          }
        }
      }

      if (
        fromSelection ||
        (this.singleSearch &&
          this.acceptAnySingleValue &&
          !isCancel &&
          this._searchValue !== this._value)
      ) {
        this.setTime(selectionValue);
      } else if (!focusBackOnInput) {
        this.dispatchEvent(
          new CustomEvent("blur", {
            bubbles: true,
            composed: true
          })
        );
      }

      this._filtering = false;
      this._searchFocused = false;
    } else {
      if (DEBUG) console.log(CLASS_NAME, "= handleClose was closed");
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleClose");
  }

  handleArrowDown() {
    if (DEBUG) console.log(CLASS_NAME, "> handleArrowDown");

    const open = this._isOpen;

    if (!this._isOpen) {
      this._isOpen = true;
    }

    const processedOptions = this.processedOptions;

    if (processedOptions.length) {
      if (DEBUG) console.log(CLASS_NAME, "= handleArrowDown has length");
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "= handleArrowDown findIndex=",
          processedOptions.findIndex
        );

      const currentActiveIndex = processedOptions.findIndex(
        (opt) => opt.id === this._activeOptionId
      );

      if (DEBUG)
        console.log(
          CLASS_NAME,
          "= handleArrowDown currentActiveIndex=",
          currentActiveIndex
        );

      if (!open && this._searchable) {
        if (DEBUG) console.log(CLASS_NAME, "= handleArrowDown focusSearch");
        nextTick(() => this.showFirstLastSelected(false));
        this.focusSearch();
      } else if (this._searchFocused && this._filtering) {
        if (DEBUG) console.log(CLASS_NAME, "= handleArrowDown option 0");
        this._activeOptionId = processedOptions[0].id;
      } else if (currentActiveIndex < 0) {
        if (DEBUG)
          console.log(CLASS_NAME, "= handleArrowDown default active id");
        this._activeOptionId = this.getDefaultActiveId();
      } else if (currentActiveIndex < processedOptions.length - 1) {
        if (DEBUG) console.log(CLASS_NAME, "= handleArrowDown next");
        this._activeOptionId = processedOptions[currentActiveIndex + 1].id;
      }
    } else {
      if (DEBUG) console.log(CLASS_NAME, "= handleArrowDown empty items");
    }

    if (DEBUG)
      console.log(CLASS_NAME, "< handleArrowDown", this._activeOptionId);
  }

  handleArrowUp() {
    if (DEBUG) console.log(CLASS_NAME, "> handleArrowUp");

    const open = this._isOpen;

    if (!open) {
      this._isOpen = true;
    }

    const processedOptions = this.processedOptions;

    if (processedOptions.length) {
      const currentActiveIndex = processedOptions.findIndex(
        (opt) => opt.id === this._activeOptionId
      );

      if (DEBUG)
        console.log(
          CLASS_NAME,
          "= handleArrowUp currentActiveIndex=",
          currentActiveIndex
        );

      if (
        !open &&
        this._searchable /*||
        (this._searchable && currentActiveIndex < 1) */
      ) {
        if (DEBUG) console.log(CLASS_NAME, "= handleArrowUp focusSearch");
        nextTick(() => this.showFirstLastSelected(true));
        this.focusSearch();
      } else if (currentActiveIndex < 0) {
        if (DEBUG) console.log(CLASS_NAME, "= handleArrowUp default active id");
        this._activeOptionId = this.getDefaultActiveId();
      } else if (currentActiveIndex > 0) {
        if (DEBUG) console.log(CLASS_NAME, "= handleArrowUp previous");
        this._activeOptionId = processedOptions[currentActiveIndex - 1].id;
      }
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleArrowUp", this._activeOptionId);
  }

  handleDeleteKey() {
    if (DEBUG) console.log(CLASS_NAME, "> handleDeleteKey");

    // For searchable dropdowns open the input so the search text can be deleted
    if (this._searchable && !this._isOpen) {
      this.handleToggle();
    }

    // For multi search dropdowns without search text we can autofocus the last tag for deletion
    if (this.multiSearch && !this._searchValue) {
      nextTick(() => this.handleSearchLeft);
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleDeleteKey");
  }

  handleSelectOptionEvent(event) {
    this.handleSelectOption(event.detail);
  }

  handleSelectOption(option) {
    if (DEBUG) console.log(CLASS_NAME, "> handleSelectOption", option);

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
    } else {
      if (this._searchable) {
        this._searchValue = option.label || "";
      }
    }

    this.handleClose(true, false, true, newValue);

    if (DEBUG) console.log(CLASS_NAME, "< handleSelectOption");
  }

  /* event management */

  handleContainerKeydown(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleContainerKeydown");

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

    if (DEBUG) console.log(CLASS_NAME, "< handleContainerKeydown");
  }

  handleInputClick(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleInputClick");

    this._onClickOutside.forceTag(CLICK_OUTSIDE_REF, event);
    this.handleToggle(false, event);
    if (this._isOpen) nextTick(() => this.showFirstLastSelected(false));

    if (DEBUG) console.log(CLASS_NAME, "< handleInputClick");
  }

  handleInputKeydown(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleInputKeydown");

    withKeys(
      withModifiers(() => this.handleToggle(true, event), ["exact"]),
      ["space"]
    )(event);

    if (DEBUG) console.log(CLASS_NAME, "< handleInputKeydown");
  }

  handleSearchKeydown(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleSearchKeydown");

    withKeys(
      withModifiers(() => this.handleSearchSubmit(), ["prevent"]),
      ["enter"]
    )(event);
    withKeys(
      withModifiers(() => this.handleSearchLeft(), ["stop"]),
      ["left"]
    )(event);

    if (DEBUG) console.log(CLASS_NAME, "< handleSearchKeydown");
  }

  handleOptionKeydown(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleOptionKeydown");

    const optionId = event.target.getAttribute("data-option-id");
    const currentOption = this.processedOptions.find(
      (option) => option.id === optionId
    );

    if (currentOption) {
      withKeys(
        withModifiers(
          () => this.handleSelectOption(currentOption),
          ["prevent"]
        ),
        ["space", "enter"]
      )(event);
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleOptionKeydown");
  }

  handleOptionClick(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleOptionClick");

    this._onClickOutside.forceTag(CLICK_OUTSIDE_REF, event);

    const optionId = event.target.getAttribute("data-option-id");
    const currentOption = this.processedOptions.find(
      (option) => option.id === optionId
    );

    if (DEBUG)
      console.log(CLASS_NAME, "= handleOptionClick", optionId, currentOption);

    if (currentOption) {
      this.handleSelectOption(currentOption);
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleOptionClick");
  }

  @api focus() {
    if (DEBUG) console.log(CLASS_NAME, "> focus");

    this.refs.inputRef.focus();

    if (DEBUG) console.log(CLASS_NAME, "< focus");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  _onClickOutside;
  _rendered = false;

  renderedCallback() {
    if (!this._rendered) {
      this._rendered = true;

      if (!this._onClickOutside) {
        this._onClickOutside = new OnClickOutside();
        this._onClickOutside.bind(this, CLICK_OUTSIDE_REF, () => {
          this.handleClose(false);
        });
      }
    }
  }

  disconnectedCallback() {
    if (this._onClickOutside) {
      this._onClickOutside.unbind(this, CLICK_OUTSIDE_REF);
    }
  }

  /* validation */

  @api messageWhenValueMissing;

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
    if (DEBUG) console.log(CLASS_NAME, "> checkValidity");

    this.assessValidity(false);
    const rv = this._validity && this._validity.valid;

    if (DEBUG) console.log(CLASS_NAME, "< checkValidity", rv);

    return rv;
  }

  @api reportValidity() {
    if (DEBUG) console.log(CLASS_NAME, "> reportValidity");

    this.assessValidity(true);

    if (DEBUG)
      console.log(CLASS_NAME, "< reportValidity", this._validity.valid);

    return this._validity.valid;
  }

  @api setCustomValidity(message) {
    if (DEBUG) console.log(CLASS_NAME, "> setCustomValidity", message);

    const isError = message === "" ? false : true;
    this._validity.customError = isError;
    this._invalid = isError;
    this.errorMessage = message;

    if (DEBUG) console.log(CLASS_NAME, "< setCustomValidity");
  }

  @api
  get validationMessage() {
    return this.errorMessage;
  }

  assessValidity(showError) {
    if (DEBUG) console.log(CLASS_NAME, "> assessValidity", showError);

    if (!this._validity.customError) {
      this._invalid = false;
      this.errorMessage = "";
    }

    if ((!this._value || this._value.length === 0) && this._required) {
      this._validity.valueMissing = true;

      if (showError) {
        this._invalid = true;
        this.errorMessage = this.messageWhenValueMissing;
      }
    } else {
      // ideally we should also check against options
      this._validity.valueMissing = false;
    }

    this._validity.valid =
      !this._validity.customError && !this._validity.valueMissing;

    if (DEBUG)
      console.log(CLASS_NAME, "< assessValidity", this._validity.valid);
  }
}
