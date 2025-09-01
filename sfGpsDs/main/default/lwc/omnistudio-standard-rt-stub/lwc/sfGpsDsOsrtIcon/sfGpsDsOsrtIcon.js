import { LightningElement, api, track } from "lwc";
import {
  newport,
  getCustomNewportUrl,
  isCommunityPage
} from "c/sfGpsDsOsrtUtility";
import { getSldsResourcesUrl } from "c/sfGpsDsOsrtSalesforceUtils";
import { get } from "c/sfGpsDsOsrtLodash";
import sldsTemplate from "./icon_slds.html";
import ndsTemplate from "./icon_nds.html";

export default class Icon extends LightningElement {
  @api size;
  @api baseurl;
  @api theme = "slds";
  @api src;
  @api variant = "default";
  @api alternativeText;
  @api parenttype;
  @api iconposition;
  @api iconType; // feature use

  @track _imgsrc;
  @track valueSet = false;
  @track iconUrl = "";
  @track _iconName;
  @track _extraclass = "";

  isCommunity = false;

  /* api: extraclass */

  @api
  get extraclass() {
    return this._extraclass;
  }

  set extraclass(val) {
    this.uninterpolatedFields.extraclass = val;
    this._extraclass = this.interpolateValue(val);
  }

  /* api: imgsrc */

  @api
  get imgsrc() {
    return this._imgsrc;
  }

  set imgsrc(val) {
    this.uninterpolatedFields.imgsrc = val;
    this.srcVal = this.interpolateValue(val);
    if (this.srcVal) {
      this.isSrcRelative = !new RegExp("^(?:[a-z]+:)?//", "i").test(
        this.srcVal
      );
      if (this.isSrcRelative) {
        this._imgsrc =
          (this.isCommunity
            ? this.getCommunityPrefix()
            : window.location.origin) + this.srcVal;
      } else {
        this._imgsrc = this.srcVal;
      }
      this.valueSet = true;
    }
  }

  /* api: iconName */

  @api get iconName() {
    return this._iconName;
  }

  set iconName(val) {
    this.uninterpolatedFields.iconName = val;
    Promise.resolve().then(() => {
      this._iconName = this.interpolateValue(val, "iconName");
      this.valueSet = true;
      this.updateValue();
    });
  }

  /* api: color */

  @api get color() {
    return this._color;
  }

  set color(val) {
    if (typeof val !== "undefined" && val !== null) {
      this._color = val;
      this.svgEl = this.svgEl ? this.svgEl : this.template.querySelector("svg");
      if (this.svgEl) {
        this.svgEl.style.fill = val;
      }
    }
  }

  /* api: bgColor */

  @api get bgColor() {
    return this._bgColor;
  }
  set bgColor(val) {
    if (val) {
      this._bgColor = val;
      this.svgEl = this.svgEl ? this.svgEl : this.template.querySelector("svg");
      if (this.svgEl) {
        this.svgEl.style.backgroundColor = val;
      }
    }
  }

  uninterpolatedFields = {};
  ndsUrl = "";
  _isCustomNdsUrlResolved = false;

  /* lifecycle */

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    Promise.all([
      getCustomNewportUrl().then((url) => {
        this._isCustomNdsUrlResolved = true;
        if (url) {
          this.ndsUrl = url.split("/assets")[0];
        }
      }),
      isCommunityPage().then((result) => {
        this.isCommunity = result;
        if (this.isCommunity && this.isSrcRelative && this.srcVal) {
          this._imgsrc = this.getCommunityPrefix() + this.srcVal;
        }
      })
    ]).then(() => {
      if (this.valueSet) {
        this.updateValue();
      }
    });
  }

  renderedCallback() {
    if (this.color || this.bgColor) {
      this.svgEl = this.template.querySelector("svg");
      const setColor =
        this.svgEl && this.color && this.svgEl.style.fill !== this.color;
      const setBgColor =
        this.svgEl &&
        this.bgColor &&
        this.svgEl.style.backgroundColor !== this.bgColor;
      if (setColor) {
        this.svgEl.style.fill = this.color;
      }
      if (setBgColor) {
        this.svgEl.style.backgroundColor = this.bgColor;
      }
    }
  }
  disconnectedCallback() {
    if (this.svgEl) {
      this.svgEl.style.fill = null;
      this.svgEl.style.backgroundColor = null;
      this.svgEl.style = null;
      this.svgEl = null;
    }
  }

  updateValue() {
    this.iconUrl = this.getUrl;
  }

  get getUrl() {
    if (this.src) {
      return this.src;
    }
    if (!this.iconName) {
      return "";
    }
    const baseurl = this.baseurl ? this.baseurl : "";
    if (!baseurl && this.theme === "slds") {
      return this.isCommunity
        ? this.getCommunityPrefix() +
            getSldsResourcesUrl() +
            "icons/" +
            this.iconName.split(":")[0] +
            "-sprite/svg/symbols.svg#" +
            this.iconName.split(":")[1]
        : getSldsResourcesUrl() +
            "icons/" +
            this.iconName.split(":")[0] +
            "-sprite/svg/symbols.svg#" +
            this.iconName.split(":")[1];
    } else if (this.theme === "nds" && this._isCustomNdsUrlResolved) {
      if (this.ndsUrl) {
        return (
          this.ndsUrl +
          "/assets/icons/" +
          this.iconName.split(":")[0] +
          "-sprite/svg/symbols.svg#" +
          this.iconName.split(":")[1]
        );
      }
      return (
        newport +
        "/assets/icons/" +
        this.iconName.split(":")[0] +
        "-sprite/svg/symbols.svg#" +
        this.iconName.split(":")[1]
      );
    } else if (this.theme === "nds" && !this._isCustomNdsUrlResolved) {
      return "";
    }
    return (
      baseurl +
      this.iconName.split(":")[0] +
      "-sprite/svg/symbols.svg#" +
      this.iconName.split(":")[1]
    );
  }

  get getClasses() {
    let classes =
      this.theme +
      "-" +
      (this.parenttype ? this.parenttype + "__" : "") +
      "icon " +
      this.extraclass;
    classes += this.variant ? ` ${this.theme}-icon-text-${this.variant}` : "";
    classes += this.size
      ? ` ${this.theme}-icon_${this.size}`
      : this.parenttype
        ? ` ${this.theme}-icon_xx-small`
        : "";
    if (this.iconposition) {
      classes +=
        " " +
        this.theme +
        "-" +
        (this.parenttype ? this.parenttype + "__" : "") +
        "icon_" +
        this.iconposition;
    }
    return classes;
  }

  getCommunityPrefix() {
    if (
      /livepreview/.test(window.location.host) ||
      /live-preview/.test(window.location.host) ||
      /preview/.test(window.location.host)
    ) {
      return "/sfsites/c";
    }
    return window.location.pathname.split("/s/")[0];
  }

  // To interpolated label value
  interpolateValue(value, type) {
    value =
      value && typeof value === "string" && value.charAt(0) === "\\"
        ? value.substring(1)
        : value;
    if (
      value &&
      typeof value === "string" &&
      value.indexOf("{") !== -1 &&
      (this.record || this._allMergeFields)
    ) {
      const stringToInterpolate = value;
      return stringToInterpolate.replace(/\{(.*?)\}/g, (match, expr) => {
        let fieldValue = get(this.record, expr);
        if (this._allMergeFields && !fieldValue) {
          fieldValue = get(this._allMergeFields, expr);
        }
        return typeof fieldValue !== "undefined"
          ? type === "iconName"
            ? fieldValue.toLowerCase()
            : fieldValue
          : "";
      });
    }
    return value;
  }
}
