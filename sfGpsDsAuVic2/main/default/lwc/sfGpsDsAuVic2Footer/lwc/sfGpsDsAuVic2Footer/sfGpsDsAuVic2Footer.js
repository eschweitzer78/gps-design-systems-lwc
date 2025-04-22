import { LightningElement, api } from "lwc";
import { isArray, normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";
import { BreakpointsMixin } from "c/sfGpsDsAuVic2BreakpointsMixin";
import STATIC_RESOURCE from "@salesforce/resourceUrl/sfGpsDsAuVic2";

const VARIANT_DEFAULT = "default";
const VARIANT_NEUTRAL = "neutral";
const VARIANT_VALUES = [VARIANT_DEFAULT, VARIANT_NEUTRAL];

const DISABLEFOOTERLOGO_DEFAULT = false;

export default class extends BreakpointsMixin(LightningElement) {
  @api nav;
  @api links;
  @api logos;
  @api credit;
  @api acknowledgement;
  @api copyright = "© Copyright State Government of Victoria";
  @api className;

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variant;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT
    });
  }

  /* api: disableFooterLogo */

  _disableFooterLogo = DISABLEFOOTERLOGO_DEFAULT;
  _disableFooterLogoOriginal;

  @api
  get disableFooterLogo() {
    return this._disableFooterLogoOriginal;
  }

  set disableFooterLogo(value) {
    this._disableFooterLogoOriginal = value;
    this._disableFooterLogo = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISABLEFOOTERLOGO_DEFAULT
    });
  }

  /* computed */

  get computedHasOneColumnOrLess() {
    return this.columns ? this.columns.length <= 1 : false;
  }

  get computedClassName() {
    return {
      "rpl-footer": true,
      "rpl-footer--default": this.variant === VARIANT_DEFAULT,
      "rpl-footer--neutral": this.variant === VARIANT_NEUTRAL,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    };
  }

  get columns() {
    let numColumns;

    if (this.isMediumScreen) {
      numColumns = 2;
    } else if (this.isLargeScreen) {
      numColumns = 3;
    } else if (this.isXLargeScreen) {
      numColumns = 4;
    } else {
      numColumns = 1;
    }

    const columnBreaks = this.getColumnBreaks(this.nav.length, numColumns);

    return columnBreaks.reduce((results, breakIndex, i) => {
      if (i < columnBreaks.length - 1) {
        return [...results, this.nav.slice(breakIndex, columnBreaks[i + 1])];
      }

      return [...results, this.nav.slice(breakIndex)];
    }, []);
  }

  get computedHref() {
    return `${STATIC_RESOURCE}/assets/logos/logo-victoria-state-government.svg#logo`;
  }

  get decoratedLogos() {
    return !this.logos || !isArray(this.logos)
      ? []
      : this.logos.map((logoLink, index) => ({
          ...logoLink,
          index: `logo-${index + 1}`
        }));
  }

  get computedShowFooterLogo() {
    return !this._disableFooterLogo;
  }

  /* methods */

  getColumnBreaks(numItems, numColumns) {
    const base = Math.floor(numItems / numColumns);
    const remainder = numItems % numColumns;

    const itemsPerColumn = Array(numColumns)
      .fill(base)
      .map((n, i) => (i < remainder ? n + 1 : n));

    const columnBreaks = itemsPerColumn
      .slice(0, itemsPerColumn.length - 1)
      .reduce(
        (results, n, i) => {
          return [...results, results[i] + n];
        },
        [0]
      );

    return columnBreaks;
  }

  get isExpandable() {
    return this.bpSmaller("l");
  }

  get isMediumScreen() {
    return this.bpBetween("m", "l");
  }

  get isLargeScreen() {
    return this.bpBetween("l", "xl");
  }

  get isXLargeScreen() {
    return this.bpGreaterOrEqual("xl");
  }

  /* event management */

  handleLogoClick(event) {
    const index = event.target.dataset.ndx;

    if (index === undefined) {
      this.dispatchEvent(
        new CustomEvent("navigate", {
          detail: {
            action: "click",
            value: this.vicGovHomeUrl,
            text: this.vicGoveHomeLabel
          }
        })
      );
    } else if (index >= 0 && index < this.logos?.length) {
      this.dispatchEvent(
        new CustomEvent("navigate", {
          detail: {
            action: "click",
            value: this.logos[index].url,
            text: this.logos[index].alt
          }
        })
      );
    }
  }

  handleLinksClick(event) {
    const index = event.target.dataset.ndx;

    this.dispatchEvent(
      new CustomEvent("linksnavigate", {
        detail: index
      })
    );
  }

  handleNavigate(event) {
    this.dispatchEvent(
      new CustomEvent("navnavigate", {
        detail: event.detail.id
      })
    );
  }
}
