import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsNavigation {
  @api className;

  /* api: mode, String */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;
  }

  /* api: navigationDevName, String */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName, String */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON, String */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* api: title and link, String */

  _titleLink; // combined link into title
  _titleLinkOriginal;

  @api
  get titleLink() {
    return this._titleLinkOriginal;
  }

  set titleLink(markdown) {
    try {
      this._titleLinkOriginal = markdown;
      this._titleLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Title Link markdown");
    }
  }

  get _title() {
    return this._titleLink?.text;
  }

  get _url() {
    return this._titleLink?.url;
  }

  /* event management */

  handleNavigate(event) {
    if (this._map && event.detail) {
      this.refs.navsvc.navigateNavMenu(this._map[event.detail]);
    }
  }
  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
