declare module "c/sfGpsDsSocialSharing" {
  import type { LightningElement } from "lwc";

  export interface MockWindow {
    innerWidth: number,
    screenX: number,
    innerHeight: number,
    screenY: number,
    screen: {
      availWidth: number
    },
    screenLeft: number,
    screenTop: number,

    open(
      url: string, 
      target?: string, 
      windowFeatures?: string
    ): Window | null;
  }

  export interface Dimensions {
    width: number,
    height: number
  }

  export function mockWindow(
    self: MockWindow
  ): void;

  export default 
  class SfGpsDsSocialSharing 
  extends LightningElement {
    name: string;
    network: string;
    url: string;
    // title: string;
    description: string;
    quote: string;
    hashtags: string;
    twitterUser: string;
    media: string;
    tag: string;
    popup: Dimensions;
    className?: string;

    // private

    popupTop: number;
    popupLeft: number;
    popupWindow: Window | null;
    popupInterval: NodeJS.Timeout | null;

    networks: Record<string, string>;

    get key(): string;
    get rawLink(): string;
    get shareLink(): string;
    get encodedHashtags(): string;
    get computedClassName(): string;

    handleClick(
      event: MouseEvent
    ): void;

    resizePopup(): void;
    share(): void;
    touch(): void;

    emit(
      name: string
    ): void;
  }
}