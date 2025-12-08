/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  getStartUrlFromCurrentUrl,
  getExpIdFromCurrentUrl,
  appendStartUrlToTargetUrl
} from "c/sfGpsDsAuthUtils";

import getAuthConfig from "@salesforce/apex/sfGpsDsCommunitiesController.getAuthConfig";

import setExperienceId from "@salesforce/apex/applauncher.SelfRegisterController.setExperienceId";
import getExtraFields from "@salesforce/apex/applauncher.SelfRegisterController.getExtraFields";
import selfRegisterGetRedirectUrl from "@salesforce/apex/applauncher.SelfRegisterController.selfRegisterGetRedirectUrl";
import getLoginUrl from "@salesforce/apex/system.Network.getLoginUrl";

import sfGpsDsAuthFirstNameFieldLabel from "@salesforce/label/c.sfGpsDsAuthFirstNameFieldLabel";
import sfGpsDsAuthLastNameFieldLabel from "@salesforce/label/c.sfGpsDsAuthLastNameFieldLabel";
import sfGpsDsAuthPasswordFieldLabel from "@salesforce/label/c.sfGpsDsAuthPasswordFieldLabel";
import sfGpsDsAuthConfirmPasswordFieldLabel from "@salesforce/label/c.sfGpsDsAuthConfirmPasswordFieldLabel";
import sfGpsDsAuthRegisterButtonLabel from "@salesforce/label/c.sfGpsDsAuthRegisterButtonLabel";
import sfGpsDsAuthRegisterWaitLabel from "@salesforce/label/c.sfGpsDsAuthRegisterWaitLabel";
import sfGpsDsAuthAlreadyRegisteredButtonLabel from "@salesforce/label/c.sfGpsDsAuthAlreadyRegisteredButtonLabel";
import sfGpsDsAuthRegistrationErrorTitle from "@salesforce/label/c.sfGpsDsAuthRegistrationErrorTitle";
import sfGpsDsAuthRegistrationErrorDefaultLabel from "@salesforce/label/c.sfGpsDsAuthRegistrationErrorDefaultLabel";
import sfGpsDsAuthRegistrationPasswordMismatchLabel from "@salesforce/label/c.sfGpsDsAuthRegistrationPasswordMismatchLabel";
import sfGpsDsAuthFieldRequiredLabel from "@salesforce/label/c.sfGpsDsAuthFieldRequiredLabel";
import sfGpsDsAuthAuthConfigErrorTitle from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorTitle";
import sfGpsDsAuthAuthConfigErrorLabel from "@salesforce/label/c.sfGpsDsAuthAuthConfigErrorLabel";
import sfGpsDsAuthRegistrationDisabledTitle from "@salesforce/label/c.sfGpsDsAuthRegistrationDisabledTitle";
import sfGpsDsAuthRegistrationDisabledLabel from "@salesforce/label/c.sfGpsDsAuthRegistrationDisabledLabel";

const I18N = {
  registrationDisabledTitle: sfGpsDsAuthRegistrationDisabledTitle,
  registrationDisabledLabel: sfGpsDsAuthRegistrationDisabledLabel,
  authConfigErrorTitle: sfGpsDsAuthAuthConfigErrorTitle,
  authConfigErrorLabel: sfGpsDsAuthAuthConfigErrorLabel,

  errorTitle: sfGpsDsAuthRegistrationErrorTitle,
  defaultErrorLabel: sfGpsDsAuthRegistrationErrorDefaultLabel,

  firstNameFieldLabel: sfGpsDsAuthFirstNameFieldLabel,
  lastNameFieldLabel: sfGpsDsAuthLastNameFieldLabel,
  passwordFieldLabel: sfGpsDsAuthPasswordFieldLabel,
  confirmPasswordFieldLabel: sfGpsDsAuthConfirmPasswordFieldLabel,
  registerButtonLabel: sfGpsDsAuthRegisterButtonLabel,
  registerWaitLabel: sfGpsDsAuthRegisterWaitLabel,
  alreadyRegisteredLabel: sfGpsDsAuthAlreadyRegisteredButtonLabel,

  passwordMismatchLabel: sfGpsDsAuthRegistrationPasswordMismatchLabel,
  fieldRequiredLabel: sfGpsDsAuthFieldRequiredLabel
};

const INPUT_TYPES = {
  BOOLEAN: "text",
  CURRENCY: "number",
  DOUBLE: "number",
  EMAIL: "email",
  INTEGER: "number",
  LONG: "number",
  PERCENT: "number",
  PHONE: "text",
  STRING: "text",
  TEXTAREA: "text",
  URL: "text"
};

const DEFAULT_VALUES = {
  BOOLEAN: false,
  CURRENCY: null,
  DOUBLE: null,
  EMAIL: "",
  INTEGER: null,
  LONG: null,
  PERCENT: null,
  PHONE: "",
  STRING: "",
  TEXTAREA: "",
  URL: ""
};

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuthRegister";

