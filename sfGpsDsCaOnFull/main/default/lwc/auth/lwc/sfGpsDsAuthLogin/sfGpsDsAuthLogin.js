/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import getAuthConfig from "@salesforce/apex/sfGpsDsCommunitiesController.getAuthConfig";
import {
  appendStartUrlToTargetUrl,
  getStartUrlFromCurrentUrl
} from "c/sfGpsDsAuthUtils";

import login from "@salesforce/apex/applauncher.LoginFormController.loginGetPageRefUrl";
import getUsernamePasswordSelfRegEnabled from "@salesforce/apex/applauncher.LoginFormController.getUsernamePasswordSelfRegEnabled";
import getForgotPasswordUrl from "@salesforce/apex/applauncher.LoginFormController.getForgotPasswordUrl";
import getSelfRegistrationUrl from "@salesforce/apex/applauncher.LoginFormController.getSelfRegistrationUrl";

import sfGpsDsAuthUsernameFieldLabel from "@salesforce/label/c.sfGpsDsAuthUsernameFieldLabel";
import sfGpsDsAuthPasswordFieldLabel from "@salesforce/label/c.sfGpsDsAuthPasswordFieldLabel";
import sfGpsDsAuthLoginLoginButtonLabel from "@salesforce/label/c.sfGpsDsAuthLoginButtonLabel";
import sfGpsDsAuthLoginForgotPasswordButtonLabel from "@salesforce/label/c.sfGpsDsAuthLoginForgotPasswordButtonLabel";
import sfGpsDsAuthLoginRegisterButtonLabel from "@salesforce/label/c.sfGpsDsAuthLoginRegisterButtonLabel";
import sfGpsDsAuthLoginErrorTitle from "@salesforce/label/c.sfGpsDsAuthLoginErrorTitle";
import sfGpsDsAuthLoginErrorDefaultLabel from "@salesforce/label/c.sfGpsDsAuthLoginErrorDefaultLabel";
import sfGpsDsAuthAuthConfigErrorTitle from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorTitle";
import sfGpsDsAuthAuthConfigErrorLabel from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorLabel";
import sfGpsDsAuthAuthDisabledTitle from "@salesforce/label/c.sfGpsDsAuthAuthDisabledTitle";
import sfGpsDsAuthAuthDisabledLabel from "@salesforce/label/c.sfGpsDsAuthAuthDisabledLabel";
import sfGpsDsAuthLoginWaitLabel from "@salesforce/label/c.sfGpsDsAuthLoginWaitLabel";
import sfGpsDsAuthLoginInvalidDefaultLabel from "@salesforce/label/c.sfGpsDsAuthLoginInvalidDefaultLabel";

const WHITELISTED_FIELDS = ["username", "password"];

const I18N = {
  authConfigErrorTitle: sfGpsDsAuthAuthConfigErrorTitle,
  authConfigErrorLabel: sfGpsDsAuthAuthConfigErrorLabel,
  loginDisabledTitle: sfGpsDsAuthAuthDisabledTitle,
  loginDisabledLabel: sfGpsDsAuthAuthDisabledLabel,
  errorTitle: sfGpsDsAuthLoginErrorTitle,
  defaultErrorLabel: sfGpsDsAuthLoginErrorDefaultLabel,

  usernameFieldLabel: sfGpsDsAuthUsernameFieldLabel,
  passwordFieldLabel: sfGpsDsAuthPasswordFieldLabel,
  loginButtonLabel: sfGpsDsAuthLoginLoginButtonLabel,
  forgotPasswordLabel: sfGpsDsAuthLoginForgotPasswordButtonLabel,
  registerUserLabel: sfGpsDsAuthLoginRegisterButtonLabel,

  loginWaitLabel: sfGpsDsAuthLoginWaitLabel,
  invalidDefaultLabel: sfGpsDsAuthLoginInvalidDefaultLabel
};

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuthLogin";

export default class extends SfGpsDsLwc {
  /* tracked */

  username = "";
  password = "";
  errorMessage;
  isLoggingIn;
  registrationUrl;
  targetRegistrationUrl;
  forgotPasswordUrl;
  targetForgotPasswordUrl;
  registrationEnabled;
  isAuthConfigLoading = true;

  @track authConfig = {};

  /* getters */

  get computedRegistrationEnabled() {
    return this.registrationEnabled;
  }

  get computedRegistrationDisabled() {
    return !this.registrationEnabled;
  }

  get computedRegistrationUrl() {
    return this.targetRegistrationUrl;
  }

  get computedForgotPasswordUrl() {
    return this.targetForgotPasswordUrl;
  }

  get computedLoginDisabled() {
    return this.authConfig.isLoginEnabled ? false : true;
  }

  get computedHasAuthConfigIssue() {
    return (
      Object.keys(this.authConfig).length === 0 && !this.isAuthConfigLoading
    );
  }

  get computedIsLoginButtonDisabled() {
    return (
      !this.username ||
      !this.password ||
      !this.authConfig.isLoginEnabled ||
      this.isLoggingIn
    );
  }

  get computedHasFooter() {
    return this.forgotUrl || this.computedRegistrationUrl;
  }

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
    const name = event.target.name;
    const value = event.target.value;

    if (DEBUG) console.debug(CLASS_NAME, "> handleChange", name, value);

    if (WHITELISTED_FIELDS.includes(name)) {
      this[name] = value;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleChange");
  }

  async handleLogin(event) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleLogin",
        "username",
        this.username,
        "password",
        this.password
      );
    }

    event.preventDefault();
    this.error = null;
    this.isLoggingIn = true;

    const baseStartUrl = getStartUrlFromCurrentUrl();
    const startUrl = baseStartUrl ? decodeURIComponent(baseStartUrl) : "";

    login({
      username: this.username,
      password: this.password,
      startUrl: startUrl
    })
      .then((rawResult) => {
        try {
          return new URL(rawResult);
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          this.isLoggingIn = false;
          return Promise.reject(rawResult);
        }
      })
      .then((uri) => {
        // TODO use lightning/navigation once W-6083785 is completed
        window.location.assign(uri.href);
        this.isLoggingIn = false;
      })
      .catch((error) => {
        this.isLoggingIn = false;
        this.errorMessage = error || I18N.invalidDefaultLabel;
      });

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleLogin", this.errorMessage);
    }
  }

  /* lifecycle */

  async connectedCallback() {
    if (super.connectedCallback()) super.connectedCallback();

    this.registrationUrl = (await getSelfRegistrationUrl()) || "./SelfRegister";
    this.targetRegistrationUrl = appendStartUrlToTargetUrl(
      this.registrationUrl,
      getStartUrlFromCurrentUrl()
    );
    this.forgotPasswordUrl =
      (await getForgotPasswordUrl()) || "./ForgotPassword";
    this.targetForgotPasswordUrl = appendStartUrlToTargetUrl(
      this.forgotPasswordUrl,
      getStartUrlFromCurrentUrl()
    );
    this.registrationEnabled = await getUsernamePasswordSelfRegEnabled();
  }
}
