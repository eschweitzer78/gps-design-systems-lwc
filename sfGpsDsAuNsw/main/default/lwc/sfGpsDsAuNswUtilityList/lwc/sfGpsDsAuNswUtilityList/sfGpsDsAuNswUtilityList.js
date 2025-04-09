import { LightningElement, api, track } from "lwc";
import { withKeys, normaliseString, uniqueId, isArray } from "c/sfGpsDsHelpers";
// commented pdf printing code out as NSW's library of choice is not compatible with Locker/LWS security
//import { loadScript } from "lightning/platformResourceLoader";
//import sfGpsDsAuNswStaticResource from "@salesforce/resourceUrl/sfGpsDsAuNsw";

const ORIENTATION_DEFAULT = "vertical";
const ORIENTATION_VALUES = {
  vertical: "",
  horizontal: "nsw-utility-list--horizontal"
};

export default class extends LightningElement {
  static renderMode = "light";

  @api printLabel = "Print this page";
  @api copyLabel = "Copy link";
  @api copiedLabel = "Copied";
  @api shareLabel = "Share this page";
  @api shareUrl = "https://www.digital.nsw.gov.au";
  @api shareConfig;

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

  @api className;

  /* api: orientation */

  _orientation = ORIENTATION_VALUES[ORIENTATION_DEFAULT];
  _orientationOriginal = ORIENTATION_DEFAULT;

  @api
  get orientation() {
    return this._orientationOriginal;
  }

  set orientation(value) {
    this._orientationOriginal = value;
    this._orientation = normaliseString(value, {
      validValues: ORIENTATION_VALUES,
      fallbackValue: ORIENTATION_DEFAULT,
      returnObjectValue: true
    });
  }

  /*
  @track downloadAsPdfText = "Download as PDF";
  */

  /* computed */

  get computedClassName() {
    return {
      "nsw-utility-list": true,
      [this._orientation]: this._orientation,
      [this.className]: this.className
    };
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

  get computedCopyClassName() {
    return {
      "nsw-utility-list__item": true,
      copied: this._clipboardCopied
    };
  }

  /* methods */

  @track _clipboardCopied;

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
    if (this.refs.share.toggleToggletip) {
      this.refs.share.toggleToggletip();
    }
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

  @track anchor;

  renderedCallback() {
    this.anchor = this.refs.anchor;
  }
}
