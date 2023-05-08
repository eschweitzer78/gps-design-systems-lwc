import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuQldFooterComm extends SfGpsDsNavigation {
  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* api: column1Content */

  _column1ContentOriginal;
  _column1ContentHtml;

  @api get column1Content() {
    return this._column1ContentOriginal;
  }

  set column1Content(markdown) {
    this._column1ContentOriginal = markdown;

    try {
      this._column1ContentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* api: column2Content */

  _column2ContentOriginal;
  _column2ContentHtml;

  @api get column2Content() {
    return this._column2ContentOriginal;
  }

  set column2Content(markdown) {
    this._column2ContentOriginal = markdown;

    try {
      this._column2ContentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* api: column3Content */

  _column3ContentOriginal;
  _column3ContentHtml;

  @api get column3Content() {
    return this._column3ContentOriginal;
  }

  set column3Content(markdown) {
    this._column3ContentOriginal = markdown;

    try {
      this._column3ContentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  @api copyrightMention;
  @api className;

  get _numberColumns() {
    if (this.column3Content) {
      return 3;
    }

    if (this.column2Content) {
      return 2;
    }

    return this.column1Content ? 1 : 0;
  }

  // events

  handleClick(event) {
    console.log("> handleClick", event, event.detail);
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
    console.log("< handleClick");
  }

  // lifecycle

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }

  renderedCallback() {
    if (this.column1Content) {
      let element = this.template.querySelector(".sf-gps-ds-content-1");
      if (element) {
        replaceInnerHtml(element, this._column1ContentHtml);
      }
    }

    if (this.column2Content) {
      let element = this.template.querySelector(".sf-gps-ds-content-2");
      if (element) {
        replaceInnerHtml(element, this._column2ContentHtml);
      }
    }

    if (this.column3Content) {
      let element = this.template.querySelector(".sf-gps-ds-content-3");
      if (element) {
        replaceInnerHtml(element, this._column3ContentHtml);
      }
    }
  }
}
