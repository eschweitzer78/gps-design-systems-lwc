import { LightningElement, api, track } from "lwc";
import { get } from "c/sfGpsDsOsrtLodash";
import sldsTemplate from "./menu_slds.html";
import ndsTemplate from "./menu_nds.html";

export default class Menu extends LightningElement {
  //DEPRECATED
  @api actions;
  @api record;
  //END OF DEPRECATED

  _extraClass = "";

  @api theme = "slds";
  @api iconName = "utility:down";
  @api overflow = false;
  @api position;
  @api size;
  @api checked;
  @api iconUrl;
  @api label;
  @api variant;
  @api iconPosition;
  @api flyoutObj;
  @api iconSize = "xx-small";
  @api iconColor;
  @api disabled;
  @api styles;
  @api iconOnly;

  //List of getter and setter functions

  @api get menuItems() {
    return this._menuItems;
  }
  set menuItems(val) {
    const validObj = (str) => {
      try {
        if (str.charAt(0) === "\\") {
          str = str.substring(1);
        }
        return JSON.parse(str);
      } catch (e) {
        return [];
      }
    };
    val = val ? (typeof val === "string" ? validObj(val) : val) : [];
    this.uninterpolatedMenuItems = [...val];
    this._menuItems = val;
    if (this.record || this._allMergeFields) {
      this.triggerRender();
    }
  }

  @api get type() {
    return this._type;
  }
  set type(val) {
    this._type = val;
  }

  @api get extraClass() {
    return this._extraClass;
  }
  set extraClass(val) {
    if (val) this._extraClass = val;
  }

  @api
  get value() {
    return this.type !== "action" && this.checked ? this.valueArray : null;
  }
  set value(val) {
    Promise.resolve().then(() => {
      if (this.type !== "action" && this.checked) {
        const validStr = (str) => {
          try {
            return str.indexOf("]") !== -1 ? JSON.parse(str) : str.split(",");
          } catch (e) {
            return "";
          }
        };
        val =
          val && val.length
            ? typeof val === "string"
              ? validStr(val)
              : [...val]
            : "";
        if (val) {
          this.unCheckMenuItem();
          this.setMenuValue(val);
        }
      }
    });
  }
  @track valueArray = [];
  @track _type;
  @track textAlign = "";
  menuItemList = [];
  visibleMenuItemList = [];
  childIcon;
  uninterpolatedMenuItems = [];
  _regexPattern = /\{([a-zA-Z.0-9_]*)\}/g;

  render() {
    if (this.theme === "nds") return ndsTemplate;
    return sldsTemplate;
  }

  renderedCallback() {
    this.initDefault();
    if (!this.dropdownTrigger) {
      this.dropdownTrigger = this.template.querySelector(
        `.${this.theme}-dropdown-trigger_click`
      );
    }
  }

  initDefault() {
    this.visibleMenuItemList = [];
    this.menuItemList = this.menuItems
      ? this.template.querySelectorAll(".menu-item-container")
      : this.querySelectorAll(".menu-item-container");
    for (let i = 0; i < this.menuItemList.length; i++) {
      let element = this.menuItemList[i];
      if (!element.classList.value.includes("slds-hide")) {
        this.visibleMenuItemList.push(element);
      }
      if (element && !element.firstRender) {
        element.addEventListener("update", this.updateMenu);
        element.addEventListener(
          "uparrow",
          this.shiftFocusToPreviousItem.bind(this)
        );
        element.addEventListener(
          "downarrow",
          this.shiftFocusToNextItem.bind(this)
        );
        element.addEventListener("hidemenu", this.hideMenuDropDown.bind(this));
        if (element.type !== "header" && element.type !== "action") {
          if (this.checked && this.type !== "action") {
            element.updateItem({ value: "showCheckIcon" });
            if (element.checked) this.valueArray.push(element.record.value);
          } else if (this.type === "action") {
            element.updateItem({ value: "action" });
          }
        }
        if (!this.childIcon) this.childIcon = element.iconName ? true : false;
        element.firstRender = true;
      }
    }
  }

  //To get interpolated label value
  get interpolatedLabel() {
    if (
      this.label &&
      this.label.indexOf("{") !== -1 &&
      (this.record || this._allMergeFields)
    ) {
      let stringToInterpolate =
        this.label.charAt(0) === "\\" ? this.label.substring(1) : this.label;
      return stringToInterpolate.replace(/\{(.*?)\}/g, (match, expr) => {
        let fieldValue = get(this.record, expr);
        if (this._allMergeFields && !fieldValue) {
          fieldValue = get(this._allMergeFields, expr);
        }
        return typeof fieldValue !== "undefined" ? fieldValue : match;
      });
    }
    return this.label;
  }

