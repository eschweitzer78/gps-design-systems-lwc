/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.11
 */

import { LightningElement, api, track } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const LAYOUT_STACK = "stack";
const LAYOUT_STACKCENTERED = "stack centered";
const LAYOUT_TWOCOLUMNTOP = "two-column top";
const LAYOUT_TWOCOLUMNCENTERED = "two-column centered";
const LAYOUT_VALUES = [
  LAYOUT_STACK,
  LAYOUT_STACKCENTERED,
  LAYOUT_TWOCOLUMNTOP,
  LAYOUT_TWOCOLUMNCENTERED
];
const LAYOUT_DEFAULT = LAYOUT_STACK;

const SIZE_DEFAULT = "default";
const SIZE_75 = "75%";
const SIZE_VALUES = [SIZE_DEFAULT, SIZE_75];

const VIDEOTYPE_VIMEO = "vimeo";
const VIDEOTYPE_YOUTUBE = "youtube";
const VIDEOTYPE_VALUES = {
  [VIDEOTYPE_VIMEO]: "https://player.vimeo.com/video/",
  [VIDEOTYPE_YOUTUBE]: "https://www.youtube.com/embed/"
};
const VIDEOTYPE_DEFAULT = VIDEOTYPE_YOUTUBE;

const CSTYLE_VALUES = {
  default: "",
  light: "qld__body--light",
  alternate: "qld__body--alt",
  dark: "qld__body--dark",
  "dark-alternate": "qld__body--dark-alt"
};
const CSTYLE_DEFAULT = "default";

export default class extends LightningElement {
  @api videoId;
  @api caption;
  @api duration;
  @api transcriptLink;
  @api transcript;
  @api className;

  /* api: mode */

  _layout = LAYOUT_DEFAULT;
  _layoutOriginal = LAYOUT_DEFAULT;

  @api
  get layout() {
    return this._layoutOriginal;
  }

  set layout(value) {
    this._layoutOriginal = value;
    this._layout = normaliseString(value, {
      validValues: LAYOUT_VALUES,
      fallbackValue: LAYOUT_DEFAULT
    });
  }

  /* api: videoType */

  _videoType = VIDEOTYPE_DEFAULT;
  _videoTypeOriginal = VIDEOTYPE_DEFAULT;

  @api
  get videoType() {
    return this._videoTypeOriginal;
  }

  set videoType(value) {
    this._videoTypeOriginal = value;
    this._videoType = normaliseString(value, {
      validValues: VIDEOTYPE_VALUES,
      fallbackValue: VIDEOTYPE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: size */

  _size = SIZE_DEFAULT;
  _sizeOriginal = SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: SIZE_VALUES,
      fallbackValue: SIZE_DEFAULT
    });
  }

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

  /* tracked */

  @track _transcriptOpen = false;

  /* getters */

  get computedPlayerSectionClassName() {
    return {
      "col-xs-12": true,
      "col-lg-8": this._size === SIZE_75
    };
  }

  get computedDescriptionClassName() {
    return {
      "col-xs-12": true,
      "qld__video__copy--centered": this._layout === LAYOUT_STACKCENTERED,
      "text-center": this._layout === LAYOUT_STACKCENTERED
    };
  }

  get computedRowClassName() {
    return {
      row: true,
      "qld__row-gap-component": true,
      "qld__video__player--align-top": this._layout === LAYOUT_TWOCOLUMNTOP,
      "qld__video__player--align-centered_vertically":
        this._layout === LAYOUT_TWOCOLUMNCENTERED
    };
  }

  get computedClassName() {
    return {
      qld__body: true,
      "qld__video__player--wrapper": true,
      [this._cstyle]: this._cstyle,
      [this.className]: this.className
    };
  }

  get computedIsStacked() {
    return this._layout === LAYOUT_STACK;
  }

  get computedVideoUrl() {
    return this._videoType + this.videoId;
  }

  get computedShowCaption() {
    return this.duration || this.caption;
  }

  get computedShowLinkTranscript() {
    return this.transcriptLink && !this.transcript;
  }

  get computedShowAccordionTranscript() {
    return this.transcript;
  }

  get computedClockIconHref() {
    return sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg#clock";
  }

  get computedArrowRightIconHref() {
    return sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg#arrow-right";
  }

  get computedTranscriptIconHref() {
    return sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg#transcript";
  }

  /* event management */

  handleToggleTranscript() {
    this._transcriptOpen = !this._transcriptOpen;
  }
}
