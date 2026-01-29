/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
// @ts-ignore - LWC module import
import { LABELS } from "c/sfGpsDsCaOnLabels";

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

/**
 * Menu item interface.
 * 
 * Use either `title` for hardcoded text or `labelKey` for translated labels.
 * When `labelKey` is provided, it will look up the translated label from
 * the LABELS.Nav object (e.g., "Home" -> LABELS.Nav.Home).
 */
export interface MenuItem {
  /** Static title text (used if labelKey is not provided) */
  title?: string;
  /** Label key for dynamic translation (e.g., "Home", "About", "Services") */
  labelKey?: string;
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

  /**
   * Translates menu items using labelKey if provided.
   * Falls back to title if no labelKey or translation not found.
   */
  private translateMenuItems(items: MenuItem[]): MenuItem[] {
    return items.map(item => {
      if (item.labelKey && LABELS.Nav[item.labelKey]) {
        return {
          ...item,
          title: LABELS.Nav[item.labelKey]
        };
      }
      return item;
    });
  }

  get menuItemsJson(): string | undefined {
    if (!this.menuItems) return undefined;
    
    // If string, parse it first to check for labelKeys
    let items: MenuItem[];
    if (typeof this.menuItems === "string") {
      try {
        items = JSON.parse(this.menuItems);
      } catch {
        return this.menuItems; // Return as-is if invalid JSON
      }
    } else {
      items = this.menuItems;
    }
    
    // Translate items with labelKey
    const translatedItems = this.translateMenuItems(items);
    return JSON.stringify(translatedItems);
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

  get computedLanguage(): string {
    return this.language || "en";
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
