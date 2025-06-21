/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import type { 
  AlertType,
  AsValue 
} from "c/sfGpsDsAuNswAlert";


const AS_DEFAULT = "info";
const AS_VALUES: Record<AlertType, AsValue> = {
  info: { 
    className: "nsw-in-page-alert--info", 
    iconName: "info" 
  },
  warning: { 
    className: "nsw-in-page-alert--warning",
    iconName: "error" 
  },
  error: { 
    className: "nsw-in-page-alert--error", 
    iconName: "cancel" 
  },
  success: { 
    className: "nsw-in-page-alert--success", 
    iconName: "check_circle" 
  }
};

const COMPACT_DEFAULT = false;

export default 
class SfGpsDsAuNswAlert
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "";
  
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  as?: AlertType;
  _as = this.defineEnumObjectProperty<AsValue, AlertType>("as", {
    validValues: AS_VALUES,
    defaultValue: AS_DEFAULT
  });  


  // @ts-ignore
  @api 
  compact?: boolean;
  _compact = this.defineBooleanProperty("compact", {
    defaultValue: COMPACT_DEFAULT
  }); 

  /* computed */

  get computedClassName(): any {
    const asClassName = this._as?.value 
      ? (this._as.value as any).className 
      : null;

    return {
      "nsw-in-page-alert": true,
      "nsw-in-page-alert--compact": this._compact.value,
      [asClassName]: !!asClassName,
      [this.className || ""]: !!this.className
    };
  }

  get computedIconName(): string {
    return this._as.value?.iconName;
  }

  get space() {
    return " ";
  }
}
