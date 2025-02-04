import { api, track } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsNavigation {
  @api className;

  /* api: mode */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;
  }

  /* api: navigationDevName */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* api: title and link */

  @track _titleLink; // combined link into title
  _titleLinkOriginal;

  @api
  get titleLink() {
    return this._titleLinkOriginal;
  }

  set titleLink(markdown) {
    this._titleLinkOriginal = markdown;

    try {
      this._titleLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Title Link markdown");
    }
  }

  get computedTitle() {
    return this._titleLink?.text;
  }

  get computedUrl() {
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
    this.classList.add("qld-scope");
  }
}
