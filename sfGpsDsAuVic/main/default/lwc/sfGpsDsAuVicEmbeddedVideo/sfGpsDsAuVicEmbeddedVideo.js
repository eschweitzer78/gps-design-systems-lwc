import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicEmbeddedVideo extends LightningElement {
  static renderMode = "light";

  @api title; // string
  @api width; // number
  @api height; // number
  @api src; // string
  @api variant; // string: link, full
  @api transcript; // string
  @api mediaLink; //   { iconSymbol: String, iconColor: string, iconPlacement: string, iconSize: string; text: string, link: string }
  @api displayTranscript; // boolean
  @api className;

  get isLink() {
    return this.variant === "link";
  }

  get showTranscriptSection() {
    return this.variant === "full" || this.displayTranscript;
  }

  get computedClassName() {
    return computeClass({
      "rpl-embedded-video": true,
      [this.className]: this.className
    });
  }
}
