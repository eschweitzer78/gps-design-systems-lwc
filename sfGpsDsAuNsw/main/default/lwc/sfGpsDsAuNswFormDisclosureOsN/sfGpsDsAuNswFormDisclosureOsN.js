/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import OmniscriptDisclosure from 'omnistudio/omniscriptDisclosure';
import { omniGetMergedField } from 'c/sfGpsDsOmniHelpersOsN';
import tmpl from './sfGpsDsAuNswFormDisclosureOsN.html';

export default class SfGpsDsAuNswFormDisclosureOsN extends OmniscriptDisclosure {
  render() {
    return tmpl;
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }
  
  get mergedCheckLabel() {
    return omniGetMergedField(this, this._propSetMap.checkLabel);
  }
}
