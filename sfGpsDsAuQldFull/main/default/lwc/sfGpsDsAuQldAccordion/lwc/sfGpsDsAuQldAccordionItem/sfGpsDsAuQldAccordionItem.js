import { LightningElement, api, track } from "lwc";
import { normaliseBoolean, replaceInnerHtml } from "c/sfGpsDsHelpers";

const ACTIVE_DEFAULT = false;

export default class extends LightningElement {
  @api title;
  @api content; // markup content
  @api className;

  /* api: active */

  @track _active = ACTIVE_DEFAULT;
  _activeOriginal = ACTIVE_DEFAULT;

  @api
  get active() {
    return this._activeOriginal;
  }

  set active(value) {
    this._activeOriginal = value;
    this._active = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ACTIVE_DEFAULT
    });
  }

  /* api: index */

  _indexOriginal;
  _index;

  @api
  get index() {
    return this._indexOriginal;
  }

  set index(value) {
    this._indexOriginal = value;
    this._index = Number(value);
  }

  /* getters */

  get indexP1() {
    return this._index + 1;
  }

  get computedClassName() {
    return {
      qld__accordion: true,
      [this.className]: this.className
    };
  }

  get computedButtonClassName() {
    return {
      qld__accordion__title: true,
      "qld__accordion--closed": !this.active,
      "qld__accordion--open": this.active
    };
  }

  get computedBodyClassName() {
    return {
      qld__accordion__body: true,
      "qld__accordion--closed": !this.active,
      "qld__accordion--open": this.active
    };
  }

  /* event management */

  handleToggle() {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: {
          index: this._index,
          active: !this.active
        }
      })
    );
  }

  /* lifecycle */

  renderedCallback() {
    if (this.content && this.refs.wrapper) {
      replaceInnerHtml(this.refs.wrapper, this.content);
    }
  }
}
