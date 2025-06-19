declare module "c/sfGpsDsIpLwc" {
  import type SfGpsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsIpLwc 
  extends SfGpsLwc {
    // public

    ipName: string;
    inputJSON: string;
    optionsJSON: string;
    ipActive: boolean | string;

    // private

    _ipActive: boolean;
    _ipName: string;
    _input: object;

    _options: object;

    _items: any[];
    _didLoadOnce: boolean;
    _isLoading: boolean;

    _nLoading: number;
    _loadingTimer: NodeJS.Timeout;

    startedLoading(): void;
    stoppedLoading(): void;
    refreshContent(): void;
    mapIpData(data: object[] | object): any[];
  }
}