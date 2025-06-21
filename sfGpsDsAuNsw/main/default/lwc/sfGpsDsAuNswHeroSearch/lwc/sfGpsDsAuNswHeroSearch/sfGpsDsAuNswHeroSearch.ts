/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import type { 
  ButtonStyle 
} from "c/sfGpsDsAuNswHeroSearch";
import type { 
  Link 
} from "c/sfGpsDsMarkdown";

const BUTTON_ICON: ButtonStyle = "icon";
const BUTTON_TEXT: ButtonStyle = "text";
const BUTTON_VALUES: ButtonStyle[] = [BUTTON_ICON, BUTTON_TEXT];
const BUTTON_DEFAULT = BUTTON_ICON;

const SHOWLABEL_DEFAULT = false;

export default 
class SfGpsDsAuNswHeroSearch 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  intro?: string;

  // @ts-ignore
  @api 
  links?: Link[];

  // @ts-ignore
  @api 
  value?: string = ""; // ADJUSTED: added value public attribute

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  searchLabel: string = "Search site for:";

  // @ts-ignore
  @api 
  searchButtonLabel: string = "Search";

  // @ts-ignore
  @api 
  button?: ButtonStyle;
  _button = this.defineEnumObjectProperty<string, ButtonStyle>("button", {
    validValues: BUTTON_VALUES,
    defaultValue: BUTTON_DEFAULT
  });

  /* A slightly confusing of attribute name as we're looking at a yes/no to showing the label, but we stick to the original name */
  // @ts-ignore
  @api
  label?: boolean;
  _label = this.defineBooleanProperty("label", {
    defaultValue: SHOWLABEL_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "hero-search": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedLabelClassName(): any {
    return {
      "nsw-form__label": true,
      "sr-only": !this.label
    };
  }

  get computedInputGroupClassName(): any {
    return {
      "nsw-form__input-group": true,
      "nsw-form__input-group--icon": this.computedHasIconButton
    };
  }

  get computedHasTextButton(): boolean {
    return this._button.value === BUTTON_TEXT;
  }

  get computedHasIconButton(): boolean {
    return this._button.value === BUTTON_ICON;
  }

  /* event management */

  handleChange(
    event: InputEvent
  ): void {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = (event.target as HTMLInputElement).value;
  }

  handleKeyUp(
    event: KeyboardEvent
  ): void {
    event.preventDefault(); // avoid submitting
    if (event.key === "enter") {
      this.dispatchEvent(new CustomEvent("search"));
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleClick(
    _event: MouseEvent
  ): void {
    this.dispatchEvent(new CustomEvent("search"));
  }
}
