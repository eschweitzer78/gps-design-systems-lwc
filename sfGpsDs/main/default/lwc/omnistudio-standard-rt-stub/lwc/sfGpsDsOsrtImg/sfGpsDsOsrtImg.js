import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./img_slds.html";
import ndsTemplate from "./img_nds.html";
import { getSldsResourcesUrl } from "c/sfGpsDsOsrtSalesforceUtils";
import {
  newport,
  getCustomNewportUrl,
  isCommunityPage,
  getCommunityPrefix
} from "c/sfGpsDsOsrtUtility";
import { isSalesforcePlatform } from "c/sfGpsDsOsrtSdkUtility";

export default class Img extends LightningElement {
  @api size;
  @api cropsize;
  @api theme = "slds";
  @api alternativeText = "";
  @api title;
  @api extraclass;
  @api titleclass;
  @api imgHeight;
  @api imgWidth;

  @track _imgsrc;

  @api get imgsrc() {
    return this._imgsrc;
  }
  set imgsrc(val) {
    this.isSrcRelative = !new RegExp("^(?:[a-z]+:)?//", "i").test(val);
    if (this.isSrcRelative) {
      this.srcVal = val;
      this._imgsrc = this.getInstanceUrl() + val;
    } else {
      this._imgsrc = val;
    }
  }

  ndsUrl = "";
  _isCustomNdsUrlResolved = false;

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    isCommunityPage().then((result) => {
      this.isCommunity = result;
      if (this.isCommunity && this.isSrcRelative && this.srcVal) {
        this._imgsrc = getCommunityPrefix() + this.srcVal;
      }
    });
    getCustomNewportUrl().then((url) => {
      this._isCustomNdsUrlResolved = true;
      if (url) {
        this.ndsUrl = url.split("/assets")[0];
      }
    });
  }

  renderedCallback() {
    this.setImgDimension();
  }

  getInstanceUrl() {
    if (this.isCommunity) {
      return getCommunityPrefix();
    } else if (!isSalesforcePlatform) {
      try {
        let connection = require("c/sfGpsDsOsrtOmniscriptConnection").getConnection();
        return connection.instanceUrl;
      } catch (e) {
        return window.location.origin;
      }
    }
    return window.location.origin;
  }

  setImgDimension() {
    if (this.size) {
      this.imgHeight = null;
      this.imgWidth = null;
    }

    let imgElement = this.template.querySelector("img");
    if (imgElement) {
      imgElement.style = imgElement.style ? imgElement.style : {};

      if (this.imgHeight) {
        imgElement.style.height = this.imgHeight;
      } else {
        delete imgElement.style.height;
      }

      if (this.imgWidth) {
        imgElement.style.width = this.imgWidth;
      } else {
        delete imgElement.style.width;
      }
    }
  }

  get getClasses() {
    let classes = this.theme + "-image ";
    classes += this.extraclass ? this.extraclass : "";
    classes += this.size ? ` ${this.theme}-size_${this.size}` : "";
    classes += this.cropsize
      ? ` ${this.theme}-image__crop ${this.theme}-image__crop--${this.cropsize}`
      : "";
    return classes;
  }

  get getTitleClasses() {
    let classes = `${this.theme}-image__title ${this.theme}-image__title--card `;
    classes += this.titleclass ? this.titleclass : "";
    return classes;
  }

  get getAltIconUrl() {
    if (this.theme === "nds" && this._isCustomNdsUrlResolved) {
      if (this.ndsUrl)
        return (
          this.ndsUrl + "/assets/icons/doctype-sprite/svg/symbols.svg#image"
        );
      return newport + "/assets/icons/doctype-sprite/svg/symbols.svg#image";
    }
    return getSldsResourcesUrl() + "icons/doctype-sprite/svg/symbols.svg#image";
  }
}
