import { api } from "lwc";
import LightningModal from "lightning/modal";
import { CodeMirror } from "c/sfGpsDsCodeMirrorEdit";
import { normaliseString } from "c/sfGpsDsHelpers";
import modeXml from "./mode-xml";
import modeMarkdown from "./mode-markdown";

export default class SfGpsDsMarkupEditor extends LightningModal {
  @api title;
  @api tips;

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

  _mode = "xml";
  _modeOriginal = this._mode;

  @api
  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValue: ["xml", "markdown"],
      fallbackValue: "xml"
    });
  }

  get mode() {
    return this._modeOriginal;
  }

  connectedCallback() {
    modeXml(CodeMirror);
    modeMarkdown(CodeMirror);
  }

  _renderedOnce = false;
  _editor;

  async renderedCallback() {
    if (!this._renderedOnce) {
      this._renderedOnce = true;

      this._editor = CodeMirror.fromTextArea(this.refs.textarea, {
        lineNumbers: true,
        mode: this._mode,
        value: this._markup || "",
        htmlMode: true
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
