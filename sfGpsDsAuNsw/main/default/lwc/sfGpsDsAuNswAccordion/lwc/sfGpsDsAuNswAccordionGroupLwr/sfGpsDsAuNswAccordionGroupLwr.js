import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Accordion1
 * @slot Accordion2
 * @slot Accordion3
 * @slot Accordion4
 * @slot Accordion5
 * @slot Accordion6
 * @slot Accordion7
 * @slot Accordion8
 * @slot Accordion9
 * @slot Accordion10
 * @slot Accordion11
 * @slot Accordion12
 */
export default class extends SfGpsDsLwc {
  @track items = [
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true }
  ];

  _numberOpen = this.items.filter((item) => !item.closed).length;

  @api firstChild;
  @api showButtons;
  @api className;

  /* api: item1title */

  @api
  get item1title() {
    return this.items[0].title;
  }

  set item1title(value) {
    this.items[0].title = value;
  }

  get item1closed() {
    return this.items[0].closed;
  }

  /* api: item2title */

  @api
  get item2title() {
    return this.items[1].title;
  }

  set item2title(value) {
    this.items[1].title = value;
  }

  get item2closed() {
    return this.items[1].closed;
  }

  /* api: item3title */

  @api
  get item3title() {
    return this.items[2].title;
  }

  set item3title(value) {
    this.items[2].title = value;
  }

  get item3closed() {
    return this.items[2].closed;
  }

  /* api: item4title */

  @api
  get item4title() {
    return this.items[3].title;
  }

  set item4title(value) {
    this.items[3].title = value;
  }

  get item4closed() {
    return this.items[3].closed;
  }

  /* api: item5title */

  @api
  get item5title() {
    return this.items[4].title;
  }

  set item5title(value) {
    this.items[4].title = value;
  }

  get item5closed() {
    return this.items[4].closed;
  }

  /* api: item6title */

  @api
  get item6title() {
    return this.items[5].title;
  }

  set item6title(value) {
    this.items[5].title = value;
  }

  get item6closed() {
    return this.items[5].closed;
  }

  /* api: item7title */

  @api
  get item7title() {
    return this.items[6].title;
  }

  set item7title(value) {
    this.items[6].title = value;
  }

  get item7closed() {
    return this.items[6].closed;
  }

  /* api: item8title */

  @api
  get item8title() {
    return this.items[7].title;
  }

  set item8title(value) {
    this.items[7].title = value;
  }

  get item8closed() {
    return this.items[7].closed;
  }

  /* api: item9title */

  @api
  get item9title() {
    return this.items[8].title;
  }

  set item9title(value) {
    this.items[8].title = value;
  }

  get item9closed() {
    return this.items[8].closed;
  }

  /* api: item10title */

  @api
  get item10title() {
    return this.items[9].title;
  }

  set item10title(value) {
    this.items[9].title = value;
  }

  get item10closed() {
    return this.items[9].closed;
  }

  /* api: item11title */

  @api
  get item11title() {
    return this.items[10].title;
  }

  set item11title(value) {
    this.items[10].title = value;
  }

  get item11closed() {
    return this.items[10].closed;
  }

  /* api: item12title */

  @api
  get item12title() {
    return this.items[11].title;
  }

  set item12title(value) {
    this.items[11].title = value;
  }

  get item12closed() {
    return this.items[11].closed;
  }

  /* computed */

  get computedIsFullyExpanded() {
    return this.items.filter((item) => item.closed).length === 0;
  }

  get computedIsFullyCollapsed() {
    return this._numberOpen === 0;
  }

  get computedClassName() {
    return {
      "nsw-accordion": true,
      ready: true,
      [this.className]: this.className
    };
  }

  /* event management */

  handleExpand(event) {
    this.items[Number(event.target.index)].closed = false;
    this._numberOpen++;
  }

  handleCollapse(event) {
    this.items[Number(event.target.index)].closed = true;
    this._numberOpen--;
  }

  handleExpandAll() {
    this._numberOpen = this.items.length;
    this.items.forEach((item) => (item.closed = false));
  }

  handleCollapseAll() {
    this._numberOpen = 0;
    this.items.forEach((item) => (item.closed = true));
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
