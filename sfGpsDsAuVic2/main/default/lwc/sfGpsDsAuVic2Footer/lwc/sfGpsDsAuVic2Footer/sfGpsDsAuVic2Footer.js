import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import { BreakpointsMixin } from "c/sfGpsDsAuVic2BreakpointsMixin";
import STATIC_RESOURCE from "@salesforce/resourceUrl/sfGpsDsAuVic2";

export default class SfGpsDsAuVic2Footer extends BreakpointsMixin(
  LightningElement
) {
  @api variant = "default"; // default, neutral
  @api nav;
  @api links;
  @api logos;
  @api credit;
  @api acknowledgement;
  @api copyright = "© Copyright State Government of Victoria";
  @api className;

  /* computed */

  get computedHasOneColumnOrLess() {
    return this.columns ? this.columns.length <= 1 : false;
  }

  get computedClassName() {
    return computeClass({
      "rpl-footer": true,
      "rpl-footer--default": this.variant !== "neutral",
      "rpl-footer--neutral": this.variant === "neutral",
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
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
    return !this.logos || !Array.isArray(this.logos)
      ? []
      : this.logos.map((logoLink, index) => ({
          ...logoLink,
          index: `logo-${index + 1}`
        }));
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
