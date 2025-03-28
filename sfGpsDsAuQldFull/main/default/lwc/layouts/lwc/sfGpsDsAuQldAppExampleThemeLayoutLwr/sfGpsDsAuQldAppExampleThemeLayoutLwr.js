import { LightningElement } from "lwc";
import { debounce } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  /* lifecycle */

  _observer;

  connectedCallback() {
    // Post a message about document resizing, but up to 1x per 500ms

    this._observer = new ResizeObserver(
      debounce(() => {
        // eslint-disable-next-line no-restricted-globals
        parent.postMessage("sfgpsds-auqld-resize");
      }, 500)
    );

    this._observer.observe(document.body);
  }

  disconnectedCallback() {
    this._observer?.disconnect();
  }
}
