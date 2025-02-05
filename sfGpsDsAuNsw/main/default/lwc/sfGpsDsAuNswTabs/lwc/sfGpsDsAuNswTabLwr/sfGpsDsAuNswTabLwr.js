import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const SHOWERRORINDICATOR_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api className;
  @api vid;
  @api variaLabelledBy;
  @api vhidden;

  /* api: value, Any */

  _value;
  _valueOriginal;

  @api
  get value() {
    return this._valueOriginal;
  }

  set value(value) {
    this._valueOriginal = value;
    this._value = String(value);
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: label, String */

  @api
  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value;
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: title, String */

  @api
  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: showErrorIndicator, Boolean */

  _showErrorIndicator = SHOWERRORINDICATOR_DEFAULT;
  _showErrorIndicatorOriginal = SHOWERRORINDICATOR_DEFAULT;

  @api
  get showErrorIndicator() {
    return this._showErrorIndicatorOriginal;
  }

  set showErrorIndicator(value) {
    this._showErrorIndicatorOriginal = value;
    this._showErrorIndicator = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWERRORINDICATOR_DEFAULT
    });

    this._dispatchDataChangeEventIfConnected();
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-tabs__content": true,
      [this.className]: this.className
    };
  }

  /* methods */

  _loadContent = false;

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
