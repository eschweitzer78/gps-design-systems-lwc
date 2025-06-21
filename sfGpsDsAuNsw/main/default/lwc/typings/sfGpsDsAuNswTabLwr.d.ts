declare module "c/sfGpsDsAuNswTabLwr" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswTabLwr 
  extends SfGpsDsElement {
    className?: string;
    vid?: string;
    variaLabelledBy?: string;
    vhidden?: boolean;

    get value(): string | undefined;
    set value(value: string);

    get label(): string;
    set label(value: string);

    showErrorIndicator: boolean;

    loadContent(): boolean;

    // private

    _value?: string;
    _valueOriginal?: string;
    _label: string;
    _title: string;

    _showErrorIndicator: PropertyAccessor<boolean>;
    _loadContent?: boolean;

    get computedClassName(): any;

    _dispatchDataChangeEventIfConnected(): void;

    _deregistrationCallback?: Function;

  }
}