  hideMenuDropDown() {
    if (this.allowBlur === true) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        const dropdown = this.template.querySelector(
          `.${this.theme}-dropdown-trigger_click`
        );
        if (dropdown && dropdown.classList.contains(`${this.theme}-is-open`)) {
          dropdown.classList.remove(`${this.theme}-is-open`);
        }
      }, 5);
    }
  }

  unCheckMenuItem() {
    // eslint-disable-next-line array-callback-return
    for (let i = 0; i < this.menuItemList.length; i++) {
      let item = this.menuItemList[i];
      item.updateItem({ value: false });
    }
    this.valueArray = [];
  }

  setMenuValue(val) {
    for (let i = 0; i < this.menuItemList.length; i++) {
      let item = this.menuItemList[i];
      if (
        item &&
        item.record &&
        val.indexOf(item.record.value) !== -1 &&
        item.type !== "action" &&
        item.type !== "header"
      ) {
        item.updateItem({ value: true });
        this.valueArray.push(item.record.value);
        if (this.checked && this.checked === "single") break;
      }
    }
  }

  updateMenu = (ev) => {
    let data = ev.detail.result;
    if (this.type !== "action" && this.checked && data.value !== "onlyBlur") {
      if (this.checked && this.checked === "single") {
        this.unCheckMenuItem();
      }
      if (data.value) this.valueArray.push(data.name);
      else if (this.valueArray.indexOf(data.name) !== -1)
        this.valueArray.splice(this.valueArray.indexOf(data.name), 1);
    }
    if (this.type === "action" && data.flyoutName) {
      Promise.resolve().then(() => {
        if (this.querySelector("[data-id=" + data.flyoutName + "]")) {
          this.template.querySelector(".menuItemFlyout").openModal();
          this.selectedFlyout = data.flyoutName;
          this.querySelector(
            "[data-id=" + data.flyoutName + "]"
          ).style.display = "block";
        }
      });
    }
    Promise.resolve().then(() => {
      this.allowBlur = true;
      this.hideMenuDropDown();
    });
  };

  isMenuDisplayed = false;

  toggleMenu() {
    this.allowBlur = true;
    this.dropdownTrigger.classList.toggle(`${this.theme}-is-open`);
    this.isMenuDisplayed = this.dropdownTrigger.classList.contains(
      `${this.theme}-is-open`
    )
      ? "true"
      : "false";
    this._currentItemIndex = 0;
  }

  _currentItemIndex = 0;

  shiftFocusToPreviousItem() {
    if (this._currentItemIndex > 0) {
      this._currentItemIndex--;
    } else {
      this._currentItemIndex = this.visibleMenuItemList.length - 1;
    }
    this.allowBlur = true;
    this.visibleMenuItemList[this._currentItemIndex].focus();
  }

  shiftFocusToNextItem() {
    if (this._currentItemIndex < this.visibleMenuItemList.length - 1) {
      this._currentItemIndex++;
    } else {
      this._currentItemIndex = 0;
    }
    this.allowBlur = true;
    this.visibleMenuItemList[this._currentItemIndex].focus();
  }

  handleKeyDown(e) {
    if (this.isMenuDisplayed) {
      switch (e.keyCode) {
        // Shift focus on down arrow key press
        case 40:
          this.allowBlur = false;
          if (this.visibleMenuItemList.length > 0) {
            this.visibleMenuItemList[0].focus();
            this._currentItemIndex = 0;
            this.allowBlur = true;
          }
          break;
        // Hide menu on any other key press
        case 27:
          this.allowBlur = true;
          this.hideMenuDropDown();
          break;
        default:
      }
    }
  }

  hideFlyout() {
    if (
      this.selectedFlyout &&
      this.querySelector("[data-id=" + this.selectedFlyout + "]")
    )
      this.querySelector(
        "[data-id=" + this.selectedFlyout + "]"
      ).style.display = "none";
    this.selectedFlyout = null;
  }

  handleOpenModal() {
    let element = this.template.querySelector(".flexMenuItems");
    if (element) {
      element.classList.remove(`${this.theme}-dropdown`);
      element.classList.remove(
        `${this.theme}${
          this.position ? "-dropdown_" + this.position : "-dropdown_left"
        }`
      );
      element.style.visibility = "hidden";
      element.style.maxHeight = "0";
      element.style.overflowY = "visible";
      element.style.position = "absolute";
    }
  }

  handleCloseModal() {
    let element = this.template.querySelector(".flexMenuItems");
    if (element) {
      element.classList.add(`${this.theme}-dropdown`);
      element.classList.add(
        `${this.theme}${
          this.position ? "-dropdown_" + this.position : "-dropdown_left"
        }`
      );
      element.style.visibility = "visible";
      element.style.maxHeight = "none";
      element.style.removeProperty("overflow-y");
      element.style.removeProperty("position");
    }
  }

  handleDropdownMouseDown(event) {
    const mainButton = 0;
    if (event.button === mainButton) {
      this.allowBlur = false;
    }
  }

  get dropdownClass() {
    return `flexMenuItems ${this.theme}-dropdown ${
      this.size ? this.theme + "-dropdown_" + this.size : ""
    } ${this.theme}${
      this.position ? "-dropdown_" + this.position : "-dropdown_left"
    } ${
      this.overflow === "true" || this.overflow === true
        ? this.childIcon
          ? this.theme + "-dropdown_length-with-icon-5"
          : this.theme + "-dropdown_length-5"
        : ""
    } ${this.type === "action" ? this.theme + "-dropdown_actions" : ""}`;
  }
}
