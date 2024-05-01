// Based on RplPrimaryNavSearchForm v2.6.2

import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api showQuickExit;

  // added to standard
  @api value;

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    /* This behaves quite differently from the original, which redirected automatically.
       We instead to dispatch an application specific message for the primary nav to deal with. */

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = event.value;
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: {
          value: event.value
        },
        composed: true,
        bubbles: true
      })
    );
  }

  _isRendered;

  renderedCallback() {
    /*
    if (!this._isRendered) {
      this._isRendered = true;

      this.refs.searchbar.focus();
    }*/
  }
}
