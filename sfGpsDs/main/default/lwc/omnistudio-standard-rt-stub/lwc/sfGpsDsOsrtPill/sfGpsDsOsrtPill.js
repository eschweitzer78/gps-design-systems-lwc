import { LightningElement, api, track } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { pillLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";
import sldsTemplate from "./pill_slds.html";
import ndsTemplate from "./pill_nds.html";

export default class Pill extends LightningElement {
  @api label;
  _theme = "slds";
  @api get theme() {
    return this._theme;
  }
  set theme(val) {
    if (val && val === "nds") {
      this._theme = "nds";
    } else {
      this._theme = "slds";
    }
    this.setOptionsClass();
  }
  @api disabled;
  @api extraclass = "";
  @api placeholder;
  @api freetext;
  @api viewonly;
  @api name;
  @api iconUrl;
  @api tagExtraclass = "";
  @api required;
  @track _options;
  @track inputValue;
  @track pillValue;
  @track islistvisible = false;
  @track valueMap = [];
  filteredOptions = [];

  @api
  get value() {
    return this.pillValue;
  }
  set value(value) {
    this.updatePill(value);
  }

  @api
  get options() {
    return this._options;
  }
  set options(value) {
    if (typeof value === "string") value = JSON.parse(value);
    this._options =
      value &&
      value.map((label) => {
        return {
          id: this.uniqueId(),
          label: label,
          class: ""
        };
      });
    this.setOptionsClass();
  }

  @track styleProperties = {
    label: {},
    value: {}
  };

  @api get styles() {
    return this._styles;
  }

  set styles(val) {
    const validObj = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return {};
      }
    };

    val = val ? (typeof val === "string" ? validObj(val) : val) : {};
    val = val.styles ? val.styles : val;
    this._styles = val;
    if (this.styles) {
      for (let key in this.styles) {
        if (this._styles.hasOwnProperty(key)) {
          this.styleProperties[key] = {};
          if (key === "label") {
            this.styleProperties.label.styles = "";
            this.updateStyles(this.styles[key], key);
          } else if (key === "value") {
            this.updateStyles(this.styles[key], key);
          }
        }
      }
    }
  }

  updateStyles(styleObj, styleKey) {
    let keys = Object.keys(styleObj);
    keys.forEach((key) => {
      if (!this.styleProperties[styleKey].styles) {
        this.styleProperties[styleKey].styles = "";
      }
      this.styleProperties[styleKey].styles += `${lwcPropertyNameConversion(
        key
      )}:${styleObj[key]};`;
    });
  }

  get pillClass() {
    return `${this.theme}-form-element ${this.extraclass}`;
  }

  updatePill(value) {
    this.pillValue = value;
    this.valueMap =
      value &&
      value.split(",").map((label) => {
        return {
          id: this.uniqueId(),
          label: label
        };
      });
    this.valueMap = this.valueMap === "" ? [] : this.valueMap;
    this.filteredOptions = [];
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  toggleLookup(event) {
    this.filterOptions();
    if (event.type === "focus" && this.filteredOptions.length > 0) {
      this.islistvisible = true;
    } else if (event.type === "blur") {
      this.islistvisible = false;
    }
  }
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

  handleKeyDown(event) {
    const itemInFocusIndex = this.filteredOptions.findIndex((item) => {
      return item.class.includes(`${this.theme}-has-focus`);
    });
    if (event.key === "Escape" || event.key === "Esc") {
      this.islistvisible = false;
    } else if (
      event.key === "ArrowUp" ||
      event.key === "Up" ||
      event.key === "ArrowDown" ||
      event.key === "Down"
    ) {
      if (this.filteredOptions.length > 0) {
        let setFocusIndex = 0;
        if (itemInFocusIndex === -1) {
          // Nothing is in focus already
          // Focus the first item.
          if (event.key === "ArrowDown" || event.key === "Down") {
            this.setFocusOnItem(setFocusIndex);
          } else if (event.key === "ArrowUp" || event.key === "Up") {
            this.setFocusOnItem(this.filteredOptions.length - 1);
          }
        } else if (event.key === "ArrowDown" || event.key === "Down") {
          // Item already in focus.
          // Focus the next item
          setFocusIndex = (itemInFocusIndex + 1) % this.filteredOptions.length;
          this.setFocusOnItem(setFocusIndex);
        } else if (event.key === "ArrowUp" || event.key === "Up") {
          setFocusIndex =
            (itemInFocusIndex - 1 + this.filteredOptions.length) %
            this.filteredOptions.length;
          this.setFocusOnItem(setFocusIndex);
        }
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (
        this.freetext &&
        event.target.value.trim().length > 0 &&
        this.valueMap.indexOf(event.target.value) === -1 &&
        itemInFocusIndex === -1
      ) {
        this.addValue(event.target.value);
        this.islistvisible = false;
      } else if (itemInFocusIndex !== -1 && this.filteredOptions.length) {
        // Select the opition thats in focus
        const selectedItemName = this.filteredOptions[itemInFocusIndex].label;
        this.selectOption(null, selectedItemName);
      }
    }
  }

  setFocusOnItem(selectedIndex) {
    const fOptions = [...this.filteredOptions];
    fOptions.forEach((item, index) => {
      if (index === selectedIndex) {
        item.class = `${this.theme}-item ${this.theme}-listbox__option ${this.theme}-has-focus`;
      } else {
        item.class = `${this.theme}-item`;
      }
    });
    this.filteredOptions = [...fOptions];
  }

  selectOption(event, selectedItemName) {
    this.inputValue = "";
    const item = event
      ? event.currentTarget.getAttribute("data-field")
      : selectedItemName;
    this.addValue(item);
    this.fireEvent("select", item);
  }

  addValue(item) {
    this.valueMap = JSON.parse(JSON.stringify(this.valueMap));
    this.valueMap.push({
      id: this.uniqueId(),
      label: item
    });
    this.pillValue = this.valueMap.map((a) => a.label).join(",");
    this.filterOptions();
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.pillValue
    });
  }

  filterOptions(event) {
    if (this.options) {
      this.filteredOptions = this.options.filter((option) => {
        this.inputValue = event ? event.target.value : "";
        if (event && event.target.value) {
          return option.label
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
        } else if (
          this.valueMap &&
          this.valueMap.map((a) => a.label).indexOf(option.label) !== -1
        ) {
          return false;
        }
        return true;
      });
    }
  }

  translatedLabels = {};

  connectedCallback() {
    this.inputValue = "";
    this.translatedLabels = translatedLabels;
  }

  setOptionsClass() {
    if (this.theme && this._options?.length) {
      this._options = this._options.map((item) => {
        return {
          id: item.id,
          label: item.label,
          class: `${this.theme}-item`
        };
      });
    }
  }

  removeValue(event) {
    const item = event.currentTarget.getAttribute("data-field");
    this.valueMap.splice(this.valueMap.map((a) => a.label).indexOf(item), 1);
    this.pillValue = this.valueMap.map((a) => a.label).join(",");
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.pillValue
    });
    this.fireEvent("remove", event.currentTarget.dataset.field);
  }

  uniqueId() {
    return Date.now() + "-" + Math.random();
  }

  get itemTagClass() {
    let classes = `${this.tagExtraclass ? this.tagExtraclass : ""} ${
      this.theme
    }-listbox_selection-group ${this.theme}-m-vertical_x-small`;
    return classes;
  }
}
