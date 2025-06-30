declare module "c/sfGpsDsAuVic2PopupMixin" {
  export interface PopupMixinItf {
    openPopup(content: string, key: string): void;
    resizePopup($window: Window): void;
  }

  export default function PopupMixin<T>(
    base: new (...args: any[]) => object,
    popupSize?: {
      width: number,
      height: number
    }
  ): new (...args: any[]) => PopupMixinItf & T;
}