import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { computeClass } from "c/sfGpsDsHelpers";

const ISEXTERNAL_DEFAULT = false;
const ISSMALL_DEFAULT = false;

const ICONPOSITION_START = "start";
const ICONPOSITION_END = "end";
const ICONPOSITION_VALUES = [ICONPOSITION_END, ICONPOSITION_START];
const ICONPOSITION_DEFAULT = ICONPOSITION_START;

export default 
class SfGpsDsAuVic2DocsLink
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  url?: string;

  // @ts-ignore
  @api 
  iconPosition?: string;
  _iconPosition = this.defineEnumProperty("iconPosition", {
    validValues: ICONPOSITION_VALUES,
    defaultValue: ICONPOSITION_DEFAULT
  });

  // @ts-ignore
  @api 
  isExternal?: boolean;
  _isExternal = this.defineBooleanProperty("isExternal", {
    defaultValue: ISEXTERNAL_DEFAULT
  });

  // @ts-ignore
  @api
  isSmall?: boolean;
  _isSmall = this.defineBooleanProperty("isSmall", {
    defaultValue: ISSMALL_DEFAULT
  });

  /* computed */

  get computedClassName(): string | null {
    return computeClass({
      "docs-link": true,
      "rpl-type-p": !this._isSmall.value,
      "rpl-type-p-small": this._isSmall.value
    });
  }

  get computedShowIconStart(): boolean {
    return this._isExternal.value && 
      this._iconPosition.value === ICONPOSITION_START;
  }

  get computedShowIconEnd(): boolean {
    return this._isExternal.value && 
      this._iconPosition.value === ICONPOSITION_END;
  }
}
