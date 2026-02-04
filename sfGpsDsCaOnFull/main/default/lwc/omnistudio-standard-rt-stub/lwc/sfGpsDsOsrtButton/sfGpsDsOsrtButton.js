import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./button_slds.html";
import ndsTemplate from "./button_nds.html";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";

export default class Button extends LightningElement {
  @api label;
  @api variant;
  @api title;
  @api theme = "slds";
  @api iconName;
  @api ndsIcon; // Deprecated Property
  @api size;
  @api bgColor;
  @api color;
  @api extraclass;
  @api iconSize;
  @api iconUrl;
  @api iconFill;
  @api iconBgColor;
  @api iconVariant;
  @api type = "button";
  @api disableTab;
  @api iconOnly;
  @api role = "button";
  @track isIconRight;
  @track labelStyle = "";
  @track _iconPosition;

  /**
   * Aria Attributes -- Start
   */
  @track
  state = {
    ariaAtomic: null,
    ariaControls: null,
    ariaDescribedBy: null,
    ariaLabelledBy: null,
    ariaExpanded: null,
    ariaHasPopup: null,
    ariaLabel: null,
    disabled: false
  };

  _iconParentType = "button";
  @api get iconParentType() {
    return this._iconParentType;
  }
  set iconParentType(val) {
    this._iconParentType = val;
  }

  @api
  get ariaLabel() {
    return this.state.ariaLabel;
  }

  set ariaLabel(value) {
    this.state.ariaLabel = value;
  }

  @api
  get ariaExpanded() {
    return this.state.ariaExpanded;
  }

  set ariaExpanded(value) {
    const validValue = ["true", "false"];
    if (value && typeof value === "string") {
      const val = value.toLowerCase();
      if (validValue.indexOf(val) !== -1) {
        this.state.ariaExpanded = val;
      } else this.state.ariaExpanded = undefined;
    }
  }

  @api
  get ariaLabelledBy() {
    return this.state.ariaLabelledBy;
  }

  set ariaLabelledBy(value) {
    if (value) {
      this.state.ariaLabelledBy = value;
    }
  }

  @api
  get ariaDescribedBy() {
    return this.state.ariaDescribedBy;
  }

  set ariaDescribedBy(value) {
    if (value) {
      this.state.ariaDescribedBy = value;
    }
  }

  @api
  get ariaControls() {
    return this.state.ariaControls;
  }

  set ariaControls(value) {
    this.state.ariaControls = value;
  }

  @api
  get ariaHasPopup() {
    return this.state.ariaHasPopup;
  }

  set ariaHasPopup(value) {
    const validValue = ["true", "dialog", "menu", "listbox", "tree", "grid"];
    if (value && typeof value === "string") {
      const val = value.toLowerCase();
      if (validValue.indexOf(val) !== -1) {
        this.state.ariaHasPopup = val;
      } else this.state.ariaHasPopup = undefined;
    }
  }

  @api
  get ariaAtomic() {
    return this.state.ariaAtomic;
  }

  set ariaAtomic(value) {
    const validValue = ["true", "false"];
    if (value && typeof value === "string") {
      const val = value.toLowerCase();
      if (validValue.indexOf(val) !== -1) {
        this.state.ariaAtomic = val;
      } else this.state.ariaAtomic = undefined;
    }
  }

  @api
  get disabled() {
    return this.state.disabled;
  }

  set disabled(value) {
    this.state.disabled = typeof value === "string" || !!value;
  }

  /**
   * End
   */
  static delegatesFocus = true;

  @api get iconPosition() {
    return this._iconPosition;
  }
  set iconPosition(val) {
    this.isIconRight = val === "right" ? true : false;
    this._iconPosition = val;
  }

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
    this._styles = val;
    this.labelStyle = "";
    if (val && val.label) {
      let keys = Object.keys(val.label);
      keys.forEach((key) => {
        if (val.label[key] && key !== "textAlign") {
          this.labelStyle += `${lwcPropertyNameConversion(key)}:${
            val.label[key]
          };`;
        }
      });
    }
  }

  _tooltipTabIndex;

  get _iconOnly() {
    return this.iconOnly === "true" || this.iconOnly === true;
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    const userAgent = window.navigator.userAgent;
    this.isIconRight = this.iconPosition === "right" ? true : false;
    if (this.label && !this._iconPosition) this._iconPosition = "left";
    this._tooltipTabIndex = this.disableTab ? -1 : undefined;
    this.template.addEventListener("click", this.focusBtn);
    if (this.iconName === "utility:info") {
      if (!userAgent?.includes("Windows")) {
        this.role = "tooltip";
      }
    }
  }
  triggerEvent = (event) => {
    if (event) {
      this.dispatchEvent(
        new CustomEvent(event.type, {
          bubbles: true,
          composed: true
        })
      );
    }
  };
  renderedCallback() {
    const btn = this.template.querySelector(".vlocity-btn");
    if (btn && !this.isRendered) {
      this.isRendered = true;
      ["blur", "focus"].forEach((event) => {
        btn.addEventListener(event, this.triggerEvent);
      });
    }
    if (!this.isFirstRender && (this.bgColor || this.color)) {
      if (this.bgColor) {
        const buttonEl = this.template.querySelector("button");
        if (buttonEl) {
          buttonEl.style.backgroundColor = this.bgColor;
        }
      }
      if (this.color) {
        //const label = this.template.querySelector(".btnLabel");
        //if (label) label.style.color = this.color;
        this.labelStyle += `color:${this.color}`;
      }
      this.isFirstRender = true;
    }
  }
  disconnectedCallback() {
    const btn = this.template.querySelector(".vlocity-btn");
    if (btn) {
      ["blur", "focus"].forEach((event) => {
        btn.removeEventListener(event, this.triggerEvent);
      });
    }
    this.template.removeEventListener("click", this.focusBtn);
  }
  focusBtn = () => {
    let btn = this.template.querySelector(".vlocity-btn");
    if (btn) {
      btn.focus();
    }
  };

  get themeClass() {
    const useTheme = this.theme ? this.theme : "slds";
    return (
      ` vlocity-btn ${useTheme}-button ` +
      (this.variant ? `${useTheme}-button_${this.variant} ` : "") +
      (this.extraclass ? this.extraclass : "") +
      (this.size ? ` ${useTheme}-m-around_${this.size}` : "")
    );
  }
}
