/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";

import SfGpsDsElement from "c/sfGpsDsElement";
import OnClickOutside from "c/sfGpsDsOnClickOutside";
import { nextTick } from "c/sfGpsDsHelpers";

import type {
  MenuPosition,
  Variant
} from "c/sfGpsDsAuNswButtonMenu";

import type {
  Link
} from "c/sfGpsDsMarkdown";

const CLASS_NAME = "SfGpsDsNswButtonMenu";
const DEBUG = false;

const MENUPOSITION_LEFT = "left";
const MENUPOSITION_RIGHT = "right";
const MENUPOSITON_VALUES = [ MENUPOSITION_LEFT, MENUPOSITION_RIGHT ];
const MENUPOSITION_DEFAULT = MENUPOSITION_LEFT;

const VARIANT_PADDED = "padded";
const VARIANT_UNPADDED = "unpadded";
const VARIANT_VALUES = [ VARIANT_PADDED, VARIANT_UNPADDED ];
const VARIANT_DEFAULT = VARIANT_PADDED;

const PREVENTDEFAULT_DEFAULT = false;
const BUTTON_ARIALABEL_DEFAULT = "Open menu";

export default 
class SfGpsDsNswButtonMenu
extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  iconName?: string;

  // @ts-ignore
  @api
  buttonAriaLabel?: string;

  // @ts-ignore
  @api
  variant?: Variant;
  _variant = this.defineEnumProperty("variant", {
    validValues: VARIANT_VALUES,
    defaultValue: VARIANT_DEFAULT
  });

  // @ts-ignore
  @api
  menuPosition?: MenuPosition;
  _menuPosition = this.defineEnumProperty("menuPosition", {
    validValues: MENUPOSITON_VALUES,
    defaultValue: MENUPOSITION_DEFAULT
  });

  // @ts-ignore
  @api 
  items?: Link[];

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  preventDefault? = false;
  _preventDefault = this.defineBooleanProperty("preventDefault", {
    defaultValue: PREVENTDEFAULT_DEFAULT
  })

  _isOpen = false;

  /* computed */

  get computedClassName(): any {
    return {
      "sfgpsdsnsw-button-menu": true,
      "sfgpsdsnsw-button-menu--padded": this._variant.value === VARIANT_PADDED,
      [this.className]: !!this.className
    }
  }

  get computedButtonClassName(): any {
    return {
      "sfgpsdsnsw-button-menu--button": true,
      "sfgpsdsnsw-button-menu--button-label": this.label || this.iconName
    }
  }

  get computedDropdownClassName(): any {
    return {
      "sfgpsdsnsw-button-menu--dropdown": true,
      "sfgpsdsnsw-button-menu--dropdown-left": this._menuPosition.value === MENUPOSITION_LEFT,
      "sfgpsdsnsw-button-menu--dropdown-right": this._menuPosition.value === MENUPOSITION_RIGHT,
    }
  }

  get computedButtonAriaLabel() {
    return this.buttonAriaLabel || BUTTON_ARIALABEL_DEFAULT;
  }

  get computedIsClosed() {
    return !this._isOpen;
  }

  get computedItems(): Array<Link & { index: number, key: string }> {
    return (this.items || []).map((item, index) => ({
      ...item,
      index: index,
      key: `item-${index + 1}`,
      // eslint-disable-next-line no-script-url
      url: item.url || "javascript:void(0);"
    }));
  }

  get nItems(): number {
    return (this.items || []).length || 0;
  }

  /* methods */

  // @ts-ignore
  @api 
  toggle(focus = false) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> toggle", "isOpen=", this._isOpen);
    }

    if (this._isOpen) {
      this.close(focus);
    } else {
      this.open(focus);
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< toggle", "isOpen=", this._isOpen);
    }
  }

  // @ts-ignore
  @api 
  close(focus = false) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> close", "isOpen=", this._isOpen);
    }

    if (focus) this.focus();
    this._isOpen = false;

    if (DEBUG) {
      console.debug(CLASS_NAME, "< close", "isOpen=", this._isOpen);
    }
  }

  // @ts-ignore
  @api 
  open(focus = false) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> open", "isOpen=", this._isOpen);
    }

    if (focus) this.focus();
    this._isOpen = true;

    if (DEBUG) {
      console.debug(CLASS_NAME, "< open", "isOpen=", this._isOpen);
    }
  }

  // @ts-ignore
  @api
  focus() {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> focus");
    }

    this.refs.buttonRef?.focus();

    if (DEBUG) {
      console.debug(CLASS_NAME, "< focus");
    }
  }

  // @ts-ignore
  @api 
  blur() {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> blur");
    }

    this.close();

    if (DEBUG) {
      console.debug(CLASS_NAME, "< blur");
    }
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleButtonClick(_event: MouseEvent): void {
    if (DEBUG) console.debug("> handleButtonClick");
    this.toggle(true);
    if (DEBUG) console.debug("< handleButtonClick");
  }

  handleButtonKeydown(event: KeyboardEvent): void {
    if (DEBUG) console.debug("> handleButtonKeydown", event.key);

    switch(event.key) {
      /* Enter will be handled automatically and turned into a click event when focused */

      case "Down":
      case "ArrowDown":
        event.preventDefault();
        this.open();

        // focus change only when arrow down, not on regular click.
        nextTick(() => {
          const firstItem = this.querySelector(".sfgpsdsnsw-button-menu--dropdown-item") as HTMLElement;
          if (firstItem) firstItem.focus();
        });

        break;

      case "Escape":
      case "Esc":
        event.preventDefault();
        this.close(true);
        break;

      default:
    }

    if (DEBUG) console.debug("< handleButtonKeydown");
  }

  handleItemClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const index = parseInt(target.dataset.ndx, 10);

    if (this._preventDefault.value) {
      event.preventDefault();
    }

    if (!isNaN(index)) {
      this.close();
      this.dispatchEvent(new CustomEvent("itemselected", { 
        detail: index
      }));

    }
    
    if (DEBUG) {
      console.debug(CLASS_NAME, "handleClick", "itemclick", index);
    }
  }

  handleItemKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const index = parseInt(target.dataset.ndx, 10);

    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleItemKeydown", index);
    }

    if (!isNaN(index)) {
      const nextIndex = (index + 1) % this.nItems;
      const nextElement = this.querySelector(`.sfgpsdsnsw-button-menu--dropdown-item[data-ndx="${nextIndex}"]`) as HTMLElement;

      const previousIndex = index > 0 ? index - 1 : this.nItems - 1;
      const previousElement = this.querySelector(`.sfgpsdsnsw-button-menu--dropdown-item[data-ndx="${previousIndex}"]`) as HTMLElement;

      switch(event.key) {
        // Enter will be handled automatically and turned into a click event when focused

        case "Down":
        case "ArrowDown":
          if (DEBUG) {
            console.debug(CLASS_NAME, "= handleItemKeydown", "nextElement", nextIndex, nextElement);
          }

          event.preventDefault();
          
          if (nextElement) {
            nextElement.focus();
          }

          break;

        case "Up":
        case "ArrowUp":
          if (DEBUG) {
            console.debug(CLASS_NAME, "= handleItemKeydown", "previousElement", previousIndex, previousElement);
          }
          
          event.preventDefault();

          if (previousElement) {
            previousElement.focus();
          }

          break;

        case "Escape":
        case "Esc":
          if (DEBUG) {
            console.debug(CLASS_NAME, "= handleItemKeydown", "close");
          }
          
          event.preventDefault();
          this.close(true);
          break;

        default:
      }
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleItemKeydown");
    }
  }

  /* lifecycle */

  _onClickOutside?: OnClickOutside;

  constructor() {
    super();

    this.handleMounted(() => {
      if (!this._onClickOutside) {
        this._onClickOutside = new OnClickOutside();
        this._onClickOutside.bind(this, "containerRef", () => {
          if (DEBUG) {
            console.debug(CLASS_NAME, "onClickOutside");
          }

          if (this._isOpen) this.close();
        });
      }
    });

    this.handleUnmounted(() => {
      if (this._onClickOutside) {
        this._onClickOutside.unbind(this, "containerRef");
        this._onClickOutside = undefined;
      }
    })
  }
}
