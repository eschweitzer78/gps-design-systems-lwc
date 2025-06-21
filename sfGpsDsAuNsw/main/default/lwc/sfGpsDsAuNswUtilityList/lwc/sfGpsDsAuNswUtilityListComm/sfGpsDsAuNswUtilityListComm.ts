import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  isString, 
  toArray 
} from "c/sfGpsDsHelpers";

import type { 
  SocialSharingInfo 
} from "c/sfGpsDsAuNswUtilityList";

const SHARECONFIG_DEFAULT: SocialSharingInfo[] = [];

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswUtilityListComm";

export default 
class sfGpsDsAuNswUtilityListComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  printLabel?: string;

  // @ts-ignore
  @api 
  copyLabel?: string;

  // @ts-ignore
  @api 
  shareLabel?: string;

  // @ts-ignore
  @api 
  shareUrl?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* api: shareConfig */

  _shareConfigOriginal: string = JSON.stringify(SHARECONFIG_DEFAULT);
  _shareConfig: SocialSharingInfo[] = SHARECONFIG_DEFAULT;

  // @ts-ignore
  @api
  get shareConfig(): string {
    return this._shareConfigOriginal;
  }

  set shareConfig(value: string) {
    this._shareConfigOriginal = value;
    let targetValue: SocialSharingInfo[];

    if (isString(value)) {
      try {
        targetValue = toArray(JSON.parse(value));
      } catch (e) {
        targetValue = SHARECONFIG_DEFAULT;
        this.addError(
          "JS-LI",
          "The share config attribute must be in JSON object format."
        );
        if (DEBUG) console.debug(CLASS_NAME, "set shareConfig", e);
      }
    } else {
      targetValue = SHARECONFIG_DEFAULT;
    }
    this._shareConfig = targetValue;
  }

  /* computed */

  get computedShareUrl(): string {
    return this.shareUrl || window.location.href;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
