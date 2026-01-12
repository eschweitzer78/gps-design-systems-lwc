declare module "c/sfGpsDsCaOnButtonComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { NavigationMixin } from "lightning/navigation";

  export default 
  class SfGpsDsCaOnButtonComm
  extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
    ariaLabelText?: string;
    elementId?: string;
    htmlType?: string;
    label?: string;
    url?: string;
    type?: string;
    className?: string;

    // private

    handleClick(_event: MouseEvent): void;
  }
}
