import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./checkboxGroup_slds.html";
import ndsTemplate from "./checkboxGroup_nds.html";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { checkboxGroupLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";

let checkboxIdGen = 0;
export default class VlocityCheckboxGroup extends LightningElement {
  @api label;
  @api tabIndex = "0";
  @api name;
  @api
  get fireChangeOnSetValue() {
    return this._fireChangeOnSetValue;
  }
  set fireChangeOnSetValue(val) {
    this._fireChangeOnSetValue = val === true || val === "true";
  }
  @api
  get value() {
    if (Array.isArray(this._val)) return this._val.join(";");
    return this._val;
  }
  set value(val) {
    this._val = val
      ? typeof val === "string"
        ? val.split(";")
        : val.toString()
      : [];
    if (val) {
      this.handleSelect(this.value);
    }
    this.updateSelection();

    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.value
    });
    if (this.fireChangeOnSetValue) {
      this.dispatchEvent(
        new Event("change", {
          composed: true,
          bubbles: true
        })
      );
    }
  }
  @api
  get options() {
    return this._options;
  }
  set options(options) {
    this._val = this.value ? this.value.split(";") : [];
    this._options = Array.isArray(options) ? options : [];
    this.updateSelection();
  }

  @api
  get type() {
    return this._type;
  }
  set type(val) {
    this._type = val;
    this.isButton = this.type === "button" ? true : false;
    this.isIcon = this.type === "icon" ? true : false;
    this.isCheckbox = this.type !== "checkbox" ? false : true;
  }

  @api messageWhenValueMissing = translatedLabels.cmpFieldRequired;
  @api required;
  @api disabled;
  @api extraclass;
  @api get validity() {
    return this._validity;
  }

  // Custom
  @api theme = "slds";
  @api checkedIconName = "utility:add";
  @api uncheckedIconName = "utility:check";
  @api checkedIconColor;
  @api uncheckedIconColor;
  @api checkedLabelColor;
  @api uncheckedLabelColor;
  @api iconUrl;
  @api checkedBackgroundColor;
  @api uncheckedBackgroundColor;
  @api checkedBorderColor;
  @api uncheckedBorderColor;

  //Deprecated Variables
  @api checkedBackgroundLabelColor;
  @api uncheckedBackgroundLabelColor;

  @api get checked() {
    return this.isChecked;
  }
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api
  get helpText() {
    return this.fieldLevelHelp;
  }

  set helpText(helpText) {
    //this.fieldLevelHelp = helpText;
    console.warn(
      "helpText is a deprecated property. Please use fieldLevelHelp instead."
    );
  }
  set checked(val) {
    this.isChecked = val;
  }

  _requiredLabel = translatedLabels.cmpRequired;

  @api get requiredLabel() {
    return this._requiredLabel;
  }
  set requiredLabel(val) {
    if (val) {
      this._requiredLabel = val;
    } else {
      this._requiredLabel = translatedLabels.cmpRequired;
    }
  }

  @api alignment;

  @track _val = [];
  @track internalOpts = [];
  _options = [];
  @track isButton = false;
  @track isIcon = false;
  @track isCheckbox = false;
  @track errorMessage;
  @track isError = false;
  @track isChecked = false;
  @track _type = "checkbox";
  @track _fireChangeOnSetValue = true;
  _validity = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false
  };

  translatedLabels = {};

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

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    this.isButton = this.type === "button" ? true : false;
    this.isIcon = this.type === "icon" ? true : false;
    this.isCheckbox = this.type !== "checkbox" ? false : true;

    if (this.checkboxId == null) {
      this.checkboxId = "vlocity-checkbox-" + checkboxIdGen++;
    }
    this.translatedLabels = translatedLabels;
  }

  renderedCallback() {
    console.log("> renderedCallback");
    if (this.alignment === "horizontal") {
      this.template
        .querySelector(`.${this.theme}-form-element__control`)
        .classList.add(
          this.theme === "slds"
            ? "slds-checkbox-horizontal"
            : "nds-horizontal_checkbox"
        );
    } else if (this.theme === "nds" && this.alignment === "vertical") {
      this.template
        .querySelector(`.${this.theme}-form-element__control`)
        .classList.add(`${this.theme}-vertical_checkbox`);
    }
    if (this.isIcon) {
      this.setStyles();
    }
    console.log("< renderedCallback");
  }

  setStyles() {
    let iconEle = this.template.querySelector(
      `.${this.theme}-checkbox_button__label`
    );
    let labelEle = this.template.querySelector(
      `.${this.theme}-form-element__label`
    );
    let btnGroupEle = this.template.querySelector(
      `.${this.theme}-checkbox_button-group`
    );
    if (iconEle) {
      iconEle.style.color = this.isChecked
        ? this.checkedIconColor
        : this.uncheckedIconColor;
      iconEle.style.backgroundColor = this.isChecked
        ? this.checkedBackgroundColor
        : this.uncheckedBackgroundColor;
    }
    if (btnGroupEle) {
      btnGroupEle.style.borderColor = this.isChecked
        ? this.checkedBorderColor
        : this.uncheckedBorderColor;
    }
    if (labelEle) {
      labelEle.style.color = this.isChecked
        ? this.checkedLabelColor
        : this.uncheckedLabelColor;
    }
  }

  processClassNamesForTheme = function (classlist, theme) {
    return classlist.split("$theme").join(theme);
  };

  get errorClass() {
    const ndsClasses =
      (this.theme === "nds"
        ? "$theme-form-element  $theme-form-container "
        : "") +
      (this.isError ||
      (this.required && this.isChanged && !(this._val && this._val.length))
        ? "$theme-has-error "
        : "") +
      (this.extraclass ? " " + this.extraclass : "");
    return this.processClassNamesForTheme(ndsClasses, this.theme);
  }

  updateSelection() {
    if (this.checkboxId == null) {
      this.checkboxId = "vlocity-checkbox-" + checkboxIdGen++;
    }

    this.internalOpts = this._options.map((option, index) => {
      return {
        ...option,
        id: this.checkboxId + "-" + index,
        selected: this._val
          ? this._val.includes(option.value.toString())
          : false
      };
    });
  }

  onchangevalue(event) {
    this.isChanged = true;
    let element = event.target;
    this.isChecked = element.checked;
    if (!Array.isArray(this._val)) this._val = this._val.split(";");

    if (element.checked) {
      this._val.push(element.value);
      this._val = this.handleSelect(this._val.join(";"));
    } else {
      let index = this._val.indexOf(element.value);
      if (index !== -1) this._val.splice(index, 1);
    }
    this._val =
      typeof this._val === "string" ? this._val.split(";") : this._val;
    this.updateSelection();
    this.setValidity();
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.value
    });
    this.dispatchEvent(
      new Event("change", {
        composed: true,
        bubbles: true
      })
    );
  }

  handleFocus(event) {
    let element = event.target;
    this.isChecked = element.checked;
    this.dispatchEvent(
      new CustomEvent("focus", {
        composed: true,
        bubbles: true
      })
    );
  }

  setValidity(showError) {
    if (!this.value && this.required) {
      this._validity.valueMissing = true;
    } else {
      this._validity.valueMissing = false;
    }

    this._validity.valid =
      !this._validity.badInput &&
      !this._validity.customError &&
      !this._validity.patternMismatch &&
      !this._validity.rangeOverflow &&
      !this._validity.rangeUnderflow &&
      !this._validity.stepMismatch &&
      !this._validity.tooLong &&
      !this._validity.tooShort &&
      !this._validity.typeMismatch &&
      !this._validity.valueMissing;

    if (showError) {
      this.isError = !this._validity.valid;

      switch (true) {
        case this._validity.valid:
          this.errorMessage = "";
          break;

        case !this.value && this.required:
          this.errorMessage = this.messageWhenValueMissing;
          break;

        default:
          this.errorMessage = this.errorMessage ? this.errorMessage : "";
      }
    } else {
      this.errorMessage = "";
    }
  }

  handleSelect(sdata, display) {
    if (sdata) {
      sdata = sdata.split(";");
    }
    let internalOpts = this._options.map((option) => {
      return {
        ...option,
        selected: sdata ? sdata.includes(option.value.toString()) : false
      };
    });

    let name = "";
    let value = "";
    for (let ind = 0; ind < internalOpts.length; ind++) {
      if (internalOpts[ind].selected) {
        if (name !== "") name += ";";
        name += internalOpts[ind].value;
        if (value !== "") value += ";";
        value += internalOpts[ind].label;
      }
    }
    return display ? value : name;
  }

  @api
  checkValidity() {
    this.setValidity(false);
    return this._validity && this._validity.valid;
  }

  @api
  reportValidity() {
    this.setValidity(true);
    return this._validity.valid;
  }

  @api
  setCustomValidity(message) {
    this._validity.customError = message === "" ? false : true;
    this.isError = message === "" ? false : true;
    this.errorMessage = message;
  }

  @api
  focus() {
    this.template.querySelector("input").focus();
  }

  @api
  showHelpMessageIfInvalid() {
    this.setValidity(true);
  }

  handleKeyDownEvent(evt) {
    switch (evt.key) {
      case "Tab":
        this.reportValidity();
        break;
      default:
    }
  }
}
