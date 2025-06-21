declare module "c/sfGpsDsCheckboxGroup" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import { PropertyAccessor } from "c/sfGpsDsElement";

  export const ELEMENT_SELECTOR: string;
  export const DISABLED_TRUE_VALUES: any[];
  export const READONLY_TRUE_VALUES: any[];
  export const REQUIRED_TRUE_VALUES: any[];
  export const VALUE_SEPARATOR: string;
  
  export interface Option {
    label: string,
    value: string,
    selected?: boolean
  }

  export interface InternalOption extends Option {
    [key: string]: any
  }

  export default 
  class SfGpsDsCheckboxGroup 
  extends SfGpsDsElement {
    name?: string;
    label?: string;
    fieldLevelHelp?: string;
    fieldLevelPosition?: string;
    alignment: "horizontal" | "vertical";

    get disabled(): boolean | string;
    set disabled(value: boolean | string);
    get readOnly(): boolean | string;
    set readOnly(value: boolean | string);
    get required(): boolean | string;
    set required(value: boolean | string);

    get value(): string[] | string;
    set value(value: string[] | string);

    get options(): Option[] | string[] | string;
    set options(options: Option[] | string[] | string);

    checked?: boolean | string;

    get requiredLabel(): string;
    set requiredLabel(value: string);

    fireChangeOnSetValue?: boolean | string;
    
    messageWhenValueMissing: string;

    readonly validity: ValidityState;
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;

    // private

    _elementId: string;
    _disabled: boolean;
    _disabledOriginal: boolean | string;
    _readOnly: boolean;
    _readOnlyOriginal: boolean | string;
    _required: boolean;
    _requiredOriginal: boolean | string;
    _value : string[];
    _options: Option[];
    _optionsOriginal: Option[] | string[] | string;

    _checked: PropertyAccessor<boolean>;
    _requiredLabel: string;
    _fireChangeOnSetValue: PropertyAccessor<boolean>;

    _internalOptions?: InternalOption[];

    _updateInternalOptions(): void;
    _mapInternalOption(
      option: Option, 
      index: number, 
      selected: boolean
    ): InternalOption;

    _isChanged: boolean;

    handleChange(event: InputEvent): void;
    handleFocus(event: FocusEvent): void;
    handleKeyDown(event: KeyboardEvent): void;

    _notifyChange(isSet?: boolean): void;

    _errorMessage?: string;
    _validity: object;
    get _hasError(): boolean;

    _assessValidity(showError: boolean): void;
  }
}