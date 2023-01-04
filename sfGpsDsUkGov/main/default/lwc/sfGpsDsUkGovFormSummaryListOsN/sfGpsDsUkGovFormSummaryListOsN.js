import { LightningElement, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";
import tmpl from "./sfGpsDsUkGovFormSummaryListOsN.html";

export default class SfGpsDsUkGovFormSummaryListOsN extends OmniscriptBaseMixin(
  LightningElement
) {
  @track _items = [];

  render() {
    return tmpl;
  }

  connectedCallback() {
    let items = this.omniJsonData[this.omniJsonDef.name];

    if (Array.isArray(items)) {
      this._items = items;
    } else {
      this._items = [];
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    let id = e.currentTarget.dataset.id;

    if (Array.isArray(this._items)) {
      for (let i = 0; i < this._items.length; i++) {
        let item = this._items[i];
        if (item.key === id && item.step) {
          super.omniNavigateTo(item.step);
          break;
        }
      }
    }
  }
}
