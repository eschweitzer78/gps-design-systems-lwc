/*
 * Copyright (c) 2025-2026, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* We currently do not support Short/Narrow Cards as they seem to be working quite differently when it comes to their interaction with the surrounding OmniscriptEditBlockWrapper, which cannot be extended/overriden */

import OmniscriptEditBlock from "c/sfGpsDsOsrtOmniscriptEditBlock";

import tmpl_table from "./omniscriptEditBlock.html";
import tmpl_inline from "./omniscriptEditBlockInline.html";
import tmpl_card from "./omniscriptEditBlockCards.html";
import tmpl_fs from "./omniscriptEditBlockFS.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsNswFormEditBlock";

export default class extends OmniscriptEditBlock {
  /* computed */

  get computedDropdownClassName() {
    return {
      "sfgpsds-dropdown": true,
      "sfgpsds-dropdown__active": this._bShowActionMenu
    };
  }

  get decoratedActionMenuItems() {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "decoratedActionMenuItems",
        JSON.stringify(this._actionMenuList)
      );

    return this._actionMenuList.map((item, index) => ({
      key: item.lwcId,
      index,
      text: item.label
    }));
  }

  get computedIsH3Heading() {
    return (this._propSetMap.headingLevel || 3) === 3;
  }

  get computedErrorTextId() {
    return this.isInvalid ? "inline-text-error" : null;
  }

  get computedAriaRole() {
    return this._propSetMap.selectCheckBox ? "checkbox" : null;
  }

  get computedAriaChecked() {
    if (this._propSetMap.selectCheckBox) {
      return this._showCheckbox ? "true" : "false";
    }

    return null;
  }

  get computedTabindex() {
    return this._propSetMap.selectCheckBox ? "0" : null;
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleCheckbox(event) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleCheckbox",
        "detail=",
        JSON.stringify(event?.detail),
        "target=",
        event.target,
        "from actionmenu=",
        this.refs.actionmenu,
        this.refs.actionmenu?.contains(event.target)
      );
    }

    // this will make sure the click event is propagated up
    const rv = this.refs.actionmenu?.contains(event.target)
      ? true
      : super.handleCheckbox(null);
    return rv;
  }

  handleActionMenuSelected(event) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleActionMenuSelected", event.detail);
    }

    const actionMenuItem = this._actionMenuList[event.detail];
    // passing null event as we do not want to stop propagation, this would mess up the button menu
    this.handleClickOrEnter(null, actionMenuItem.lwcId);

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleActionMenuSelected");
    }
  }

  handleActionMenuClick(event) {
    if (event) event.preventDefault();
    if (DEBUG) console.debug(CLASS_NAME, "handleActionMenuClick");
  }

  /* lifecycle */

  render() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> render",
        this._propSetMap.label,
        "isFs=",
        this._isFS,
        "isLongCards=",
        this._isLongCards,
        "isCards=",
        this._isCards,
        "isTable=",
        this._isTable,
        "isInline=",
        this._isInline,
        "isEditing=",
        this._isEditing,
        "hasChildren=",
        this._hasChildren,
        "isFirstIndex=",
        this._isFirstIndex
      );
    }

    let template = super.render(); // must run render as it computes a few variables

    if (this._isFS) {
      template = tmpl_fs;
    } else if (this._isLongCards || this._isCards) {
      template = tmpl_card;
    } else if (this._isTable) {
      template = tmpl_table;
    } else if (this._isInline) {
      template = tmpl_inline;
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< render",
        this._propSetMap.label,
        "template=",
        template
      );
    }

    return template;
  }

  /* override */

  get svgMapIcon() {
    // sprite ignored when using Google Material icons

    let svgIcon = "";

    if (this.jsonDef) {
      if (
        this.jsonDef.response &&
        this._propSetMap.valueSvgMap &&
        this._propSetMap.elementName
      ) {
        const svgMap = this._propSetMap.valueSvgMap;
        const val = this.jsonDef.response[this._propSetMap.elementName];
        for (let i = 0; i < svgMap.length; i++) {
          console.debug(
            "try",
            JSON.stringify(svgMap[i].value),
            JSON.stringify(val)
          );
          if (
            svgMap[i].value === val ||
            (typeof val === "boolean" && svgMap[i].value === "true" && val) ||
            (svgMap[i].value === "false" && !val)
          ) {
            svgIcon = svgMap[i].svgIcon;
            console.debug("icon", svgIcon);
            break;
          }
        }
      }

      svgIcon = svgIcon || this._propSetMap.svgIcon;
    }

    return svgIcon;
  }

  get visualClassName() {
    return {
      "nsw-col": true,
      "nsw-hide": this._isEditing || !this._hasChildren,
      "nsw-col-sm-12": this._isLongCards || this._isCards
    };
  }

  get editClassName() {
    return {
      "nsw-col": true,
      "nsw-hide": !this._isEditing
    };
  }

  applyCtrlWidth() {
    super.applyCtrlWidth();

    if (this.jsonDef && this._propSetMap) {
      if (this._propSetMap.controlWidth != null && this.jsonDef.level !== 0) {
        this.classList.remove(this._theme + "-p-right_small");
        this.classList.remove(this._theme + "-m-bottom_xx-small");
        this.classList.remove(this._theme + "-size_12-of-12");

        this.classList.add("nsw-m-right-sm", "nsw-m-bottom-sm");
      }
      // This is the UI hide, not show/hide hide
      if (this._propSetMap.hide === true) {
        this.classList.add("nsw-hidden");
      }
    }

    if (this._isCards) {
      this.classList.remove(this._theme + "-large-size_3-of-12");
      this.classList.remove(this._theme + "-medium-size_6-of-12");
      this.classList.add("nsw-col-lg-3", "nsw-col-md-6");
    } else {
      this.classList.add("nsw-col-sm-12");
    }
  }

  createTableLabelColumns() {
    if (this.jsonDef) {
      let preTableLabels = [];
      let children = [];
      this._tableLabels = [];

      if (this.jsonDef.children?.length > 0) {
        children = this.jsonDef.children;
      } else if (this.jsonDef.childrenC && this.jsonDef.childrenC.length > 0) {
        children = this.jsonDef.childrenC;
      }

      for (let i = 0; i < children.length; i++) {
        const eleArray = children[i].eleArray[0];
        if (
          eleArray.propSetMap.disOnTplt &&
          this._maxDisplayCount > preTableLabels.length
        ) {
          preTableLabels.push(eleArray);
        }
      }

      // update table labels
      for (let i = 0; i < preTableLabels.length; i++) {
        const eleArray = preTableLabels[i];
        let cls = "nsw-p-sm nsw-text-truncate";
        let width = 0;

        if (this._isFS || this._isTable) {
          if (this._isFS) {
            width = eleArray.propSetMap.controlWidth;
          } else if (this._isTable) {
            // automatically determine width of each column based on display count
            width = this._tableWidth[preTableLabels.length]
              ? this._tableWidth[preTableLabels.length]
              : 1;
          }

          // cls += ` nsw-col nsw-col-sm-${width}`;

          /* if (eleArray.type === "Checkbox") {
            cls += " nsw-text-center";
          } else */ if (
            eleArray.type === "Currency" ||
            eleArray.type === "Number"
          ) {
            cls += " nsw-text-right";
          }
        }

        let tableLabel =
          eleArray.propSetMap.label && this._multiLang
            ? this.allCustomLabelsUtil[eleArray.propSetMap.label]
            : eleArray.propSetMap.label;

        if (eleArray.type === "Checkbox")
          tableLabel = eleArray.propSetMap.checkLabel;

        this._tableLabels.push({
          lwcId: "lwc" + i,
          label: tableLabel,
          cls: cls,
          tableWidth: [
            "7%",
            "14%",
            "21%",
            "28%",
            "35%",
            "42%",
            "49%",
            "56%",
            "73%",
            "80%",
            "87%",
            "94%"
          ][width]
        });
      }
    }
  }

  createDisplayColumns() {
    const jdChildren = this.jsonDef?.children;

    if (jdChildren?.length > 0 && this.jsonData) {
      let preDisplayVal = [];
      this._displayValues = [];
      // preprocessing to calculate actual number of columns to be displayed

      for (let i = 0; i < jdChildren.length; i++) {
        const eleArray = jdChildren[i].eleArray[0];
        if (
          eleArray.propSetMap.disOnTplt &&
          this._maxDisplayCount > preDisplayVal.length
        ) {
          preDisplayVal.push(eleArray);
        }
      }

      // create display objects
      for (let i = 0; i < preDisplayVal.length; i++) {
        const eleArray = preDisplayVal[i];
        let value =
          this.jsonData.OmniScriptFmtData &&
          this.jsonData.OmniScriptFmtData[eleArray.JSONPath];
        value = value == null ? eleArray.response : value;
        value = value == null ? "" : value;

        let cls = "nsw-p-sm nsw-text-truncate";
        let width = 0;

        if (this._isFS || this._isTable) {
          if (this._isFS) {
            width = eleArray.propSetMap.controlWidth;
          } else if (this._isTable) {
            // automatically determine width of each column based on display count
            width = this._tableWidth[preDisplayVal.length]
              ? this._tableWidth[preDisplayVal.length]
              : 1;
          }

          //cls += ` nsw-col nsw-col-sm-${width}`;

          /* if (eleArray.type === "Checkbox") {
            cls += " nsw-text-center";
          } else */ if (
            eleArray.type === "Currency" ||
            eleArray.type === "Number"
          ) {
            cls += " nsw-text-right";
          }
        }

        this._displayValues.push({
          lwcId: "lwc" + i,
          value: value, // formatted value,
          label: eleArray.propSetMap.label,
          cls: cls,
          isCheckbox: eleArray.type === "Checkbox",
          checkboxId: `sfgpsds-au-nsw-form-edit-block-checkbox-${i + 1}`,
          tableWidth: [
            "7%",
            "14%",
            "21%",
            "28%",
            "35%",
            "42%",
            "49%",
            "56%",
            "73%",
            "80%",
            "87%",
            "94%"
          ][width]
        });
      }
    }
  }

  save(evt) {
    this.reportValidity(); // prevent a glitch with validation
    super.save(evt);
  }
}
