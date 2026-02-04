import { api } from "lwc";
import LightningModal from "lightning/modal";
import { CodeMirror } from "c/sfGpsDsCodeMirrorEdit";
import { normaliseString, replaceInnerHtml } from "c/sfGpsDsHelpers";
import modeXml from "./mode-xml";
import modeMarkdown from "./mode-markdown";

const MODE_DEFAULT = "xml";

export default class extends LightningModal {
  @api title;
  @api tips;

  /* markup */

  _markup;

  @api
  set markup(value) {
    this._markup = value;

    if (this._editor) {
      this._editor.doc?.setValue(this._markup);
    }
  }

  get markup() {
    return this._markup;
  }

  /* api: mode */

  _mode = MODE_DEFAULT;
  _modeOriginal = MODE_DEFAULT;

  @api
  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValue: ["xml", "markdown"],
      fallbackValue: MODE_DEFAULT
    });
  }

  get mode() {
    return this._modeOriginal;
  }

  /* event management */

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

  /* lifecycle */

  connectedCallback() {
    modeXml(CodeMirror);
    modeMarkdown(CodeMirror);
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
        lineNumbers: true,
        mode: this._mode,
        value: this._markup || "",
        htmlMode: true
      });

      this.refs.container.dataset.isReady = "";
    }
  }
}
