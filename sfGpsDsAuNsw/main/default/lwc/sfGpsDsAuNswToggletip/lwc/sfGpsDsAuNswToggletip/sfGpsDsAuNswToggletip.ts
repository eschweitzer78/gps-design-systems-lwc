/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * Inspired by code written by Digital.NSW https://github.com/digitalnsw/nsw-design-system
 * Leverages code written by the authors of https://github.com/floating-ui/floating-ui
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  platform
} from "./floating-ui-dom";

import type { 
  Coords 
} from "./floating-ui-dom";

const ISOPEN_DEFAULT = false;

export default 
class SfGpsDsAuNswToggleTip 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "Toggletip";

  // @ts-ignore
  @api 
  anchor?: Element;

  /* computed */

  _isOpen = ISOPEN_DEFAULT;

  get computedToggleTipClassName(): any {
    return {
      "nsw-toggletip__element": true,
      "nsw-toggletip__element--light": true,
      active: this._isOpen
    };
  }

  /* methods */

  // @ts-ignore
  @api 
  showToggletip(): void {
    this._isOpen = true;
    this.updateToggletip();
  }

  // @ts-ignore
  @api 
  closeToggletip(): void {
    this._isOpen = false;
  }

  // @ts-ignore
  @api 
  toggleToggletip(
    event?: MouseEvent
  ): void {
    if (event) {
      event.stopPropagation();
    }

    if (this._isOpen) {
      this.closeToggletip();
    } else {
      this.showToggletip();
      // Do things async as it needs to render first before we can focus
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => this.refs.toggletip.focus());
    }
  }

  updateToggletip(): void {
    const anchor = this.anchor;
    const toggletip = this.refs.toggletip;
    const arrowElement = this.refs.arrow;

    if (anchor == null) {
      return;
    }

    computePosition(anchor, toggletip, {
      placement: "top",
      middleware: [
        offset(8),
        flip(),
        shift({ padding: 5 }),
        arrow({ element: arrowElement })
      ],
      platform
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(toggletip.style, {
        left: `${x}px`,
        top: `${y}px`
      });

      const { 
        x: arrowX, 
        y: arrowY 
      } = middlewareData.arrow as Partial<Coords>;

      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      }[placement.split("-")[0]]

      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        right: "",
        bottom: "",
        [staticSide || "top"]: "-6px"
      });
    });
  }
}
