import { api, track } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { withKeys, uniqueId, isArray } from "c/sfGpsDsHelpers";
const ORIENTATION_DEFAULT = "vertical";
const ORIENTATION_VALUES = {
  vertical: "",
  horizontal: "nsw-utility-list--horizontal"
};
export default class SfGpsDsAuNswUtilityList extends SfGpsDsElement {
  static renderMode = "light";
  // @ts-ignore
  @api
  printLabel = "Print this page";
  // @ts-ignore
  @api
  copyLabel = "Copy link";
  // @ts-ignore
  @api
  copiedLabel = "Copied";
  // @ts-ignore
  @api
  shareLabel = "Share this page";
  // @ts-ignore
  @api
  shareUrl = "https://www.digital.nsw.gov.au";
  // @ts-ignore
  @api
  shareConfig;
  // @ts-ignore
  @api
  className;
  // @ts-ignore
  @api
  orientation;
  _orientation = this.defineEnumObjectProperty("orientation", {
    validValues: ORIENTATION_VALUES,
    defaultValue: ORIENTATION_DEFAULT
  });
  /*
    @track downloadAsPdfText = "Download as PDF";
    */
  /* computed */
  get computedClassName() {
    return {
      "nsw-utility-list": true,
      [this._orientation.value]: !!this._orientation.value,
      [this.className]: !!this.className
    };
  }
  get computedCopyClassName() {
    return {
      "nsw-utility-list__item": true,
      copied: this._clipboardCopied
    };
  }
  get facebook() {
    return isArray(this.shareConfig)
      ? this.shareConfig.find((item) => item.network === "facebook")
      : null;
  }
  get linkedin() {
    return isArray(this.shareConfig)
      ? this.shareConfig.find((item) => item.network === "linkedin")
      : null;
  }
  get twitter() {
    return isArray(this.shareConfig)
      ? this.shareConfig.find((item) => item.network === "twitter")
      : null;
  }
  get email() {
    return isArray(this.shareConfig)
      ? this.shareConfig.find((item) => item.network === "email")
      : null;
  }
  _socialShareId;
  get computedSocialShareId() {
    if (this._socialShareId == null) {
      this._socialShareId = uniqueId(
        "sf-gps-ds-au-nsw-utility-list-social-share"
      );
    }
    return this._socialShareId;
  }
  /* methods */
  // @ts-ignore
  @track
  _clipboardCopied;
  copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.shareUrl).then(() => {
        this._clipboardCopied = true;
        /* eslint-disable @lwc/lwc/no-async-operation */
        setTimeout(() => {
          this._clipboardCopied = false;
        }, 3000);
      });
    }
  }
  print() {
    window.print();
  }
  /*
    download() {
      const content = document.body;
      const originalButtonText = this.downloadAsPdf;
      this.downloadAsPdf = "Building PDF...";
  
      // eslint-disable-next-line no-undef
      //html2canvas(content)
      htmlToImage.toPng(content)
        .then((base64image) => {
          console.log('have canvas');
          //const base64image = canvas.toDataURL('image/png');
          // eslint-disable-next-line no-undef
          const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
          pdf.addImage(base64image, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`${this.name}.pdf`);
          this.downloadAsPdf = originalButtonText;
        })
        .catch((error) => {
          console.error('An error occurred:', error);
          this.downloadAsPdf = originalButtonText;
        });
    }
    */
  toggleShare() {
    const share = this.refs.share;
    share?.toggleToggletip?.();
  }
  /* event management */
  handleCopyClick = this.copyToClipboard;
  handleCopyKeyup = withKeys(() => this.copyToClipboard(), ["enter"]);
  handlePrintClick = this.print;
  handlePrintKeyup = withKeys(() => this.print(), ["enter"]);
  handleShareClick = this.toggleShare;
  handleShareKeyup = withKeys(() => this.toggleShare(), ["enter"]);
  /*
    handleDownloadClick = this.download;
    handleDownloadKeyup = withKeys(() => this.download(), [ "enter" ]);
    */
  /* lifecycle management */
  /*
    connectedCallback() {
      Promise.all([
        loadScript(this, `${sfGpsDsAuNswStaticResource}/js/html2canvas.min.js`),
        loadScript(this, `${sfGpsDsAuNswStaticResource}/js/jspdf.min.js`)
      ])
      .catch((err) => { console.log(err); })
    }
    */
  // @ts-ignore
  @track
  anchor;
  renderedCallback() {
    super.renderedCallback();
    this.anchor = this.refs.anchor;
  }
}
