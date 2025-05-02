import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const SCROLL_THRESHOLD = 750;

export default class extends SfGpsDsLwc {
  @api label;
  @api className;

  @track scrollY = 0;

  /* computed */

  get computedClassName() {
    return {
      qld__btn: true,
      "qld__btn--floating": true,
      "qld__btn--back-to-top": true,
      "qld__btn--back-to-top--hidden": this.computedIsHidden,
      [this.className]: this.className
    };
  }

  get computedIsHidden() {
    return this.scrollY <= SCROLL_THRESHOLD;
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  handleScroll() {
    const rootElement = this.refs.containerRef;

    if (rootElement) {
      this.scrollY = window.scrollY || window.pageYOffset;
    }
  }

  /* lifecycle */

  _handleScroll;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");

    this._handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this._handleScroll);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._handleScroll);
  }
}
