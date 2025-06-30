import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const FULLWIDTH_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2PageComponentLwr";

/**
 * @slot Component
 */
export default 
class SfGpsDsAuVic2PageComponentLwr 
extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "";

  /* api: cid */

  _cid?: string;

  // @ts-ignore
  @api
  get cid(): string | undefined {
    return this._cid;
  }

  set cid(value) {
    this._cid = value;
  
    if (value)
      this.id = value;
  }

  // @ts-ignore
  @api
  fullWidth?: boolean;
  _fullWidth = this.defineBooleanProperty("fullWidth", {
    defaultValue: FULLWIDTH_DEFAULT,
    watcher: () => {
      if (this._fullWidth.value) {
        this.classList.add("rpl-page-component--full-width");
      } else {
        this.classList.remove("rpl-page-component--full-width");
      }
    }
  });

  /* api: className */

  // @ts-ignore
  @api
  className?: string;
  _className = this.defineStringProperty("className", {
    // eslint-disable-next-line no-unused-vars
    watcher: (_propertyName, newValue, oldValue) => {
      if (DEBUG)
        console.debug(CLASS_NAME, "> set className", newValue, oldValue);

      if (oldValue) this.classList.remove(...oldValue.split(" "));
      if (newValue) this.classList.add(...newValue.split(" "));

      if (DEBUG) console.debug(CLASS_NAME, "< set className", this._className.value);

    }
  });

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly;
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("rpl-page-component");
  }
}
