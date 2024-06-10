import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import { htmlDecode } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsIpLwc {
  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  _rawItems;

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  @api accessibilityLabel;
  @api drag;
  @api justifyContent;
  @api navigation;
  @api navigationItemClassName;
  @api navigationClassName;
  @api paginationClassName;
  @api cstyle = "white";
  @api headline = false;
  @api orientation = "vertical";
  @api displayDate = false;
  @api dateStyle = "medium";
  @api className;

  get isEmpty() {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  get navigationNavigation() {
    return this.navigation === "navigation" || this.navigation === "pagination";
  }

  get navigationPagination() {
    return this.navigation === "pagination";
  }

  get loop() {
    return this.navigation === "loop";
  }

  mapIpData(data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    return data.map((card, index) => ({
      ...card,
      title: card.title || card.headline, // it used to be called headline in v1 and it's not in the payload in v2
      copy: card.copy ? htmlDecode(card.copy) : null,
      footer: card.footer ? htmlDecode(card.footer) : null,
      index: card.index || `card-${index + 1}`,
      cstyle: this.cstyle,
      headline: this.headline,
      orientation: this.orientation,
      dateStyle: this.dateStyle,
      date: this.displayDate ? card.date : null
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
