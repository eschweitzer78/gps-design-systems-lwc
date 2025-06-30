import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const HASSIDEBAR_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2CardGridLwr";

/**
 * @slot Grid-Content
 */
export default 
class SfGpsDsAuVic2CardGridLwr
extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  hasSidebar?: boolean;
  _hasSidebar = this.defineBooleanProperty("hasSidebar", {
    defaultValue: HASSIDEBAR_DEFAULT,
    watcher: (_propertyName, newValue, previousValue) => {
      if (previousValue && !newValue)
        this.classList.remove("rpl-layout-card-grid--has-sidebar");
      else if (!previousValue && newValue)
        this.classList.add("rpl-layout-card-grid--has-sidebar");
    }
  });

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
    super(true); // isLwrOnly
  }

  connectedCallback() {
    super.connectedCallback?.();

    this.classList.add("rpl-layout-card-grid");
  }
}
