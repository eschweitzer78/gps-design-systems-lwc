import { LightningElement, api, track } from "lwc";
import {
  isArray,
  nextTick,
  normaliseBoolean,
  normaliseString,
  normaliseInteger
} from "c/sfGpsDsHelpers";
import OnClickOutside from "c/sfGpsDsOnClickOutside";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2SearchBar";

const VARIANT_DEFAULT = "default";
const VARIANT_REVERSE = "reverse";
const VARIANT_MENU = "menu";
const VARIANT_VALUES = [VARIANT_DEFAULT, VARIANT_REVERSE, VARIANT_MENU];

const AUTOFOCUS_DEFAULT = false;
const SHOWNORESULTS_DEFAULT = false;
const SHOWLABEL_DEFAULT = false;

const MAXSUGGESTIONSDISPLAYED_MIN = 1;
const MAXSUGGESTIONSDISPLAYED_MAX = 30;
const MAXSUGGESTIONSDISPLAYED_DEFAULT = 10;

const CLICK_OUTSIDE_REF = "containerRef";

export default class extends LightningElement {
  @api inputLabel = "Search";
  @api submitLabel = "Search";
  @api placeholder = "";

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT
    });
  }

  /* api: autoFocus */

  _autoFocus = AUTOFOCUS_DEFAULT;
  _autoFocusOriginal = AUTOFOCUS_DEFAULT;

  @api
  get autoFocus() {
    return this._autoFocusOriginal;
  }

  set autoFocus(value) {
    this._autoFocusOriginal = value;
    this._autoFocus = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: AUTOFOCUS_DEFAULT
    });
  }

  /* api: maxSuggestionsDisplayed */

  _maxSuggestionsDisplayedOriginal = MAXSUGGESTIONSDISPLAYED_DEFAULT;
  _maxSuggestionsDisplayed = MAXSUGGESTIONSDISPLAYED_DEFAULT;

  @api
  get maxSuggestionsDisplayed() {
    return this._maxSuggestionsDisplayedOriginal;
  }

  set maxSuggestionsDisplayed(value) {
    this._maxSuggestionsDisplayedOriginal = value;
    this._maxSuggestionsDisplayed = normaliseInteger(value, {
      min: MAXSUGGESTIONSDISPLAYED_MIN,
      max: MAXSUGGESTIONSDISPLAYED_MAX,
      fallbackValue: MAXSUGGESTIONSDISPLAYED_DEFAULT
    });
  }

  /* api: showNoResults */

  _showNoResultsOriginal = SHOWNORESULTS_DEFAULT;
  _showNoResults = SHOWNORESULTS_DEFAULT;

  @api
  get showNoResults() {
    return this._showNoResultsOriginal;
  }

  set showNoResults(value) {
    this._showNoResultsOriginal = value;
    this._showNoResults = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWNORESULTS_DEFAULT
    });
  }

  /* api: showLabel */

  _showLabel = SHOWLABEL_DEFAULT;
  _showLabelOriginal = SHOWLABEL_DEFAULT;

  @api
  get showLabel() {
    return this._showLabelOriginal;
  }

  set showLabel(value) {
    this._showLabelOriginal = value;
    this._showLabel = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWLABEL_DEFAULT
    });
  }

  /* api: suggestions */

  _suggestions = [];
  _suggestionsById;

  @api
  get suggestions() {
    return this._suggestions;
  }

  set suggestions(value) {
    if (DEBUG)
      console.log(CLASS_NAME, "> set suggestions", JSON.stringify(value));

    this._suggestions = value;
    this._suggestionsById = new Map();

    if (isArray(value)) {
      value.forEach((option) => {
        this._suggestionsById.set(this.getOptionId(option), option);
      });
    }

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< set suggestions",
        JSON.stringify({
          _suggestions: this._suggestions,
          _suggestionsById: this._suggestionsById
        })
      );
  }

  /* api: inputValue */

  _inputValue = "";

  @api
  get inputValue() {
    return this._inputValue;
  }

  set inputValue(newModelValue) {
    this._inputValue = newModelValue;
    this.watchInputValue(newModelValue);
  }

  /* tracked */

  @track _isOpen;

  /* var: _activeOptionId */

  __activeOptionId;

  get _activeOptionId() {
    return this.__activeOptionId;
  }

  set _activeOptionId(newId) {
    this.__activeOptionId = newId;
    this.watchActiveOptionId(newId);
  }

  /* var: _onClickOutside */

  _onClickOutside = new OnClickOutside();

  /* var: _internalValue */

  _internalValue;

  /* computed */

  get computedClassName() {
    return {
      "rpl-search-bar": true,
      "rpl-search-bar--default": this._variant === VARIANT_DEFAULT,
      "rpl-search-bar--reverse": this._variant === VARIANT_REVERSE,
      "rpl-search-bar--menu": this._variant === VARIANT_MENU
    };
  }

  get computedStyle() {
    return `--local-max-items: ${this._maxSuggestionsDisplayed}`;
  }

  get computedLabelClassName() {
    return {
      "rpl-search-bar__label": true,
      "rpl-u-visually-hidden": !this._showLabel,
      "rpl-type-h4-fixed": true
    };
  }

  get computedInputClassName() {
    return {
      "rpl-search-bar__input": true,
      "rpl-u-focusable-outline": true,
      "rpl-u-focusable-outline--no-border": true,
      "rpl-u-focusable--force-on": this._isOpen
    };
  }

  get computedNoResults() {
    const rv =
      this._showNoResults &&
      this._suggestions?.length === 0 &&
      !!this._internalValue &&
      this._isOpen;

    if (DEBUG) console.log(CLASS_NAME, "computedNoResults", rv);

    return rv;
  }

  get computedHasResults() {
    const rv = this._suggestions?.length && this._isOpen;

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "computedHasResults",
        this._suggestions?.length,
        this._isOpen,
        rv
      );

    return rv;
  }

  get decoratedSuggestions() {
    return this._suggestions.map((option) => {
      const optionId = this.getOptionId(option);

      return {
        id: optionId,
        label: this.getOptionLabel(option),
        slug: this.slug(optionId),
        role: this.isOptionSelectable(option) ? "option" : null,
        className: {
          "rpl-search-bar__menu-option": true,
          "rpl-u-focusable-block": true,
          "rpl-u-focusable--force-on": this.isMenuItemKeyboardFocused(optionId)
        }
      };
    });
  }

  /* methods */

  // eslint-disable-next-line no-unused-vars
  @api isOptionSelectable = (opt) => true;
  @api getSuggestionVal = (item) => item;
  @api getOptionLabel = (opt) => opt;
  @api getOptionId = (opt) => opt;

  suggestionById(optionId) {
    if (DEBUG) console.log(CLASS_NAME, "> suggestionById", optionId);

    const rv = this._suggestionsById.get(optionId);

    if (DEBUG) console.log(CLASS_NAME, "< suggestionById", JSON.stringify(rv));

    return rv;
  }

  getDefaultActiveId() {
    return this.suggestions?.length
      ? this.getOptionId(this.suggestions[0])
      : null;
  }

  watchInputValue(newModelValue) {
    this._internalValue = this.getSuggestionVal(newModelValue);
  }

  watchActiveOptionId(newId) {
    if (newId !== null) {
      nextTick((_newId) => {
        this.focusOption(_newId);
      }, newId);
    }
  }

  slug(label) {
    return label.toLowerCase().replace(/[^\w-]+/g, "-");
  }

  @api focus() {
    this.refs.inputRef.focus();
  }

  /* event management */

  handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    this.handleSubmit("button");
  }

  handleContainerKeydown(event) {
    switch (event.code) {
      case "ArrowUp":
        event.preventDefault();
        this.handleArrowUp();
        break;

      case "ArrowDown":
        event.preventDefault();
        this.handleArrowDown();
        break;

      case "Escape":
        event.preventDefault();
        this.handleClose(true);
        break;

      case "Tab":
        this.handleClose(false);
        break;

      default:
    }
  }

  handleInputFocus() {
    this.handleOpen(false);
  }

  handleInputKeydown(event) {
    if (event.code === "Enter") {
      event.preventDefault();
      this.handleSubmit("enter");
    }
  }

  handleOptionKeydown(event) {
    const optionId = event.target.dataset.optionId;
    const option = this.suggestionById(optionId);

    switch (event.code) {
      case "Space":
      case "Enter":
        event.preventDefault();

        if (this.isOptionSelectable(option)) {
          this.handleSelectOption(option, true);
        }
        break;

      default:
        if (this.isOptionSelectable(option)) {
          this.handleKeydown(event);
        }
    }
  }

  handleOptionClick(event) {
    this._onClickOutside.forceTag(CLICK_OUTSIDE_REF, event);

    const optionId = event.target.dataset.optionId;
    const option = this.suggestionById(optionId);

    if (this.isOptionSelectable(option)) {
      this.handleSelectOption(option, false);
    }
  }

  handleSubmit(type) {
    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: {
          action: "search",
          id: this.id,
          name: this.inputLabel,
          value: this._internalValue,
          text: this.type === "button" ? this.submitLabel : null,
          type
        }
      })
    );
  }

  handleInputChange(event) {
    const value = event.target.value;
    this._internalValue = value;
    this.dispatchEvent(
      new CustomEvent("updateinputvalue", {
        detail: value
      })
    );
    this._isOpen = true;
  }

  handleSelectOption(optionValue, focusBackOnInput) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> handleSelectOption",
        JSON.stringify(optionValue),
        focusBackOnInput
      );

    const optionLabel = this.getOptionLabel(optionValue);

    if (focusBackOnInput) {
      this.refs.InputRef.focus();
    }

    this._internalValue = optionValue;
    this.dispatchEvent(
      new CustomEvent("updateinputvalue", {
        detail: optionValue
      })
    );

    this._isOpen = false;

    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: {
          action: "search",
          id: this.id,
          text: this.getSuggestionVal(optionValue),
          name: this.inputLabel,
          value: optionLabel,
          payload: optionValue,
          type: "suggestion"
        }
      })
    );

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< handleSelectOption",
        JSON.stringify(this._internalValue)
      );
  }

  handleOpen(fromKeyboard = false) {
    this._isOpen = true;

    if (fromKeyboard && this.suggestions?.length) {
      this._activeOptionId = this.getDefaultActiveId();
    }
  }

  handleClose(focusBackOnInput = false) {
    this._isOpen = false;
    this._activeOptionId = null;

    if (focusBackOnInput) {
      this.refs.inputRef.focus();
    }
  }

  handleArrowDown() {
    const currentActiveIndex = this.suggestions.findIndex(
      (opt) => this.getOptionId(opt) === this._activeOptionId
    );

    if (currentActiveIndex < 0) {
      this._activeOptionId = this.getDefaultActiveId();
    } else if (currentActiveIndex < this.suggestions.length - 1) {
      this._activeOptionId = this.getOptionId(
        this.suggestions[currentActiveIndex + 1]
      );
    }
  }

  handleArrowUp() {
    const currentActiveIndex = this.suggestions.findIndex(
      (opt) => this.getOptionId(opt) === this._activeOptionId
    );

    if (currentActiveIndex < 0) {
      this._activeOptionId = this.getDefaultActiveId();
    } else if (currentActiveIndex > 0) {
      this._activeOptionId = this.getOptionId(
        this.suggestions[currentActiveIndex - 1]
      );
    }
  }

  isPrintableKeyCode(keyCode) {
    return (
      (keyCode > 47 && keyCode < 58) || // number keys
      keyCode === 32 ||
      keyCode === 8 || // spacebar or backspace
      (keyCode > 64 && keyCode < 91) || // letter keys
      (keyCode > 95 && keyCode < 112) || // numpad keys
      (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
      (keyCode > 218 && keyCode < 223) // [\]' (in order)
    );
  }

  handleKeydown(event) {
    if (this.isPrintableKeyCode(event.keyCode)) {
      this.refs.inputRef.focus();
    }
  }

  isMenuItemKeyboardFocused(optionId) {
    return this._activeOptionId === optionId;
  }

  focusOption(optionId) {
    const optionEl = this.refs.menuRef.querySelector(
      `[data-option-id="${optionId}`
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
  }

  /* lifecycle */

  _isRendered;

  renderedCallback() {
    if (!this._isRendered) {
      this._isRendered = true;

      if (this._autoFocus) {
        this.refs.inputRef.focus();
      }

      this._onClickOutside.bind(this, CLICK_OUTSIDE_REF, () => {
        this.handleClose(false);
      });
    }
  }

  disconnectedCallback() {
    this._onClickOutside.unbind(this, CLICK_OUTSIDE_REF);
  }
}
