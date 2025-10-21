/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptEditBlock from "c/sfGpsDsOsrtOmniscriptEditBlock";

import tmpl_table from "./omniscriptEditBlock.html";
import tmpl_inline from "./omniscriptEditBlockInline.html";
import tmpl_card from "./omniscriptEditBlockCards.html";
import tmpl_fs from "./omniscriptEditBlockFS.html";

const DEBUG = true;
const CLASS_NAME = "SfGpsDsNswFormEditBlock";

export default class extends OmniscriptEditBlock {
  test(event) {
    console.debug("*** TEST", event.currentTarget, event.target);
  }

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
      text: item.label,
      checkboxId: `sfgpsds-au-nsw-form-edit-block-checkbox-${index + 1}`
    }));
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleCheckbox(event) {
    // this will make sure the click event is propagated up
    return super.handleCheckbox(null);
  }

  handleActionMenuSelected(event) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> handleActionMenuSelected", event.detail);

    const actionMenuItem = this._actionMenuList[event.detail];
    // passing null event as we do not want to stop propagation, this would mess up the button menu
    this.handleClickOrEnter(null, actionMenuItem.lwcId);

    if (DEBUG) console.debug(CLASS_NAME, "< handleActionMenuSelected");
  }

  /* lifecycle */

  render() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "render",
        "isFs=",
        this._isFS,
        "isLongCards=",
        this._isLongCards,
        "isCards=",
        this._isCards,
        "isTable=",
        this._isTable,
        "isInline=",
        this._isInline
      );
    }

    let template = super.render();

    if (this._isFS) {
      template = tmpl_fs;
    } else if (this._isLongCards || this._isCards) {
      template = tmpl_card;
    } else if (this._isTable) {
      template = tmpl_table;
    } else if (this._isInline) {
      template = tmpl_inline;
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
        for (let i = 0; i < svgMap.length; i++) {
          if (
            svgMap[i].value ===
            this.jsonDef.response[this._propSetMap.elementName]
          ) {
            svgIcon = svgMap[i].svgIcon;
          }
        }
      }

      svgIcon = svgIcon || this._propSetMap.svgIcon;
    }

    return svgIcon;
  }

  get visualClassName() {
    return (
      "nsw-col" + (this._isEditing || !this._hasChildren ? " nsw-hide" : "")
    );
  }

  get editClassName() {
    return "nsw-col " + (this._isEditing ? "" : " nsw-hide");
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

          if (eleArray.type === "Checkbox") {
            cls += " nsw-text-center";
          } else if (
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

          if (eleArray.type === "Checkbox") {
            cls += " nsw-text-center";
          } else if (
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
}
