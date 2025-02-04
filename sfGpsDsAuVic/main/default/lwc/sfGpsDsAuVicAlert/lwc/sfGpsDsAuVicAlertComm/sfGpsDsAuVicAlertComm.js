import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { uniqueId, computeClass } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

const types = {
  Emergency: {
    backgroundColor: "danger",
    iconSymbol: "alert_information"
  },
  Fire: {
    backgroundColor: "danger",
    iconSymbol: "alert_fire"
  },
  Flood: {
    backgroundColor: "danger",
    iconSymbol: "alert_flood"
  },
  Medical: {
    backgroundColor: "danger",
    iconSymbol: "alert_medical"
  },
  Lightning: {
    backgroundColor: "warning",
    iconSymbol: "alert_lightning"
  },
  Pollution: {
    backgroundColor: "warning",
    iconSymbol: "alert_smoke"
  },
  "Heat wave": {
    backgroundColor: "warning",
    iconSymbol: "alert_high_temperature"
  },
  Traffic: {
    backgroundColor: "dark_neutral",
    iconSymbol: "alert_transport"
  }
};

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api title;
  @api className;

  /* api: type */

  _typeOriginal;
  backgroundColor;
  iconSymbol;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    const entry = types[value] || types.Emergency;
    this.backgroundColor = entry.backgroundColor;
    this.iconSymbol = entry.iconSymbol;
  }

  /* api: link */

  _link;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
    }
  }

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-alert": true,
      [this.className]: this.className
    });
  }

  _labelId;

  get computedLabelId() {
    if (this._labelId === undefined) {
      this._labelId = uniqueId("sf-gps-ds-au-vic-alert-comm-label");
    }

    return this._labelId;
  }

  /* event management */

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
