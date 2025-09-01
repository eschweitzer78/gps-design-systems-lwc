import OmniscriptTypeaheadBlock from "omnistudio/omniscriptTypeaheadBlock";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixinOsN";

import tmpl from "./sfGpsDsAuVic2FormTypeaheadBlockOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixin(
  OmniscriptTypeaheadBlock
) {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
