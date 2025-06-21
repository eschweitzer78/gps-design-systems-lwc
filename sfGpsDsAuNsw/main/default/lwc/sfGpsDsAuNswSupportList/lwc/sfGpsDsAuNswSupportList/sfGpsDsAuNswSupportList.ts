/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  Link 
} from "c/sfGpsDsMarkdown";
import type { 
  LogoPosition 
} from "c/sfGpsDsAuNswSupportList";

const I18N = {
  waratahLogoTitle: "NSW Government waratah logo"
};

const LOGO_POSITION_NONE = "none";
const LOGO_POSITION_LABELS = "labels";
const LOGO_POSITION_LOGOS = "logos";

const LOGO_POSITION_VALUES: LogoPosition[] = [
  LOGO_POSITION_NONE,
  LOGO_POSITION_LABELS,
  LOGO_POSITION_LOGOS
];
const LOGO_POSITION_DEFAULT = LOGO_POSITION_LABELS;

/**
 * @slot SupportLogo1
 * @slot SupportLogo2
 * @slot SupportLogo3
 * @slot SupportLogo4
 */
export default 
class SfGpsDsAuNswSupportList
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  header: string = "Supported by";

  // @ts-ignore
  @api 
  departments?: Link[];

  // @ts-ignore
  @api 
  supportLogos?: Link[];

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  logoPosition?: LogoPosition;
  _logoPosition = this.defineEnumProperty<LogoPosition>("logoPosition", {
    validValues: LOGO_POSITION_VALUES,
    defaultValue: LOGO_POSITION_DEFAULT
  });

  /* computed */

  get i18n(): Record<string, string> {
    return I18N;
  }

  get computedClassName(): any {
    return {
      "nsw-support-list": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedContainerClassName(): any {
    return {
      "nsw-support-list__container": true,
      "nsw-support-list__container-no-text": !this.computedHasDepartments
    };
  }

  get computedShowLogoTop(): boolean {
    return this._logoPosition.value === LOGO_POSITION_LABELS;
  }

  get computedShowLogoBottom(): boolean {
    return this._logoPosition.value === LOGO_POSITION_LOGOS;
  }

  get computedHasDepartments(): boolean {
    return !!this.departments &&
      this.departments?.length > 0;
  }

  get computedHasSupportLogos(): boolean {
    return !!this.supportLogos && 
      this.supportLogos.length > 0;
  }
}
