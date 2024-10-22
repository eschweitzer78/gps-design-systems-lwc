import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const I18N = {
  navAriaLabel: "footer",
  linksAriaLabel: "footer",
  socialLinksAriaLabel: "social media links",
  copyrightStatement: "Copyright statement"
};

const CSTYLE_LIGHT = "light";
const CSTYLE_DARK = "dark";
const CSTYLE_DARKALT = "dark-alt";
const CSTYLE_VALUES = [CSTYLE_LIGHT, CSTYLE_DARK, CSTYLE_DARKALT];
const CSTYLE_DEFAULT = CSTYLE_DARK;

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

  _cstyle = CSTYLE_DEFAULT;
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT
    });
  }

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return computeClass({
      qld__footer: true,
      "qld__footer--dark": this.cstyle === CSTYLE_DARK,
      "qld__footer--dark-alt": this.cstyle === CSTYLE_DARKALT,
      [this.className]: this.className
    });
  }
}
