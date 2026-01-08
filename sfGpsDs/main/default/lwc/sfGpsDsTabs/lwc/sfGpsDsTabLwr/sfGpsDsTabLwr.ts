import { 
  api,
  track
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

const SHOWERRORINDICATOR_DEFAULT = false;
const TABLABEL_DEFAULT = "Tab";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsTabLwr";

export default 
class SfGpsDsTabLwr
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  vid?: string;

  // @ts-ignore
  @api 
  variaLabelledBy?: string;

  /* api: vhidden, Boolean */

  _vhidden: boolean;

  // @ts-ignore
  @api
  get vhidden() {
    return this._vhidden;
  }

  set vhidden(value) {
    this._vhidden = value;
  }

  /* api: value, Any */

  _value?: string;
  _valueOriginal?: string;

  // @ts-ignore
  @api
  get value(): string | undefined {
    return this._valueOriginal;
  }

  set value(value: string) {
    this._valueOriginal = value;
    this._value = String(value);
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: label, String */

  _label = TABLABEL_DEFAULT;

  // @ts-ignore
  @api
  get label(): string | undefined {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
    this._dispatchDataChangeEventIfConnected();
  }

  /* api: title, String */

  _title: string | undefined = undefined;
  
  // @ts-ignore
  @api
  // @ts-ignore
  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    this._dispatchDataChangeEventIfConnected();
  }

  // @ts-ignore
  @api
  showErrorIndicator?: boolean;
  _showErrorIndicator = this.defineBooleanProperty("showErrorIndicator", {
    defaultValue: SHOWERRORINDICATOR_DEFAULT,
    watcher: () => { this._dispatchDataChangeEventIfConnected(); }
  });

  /* computed */

  get computedClassName(): any {
    return {
      [this.className || ""]: !!this.className
    };
  }

  /* methods */

  // @ts-ignore
  @track 
  _loadContent: boolean = false;

  // @ts-ignore
  @api
  loadContent(): void {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> loadContent");
    }

    this._loadContent = true;
    this.dispatchEvent(new CustomEvent("active"));

    if (DEBUG) {
      console.debug(CLASS_NAME, "< loadContent");
    }
  }

  _dispatchDataChangeEventIfConnected(): void {
    if (this._isConnected) {
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

  _deregistrationCallback?: Function;

  constructor() {
    super();

    this.handleMounted(() => {
      this.dispatchEvent(
        new CustomEvent("privatetabregister", {
          cancelable: true,
          bubbles: true,
          composed: true,
          detail: {
            setDeregistrationCallback: (deregistrationCallback: Function) => {
              this._deregistrationCallback = deregistrationCallback;
            }
          }
        })
      );
    });

    this.handleUnmounted(() => {
      if (this._deregistrationCallback) {
        this._deregistrationCallback();
      }
    });
  }
}
