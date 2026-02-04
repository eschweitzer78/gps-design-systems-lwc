declare module "c/sfGpsDsTabLwr" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsTabLwr 
  extends SfGpsDsElement {
    className?: string;
    vid?: string;
    variaLabelledBy?: string;
    
    get value(): string | undefined;
    set value(value: string);

    get label(): string;
    set label(value: string);

    get vhidden(): boolean;
    set vhidden(value: boolean);

    showErrorIndicator: boolean;

    loadContent(): boolean;

    // private

    _value?: string;
    _valueOriginal?: string;
    _label: string | undefined;
    _title: string;
    _vhidden: boolean;

    _showErrorIndicator: PropertyAccessor<boolean>;
    _loadContent?: boolean;
    _deregistrationCallback?: Function;

    get computedClassName(): any;

    _dispatchDataChangeEventIfConnected(): void;
  }
}
