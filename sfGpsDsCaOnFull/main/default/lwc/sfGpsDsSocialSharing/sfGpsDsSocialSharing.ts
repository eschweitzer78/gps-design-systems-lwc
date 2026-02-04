import { 
  LightningElement, 
  api, 
  track 
} from "lwc";
import AvailableNetworks from "./networks";
import { 
  isString 
} from "c/sfGpsDsHelpers";

import type {
  Dimensions,
  MockWindow
} from "c/sfGpsDsSocialSharing";

let $window: Window & typeof globalThis | MockWindow | null = typeof window !== "undefined" ? window : null;

export function mockWindow(
  self: MockWindow
): void {
  $window = self || window; // mock window for unit testing
}

export default 
class SfGpsDsSocialSharing 
extends LightningElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  name = "ShareNetwork";

  // @ts-ignore
  @api 
  network = ""; // String required, name of the network to display

  // @ts-ignore
  @api 
  url = "#"; // String required, URL of the content to share

  // @ts-ignore
  @api 
  title = ""; // String required, URL of the content to share

  // @ts-ignore
  @api 
  description = ""; // description of the content to share

  // @ts-ignore
  @api 
  quote = ""; // quote content, used for Facebook

  // @ts-ignore
  @api 
  hashtags = ""; // used for Twitter and Facebook

  // @ts-ignore
  @api 
  twitterUser = ""; // used for Twitter

  // @ts-ignore
  @api 
  media = ""; // used for Pinterest

  // @ts-ignore
  @api 
  tag = "a"; // tag used by the Network component - note this is disregarded as we only support "a"

  // @ts-ignore
  @api 
  popup: Dimensions = { 
    width: 626, 
    height: 436 
  }; // properties of the popup window

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @track 
  popupTop = 0;

  // @ts-ignore
  @track 
  popupLeft = 0;

  // @ts-ignore
  @track 
  popupWindow: Window | null = null;

  // @ts-ignore
  @track 
  popupInterval: NodeJS.Timeout | null = null;

  networks = AvailableNetworks;


  /* Formatted network name */

  get key(): string {
    return isString(this.network) ? this.network.toLowerCase() : "";
  }

  /* Network sharing raw sharing link */

  get rawLink(): string {
    const ua = navigator.userAgent.toLowerCase();

    /**
     * On IOS, SMS sharing link need a special formatting
     * Source: https://weblog.west-wind.com/posts/2013/Oct/09/Prefilling-an-SMS-on-Mobile-Devices-with-the-sms-Uri-Scheme#Body-only
     */
    if (
      this.key === "sms" &&
      (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1)
    ) {
      return this.networks[this.key].replace(":?", ":&");
    }

    return this.networks[this.key];
  }

  /* Create the url for sharing */

  get shareLink(): string {
    let link = this.rawLink;

    /**
     * Twitter sharing shouldn't include empty parameter
     * Source: https://github.com/nicolasbeauvais/vue-social-sharing/issues/143
     */
    if (this.key === "twitter") {
      if (!this.hashtags?.length) link = link.replace("&hashtags=@h", "");
      if (!this.twitterUser?.length) link = link.replace("@tu", "");
    }

    return link
      .replace(/@tu/g, "&via=" + encodeURIComponent(this.twitterUser))
      .replace(/@u/g, encodeURIComponent(this.url || ""))
      .replace(/@t/g, encodeURIComponent(this.title || ""))
      .replace(/@d/g, encodeURIComponent(this.description || ""))
      .replace(/@q/g, encodeURIComponent(this.quote || ""))
      .replace(/@h/g, this.encodedHashtags)
      .replace(/@m/g, encodeURIComponent(this.media || ""));
  }

  /* Encoded hashtags for the current social networks */

  get encodedHashtags(): string {
    if (this.key === "facebook" && this.hashtags?.length) {
      return "%23" + this.hashtags.split(",")[0];
    }

    return this.hashtags;
  }

  get computedClassName(): string {
    return this.className
      ? this.className
      : `share-network-` + this.key.replace(/\s/g, "");
  }

  // eslint-disable-next-line no-unused-vars
  handleClick(_event: MouseEvent): void {
    if (this.rawLink.substring(0, 4) === "http") {
      this.share();
    } else {
      this.touch();
    }
  }

  /**
   * Center the popup on multi-screens
   * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
   */

  resizePopup(): void {
    if (!$window) return;

    const width =
      $window.innerWidth ||
      document.documentElement.clientWidth ||
      $window.screenX;
    const height =
      $window.innerHeight ||
      document.documentElement.clientHeight ||
      $window.screenY;
    const systemZoom = width / $window.screen.availWidth;

    this.popupLeft =
      (width - this.popup.width) / 2 / systemZoom +
      ($window.screenLeft !== undefined ? $window.screenLeft : $window.screenX);
    this.popupTop =
      (height - this.popup.height) / 2 / systemZoom +
      ($window.screenTop !== undefined ? $window.screenTop : $window.screenY);
  }

  /**
   * Shares URL in specified network.
   */

  share(): void {
    if (!$window) return;
    this.resizePopup();

    // If a popup window already exist, we close it and trigger a change event.
    if (this.popupWindow && this.popupInterval) {
      clearInterval(this.popupInterval);

      // Force close (for Facebook)
      this.popupWindow.close();

      this.emit("change");
    }

    this.popupWindow = $window.open(
      this.shareLink,
      "sharer-" + this.key,
      ",height=" +
        this.popup.height +
        ",width=" +
        this.popup.width +
        ",left=" +
        this.popupLeft +
        ",top=" +
        this.popupTop +
        ",screenX=" +
        this.popupLeft +
        ",screenY=" +
        this.popupTop
    );

    // If popup are prevented (AdBlocker, Mobile App context..), popup.window stays undefined and we can't display it
    if (!this.popupWindow) return;

    this.popupWindow.focus();

    // Create an interval to detect popup closing event
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.popupInterval = setInterval(() => {
      if (!this.popupWindow || this.popupWindow.closed ) {
        if (this.popupInterval) {
          clearInterval(this.popupInterval);
        }
        
        this.popupWindow = null;
        this.emit("close");
      }
    }, 500);

    this.emit("open");
  }

  /**
   * Touches network and emits click event.
   */

  touch(): void {
    window.open(this.shareLink, "_blank");
    this.emit("open");
  }

  emit(
    name: string
  ): void {
    this.dispatchEvent(new CustomEvent(name, {
      detail: {
        key: this.key,
        url: this.url
      }
    }));
  }
}
