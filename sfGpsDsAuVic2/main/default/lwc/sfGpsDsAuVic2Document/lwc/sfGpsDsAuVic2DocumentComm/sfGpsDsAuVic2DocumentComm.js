import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

/**
 * @slot Icon
 * @slot Info
 * @slot Caption
 */
export default class extends SfGpsDsLwc {
  @api iconSlot = false;
  @api icon;
  @api className;

  /* api: name, string in link markdown format */

  _name = {};
  _nameOriginal;

  @api
  get name() {
    return this._nameOriginal;
  }

  set name(markdown) {
    try {
      this._nameOriginal = markdown;
      this._name = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._name = {};
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
