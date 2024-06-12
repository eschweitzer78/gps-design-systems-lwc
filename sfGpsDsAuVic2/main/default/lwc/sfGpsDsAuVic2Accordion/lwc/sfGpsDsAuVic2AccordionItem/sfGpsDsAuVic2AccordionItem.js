import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api title;
  @api active;

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

  get inactive() {
    return !this.active;
  }

  get indexP1() {
    return this._index + 1;
  }

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
}
