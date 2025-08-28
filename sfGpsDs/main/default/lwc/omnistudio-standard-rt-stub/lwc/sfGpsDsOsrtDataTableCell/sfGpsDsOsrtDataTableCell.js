import { LightningElement, api, track } from "lwc";
import { formatDate } from "c/sfGpsDsOsrtUtility";
import { dataTableLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";
export default class DataTableCell extends LightningElement {
  @api columnData;
  @api cellData;
  @api iconUrl;
  @api theme = "slds";
  @api rowData = {};
  @api dateFormat;
  @api isCustomUi;
  @api cellWrapperClass;

  translatedLabels = {};

  _isCheckBoxFocused = false;
  _checkBoxEventCount = 1;
  hasError = false;
  @api
  get cellElem() {
    return this.cellData.label
      ? null
      : this.template.querySelector(".editableField");
  }

  get fieldType() {
    if (this.columnData && this.columnData.type && this.cellData) {
      return this.columnData.type;
    }
    return "text";
  }

  get outputFieldClass() {
    return `${this.theme}-show_inline-block`;
  }

  get iconClass() {
    return `hover-icon ${this.theme}-transition-hide`;
  }

  get showOutputField() {
    return this.cellData.label && this.columnData.type !== "icon";
  }

  get showIconField() {
    return (
      this.cellData.label &&
      this.columnData.type === "icon" &&
      this.cellData.value === true
    );
  }

  get showEmptyIconField() {
    return (
      this.cellData.label &&
      this.columnData.type === "icon" &&
      this.cellData.value === false
    );
  }

  get checkBoxType() {
    return (
      this.fieldType === "checkbox" ||
      this.cellData.checkbox ||
      this.cellData.icon
    );
  }

  get isEditable() {
    return !this.cellData.editable;
  }

  get actionIconClass() {
    return `${this.theme}-p-around_xxx-small ${this.theme}-icon_container--circle ${this.theme}-float_left`;
  }
  get dataTableCellClass() {
    let cellClass = "";
    if (this.fieldType === "checkbox") {
      cellClass = "checkBoxCell";
    }
    if (this.isCustomUi === "true" || this.isCustomUi) {
      cellClass = cellClass + " tableRowCell";
    }
    if (this.cellData.label && this.theme === "nds") {
      cellClass = cellClass + " top-padding";
    }
    if (this.cellWrapperClass) {
      cellClass = cellClass + ` ${this.cellWrapperClass}`;
    }
    return cellClass;
  }
  get preventNavigation() {
    return this.columnData.type === "url" && this.columnData.preventNavigation;
  }

  @track percentMask = {
    mask: Number(),
    radix: "."
  };

  fireEvent(eventName, data) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        result: data || ""
      }
    });
    this.dispatchEvent(event);
  }

  checkValidity(event) {
    this.hasError = !event.currentTarget.reportValidity();
  }

  editDataCell(event) {
    event?.stopPropagation();
    this.fireEvent("click", this.cellData.value);
    // blur event gets triggered on checkbox on second click, making sure that click happened outside checkbox
    if (event?.target?.dataset?.checkbox) {
      if (!this._isCheckBoxFocused) this.fireEvent("edit", event);
    } else if (!this.hasError) {
      this.fireEvent("edit", event);
    } else if (this.hasError) {
      event.target.value = this.cellData.date
        ? formatDate(this.cellData.value, this.dateFormat)
        : this.cellData.value;
      this.fireEvent("edit", event);
    }
  }

  onClickFieldValue(event) {
    event.stopPropagation();
    // onclick event gets triggered twice on checkbox, this is to avoid that
    if (event.target.dataset && event.target.dataset.checkbox) {
      if (this._checkBoxEventCount === 1) {
        this._checkBoxEventCount++;
        this.fireEvent("click", this.cellData.value);
      } else {
        this._checkBoxEventCount = 1;
      }
    } else {
      this.fireEvent("click", this.cellData.value);
    }
  }

  mouseoverField(event) {
    if (!this._cellHasFocus) {
      const target = event.currentTarget;
      const hoverIcon = target.querySelector(".hover-icon");
      if (!hoverIcon) {
        return;
      }
      hoverIcon.classList.remove(`${this.theme}-transition-hide`);
    }
    event.stopPropagation();
  }

  mouseoutField(event) {
    if (!this._cellHasFocus) {
      const target = event.currentTarget;
      const hoverIcon = target.querySelector(".hover-icon");
      if (hoverIcon) {
        hoverIcon.classList.add(`${this.theme}-transition-hide`);
      }
    }
    event.stopPropagation();
  }
  mouseoverLeaveBox() {
    this._isCheckBoxFocused = false;
  }
  focusCheckbox(event) {
    //checkbox needs to be focused in firebox to trigger blur event
    event.target.focus();
    this._isCheckBoxFocused = true;
  }

  _cellHasFocus = false;
  @api showEditIcon(show) {
    const editIconEle = this.template.querySelector(".hover-icon");
    if (show) {
      editIconEle?.classList?.remove(`${this.theme}-transition-hide`);
      this._cellHasFocus = true;
    } else {
      editIconEle?.classList?.add(`${this.theme}-transition-hide`);
      this._cellHasFocus = false;
    }
  }

  @api triggerEditCell() {
    if (this._cellHasFocus) {
      const editIcon = this.template.querySelector(".hover-icon");
      editIcon.click();
    }
  }

  connectedCallback() {
    this.translatedLabels = translatedLabels;
  }

  renderedCallback() {
    // When ever cell is editable focus on it.
    // When enter is pressed save the value and try to save the state
    const editAbleField = this.template.querySelector(".editableField");
    if (editAbleField) {
      editAbleField.focus();

      editAbleField.addEventListener("keydown", this.handleKeyDown);
    }
  }

  handleKeyDown = (event) => {
    if (event?.key === "Enter" || event?.key === "Escape") {
      event.currentTarget.blur();
    }
  };
}
