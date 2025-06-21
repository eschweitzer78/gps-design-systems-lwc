/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import { 
  isArray 
} from "c/sfGpsDsHelpers";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  CStyle, 
  CStyleValue 
} from "c/sfGpsDsAuNswHeroBanner";
import type { 
  Link 
} from "c/sfGpsDsMarkdown";
import type { 
  BannerImage 
} from "c/sfGpsDsAuNswHeroBanner";


type CStyleValues = Record<CStyle, CStyleValue>;

interface DisplayLink {
  index: string,
  text?: string,
  url?: string
}

const CSTYLE_VALUES: CStyleValues = {
  dark: {
    main: "nsw-hero-banner--dark",
    button: "nsw-button--white"
  },
  light: {
    main: "nsw-hero-banner--light",
    button: "nsw-button--dark"
  },
  "off-white": {
    main: "nsw-hero-banner--off-white",
    button: "nsw-button--dark"
  },
  white: {
    main: "nsw-hero-banner--white",
    button: "nsw-button--dark"
  }
};
const CSTYLE_DEFAULT: CStyle = "dark";

const CTAPREVENTDEFAULT_DEFAULT = false;
const LINKSPREVENTDEFAULT_DEFAULT = false;
const WIDE_DEFAULT = false;
const FEATURED_DEFAULT = false;
const LINES_DEFAULT = false;
const DISPLAYLINKS_DEFAULT: DisplayLink[] = [];
const LINKS_DEFAULT: Link[] = [];

export default 
class SfGpsDsAuNswHeroBanner
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  subtitle?: string;

  // @ts-ignore
  @api 
  cta?: string;

  // @ts-ignore
  @api 
  image?: BannerImage;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  cstyle?: CStyle;
  _cstyle = this.defineEnumObjectProperty<CStyleValue, CStyle>("cstyle", {
      validValues: CSTYLE_VALUES,
      defaultValue: CSTYLE_DEFAULT
  });

  // @ts-ignore
  @api
  wide?: boolean;
  _wide = this.defineBooleanProperty("wide", {
    defaultValue: WIDE_DEFAULT
  });

  // @ts-ignore
  @api
  featured?: boolean;
  _featured = this.defineBooleanProperty("featured", {
    defaultValue: FEATURED_DEFAULT
  });

  // @ts-ignore
  @api
  lines?: boolean;
  _lines = this.defineBooleanProperty("lines", {
    defaultValue: LINES_DEFAULT
  });

  // @ts-ignore
  @api
  ctaPreventDefault?: boolean;
  _ctaPreventDefault = this.defineBooleanProperty("ctaPreventDefault", {
    defaultValue: CTAPREVENTDEFAULT_DEFAULT
  });

  // @ts-ignore
  @api
  linksPreventDefault?: boolean;
  _linksPreventDefault = this.defineBooleanProperty("linksPreventDefault", {
    defaultValue: LINKSPREVENTDEFAULT_DEFAULT
  });

  /* api: links */

  _links: DisplayLink[] = DISPLAYLINKS_DEFAULT;
  _linksOriginal: Link[] = LINKS_DEFAULT;

  // @ts-ignore
  @api
  get links(): Link[] {
    return this._linksOriginal;
  }

  set links(value: Link[]) {
    this._linksOriginal = value;
    this._links = isArray(value)
      ? value.map((link, index) => ({
          text: link.text,
          url: link.url,
          index: link.index ? `link-ori-${link.index}` : `link-${index + 1}`
        }))
      : DISPLAYLINKS_DEFAULT;
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-hero-banner": true,
      "nsw-hero-banner--wide": this._wide.value,
      "nsw-hero-banner--featured": this._featured.value,
      "nsw-hero-banner--lines": this._lines.value,
      [this._cstyle.value.main]: !!this._cstyle.value.main,
      [this.className || ""]: !!this.className
    };
  }

  get computedButtonClassName(): any {
    return {
      "nsw-button": true,
      [this._cstyle.value.button]: !!this._cstyle.value.button
    };
  }

  get computedHasLinks(): boolean {
    return this._links?.length > 1;
  }

  /* event management */

  handleCtaClick(
    event: MouseEvent
  ): void {
    if (this._ctaPreventDefault.value) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navclick", { 
        detail: (event.target as HTMLAnchorElement).href 
      })
    );
  }

  handleLinksClick(
    event: MouseEvent
  ): void {
    if (this._linksPreventDefault.value) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navclick", { 
        detail: (event.target as HTMLAnchorElement).href 
      })
    );
  }
}
