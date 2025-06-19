declare module "c/sfGpsDsCheckboxGroup" {
  import type SfGpsDsElement from "c/sfGpsDsElement";

  export const ELEMENT_SELECTOR: string;
  export const DISABLED_TRUE_VALUES: any[];
  export const READONLY_TRUE_VALUES: any[];
  export const REQUIRED_TRUE_VALUES: any[];
  export const VALUE_SEPARATOR: string;
  export const CHECKED_DEFAULT: boolean;

  export interface Option {
    label: string,
    value: string,
    selected?: boolean
  };

  export interface InternalOption extends Option {
    [key: string]: any
  };

  export default 
  class SfGpsDsCheckboxGroup 
  extends SfGpsDsElement {
    name: string;
    label: string;
    fieldLevelHelp: string;
    fieldLevelPosition: string;
    alignment: "horizontal" | "vertical";
    disabled: boolean | string;
    readOnly: boolean | string;
    required: boolean | string;
    value: string[] | string;
    options: Option[] | string[] | string;
    checked: boolean | string;
    requiredLabel: string;

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

    _isChecked: boolean;
    _requiredLabel: string;

    _fireChangeOnSetValue: boolean;
    _fireChangeOnSetValue: boolean | string;

    _internalOptions: InternalOptions[];

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

    _errorMessage: string;
    _validity: object;
    readonly _hasError: boolean;

    _assessValidity(): void;
  }
}