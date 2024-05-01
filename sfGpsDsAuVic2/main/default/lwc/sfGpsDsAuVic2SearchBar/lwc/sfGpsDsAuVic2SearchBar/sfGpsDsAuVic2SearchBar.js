import { LightningElement, api, track } from "lwc";
import { computeClass, nextTick, normaliseBoolean } from "c/sfGpsDsHelpers";
import OnClickOutside from "c/sfGpsDsOnClickOutside";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2SearchBar";

export default class extends LightningElement {
  @api variant = "default";
  @api inputLabel = "Search";
  @api submitLabel = "Search";
  @api placeholder = "";
  @api getSuggestionVal = (item) => item;
  @api getOptionLabel = (opt) => opt;
  @api getOptionId = (opt) => opt;
  // eslint-disable-next-line no-unused-vars
  @api isOptionSelectable = (opt) => true;

  /* api: autoFocus */

  _autoFocusOriginal;
  _autoFocus;

  @api get autoFocus() {
    return this._autoFocusOriginal;
  }

  set autoFocus(value) {
    this._autoFocusOriginal = value;
    this._autoFocus = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: ma */

  _maxSuggestionsDisplayedOriginal = 10;
  _maxSuggestionsDisplayed = 10;

  @api get maxSuggestionsDisplayed() {
    return this._maxSuggestionsDisplayedOriginal;
  }

  set maxSuggestionsDisplayed(value) {
    this._maxSuggestionsDisplayedOriginal = value;
    this._maxSuggestionsDisplayed = Number(value);
  }

  /* api: showNoResults */

  _showNoResultsOriginal;
  _showNoResults;

  @api get showNoResults() {
    return this._showNoResultsOriginal;
  }

  set showNoResults(value) {
    this._showNoResultsOriginal = value;
    this._showNoResults = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: showLabel */

  _showLabelOriginal;
  _showLabel;

  @api get showLabel() {
    return this._showLabelOriginal;
  }

  set showLabel(value) {
    this._showLabelOriginal = value;
    this._showLabel = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: suggestions */

  _suggestions = [];
  _suggestionsById;

  @api get suggestions() {
    return this._suggestions;
  }

  set suggestions(value) {
    if (DEBUG)
      console.log(CLASS_NAME, "> set suggestions", JSON.stringify(value));

    this._suggestions = value;
    this._suggestionsById = new Map();

    if (Array.isArray(value)) {
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

  get decoratedSuggestions() {
    return this._suggestions.map((option) => {
      const optionId = this.getOptionId(option);

      return {
        id: optionId,
        label: this.getOptionLabel(option),
        slug: this.slug(optionId),
        role: this.isOptionSelectable(option) ? "option" : null,
        className: computeClass({
          "rpl-search-bar__menu-option": true,
          "rpl-u-focusable-block": true,
          "rpl-u-focusable--force-on": this.isMenuItemKeyboardFocused(optionId)
        })
      };
    });
  }

  suggestionById(optionId) {
    if (DEBUG) console.log(CLASS_NAME, "> suggestionById", optionId);

    const rv = this._suggestionsById.get(optionId);

    if (DEBUG) console.log(CLASS_NAME, "< suggestionById", JSON.stringify(rv));

    return rv;
  }

  /* api: inputValue */

  _inputValue = "";

  @api get inputValue() {
    return this._inputValue;
  }

  set inputValue(newModelValue) {
    this._inputValue = newModelValue;
    this.watchInputValue(newModelValue);
  }

  @track isOpen;

  /* var: activeOptionId */

  _activeOptionId;

  get activeOptionId() {
    return this._activeOptionId;
  }

  set activeOptionId(newId) {
    this._activeOptionId = newId;
    this.watchActiveOptionId(newId);
  }

  /* var: onClickOutside */

  _onClickOutside = new OnClickOutside();

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-search-bar": true,
      "rpl-search-bar--default": this.variant === "default" || !this.variant,
      "rpl-search-bar--reverse": this.variant === "reverse",
      "rpl-search-bar--menu": this.variant === "menu"
    });
  }

  get computedStyle() {
    return `--local-max-items: ${this._maxSuggestionsDisplayed}`;
  }

  get computedLabelClassName() {
    return computeClass({
      "rpl-search-bar__label": true,
      "rpl-u-visually-hidden": !this._showLabel,
      "rpl-type-h4-fixed": true
    });
  }

  get computedInputClassName() {
    return computeClass({
      "rpl-search-bar__input": true,
      "rpl-u-focusable-outline": true,
      "rpl-u-focusable-outline--no-border": true,
      "rpl-u-focusable--force-on": this.isOpen
    });
  }

  get computedNoResults() {
    const rv =
      this._showNoResults &&
      this._suggestions?.length === 0 &&
      !!this.internalValue &&
      this.isOpen;

    if (DEBUG) console.log(CLASS_NAME, "computedNoResults", rv);

    return rv;
  }

  get computedHasResults() {
    const rv = this._suggestions?.length && this.isOpen;

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "computedHasResults",
        this._suggestions?.length,
        this.isOpen,
        rv
      );

    return rv;
  }

  /* methods */

  getDefaultActiveId() {
    return this.suggestions?.length
      ? this.getOptionId(this.suggestions[0])
      : null;
  }

  watchInputValue(newModelValue) {
    this.internalValue = this.getSuggestionVal(newModelValue);
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

  _requestedFocus;

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
          value: this.internalValue,
          text: this.type === "button" ? this.submitLabel : null,
          type
        }
      })
    );
  }

  handleInputChange(event) {
    const value = event.target.value;
    this.internalValue = value;
    this.dispatchEvent(
      new CustomEvent("updateinputvalue", {
        detail: value
      })
    );
    this.isOpen = true;
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

    this.internalValue = optionValue;
    this.dispatchEvent(
      new CustomEvent("updateinputvalue", {
        detail: optionValue
      })
    );

    this.isOpen = false;

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
        JSON.stringify(this.internalValue)
      );
  }

  handleOpen(fromKeyboard = false) {
    this.isOpen = true;

    if (fromKeyboard && this.suggestions?.length) {
      this.activeOptionId = this.getDefaultActiveId();
    }
  }

  handleClose(focusBackOnInput = false) {
    this.isOpen = false;
    this.activeOptionId = null;

    if (focusBackOnInput) {
      this.refs.inputRef.focus();
    }
  }

  handleArrowDown() {
    const currentActiveIndex = this.suggestions.findIndex(
      (opt) => this.getOptionId(opt) === this.activeOptionId
    );

    if (currentActiveIndex < 0) {
      this.activeOptionId = this.getDefaultActiveId();
    } else if (currentActiveIndex < this.suggestions.length - 1) {
      this.activeOptionId = this.getOptionId(
        this.suggestions[currentActiveIndex + 1]
      );
    }
  }

  handleArrowUp() {
    const currentActiveIndex = this.suggestions.findIndex(
      (opt) => this.getOptionId(opt) === this.activeOptionId
    );

    if (currentActiveIndex < 0) {
      this.activeOptionId = this.getDefaultActiveId();
    } else if (currentActiveIndex > 0) {
      this.activeOptionId = this.getOptionId(
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
    return this.activeOptionId === optionId;
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

      this._onClickOutside.bind(this, "containerRef", () => {
        this.handleClose(false);
      });
    }
  }

  disconnectedCallback() {
    this._onClickOutside.unbind(this, "containerRef");
  }
}
