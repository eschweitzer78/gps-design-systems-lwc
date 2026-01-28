/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnHeader";

export type HeaderType = "ontario" | "application" | "serviceOntario";

const HEADERTYPE_VALUES: HeaderType[] = ["ontario", "application", "serviceOntario"];
const HEADERTYPE_DEFAULT: HeaderType = "ontario";

export interface ApplicationHeaderInfo {
  title: string;
  href?: string;
  maxWidth?: string;
}

export interface LanguageToggleOptions {
  englishLink?: string;
  frenchLink?: string;
}

export interface MenuItem {
  title: string;
  href: string;
  linkIsActive?: boolean;
  onClickHandler?: string;
}

export default class SfGpsDsCaOnHeader extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api
  type?: HeaderType;
  _type = this.defineEnumProperty<HeaderType>("type", {
    validValues: HEADERTYPE_VALUES,
    defaultValue: HEADERTYPE_DEFAULT
  });

  // @ts-ignore
  @api
  applicationHeaderInfo?: ApplicationHeaderInfo | string;

  // @ts-ignore
  @api
  menuItems?: MenuItem[] | string;

  // @ts-ignore
  @api
  languageToggleOptions?: LanguageToggleOptions | string;

  // @ts-ignore
  @api
  disableDynamicMenu?: boolean;
  _disableDynamicMenu = this.defineBooleanProperty("disableDynamicMenu", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  language?: string;

  // @ts-ignore
  @api
  assetBasePath?: string;

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get applicationHeaderInfoJson(): string | undefined {
    if (!this.applicationHeaderInfo) return undefined;
    if (typeof this.applicationHeaderInfo === "string") {
      return this.applicationHeaderInfo;
    }
    return JSON.stringify(this.applicationHeaderInfo);
  }

  get menuItemsJson(): string | undefined {
    if (!this.menuItems) return undefined;
    if (typeof this.menuItems === "string") {
      return this.menuItems;
    }
    return JSON.stringify(this.menuItems);
  }

  get languageToggleOptionsJson(): string | undefined {
    if (!this.languageToggleOptions) return undefined;
    if (typeof this.languageToggleOptions === "string") {
      return this.languageToggleOptions;
    }
    return JSON.stringify(this.languageToggleOptions);
  }

  get computedDisableDynamicMenu(): boolean {
    return this._disableDynamicMenu.value;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
