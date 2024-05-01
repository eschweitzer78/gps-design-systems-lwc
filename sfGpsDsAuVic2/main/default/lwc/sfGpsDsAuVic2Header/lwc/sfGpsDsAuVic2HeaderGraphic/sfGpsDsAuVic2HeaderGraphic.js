import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import STATIC_RESOURCE from "@salesforce/resourceUrl/sfGpsDsAuVic2";

export default class extends LightningElement {
  @api image;
  @api placement;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-header-graphic": true,
      "rpl-header-graphic--top": this.placement === "top",
      "rpl-header-graphic--bottom": this.placement === "bottom",
      "rpl-header-graphic--image": this.image,
      "rpl-header-graphic--pattern": !this.image,
      [this.className]: this.className
    });
  }

  get computedIsTopPlacement() {
    return this.placement === "top";
  }

  get computedIsBottomPlacement() {
    return this.placement === "bottom";
  }

  get computedTrianglesTopHref() {
    return `${STATIC_RESOURCE}/assets/patterns/triangles-top.svg#triangles-top`;
  }

  get computedTrianglesBottomHref() {
    return `${STATIC_RESOURCE}/assets/patterns/triangles-bottom.svg#triangles-bottom`;
  }
}
