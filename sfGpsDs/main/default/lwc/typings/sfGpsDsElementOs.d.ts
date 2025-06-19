declare module "c/sfGpsDsElementOs" {
  import type { LightningElement } from "lwc";

  export type PropertyWatcher<T> = 
    ((propertyName: string, newValue: T, oldValue: T) => void) | 
    ((propertyName: string, newValue: T) => void) | 
    ((propertyName?: string) => void);

  export type PropertyTransformer<T> = (value: any) => T;

  export interface PropertyDefOptions<T> {
    defaultValue?: any,
    watcher?: PropertyWatcher<T> | PropertyWatcher<T>[],
    transform?: PropertyTransformer<T>
  }

  export interface PropertyDefIntegerOptions extends PropertyDefOptions<number> {
    minValue?: number,
    maxValue?: number
  }

  export interface PropertyDefEnumOptions<T, K = string> extends PropertyDefOptions<T> {
    validValues?: T[] | { [key: string]: T },
    returnObjectValue?: boolean
  }

  export interface PropertyAccessor<T> {
    value: T
  }

  interface LwcError {
    index: number,
    code: string,
    description: string
  }

  type HookType = symbol;

  export default 
  class SfGpsDsElementOS 
  extends LightningElement {
    static HookTypes: { [key: string]: HookType };

    callHook(type: HookType): void;

    injectHook(
      type: HookType, 
      hook: Function, 
      prepend?: boolean
    ): Function;
    update(fn: Function | Function[]): void;

    update(fn: Function | Function[]): void;

    readonly handleBeforeMount: Function;
    readonly handleMounted: Function;
    readonly handleBeforeUpdate: Function;
    readonly handleUpdated: Function;
    readonly handleBeforeUnmount: Function;
    readonly handleUnmounted: Function;
    readonly handleFirstRender: Function;

    __serialiseInner(): string;

    defineProperty(
      propertyName: string, 
      options?: PropertyDefOptions<any>
    ): PropertyAccessor<any>;  
    
    defineBooleanProperty(
      propertyName: string, 
      options?: PropertyDefOptions<boolean>
    ): PropertyAccessor<boolean>;

    defineIntegerProperty<T = number>(
      propertyName: string, 
      options?: PropertyDefIntegerOptions
    ): PropertyAccessor<T>;

    defineStringProperty<T = string>(
      propertyName: string, 
      options?: PropertyDefOptions<string>
    ): PropertyAccessor<T>;

    defineEnumProperty<T = string>(
      propertyName: string, 
      options?: PropertyDefEnumOptions<T, T>
    ): PropertyAccessor<T>;

    defineEnumObjectProperty<T, K = string>(
      propertyName: string, 
      options?: PropertyDefEnumOptions<T, K>
    ): PropertyAccessor<T>;

    _isConnected: boolean;
    _isRendered: boolean;

    // patching for missing declarations in LightningElement

    hostElement: HTMLElement;
    refs: { [key: string]: HTMLElement };
  }
}