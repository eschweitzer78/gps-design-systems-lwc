import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswTabLwr extends LightningElement {
  static renderMode = "light";

  @api iconName;
  @api className;
  @api vid;
  @api variaLabelledBy;

  /* api: vhidden */

  _vhidden;

  @api
  get vhidden() {
    return this._vhidden;
  }

  set vhidden(value) {
    this._vhidden = value;
    this.setAttribute("data-vhidden", value);
  }

  /* api: value */

  @api
  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = String(newValue);
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: label */

  @api
  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value;
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: title */

  @api
  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: showErrorIndicator */

  @api
  get showErrorIndicator() {
    return this._showErrorIndicator;
  }

  set showErrorIndicator(value) {
    this._showErrorIndicator = value;
    this._dispatchDataChangeEventIfConnected();
  }

  /* tracked */

  @track _loadContent = false;

  /* computed */

  get computedClassName() {
    return computeClass({
      "sfgpsdsauvic2-tab__content": true,
      [this.className]: this.className
    });
  }

  /* methods */

  @api
  loadContent() {
    this._loadContent = true;
    this.dispatchEvent(new CustomEvent("active"));
  }

  _dispatchDataChangeEventIfConnected() {
    if (this._connected) {
      this.dispatchEvent(
        new CustomEvent("privatetabdatachange", {
          cancelable: true,
          bubbles: true,
          composed: true
        })
      );
    }
  }

  /* lifecycle */

  _connected = false;
  _deregistrationCallback;

  connectedCallback() {
    this._connected = true;

    this.dispatchEvent(
      new CustomEvent("privatetabregister", {
        cancelable: true,
        bubbles: true,
        composed: true,
        detail: {
          setDeregistrationCallback: (deregistrationCallback) => {
            this._deregistrationCallback = deregistrationCallback;
          }
        }
      })
    );
  }

  disconnectedCallback() {
    this._connected = false;

    if (this._deregistrationCallback) {
      this._deregistrationCallback();
    }
  }
}
