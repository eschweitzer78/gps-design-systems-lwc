import { LightningElement, api } from "lwc";
import { computeClass, replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api content;
  @api variant;

  /* api: className */

  _className;

  @api
  get className() {
    return this._className;
  }

  set className(value) {
    this.removeClasses(this._className);
    this._className = value;
    this.addClasses(this._className);
  }

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-callout": true,
      "rpl-callout--neutral": this.variant === "neutral"
    });
  }

  /* methods */

  removeClasses(value) {
    try {
      if (value) {
        this.classList.remove(...value.split(" "));
      }
    } catch (e) {
      console.debug(e);
    }
  }

  addClasses(value) {
    try {
      if (value) {
        this.classList.add(...value.split(" "));
      }
    } catch (e) {
      console.debug(e);
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this.refs?.content) {
      replaceInnerHtml(
        this.refs.content,
        (this.title ? `<h3>${this.title}</h3>` : "") + (this.content || "")
      );
    }
  }
}
