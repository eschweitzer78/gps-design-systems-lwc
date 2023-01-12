import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { normaliseBoolean, replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicEmbeddedVideoComm extends SfGpsDsLwc {
  @api title; // string
  @api width; // number
  @api height; // number
  @api src; // string
  @api variant; // string: link, full
  @api url; // string

  /* api: mediaLink, string in link markdown format */

  _mediaLinkOriginal;
  _mediaLink;

  @api get mediaLink() {
    return this._mediaLinkOriginal;
  }

  set mediaLink(markdown) {
    this._mediaLinkOriginal = markdown;

    try {
      this._mediaLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      console.log(e);
      this.addError("ML-MD", "Issue when parsing MediaLink markdown");
      this._name = {};
    }
  }

  @api className;

  /* api: transcript */

  _transcriptOriginal;
  _transcriptHtml;

  @api get transcript() {
    return this._transcriptOriginal;
  }

  set transcript(markdown) {
    this._transcriptOriginal = markdown;

    try {
      this._transcriptHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("TR-MD", "Issue when parsing Transcript markdown");
    }
  }

  _displayTranscriptOriginal;
  _displayTranscript;

  @api get displayTranscript() {
    return this._displayTranscriptOriginal;
  }

  set displayTranscript(value) {
    this._displayTranscriptOriginal = value;
    this._displayTranscript = normaliseBoolean({
      acceptString: true,
      fallbackValue: false
    });
  }

  get showTranscriptSection() {
    return this.variant === "full" || this.displayTranscript;
  }

  /* lifecycle */

  _rendered;

  renderedCallback() {
    if (!this._rendered) {
      if (this.showTranscriptSection) {
        let element = this.template.querySelector(".sfGpsMarkdown");

        if (element) {
          replaceInnerHtml(element, this._transcriptHtml);
        } else {
          this.addError(
            "CO-PH",
            "Couldn't find internal Caption markdown placeholder"
          );
        }
      }

      this._rendered = true;
    }
  }
}
