import { LightningElement, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";
import { isArray } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovFormSummaryListOsN.html";

export default class extends OmniscriptBaseMixin(LightningElement) {
  @track _items = [];

  /* event management */

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    let id = event.currentTarget.dataset.id;

    if (isArray(this._items)) {
      for (let i = 0; i < this._items.length; i++) {
        let item = this._items[i];
        if (item.key === id && item.step) {
          super.omniNavigateTo(item.step);
          break;
        }
      }
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    let items = this.omniJsonData[this.omniJsonDef.name];

    if (isArray(items)) {
      this._items = items;
    } else {
      this._items = [];
    }
  }
}
