import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswTabLwr extends LightningElement {
  static renderMode = "light";

  @api iconName;
  @api className;
  @api vid;
  @api variaLabelledBy;
  @api vhidden;

  @track _loadContent = false;

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

  @api
  loadContent() {
    this._loadContent = true;
    this.dispatchEvent(new CustomEvent("active"));
  }

  @api
  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = String(newValue);
    this._dispatchDataChangeEventIfConnected();
  }

  @api
  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value;
    this._dispatchDataChangeEventIfConnected();
  }

  @api
  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    this._dispatchDataChangeEventIfConnected();
  }

  @api
  get showErrorIndicator() {
    return this._showErrorIndicator;
  }

  set showErrorIndicator(value) {
    this._showErrorIndicator = value;
    this._dispatchDataChangeEventIfConnected();
  }

  get computedClassName() {
    return computeClass({
      "nsw-tabs__content": true,
      [this.className]: this.className
    });
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
}
