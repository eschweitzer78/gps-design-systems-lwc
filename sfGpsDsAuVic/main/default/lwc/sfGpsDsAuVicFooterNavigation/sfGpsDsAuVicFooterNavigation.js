import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import BreakpointMixin from "c/sfGpsDsAuVicBreakpointMixin";
import Masonry from "./masonry";

export default class SfGpsDsAuVicFooterNavigation extends BreakpointMixin(
  LightningElement
) {
  static renderMode = "light";

  @track _nav = []; //:array
  _originalNav;
  _performLayout;

  @api get nav() {
    return this._originalNav;
  }

  set nav(value) {
    this._originalNav = value;

    if (!Array.isArray(value) || value == null) {
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
      class: computeClass({
        "rpl-footer-nav__menu-item": true,
        "rpl-footer-nav__menu-item--parent": item.children
      })
    }));

    this._performLayout = true;
  }

  @track _socialActive = false;
  @api socialLinks;

  get minimize() {
    return this.$breakpoint.l === false;
  }

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

  disconnectedCallback() {
    this.breakpointDisconnectedCallback();
  }

  connectedCallback() {
    this.breakpointConnectedCallback();
  }

  renderedCallback() {
    this.handleMinimize(this.minimize);
  }

  get computedShowSocialLinks() {
    return (
      this.socialLinks &&
      this.socialLinks.children &&
      this.socialLinks.children.length > 0
    );
  }

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
}
