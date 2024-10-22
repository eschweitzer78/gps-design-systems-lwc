/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const MODE_LIST = "list";
const MODE_1COLUMN = "1 column";
const MODE_2COLUMNS = "2 columns";
const MODE_3COLUMNS = "3 columns";

const MODE_VALUES = [MODE_LIST, MODE_1COLUMN, MODE_2COLUMNS, MODE_3COLUMNS];

export default class SfGpsDsAuNswLinkList extends LightningElement {
  @api title;
  @api links;
  @api cvaUrl;
  @api cvaText;
  @api titleClassName;
  @api linkClassName;
  @api anchorClassName;
  @api iconClassName;
  @api className;

  /* api: listMode */

  _listMode = MODE_LIST;
  _listModeOriginal = MODE_LIST;

  @api get listMode() {
    return this._modeOriginal;
  }

  set listMode(value) {
    this._listModeOriginal = value;
    this._listMode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_LIST
    });
  }

  /* getters */

  get computedIsColumnMode() {
    return (
      this._listMode === MODE_1COLUMN ||
      this._listMode === MODE_2COLUMNS ||
      this._listMode === MODE_3COLUMNS
    );
  }

  get computedListClassName() {
    return computeClass({
      "qld__link-list": this._listMode === MODE_LIST,
      "qld__link-columns": this.computedIsColumnMode,
      "qld__link-columns--2-col": this._listMode === MODE_2COLUMNS,
      "qld__link-columns--3-col": this._listMode === MODE_3COLUMNS
    });
  }

  get _links() {
    return (this.links || []).map((link, index) => ({
      ...link,
      key: `link-${index + 1}`,
      linkClassName: computeClass({
        [this.linkClassName]: this.linkClassName
      }),
      anchorClassName: this.anchorClassName,
      iconClassName: link.icon
        ? computeClass({
            [link.icon]: true,
            [this.iconClassName]: this.iconClassName
          })
        : null
    }));
  }

  get computedCvaLinkClassName() {
    return computeClass({
      "qld__link-columns__all-link": true,
      [this.linkClassName]: this.linkClassName
    });
  }

  get computedCvaAnchorClassName() {
    return computeClass({
      "qld__cta-link": true,
      "qld__cta-link--view-all": true,
      [this.anchorClassName]: this.anchorClassName
    });
  }
}
