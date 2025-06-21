import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  withKeys, 
  uniqueId, 
  isArray 
} from "c/sfGpsDsHelpers";

// commented pdf printing code out as NSW's library of choice is not compatible with Locker/LWS security
//import { loadScript } from "lightning/platformResourceLoader";
//import sfGpsDsAuNswStaticResource from "@salesforce/resourceUrl/sfGpsDsAuNsw";

import type SfGpsDsAuNswToggletip from "c/sfGpsDsAuNswToggletip";
import type { 
  ListOrientation, 
  SocialSharingInfo 
} from "c/sfGpsDsAuNswUtilityList";

type ListOrientationValues = Record<ListOrientation, string>;

const ORIENTATION_DEFAULT: ListOrientation = "vertical";
const ORIENTATION_VALUES: ListOrientationValues = {
  vertical: "",
  horizontal: "nsw-utility-list--horizontal"
};

export default 
class SfGpsDsAuNswUtilityList
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

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
  shareConfig?: SocialSharingInfo[];

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  orientation?: ListOrientation;
  _orientation = this.defineEnumObjectProperty<string, ListOrientation>("orientation", {
    validValues: ORIENTATION_VALUES,
    defaultValue: ORIENTATION_DEFAULT
  });

  /*
  @track downloadAsPdfText = "Download as PDF";
  */

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-utility-list": true,
      [this._orientation.value]: !!this._orientation.value,
      [this.className || ""]: !!this.className
    };
  }

  get computedCopyClassName(): any {
    return {
      "nsw-utility-list__item": true,
      copied: this._clipboardCopied
    };
  }

  get facebook(): SocialSharingInfo | undefined {
    return isArray(this.shareConfig)
      ? (this.shareConfig as SocialSharingInfo[]).find((item) => item.network === "facebook")
      : undefined;
  }

  get linkedin(): SocialSharingInfo | undefined {
    return isArray(this.shareConfig)
      ? (this.shareConfig as SocialSharingInfo[]).find((item) => item.network === "linkedin")
      : undefined;
  }

  get twitter(): SocialSharingInfo | undefined {
    return isArray(this.shareConfig)
      ? (this.shareConfig as SocialSharingInfo[]).find((item) => item.network === "twitter")
      : undefined;
  }

  get email(): SocialSharingInfo | undefined {
    return isArray(this.shareConfig)
      ? (this.shareConfig as SocialSharingInfo[]).find((item) => item.network === "email")
      : undefined;
  }

  _socialShareId?: string;

  get computedSocialShareId(): string {
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
  _clipboardCopied: boolean = false;

  copyToClipboard(): void {
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

  print(): void {
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

  toggleShare(): void {
    const share = this.refs.share as unknown as SfGpsDsAuNswToggletip;

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
  anchor?: HTMLElement;

  renderedCallback() {
    super.renderedCallback?.();
    this.anchor = this.refs.anchor;
  }
}
