import { LightningElement, api, track } from "lwc";

export default class MenuItem extends LightningElement {
  static delegatesFocus = true;

  // Api Variables
  @api record = {};
  @api obj;
  @api iconName;
  @api openUrlIn = "newTab";
  @api iconPosition;
  @api iconText;
  @api theme = "slds";
  @api label;
  @api status;
  @api iconUrl;
  @api name;

  // Getter and setter functions
  @api get actionData() {
    return this._actionData;
  }
  set actionData(val) {
    this._actionData = val;
  }

  @api get actionUrl() {
    // eslint-disable-next-line no-script-url
    return this._actionUrl || "javaScript:void(0);";
  }
  set actionUrl(val) {
    this._actionUrl = val;
    if (!this.actionData || !this.actionData.stateAction) {
      this.actionData = {
        stateAction: {
          id: "custom-action-" + this.uniqueKey(),
          type: "Custom",
          targetType: "Web Page",
          openUrlIn: this.openUrlIn || "Current Window",
          "Web Page": { targetName: val }
        }
      };
    }
  }

  @api get checked() {
    return this.isChecked;
  }
  set checked(val) {
    this.isChecked = val && val !== "false" ? true : false;
  }

  @api get type() {
    return this.itemType;
  }
  set type(val) {
    this.itemType = val;
  }

  // Track Variables
  @track isBaseVersion = false;
  @track itemType;
  @track showCheckIcon = false;
  @track isChecked = false;
  @track showCheckIcon = false;
  @track isTypeAction = false;

  // Private variables
  _actionData = {};
  isIconRight = false;

  connectedCallback() {
    this.classList.add("menu-item-container");
    this.setAttribute("checked", this.checked);
    this.setAttribute("type", this.type);
    this.setAttribute("iconName", this.iconName);
    this.isIconRight =
      this.iconPosition && this.iconPosition.toLowerCase() === "right"
        ? true
        : false;
    this.isChecked =
      this.type !== "header" && this.type !== "action" ? this.isChecked : false;
    this.isTypeAction = this.type === "action";
  }

  uniqueKey() {
    return Date.now() + "-" + Math.random();
  }

  renderedCallback() {
    if (!this.firstRender) {
      this.firstRender = true;
      const elem = this.querySelectorAll("*")[0];
      this.isBaseVersion = elem ? false : true;
    }
  }

  @api updateItem(data) {
    if (data.value === "action") {
      this.itemType = "action";
      this.isTypeAction = true;
    } else if (data.value === "showCheckIcon") this.showCheckIcon = true;
    else this.isChecked = data.value;
  }

  get extraClasses() {
    let classes =
      this.theme +
      "-icon-text-default " +
      this.theme +
      (this.iconPosition && this.iconPosition.toLowerCase() === "right"
        ? "-m-left_small " + this.theme + "-shrink-none"
        : "-m-right_x-small");
    return classes;
  }

  get iconClass() {
    let iconClass =
      this.theme +
      "-icon_selected " +
      this.theme +
      "-icon-text-default " +
      this.theme +
      "-m-right_x-small";
    return iconClass;
  }

  get truncateClass() {
    return `${this.theme}-truncate menu-item-label`;
  }
  get dropdownClass() {
    return `${this.theme}-dropdown__item ${
      this.type === "header" ? this.theme + "-dropdown__header" : ""
    } ${this.isChecked ? this.theme + "-is-selected" : ""}`;
  }
  get statusClass() {
    return `${this.status ? this.theme + "-has-" + this.status : ""}`;
  }
  get navigateActionClass() {
    return `${this.theme}-dropdown__item`;
  }
  get menuLabel() {
    return this.label
      ? this.label
      : this.record && this.record.label
        ? this.record.label
        : "";
  }
  toggleCheck() {
    let val = "onlyBlur";
    if (this.type !== "header" && !this.isTypeAction) {
      val = this.showCheckIcon ? !this.isChecked : false;
    }
    let data = {
      name: this.menuLabel.toLowerCase(),
      value: val
    };
    if (
      this.isTypeAction &&
      this.actionData.stateAction?.type === "Flyout" &&
      this.actionData.stateAction.menuFlyoutId
    ) {
      data.flyoutName = this.actionData.stateAction.menuFlyoutId;
    }
    this.fireEvent("update", data);
    this.isChecked = val;
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case 38:
        this.fireEvent("uparrow");
        break;
      case 40:
        this.fireEvent("downarrow");
        break;
      case 27:
      case 9:
        this.fireEvent("hidemenu");
        break;
      default:
    }
  }

  fireEvent(eventName, data) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        result: data
      }
    });
    this.dispatchEvent(event);
  }
}
