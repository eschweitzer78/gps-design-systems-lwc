import { api, LightningElement } from "lwc";

export default class OmniScriptEditBlockWrapper extends LightningElement {
  @api jsonDef;
  @api layout;
  @api scriptHeaderDef;
  _pendingUpdates = 0;
  _role = null;
  allCustomLabelsUtil;

  handleAdd(evt) {
    this._pendingUpdates++;
    evt.stopPropagation();
  }

  handleCancel(evt) {
    if (this._pendingUpdates > 0) {
      this._pendingUpdates--;
    }
    evt.stopPropagation();
  }

  handleSave(evt) {
    if (this._pendingUpdates > 0) {
      this._pendingUpdates--;
    }
    evt.stopPropagation();
  }

  handleRemove() {
    // here we query for the default slot
    const elem = this.querySelector("slot:not([name]) > *");
    if (elem && typeof elem.focus === "function") {
      elem.focus();
    }
  }

  get assistiveTextItemCountLabel() {
    let count = 0;
    let label = "";
    if (this.jsonDef && this.jsonDef.eleArray) {
      const realChildren = this.jsonDef.eleArray.filter((eleArray) => {
        return eleArray.children.length > 0;
      });
      count = realChildren.length - this._pendingUpdates;
    }
    if (this.allCustomLabelsUtil) {
      label =
        count === 1
          ? this.allCustomLabelsUtil.OmniEditBlockItemCountAssistiveText
          : this.allCustomLabelsUtil.OmniEditBlockItemsCountAssistiveText;
    }
    return label.replace("{0}", count);
  }

  connectedCallback() {
    this._theme = this.layout === "newport" ? "nds" : "slds";
    if (this.scriptHeaderDef && this.scriptHeaderDef.allCustomLabels) {
      this.allCustomLabelsUtil = this.scriptHeaderDef.allCustomLabels;
    }
    if (this.jsonDef) {
      const ebmode = this.jsonDef.eleArray[0]?.propSetMap.mode;
      if (ebmode === "LongCards") {
        this._role = "list";
      }
      if (ebmode === "" || ebmode === "Table") {
        this._role = "table";
      }
    }
  }
  constructor() {
    super();
    this.template.addEventListener(
      "omnieditblockshow",
      this.handleShow.bind(this)
    );
  }

  handleShow(evt) {
    if (evt.detail?.show === false) {
      this.classList.add(this._theme + "-hide");
    } else {
      this.classList.remove(this._theme + "-hide");
    }
  }
}
