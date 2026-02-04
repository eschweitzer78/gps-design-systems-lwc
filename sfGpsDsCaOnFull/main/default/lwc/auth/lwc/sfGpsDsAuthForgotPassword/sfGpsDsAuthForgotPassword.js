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

import getAuthConfig from "@salesforce/apex/sfGpsDsCommunitiesController.getAuthConfig";
import forgotPassword from "@salesforce/apex/applauncher.ForgotPasswordController.forgotPassword";
import getLoginUrl from "@salesforce/apex/system.Network.getLoginUrl";

import sfGpsDsAuthUsernameFieldLabel from "@salesforce/label/c.sfGpsDsAuthUsernameFieldLabel";
import sfGpsDsAuthForgotPasswordResetButtonLabel from "@salesforce/label/c.sfGpsDsAuthForgotPasswordResetButtonLabel";
import sfGpsDsAuthForgotPasswordCancelButtonLabel from "@salesforce/label/c.sfGpsDsAuthForgotPasswordCancelButtonLabel";
import sfGpsDsAuthForgotPasswordErrorTitle from "@salesforce/label/c.sfGpsDsAuthForgotPasswordErrorTitle";
import sfGpsDsAuthForgotPasswordErrorDefaultLabel from "@salesforce/label/c.sfGpsDsAuthForgotPasswordErrorDefaultLabel";
import sfGpsDsAuthAuthConfigErrorTitle from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorTitle";
import sfGpsDsAuthAuthConfigErrorLabel from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorLabel";
import sfGpsDsAuthAuthDisabledTitle from "@salesforce/label/c.sfGpsDsAuthAuthDisabledTitle";
import sfGpsDsAuthAuthDisabledLabel from "@salesforce/label/c.sfGpsDsAuthAuthDisabledLabel";
import sfGpsDsAuthForgotPasswordWaitLabel from "@salesforce/label/c.sfGpsDsAuthForgotPasswordWaitLabel";

const I18N = {
  authConfigErrorTitle: sfGpsDsAuthAuthConfigErrorTitle,
  authConfigErrorLabel: sfGpsDsAuthAuthConfigErrorLabel,
  loginDisabledTitle: sfGpsDsAuthAuthDisabledTitle,
  loginDisabledLabel: sfGpsDsAuthAuthDisabledLabel,
  errorTitle: sfGpsDsAuthForgotPasswordErrorTitle,
  defaultErrorLabel: sfGpsDsAuthForgotPasswordErrorDefaultLabel,

  usernameFieldLabel: sfGpsDsAuthUsernameFieldLabel,
  cancelButtonLabel: sfGpsDsAuthForgotPasswordCancelButtonLabel,
  resetButtonLabel: sfGpsDsAuthForgotPasswordResetButtonLabel,

  resetPasswordWaitLabel: sfGpsDsAuthForgotPasswordWaitLabel
};

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuthForgotPassword";

export default class extends SfGpsDsLwc {
  /* tracked */

  username = "";
  errorMessage;
  isAuthConfigLoading = true;
  loginUrl;
  checkEmailUrl;
  isResettingPassword;

  @track authConfig = {};

  /* getters */

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

  get computedIsResetButtonDisabled() {
    const rv = !this.username;
    if (DEBUG) console.debug(CLASS_NAME, "computedIsResetDisabled", rv);
    return rv;
  }

  get computedLoginDisabled() {
    return this.authConfig.isLoginEnabled ? false : true;
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

  /* event management */

  handleChange(event) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleChange", event.target.name);
    }

    this[event.target.name] = event.target.value;

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleChange", event.target.value);
    }
  }

  async handleReset(event) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleReset", "username", this._username);
    }

    event.preventDefault();

    this.errorMessage = null;
    this.isResettingPassword = true;

    const rawResult = await forgotPassword({
      username: this.username,
      checkEmailUrl: this.checkEmailUrl
    });

    // rawResult null means that forgotPassword was successful
    if (!rawResult) {
      window.location.assign(this.checkEmailUrl);
    } else {
      this.errorMessage = rawResult;
      this.isResettingPassword = false;
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleReset", "outcome", rawResult);
    }
  }

  /* lifecycle */

  async connectedCallback() {
    if (super.connectedCallback()) super.connectedCallback();

    this.loginUrl = await getLoginUrl();

    this.checkEmailUrl = "./CheckPasswordResetEmail";
    this.targetcheckEmailUrl = appendStartUrlToTargetUrl(
      this.checkEmailUrl,
      getStartUrlFromCurrentUrl()
    );
  }
}
