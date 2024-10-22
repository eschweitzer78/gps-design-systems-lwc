import { api } from "lwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

/**
 * @slot mobileBreadcrumbs
 * @slot desktopBreadcrumbs
 * @slot abstract
 */
export default class extends SfGpsDsLwc {
  @api mode;
  @api cstyle;
  @api title;
  @api image;
  @api className;

  /* api: items */

  _items;
  _itemsArray = [];

  @api set breadcrumbsItems(markdown) {
    this._items = markdown;
    try {
      this._itemsArray = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  get breadcrumbsItems() {
    return this._items;
  }

  /* api: abstract */

  _abstractOriginal;
  _abstractHtml;

  @api get abstract() {
    return this._abstractOriginal;
  }

  set abstract(markdown) {
    this._abstractOriginal = markdown;
    try {
      if (markdown) {
        this._abstractHtml = mdEngine.renderEscaped(markdown);
      } else {
        this._abstractHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Abstract markdown");
    }
  }

  /* api: primaryAction */

  _primaryAction;
  _primaryActionOriginal;

  @api get primaryAction() {
    return this._primaryActionOriginal;
  }

  set primaryAction(markdown) {
    this._primaryActionOriginal = markdown;

    try {
      this._primaryAction = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Primary Action markdown");
    }
  }

  /*
   * api: secondaryAction
   */

  _secondaryAction;
  _secondaryActionOriginal;

  @api get secondaryAction() {
    return this._secondaryActionOriginal;
  }

  set secondaryAction(markdown) {
    this._secondaryActionOriginal = markdown;

    try {
      this._secondaryAction = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Secondary Action markdown");
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this.refs.abstract) {
      replaceInnerHtml(this.refs.abstract, this._abstractHtml);
    }
  }
}
