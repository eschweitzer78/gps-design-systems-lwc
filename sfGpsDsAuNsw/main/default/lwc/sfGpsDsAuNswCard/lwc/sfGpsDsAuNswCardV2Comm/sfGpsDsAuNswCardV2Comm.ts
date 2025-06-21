/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  DateStyle, 
  CStyle, 
  Orientation 
} from "c/sfGpsDsAuNswCardV2";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswCardV2Comm";

/**
 * @slot Card-Copy
 * @slot Card-Footer
 */
export default 
class SfGpsDsAuNswCardV2Comm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  cstyle: CStyle | "highlight" = "white";

  // @ts-ignore
  @api 
  orientation: Orientation = "vertical";

  // @ts-ignore
  @api 
  dateStyle: DateStyle = "medium";

  // @ts-ignore
  @api 
  headline?: boolean;

  // @ts-ignore
  @api 
  tag?: string;

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  preventDefault: boolean = false;

  // @ts-ignore
  @api 
  className?: string;

  // This is not exposed in Experience Builder and is used by cardCollectionComm
  // @ts-ignore
  @api 
  useMarkup: string | boolean = false;

  // @ts-ignore
  @track 
  _copySlotted : boolean = false;

  // @ts-ignore
  @track 
  _footerSlotted: boolean = false;

  // @ts-ignore
  @api 
  title = "";
  _title = this.defineMarkdownFirstLinkProperty("title", {
    errorCode: "TI-MD",
    errorText: "Issue when parsing Title markdown"
  });

  get _titleText(): string | undefined {
    return this._title.value?.text;
  }

  get _titleUrl(): string | undefined {
    return this._title.value?.url;
  }

  // @ts-ignore
  @api 
  date?: string;

  // @ts-ignore
  @api 
  copy?: string;
  _copyHtml = this.defineMarkdownContentProperty("copy", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Copy markdown"
  });

  // @ts-ignore
  @api 
  footer?: string;
  _footerHtml = this.defineMarkdownContentProperty("footer", {
    errorCode: "FO-MD",
    errorText: "Issue when parsing Footer markdown"
  });

  get highlight(): boolean {
    return this.cstyle === "highlight";
  }

  get computedCopyClassName(): string | undefined {
    return this._copySlotted 
      ? "nsw-card__copy" 
      : undefined;
  }

  get computedFooterClassName(): string | undefined{
    return this._copySlotted 
      ? "nsw-card__footer" 
      : undefined;
  }

  /* methods */

  // @ts-ignore
  @api 
  click(): void {
    if (this.refs.card) this.refs.card.click();
  }

  /* event management */

  handleSlotChange(event: Event): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSlotChange");

    const target = event.target as HTMLSlotElement
    const an = target.assignedNodes();
    let emptyNode = true;

    /* 
      Try and determine if it's an empty design node...
      very imperfect as further edits won't be detected, but at least it's good on reload 
    */

    if (an.length) {
      const el = an[0] as HTMLElement;
      if (el.tagName?.startsWith("WEBRUNTIMEDESIGN")) {
        if (el.querySelector(".actualNode")) {
          emptyNode = false;
        }
      } else {
        emptyNode = false;
      }
    }

    switch (target.name) {
      case "Card-Copy":
        this._copySlotted = !emptyNode;
        break;

      case "Card-Footer":
        this._footerSlotted = !emptyNode;
        break;

      default:
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleSlotChange");
  }

  handleNavigate(event: CustomEvent): void {
    this.dispatchEvent(new CustomEvent("navigate", { 
      detail: event.detail 
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this._copyHtml.value && this.refs.copy) {
      replaceInnerHtml(this.refs.copy, this._copyHtml.value);
    }

    if (this._footerHtml.value && this.refs.footer) {
      replaceInnerHtml(this.refs.footer, this._footerHtml.value);
    }
  }
}
