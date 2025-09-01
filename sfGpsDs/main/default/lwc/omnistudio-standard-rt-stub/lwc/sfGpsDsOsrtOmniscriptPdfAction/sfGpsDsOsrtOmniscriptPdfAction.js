import { loadScript } from "lightning/platformResourceLoader";
import { NavigationMixin } from "lightning/navigation";
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptPdfActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";
import { pdfWriterUrl } from "c/sfGpsDsOsrtOmniscriptRestApi";

export default class OmniscriptPdfAction extends NavigationMixin(
  OmniscriptBaseAction
) {
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptPdfActionUtil(this.jsonDef);
    }
  }

  renderedCallback() {
    if (!this.vPdfWriter) {
      this.loadWriterProm = loadScript(this, pdfWriterUrl).then(
        function () {
          // eslint-disable-next-line no-undef
          this.vPdfWriter = vlocityPdfWriter;
        }.bind(this)
      );
    }
    super.renderedCallback();
  }
}
