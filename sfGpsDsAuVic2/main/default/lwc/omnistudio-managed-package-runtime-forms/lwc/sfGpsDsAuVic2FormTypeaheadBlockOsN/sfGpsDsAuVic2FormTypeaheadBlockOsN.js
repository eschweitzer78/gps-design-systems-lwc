import OmniscriptTypeaheadBlock from "omnistudio/omniscriptTypeaheadBlock";
import SfGpsDsAuVic2FormElementMixinOsN from "c/sfGpsDsAuVic2FormElementMixinOsN";

import tmpl from "./sfGpsDsAuVic2FormTypeaheadBlockOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixinOsN(
  OmniscriptTypeaheadBlock
) {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
