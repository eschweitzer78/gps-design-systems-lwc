declare module "c/sfGpsDsAuNswTabLwr" { 
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswTabLwr 
  extends SfGpsDsElement {
    className: string;
    vid: string;
    variaLabelledBy: string;
    vhidden: boolean;

    value: string;
    label: string;
    showErrorIndicator: boolean;

    loadContent(): boolean;

    // private

    _value: string;
    _valueOriginal: string;
    _label: string;
    _title: string;
    _showErrorIndicator: boolean;
    _loadContent: boolean;

    readonly computedClassName: any;

    _dispatchDataChangeEventIfConnected(): void;

    _deregistrationCallback: Function;

  }
}
