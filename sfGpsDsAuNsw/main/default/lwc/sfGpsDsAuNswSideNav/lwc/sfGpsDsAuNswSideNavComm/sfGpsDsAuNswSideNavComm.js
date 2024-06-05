import { api, track } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswSideNavComm extends SfGpsDsNavigation {
  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;
  }

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

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

  /*
   * title and link
   */

  @track _titleLink; // combined link into title
  _originalTitleLink;

  @api get titleLink() {
    return this._originalTitleLink;
  }

  set titleLink(markdown) {
    this._originalTitleLink = markdown;

    try {
      this._titleLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Title Link markdown");
    }
  }

  //

  @api className;

  get _title() {
    return this._titleLink?.text;
  }

  get _url() {
    return this._titleLink?.url;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  /* events */

  handleNavigate(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }
}
