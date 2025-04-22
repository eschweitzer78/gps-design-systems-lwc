import { LightningElement, api } from "lwc";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpers";

const PREVENTDEFAULT_DEFAULT = false;

export default class SfGpsDsAuVic2Chip extends LightningElement {
  static renderMode = "light";

  @api variant = "default";
  @api items;
  @api label = "";
  @api url = "#";
  @api className;

  /* api: preventDefault */

  _preventDefault = PREVENTDEFAULT_DEFAULT;
  _preventDefaultOriginal = PREVENTDEFAULT_DEFAULT;

  @api
  get preventDefault() {
    return this._preventDefaultOriginal;
  }

  set preventDefault(value) {
    this._preventDefaultOriginal = value;
    this._preventDefault = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PREVENTDEFAULT_DEFAULT
    });
  }

  /* computed */

  get computedContainerClassName() {
    return {
      "chip-container": true,
      [this.className]: this.className
    };
  }

  get computedClassName() {
    return computeClass({
      "rpl-chip": true,
      "rpl-chip--default": this.variant === "default",
      "rpl-chip--reverse": this.variant === "reverse",
      "rpl-type-label": true,
      "rpl-u-focusable-block": true,
      "rpl-u-screen-only": true,
      [this.className]: this.className && this._items?.length > 1
    });
  }

  /* event management */

  handleClick(event) {
    const index = event.target.index;

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          value: this.items ? this.items[index].url : this.url,
          text: this.items ? this.items[index].text : this.label,
          index: index + 1
        }
      })
    );
  }
}
