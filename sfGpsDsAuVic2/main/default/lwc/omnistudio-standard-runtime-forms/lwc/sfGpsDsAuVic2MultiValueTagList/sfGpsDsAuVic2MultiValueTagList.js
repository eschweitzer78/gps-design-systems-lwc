/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { nextTick, withKeys, withModifiers } from "c/sfGpsDsHelpers";

const MORE_LABEL_WIDTH = 76;

export default class extends LightningElement {
  /* api: selectedOptions */

  _selectedOptions;

  @api
  get selectedOptions() {
    return this._selectedOptions;
  }

  set selectedOptions(value) {
    this._selectedOptions = (value || []).map((option, index) => ({
      ...option,
      _ariaLabel: `Remove ${option.label}`,
      key: `option-${index + 1}`
    }));

    this.calculateHiddenItems();
  }

  /* api: isOpen */

  _isOpen;

  @api
  get isOpen() {
    return this._isOpen;
  }

  set isOpen(value) {
    this._isOpen = value;
    this.calculateHiddenItems();
  }

  /* api: focusTag */

  _focusTag;

  @api
  get focusTag() {
    return this._focusTag;
  }

  set focusTag(value) {
    this._focusTag = value;
    this.handleInitialFocus();
  }

  /* tracked */

  @track numItemsHidden = 0;
  @track _activeTag;

  get activeTag() {
    return this._activeTag;
  }

  set activeTag(value) {
    this._activeTag = value;
    this.handleFocus();
  }

  /* computed */

  get computedShowHiddenMessage() {
    return !this.isOpen && this.numItemsHidden;
  }

  get displayedOptions() {
    if (this.isOpen) {
      return this.selectedOptions;
    }

    return this.selectedOptions.slice(
      0,
      this.selectedOptions.length - this.numItemsHidden
    );
  }

  get hiddenMessage() {
    return this.numItemsHidden === this.selectedOptions?.length
      ? `${this.numItemsHidden} items`
      : `+${this.numItemsHidden} more`;
  }

  /* methods */

  calculateHiddenItems = async () => {
    if (this.isOpen || !this._observer) return;

    await nextTick();

    const itemsBBox = this.refs.itemsRef.getBoundingClientRect();
    const tagElements = this.refs.faxItemsRef.querySelectorAll("[aria-hidden]");

    let countShown = 0;
    const widthToFill = this.numItemsHidden
      ? itemsBBox.width - MORE_LABEL_WIDTH
      : itemsBBox.width;

    for (const tagEl of tagElements) {
      const tagBBox = tagEl.getBoundingClientRect();

      if (tagBBox.right - itemsBBox.left < widthToFill) {
        countShown += 1;
      }
    }

    this.numItemsHidden = this.selectedOptions.length - countShown;
  };

  handleArrowLeft() {
    const activeTagIndex = this.selectedOptions.findIndex(
      (option) => option.id === this.activeTag
    );

    if (activeTagIndex) {
      this.activeTag = this.selectedOptions[activeTagIndex - 1].id;
    }

    return activeTagIndex;
  }

  handleArrowRight() {
    const activeTagIndex = this.selectedOptions.findIndex(
      (option) => option.id === this.activeTag
    );

    if (activeTagIndex < this.selectedOptions.length - 1) {
      this.activeTag = this.selectedOptions[activeTagIndex + 1].id;
    } else {
      this.dispatchEvent(new CustomEvent("focussearch"));
    }

    return activeTagIndex;
  }

  handleRemoval(option, keyboardEvent) {
    if (keyboardEvent) {
      const prevItem = this.handleArrowLeft();

      if (!prevItem) {
        this.handleArrowRight();
      }
    }

    this.dispatchEvent(new CustomEvent("removeoption", { detail: option }));
  }

  handleFocus(tagId) {
    if (!this.selectedOptions?.length) return;

    if (!tagId) {
      tagId = this.selectedOptions[this.selectedOptions.length - 1].id;
    }

    const foundTag = this._observer
      ? this.refs.itemsRef?.querySelector(`[data-tag-id="${tagId}"]`)
      : null;

    if (foundTag) {
      foundTag.focus();
    }
  }

  handleInitialFocus() {
    if (!this.selectedOptions?.length) return;

    const foundTag = this.selectedOptions[this.selectedOptions.length - 1]?.id;

    if (foundTag === this.activeTag) {
      this.handleFocus(foundTag);
    }

    this.activeTag = foundTag;
  }

  /* event management */

  handleClick(event) {
    event.stopPropagation();

    const optionId = event.target.dataset.tagId;
    const selectedOption = this.displayedOptions.find(
      (option) => option.id === optionId
    );

    if (selectedOption) {
      this.handleRemoval(selectedOption);
    }
  }

  handleKeydown(event) {
    const optionId = event.target.dataset.tagId;
    const selectedOption = this.displayedOptions.find(
      (option) => option.id === optionId
    );

    withKeys(
      withModifiers(
        () => this.handleRemoval(selectedOption, event),
        ["prevent"]
      ),
      ["delete", "enter"]
    );
    withKeys(withModifiers(this.handleArrowLeft, ["stop"]), ["left"]);
    withKeys(withModifiers(this.handleArrowRight, ["stop"]), ["right"]);
  }

  /* lifecycle */

  _observer;

  renderedCallback() {
    if (!this._observer) {
      this._observer = new ResizeObserver(() => {
        this.calculateHiddenItems();
      });

      this._observer.observe(this.refs.itemsRef);
    }
  }

  connectedCallback() {
    this.calculateHiddenItems();
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = null;
  }
}
