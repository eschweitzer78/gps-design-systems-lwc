import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import Breakpoint from "c/sfGpsDsAuVicBreakpoint";

export default class SfGpsDsAuVicFooterNavigation extends Breakpoint(
  LightningElement
) {
  _nav = []; //:array
  _originalNav;

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
        ? item.children.map((child) => ({
            ...child,
            key: `child-${index + 1}`
          }))
        : [],
      key: `nav-${index + 1}`,
      active: false,
      class: computeClass({
        "rpl-footer-nav__menu-item": true,
        "rpl-footer-nav__menu-item--parent": item.children
      })
    }));
  }

  get minimize() {
    return this.$breakpoint.l === false;
  }

  handleClick(event) {
    event.preventDefault();
    let key = event.currentTarget.dataset.key;

    this._nav = this._nav.forEach((item) => {
      item.active = item.key === key ? !item.active : false;
    });
  }

  connectedCallback() {
    this.breakpoint$connectedCallback();
  }

  disconnectedCallback() {
    this.breakpoint$disconnectedCallback();
  }

  _socialLinks;
  _originalSocialLinks;

  @api get socialLinks() {
    return this._originalSocialLinks;
  }

  set socialLinks(value) {
    this._originalSocialLinks = value;
    this._socialLinks = value;
  }

  get computedShowSocialLinks() {
    return (
      this._socialLinks &&
      this._socialLinks.children &&
      this._socialLinks.children.length
    );
  }
}
