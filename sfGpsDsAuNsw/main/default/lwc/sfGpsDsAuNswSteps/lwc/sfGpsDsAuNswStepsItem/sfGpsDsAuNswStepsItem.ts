import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";

import type { 
  HeadingLevel 
} from "c/sfGpsDsAuNswStepsItem";

const HEADINGLEVEL_DEFAULT = 2;
const FILLED_DEFAULT = false;

export default 
class SfGpsDsAuNswStepsItem
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  content?: string;

  // @ts-ignore
  @api 
  className?: string;

  
  // @ts-ignore
  @api 
  headingLevel?: HeadingLevel;
  _headingLevel = this.defineIntegerProperty<HeadingLevel>("headingLevel", {
    minValue: 2,
    maxValue: 4,
    defaultValue: HEADINGLEVEL_DEFAULT
  });

  // @ts-ignore
  @api 
  filled?: boolean;
  _filled = this.defineBooleanProperty("filled", {
    defaultValue: FILLED_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-steps__item": true,
      "nsw-steps__item--fill": this._filled.value,
      [this.className || ""]: !!this.className
    }
  }

  get _isH3(): boolean {
    return this._headingLevel.value === 3;
  }

  get _isH4(): boolean {
    return this._headingLevel.value === 4;
  }

  /* lifecycle */

  renderedCallback() {
    super.renderedCallback?.();

    if (this.refs.content) {
      replaceInnerHtml(this.refs.content, this.content || "");
    }
  }
}
