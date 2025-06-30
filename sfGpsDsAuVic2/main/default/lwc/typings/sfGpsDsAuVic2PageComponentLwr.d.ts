declare module "c/sfGpsDsAuVic2PageComponentLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuVic2PageComponentLwr 
  extends SfGpsDsLwc {
    // title: string;

    get cid(): string | undefined;
    set cid(value: string);

    fullWidth?: boolean;
    className?: string;

    // private

    _cid?: string;
    _fullWidth: PropertyAccessor<boolean>;
    _className: PropertyAccessor<string>;
  }
}