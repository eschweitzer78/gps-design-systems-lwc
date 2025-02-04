import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const I18N = {
  navAriaLabel: "footer",
  linksAriaLabel: "footer",
  socialLinksAriaLabel: "social media links",
  copyrightStatement: "Copyright statement"
};

const CSTYLE_DEFAULT = "dark";
const CSTYLE_VALUES = {
  light: "",
  dark: "qld__footer--dark",
  "dark-alternate": "qld__footer--dark-alt"
};

export default class extends LightningElement {
  @api title;
  @api navHeading;
  @api linksHeading;
  @api socialHeading;

  @api facebookUrl;
  @api linkedInUrl;
  @api youTubeUrl;
  @api instagramUrl;
  @api twitterXUrl;

  @api acknowledgementsHeading;
  @api acknowledgements;

  @api logoUrl;
  @api logo;
  @api logoAlt;

  @api copyrightLinkText;
  @api copyrightLinkUrl;
  @api className;

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      qld__footer: true,
      [this._cstyle]: this._cstyle,
      [this.className]: this.className
    };
  }
}
