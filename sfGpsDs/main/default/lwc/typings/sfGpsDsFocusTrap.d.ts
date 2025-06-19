declare module "c/sfGpsDsFocusTrap" {

  export interface FocusTrapOptions {
  }

  export default class SfGpsDsFocusTrap {
    // public

    disabled: integer | string;
    options: FocusTrapOptions;

    // private

    _disabled: boolean;
    _disabledOriginal: integer | string;
  }
}