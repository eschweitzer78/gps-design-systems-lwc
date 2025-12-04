/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  appendStartUrlToTargetUrl,
  getStartUrlFromCurrentUrl
} from "c/sfGpsDsAuthUtils";
import getLoginUrl from "@salesforce/apex/system.Network.getLoginUrl";

import sfGpsDsAuthCheckPasswordBackToLoginButtonLabel from "@salesforce/label/c.sfGpsDsAuthCheckPasswordBackToLoginButtonLabel";

const I18N = {
  backToLoginButtonLabel: sfGpsDsAuthCheckPasswordBackToLoginButtonLabel
};

export default class extends SfGpsDsLwc {
  loginUrl;
  targetLoginUrl;

  get i18n() {
    return I18N;
  }

  get _cantBeUsedAsIsErrors() {
    return [
      {
        index: 1,
        code: "AUT-CBUA",
        description: "This component cannot be used as is."
      }
    ];
  }

  async connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this.loginUrl = await getLoginUrl();
    this.targetLoginUrl = appendStartUrlToTargetUrl(
      this.loginUrl,
      getStartUrlFromCurrentUrl()
    );
  }
}
