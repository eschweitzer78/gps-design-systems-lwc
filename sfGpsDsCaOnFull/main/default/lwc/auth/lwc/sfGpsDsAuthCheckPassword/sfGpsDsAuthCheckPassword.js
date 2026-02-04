/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  appendStartUrlToTargetUrl,
  getStartUrlFromCurrentUrl
} from "c/sfGpsDsAuthUtils";
import getLoginUrl from "@salesforce/apex/system.Network.getLoginUrl";
import getAuthConfig from "@salesforce/apex/sfGpsDsCommunitiesController.getAuthConfig";

import sfGpsDsAuthAuthConfigErrorTitle from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorTitle";
import sfGpsDsAuthAuthConfigErrorLabel from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorLabel";
import sfGpsDsAuthCheckPasswordBackToLoginButtonLabel from "@salesforce/label/c.sfGpsDsAuthCheckPasswordBackToLoginButtonLabel";

const I18N = {
  authConfigErrorTitle: sfGpsDsAuthAuthConfigErrorTitle,
  authConfigErrorLabel: sfGpsDsAuthAuthConfigErrorLabel,

  backToLoginButtonLabel: sfGpsDsAuthCheckPasswordBackToLoginButtonLabel
};

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuthCheckPassword";

export default class extends SfGpsDsLwc {
  loginUrl;
  isAuthConfigLoading = true;

  @track authConfig = {};

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

  get computedHasAuthConfigIssue() {
    return (
      Object.keys(this.authConfig).length === 0 && !this.isAuthConfigLoading
    );
  }

  get targetLoginUrl() {
    const loginUrl = this.loginUrl || this.authConfig?.loginUrl1;
    return loginUrl
      ? appendStartUrlToTargetUrl(loginUrl, getStartUrlFromCurrentUrl())
      : null;
  }

  /* methods */

  constructor() {
    super();

    if (DEBUG) {
      console.debug(CLASS_NAME, "> constructor");
    }

    getAuthConfig()
      .then((data) => this.handleAuthConfig(data, null))
      .catch((error) => this.handleAuthConfig(null, error));

    if (DEBUG) {
      console.debug(CLASS_NAME, "< constructor");
    }
  }

  handleAuthConfig(data, error) {
    if (data) {
      if (DEBUG) {
        console.debug(
          CLASS_NAME,
          "handleAuthConfig data",
          JSON.stringify(data)
        );
      }

      this.authConfig = data;
      this.isAuthConfigLoading = false;
    }

    if (error) {
      if (DEBUG) {
        console.debug(
          CLASS_NAME,
          "handleAuthConfig error",
          JSON.stringify(error)
        );
      }

      this.authConfig = {};
      this.isAuthConfigLoading = false;
    }
  }

  /* lifecycle */

  async connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this.loginUrl = await getLoginUrl();
  }
}
