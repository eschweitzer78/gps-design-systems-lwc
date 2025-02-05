import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { normaliseBoolean, replaceInnerHtml } from "c/sfGpsDsHelpers";

const DISPLAYTRANSCRIPT_DEFAULT = false;

export default class extends SfGpsDsLwc {
  @api title; // string
  @api width; // number
  @api height; // number
  @api src; // string
  @api variant; // string: link, full
  @api url; // string -- unused
  @api className;

  /* api: mediaLink, string in link markdown format */

  _mediaLink;
  _mediaLinkOriginal;

  @api
  get mediaLink() {
    return this._mediaLinkOriginal;
  }

  set mediaLink(markdown) {
    try {
      this._mediaLinkOriginal = markdown;
      this._mediaLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      console.log(e);
      this.addError("ML-MD", "Issue when parsing MediaLink markdown");
      this._name = {};
    }
  }

  /* api: transcript */

  _transcriptHtml;
  _transcriptOriginal;

  @api
  get transcript() {
    return this._transcriptOriginal;
  }

  set transcript(markdown) {
    try {
      this._transcriptOriginal = markdown;
      this._transcriptHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("TR-MD", "Issue when parsing Transcript markdown");
    }
  }

  /* api: displayTranscript */

  _displayTranscript = DISPLAYTRANSCRIPT_DEFAULT;
  _displayTranscriptOriginal = DISPLAYTRANSCRIPT_DEFAULT;

  @api
  get displayTranscript() {
    return this._displayTranscriptOriginal;
  }

  set displayTranscript(value) {
    this._displayTranscriptOriginal = value;
    this._displayTranscript = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISPLAYTRANSCRIPT_DEFAULT
    });
  }

  /* computed */

  get computedShowTranscriptSection() {
    return this.variant === "full" || this._displayTranscript;
  }

  /* lifecycle */

  renderedCallback() {
    const element = this.refs.markdown;

    if (this.computedShowTranscriptSection && element) {
      replaceInnerHtml(element, this._transcriptHtml);
    }
  }
}