export default class extends SfGpsDsLwc {
  /* api: includePasswordField */

  _includePasswordField = true;

  @api
  get includePasswordField() {
    return this._includePasswordField;
  }

  set includePasswordField(value) {
    this._includePasswordField = value;
  }

  /* api: extraFieldsFieldset */

  @track _extraFieldsFieldset;

  @api
  get extraFieldsFieldset() {
    return this._extraFieldsFieldset;
  }

  set extraFieldsFieldset(value) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> set extraFieldsFieldset", value);
    }

    let hasChanged = false;

    if (value !== this._extraFieldsFieldset) {
      this._extraFieldsFieldset = value;
      this.isExtraFieldsLoading++;
      hasChanged = true;

      getExtraFields({ extraFieldsFieldSet: value })
        .then((data) => this.handleFieldset(data, null))
        .catch((error) => this.handleFieldset(null, error));
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< set extraFieldsFieldset", hasChanged);
    }
  }

  @track fields = {
    firstName: {
      type: "STRING",
      inputType: "text",
      label: "First name",
      name: "firstName",
      value: "",
      required: true,
      autocomplete: "given-name",
      anyError: false,
      requiredError: false,
      mismatchError: false
    },
    lastName: {
      type: "STRING",
      inputType: "text",
      label: "Last name",
      name: "lastName",
      value: "",
      required: true,
      autocomplete: "family-name",
      anyError: false,
      requiredError: false,
      mismatchError: false
    },
    email: {
      type: "EMAIL",
      inputType: "email",
      label: "Email",
      name: "email",
      value: "",
      required: true,
      autocomplete: "email",
      anyError: false,
      requiredError: false,
      mismatchError: false
    },
    password: {
      type: "STRING",
      inputType: "password",
      label: "Password",
      name: "password",
      value: "",
      isPassword: true,
      required: true,
      autocomplete: "new-password",
      anyError: false,
      requiredError: false,
      mismatchError: false
    },
    confirmPassword: {
      type: "STRING",
      inputType: "password",
      label: "Confirm password",
      name: "confirmPassword",
      value: "",
      required: true,
      autocomplete: "new-password",
      anyError: false,
      requiredError: false,
      mismatchError: false
    }
  };

  errorMessage;
  isExtraFieldsLoading = 0;
  isRegistering = false;
  passwordMismatchError = false;
  loginUrl;
  isAuthConfigLoading = true;

  @track authConfig = {};
  @track extraFields = {};

  /* getters */

  get computedRegistrationEnabled() {
    return this.authConfig.registrationEnabled ? true : false;
  }

  get computedRegistrationDisabled() {
    if (this.authConfig.registrationEnabled == null) return true;
    return this.authConfig.registrationEnabled ? false : true;
  }

  get computedHasAuthConfigIssue() {
    return (
      Object.keys(this.authConfig).length === 0 && !this.isAuthConfigLoading
    );
  }

  get computedIsRegisterButtonDisabled() {
    return (
      this.isExtraFieldsLoading ||
      this.isRegistering ||
      this.fieldsArray.some(
        (field) => (!field.value && field.required) || field.anyError
      ) ||
      this.extraFieldsArray.some(
        (field) => (!field.value && field.required) || field.anyError
      )
    );
  }

  get i18n() {
    return I18N;
  }

  get computedStartUrl() {
    const rv = getStartUrlFromCurrentUrl();
    return rv ? decodeURIComponent(rv) : "";
  }

  get fieldsArray() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> get fieldsArray",
        JSON.stringify(this.fields)
      );
    }

    const fieldNames = Object.keys(this.fields).filter(
      (fieldName) =>
        this.fields[fieldName].inputType !== "password" ||
        this.includePasswordField
    );
    const rv = fieldNames.map((fieldName) => this.fields[fieldName]);

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< get fieldsArray",
        JSON.stringify(fieldNames),
        JSON.stringify(rv)
      );
    }

    return rv;
  }

  get extraFieldsArray() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> get extraFieldsArray",
        JSON.stringify(this.extraFields)
      );
    }

    const fieldNames = Object.keys(this.extraFields);
    const rv = fieldNames.map((fieldName) => this.extraFields[fieldName]);

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< get extraFieldsArray",
        JSON.stringify(fieldNames),
        JSON.stringify(rv)
      );
    }

    return rv;
  }

  get targetLoginUrl() {
    const loginUrl = this.loginUrl || this.authConfig?.loginUrl1;
    return loginUrl
      ? appendStartUrlToTargetUrl(loginUrl, getStartUrlFromCurrentUrl())
      : null;
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

  handleFieldset(data, error) {
    if (data) {
      this.isExtraFieldsLoading--;

      if (data) {
        if (DEBUG) {
          console.debug(CLASS_NAME, "loadFieldset data", JSON.stringify(data));
        }

        const fields = Object.keys(this.fields).map((field) =>
          field.toUpperCase()
        );
        let extraFields = {};

        for (let i = 0; i < data.length; i++) {
          const originalField = data[i];
          const fieldName = originalField.fieldPath;
          const originalType = originalField.type || "STRING";

          if (fields.includes(fieldName.toUpperCase())) {
            // Skip if already included in fields
            continue;
          }

          extraFields[fieldName] = {
            ...originalField,
            name: fieldName,
            type: originalType,
            inputType: INPUT_TYPES[originalType],
            anyError: false,
            requiredError: false,
            value: DEFAULT_VALUES[originalType] || ""
          };
        }

        this.extraFields = extraFields;
      }
    }

    if (error) {
      if (DEBUG) {
        console.debug(CLASS_NAME, "loadFieldset error", JSON.stringify(error));
      }

      this.extraFields = {};
    }
  }

  /* event management */

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleChange",
        "name=",
        name,
        "value=",
        value
      );
    }

    let previousValue = "";
    let newValue = "";

    if (name in this.fields) {
      const field = this.fields[name];
      previousValue = field.value;
      newValue = value;
      field.value = value;
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< handleChange",
        "previous value=",
        previousValue,
        "new value=",
        newValue
      );
    }
  }

  handleBlur(event) {
    const name = event.target.name;

    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleBlur", "name=", name);
    }

    let field;

    if (name in this.fields) {
      field = this.fields[name];

      field.requiredError = field.required && !field.value;
      field.mismatchError =
        name === "confirmPassword" &&
        this.fields.password.value !== this.fields.confirmPassword.value;
      field.anyError = field.requiredError || field.mismatchError;
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< handleBlur",
        "field=",
        JSON.stringify(field)
      );
    }
  }

  handleExtraFieldsChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleExtraFieldsChange",
        "name=",
        name,
        "value=",
        value
      );
    }

    let previousValue = "";
    let newValue = "";
    const field = this.extraFields[name];

    if (field) {
      previousValue = field.value;
      newValue = value;
      field.value = value;
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleExtraFieldsChange",
        "previous value=",
        previousValue,
        "new value=",
        newValue
      );
    }
  }

  handleExtraFieldsBlur(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleExtraFieldsBlur",
        "name=",
        name,
        "value=",
        value
      );
    }

    const field = this.extraFields[name];

    if (field) {
      field.requiredError = field.required && !field.value;
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> handleExtraFieldsBlur",
        "requiredError=",
        field?.requiredError
      );
    }
  }

  async handleClick() {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleClick");
    }

    this.errorMessage = "";
    this.isRegistering = false;
    const registrationHandler =
      this.registrationHandler || selfRegisterGetRedirectUrl;
    const t = {
      firstname: this.fields.firstName?.value,
      lastname: this.fields.lastName?.value,
      email: this.fields.email?.value,
      password: this.fields.password?.value,
      confirmPassword: this.fields.confirmPassword?.value,
      accountId: this.accountId,
      regConfirmUrl: this.regConfirmUrl || "./CheckPasswordResetEmail",
      extraFields: JSON.stringify(Object.values(this.extraFields)),
      startUrl: this.computedStartUrl,
      includePassword: this.includePasswordField,
      redirect: !1
    };

    registrationHandler(t)
      .then((url) => {
        if (DEBUG) {
          console.debug(CLASS_NAME, "= handleClick then1", url);
        }

        if ("./CheckPasswordResetEmail" === url) {
          return appendStartUrlToTargetUrl(url, getStartUrlFromCurrentUrl());
        }

        try {
          return new URL(url).href;
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          this.isRegistering = false;
          return Promise.reject(url);
        }
      })
      .then((startUrl) => {
        if (DEBUG) {
          console.debug(CLASS_NAME, "= handleClick then2", startUrl);
        }

        window.location.assign(startUrl);
        this.isRegistering = false;
      })
      .catch((e) => {
        if (DEBUG) {
          console.debug(CLASS_NAME, "= handleClick error", e);
        }

        if (this.errorMessage === e) {
          this.isRegistering = false;
        } else {
          this.isRegistering = false;
          this.errorMessage = e || I18N.defaultErrorLabel;
        }
      });

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleClick");
    }
  }

  /* lifecycle */

  async connectedCallback() {
    if (super.connectedCallback()) super.connectedCallback();

    this.classList.add("sfgpsds-auth-register");
    const expId = getExpIdFromCurrentUrl();

    if (expId) {
      setExperienceId({
        expId
      });
    }

    this.loginUrl = await getLoginUrl();
  }
}
