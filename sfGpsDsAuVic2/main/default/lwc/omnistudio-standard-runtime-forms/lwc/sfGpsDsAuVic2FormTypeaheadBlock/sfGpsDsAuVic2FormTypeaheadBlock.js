import OmniscriptTypeaheadBlock from "c/sfGpsDsOsrtOmniscriptTypeaheadBlock";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixin";

import tmpl from "./sfGpsDsAuVic2FormTypeaheadBlock.html";

export default class extends SfGpsDsAuVic2FormElementMixin(
  OmniscriptTypeaheadBlock
) {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
