/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

/**
 * @slot copy
 * @slot footer
 */
export default class extends SfGpsDsLwc {
  @api type;
  @api icon;
  @api iconAlign;
  @api headingLevel;
  @api thumbnail;
  @api displayArrow;
  @api displayFooter;
  @api className;

  /* api: nameLink */

  _nameLink;
  _nameLinkOriginal;

  @api get nameLink() {
    return this._nameLinkOriginal;
  }

  set nameLink(markdown) {
    this._nameLinkOriginal = markdown;

    try {
      this._nameLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name link markdown");
    }
  }

  get computedNameLinkText() {
    return this._nameLink?.text;
  }

  get computedNameLinkUrl() {
    return this._nameLink?.url;
  }

  /* api: copy */

  _copyOriginal;
  _copyHtml;

  @api get copy() {
    return this._copyOriginal;
  }

  set copy(markdown) {
    this._copyOriginal = markdown;
    try {
      if (markdown) {
        this._copyHtml = mdEngine.renderEscaped(markdown);
      } else {
        this._copyHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Copy markdown");
    }
  }

  /* api: footer */

  _footerOriginal;
  _footerHtml;

  @api get footer() {
    return this._footerOriginal;
  }

  set footer(markdown) {
    this._footerOriginal = markdown;
    try {
      if (markdown) {
        this._footerHtml = mdEngine.renderEscaped(markdown);
      } else {
        this._footerHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Footer markdown");
    }
  }

  /*
   * tags
   */

  _tags;
  _tagsOriginal;

  @api get tags() {
    return this._tagsOriginal;
  }

  set tags(markdown) {
    this._tagsOriginal = markdown;

    try {
      if (markdown) {
        this._tags = mdEngine.extractLinks(markdown);
      } else {
        this._tags = null;
      }
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Tags markdown");
    }
  }

  /* api: actions */

  _actionsOriginal;
  _actions;

  @api get actions() {
    return this._actionsOriginal;
  }

  set actions(value) {
    this._actionsOriginal = value;

    if (typeof value === "string" && value) {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) {
          value = [value];
        }
      } catch (e) {
        value = [];
        this.addError(
          "JS-LI",
          "The actions attribute must be in JSON array format of text, url and icon."
        );
      }
    } else {
      value = [];
    }

    this._actions = value;
  }

  /* lifecycle */

  renderedCallback() {
    const copy = this.refs.copy;
    const footer = this.refs.footer;

    if (copy && this._copyHtml) {
      replaceInnerHtml(copy, this._copyHtml);
    }

    if (footer && this._footerHtml) {
      replaceInnerHtml(footer, this._footerHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
