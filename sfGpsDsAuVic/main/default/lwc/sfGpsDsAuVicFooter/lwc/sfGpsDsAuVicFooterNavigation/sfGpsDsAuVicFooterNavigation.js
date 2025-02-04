import { LightningElement, api, track } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";
import BreakpointMixin from "c/sfGpsDsAuVicBreakpointMixin";
import Masonry from "./masonry";

export default class extends BreakpointMixin(LightningElement) {
  static renderMode = "light";

  @api socialLinks;
  _socialActive = false;

  /* api: nav */

  @track _nav = []; //:array
  _navOriginal;
  _performLayout;

  @api
  get nav() {
    return this._navOriginal;
  }

  set nav(value) {
    this._navOriginal = value;

    if (!isArray(value) || value == null) {
      this._nav = [];
      return;
    }

    this._nav = value.map((item, index) => ({
      ...item,
      children: item.children
        ? item.children.map((child, cIndex) => ({
            ...child,
            key: `nav-${index + 1}-${cIndex + 1}`
          }))
        : [],
      key: `nav-${index + 1}`,
      active: false,
      class: {
        "rpl-footer-nav__menu-item": true,
        "rpl-footer-nav__menu-item--parent": item.children
      }
    }));

    this._performLayout = true;
  }

  /* computed */

  get computedMinimize() {
    return this.$breakpoint.l === false;
  }

  get computedShowSocialLinks() {
    return (
      this.socialLinks &&
      this.socialLinks.children &&
      this.socialLinks.children.length > 0
    );
  }

  /* methods */

  _msnry = null;

  handleMinimize(val) {
    if (val === true) {
      if (this._msnry !== null) {
        this._msnry.destroy();
        this._msnry = null;
      }
    } else {
      if (this._msnry === null || this._performLayout) {
        if (this._msnry) this._msnry.destroy();
        this._msnry = new Masonry(".rpl-footer-nav", {
          itemSelector: ".rpl-footer-nav__menu-item",
          gutter: 24,
          transitionDuration: 0,
          root: this
        });

        this._performLayout = false;
      }
    }
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();
    let key = event.currentTarget.dataset.key;

    this._nav = this._nav.map((item) => ({
      ...item,
      active: item.key === key ? !item.active : false
    }));
  }

  handleSocialToggle() {
    this._socialActive = !this._socialActive;
  }

  /* lifecycle */

  disconnectedCallback() {
    this.breakpointDisconnectedCallback();
  }

  connectedCallback() {
    this.breakpointConnectedCallback();
  }

  renderedCallback() {
    this.handleMinimize(this.minimize);
  }
}
