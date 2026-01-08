declare module "c/sfGpsDsIpLwc" {
  import type SfGpsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsIpLwc 
  extends SfGpsLwc {
    // public

    get ipActive(): boolean;
    set ipActive(value: boolean);

    get ipName(): string | undefined;
    set ipName(value: string | undefined);

    get inputJSON(): string | undefined;
    set inputJSON(value: string | undefined);
    get optionsJSON(): string | undefined;
    set optionsJSON(value: string | undefined);

    // private

    _ipActive: boolean;
    _ipName?: string;
    _input: object | undefined;
    _inputJSONOriginal: string | undefined;
    _options: object | undefined;
    _optionsJSONOriginal: string | undefined;

    _items: any[];
    _didLoadOnce: boolean;
    _isLoading: boolean;

    _nLoading: number;
    _loadingTimer?: NodeJS.Timeout;

    startedLoading(): void;
    stoppedLoading(): void;
    refreshContent(): void;
    runIntegrationProcedureCustom(
      additionalInput: object, 
      successCb: (value: any) => any, 
      failureCb: (value: any) => any
    ): void;
    mapIpData(data: object[] | object): any[];
  }
}