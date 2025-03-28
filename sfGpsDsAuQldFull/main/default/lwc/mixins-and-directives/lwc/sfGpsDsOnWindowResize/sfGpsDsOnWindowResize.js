import { debounce } from "c/sfGpsDsHelpers";

const WINDOW_RESIZE = Symbol("_sfGpsDsOnWindowResize");

export default class {
  /* bind must be called in the connectedCallback method */

  bind(handler) {
    this[WINDOW_RESIZE] = {
      handler: debounce((e) => {
        handler(e);
      }, 250)
    };

    window.addEventListener("resize", this[WINDOW_RESIZE].handler, false);
  }

  /* unbind must be called in the disconnectedCallback method */

  unbind() {
    if (this[WINDOW_RESIZE]) {
      window.removeEventListener("resize", this[WINDOW_RESIZE].handler, false);

      delete this[WINDOW_RESIZE];
    }

    if (super.disconnectedCallback) {
      super.connectedCallback();
    }
  }
}
