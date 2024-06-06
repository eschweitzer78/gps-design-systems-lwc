import { api } from "lwc";
import LightningModal from "lightning/modal";
import { CodeMirror } from "c/sfGpsDsCodeMirrorEdit";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import modeJavascript from "./mode-javascript";

export default class SfGpsDsMarkupEditor extends LightningModal {
  @api title;
  @api tips;

  _text;

  @api
  set text(value) {
    this._text = value;

    if (this._editor) {
      this._editor.doc?.setValue(this._text);
    }
  }

  get text() {
    return this._text;
  }

  connectedCallback() {
    modeJavascript(CodeMirror);
  }

  _renderedOnce = false;
  _editor;

  async renderedCallback() {
    if (!this._renderedOnce) {
      this._renderedOnce = true;

      /**
       * The following code sounds convoluted, but LWC prevents using insertBefore like
       * CodeMirror.fromTextArea does if said textarea is not in an element that has
       * lwc:dom="manual" set
       */

      const ref = this.refs.textarea;
      replaceInnerHtml(ref, "<textarea></textarea>");
      const textarea = ref.querySelector("textarea");

      this._editor = CodeMirror.fromTextArea(textarea, {
        matchBrackets: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        lineWrapping: true,
        mode: "application/ld+json",
        value: this._text || ""
      });

      this.refs.container.dataset.isReady = "";
    }
  }

  handleCancel() {
    this.close();
  }

  handleSave() {
    if (this._editor) {
      this.close(this._editor.getValue());
    } else {
      this.close();
    }
  }
}
