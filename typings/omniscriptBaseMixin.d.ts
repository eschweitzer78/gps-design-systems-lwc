declare module "omnistudio/omniscriptBaseMixin" {
  class OmniscriptBaseItf {
    showValidation: boolean;
    omniSpinnerEnabled: boolean;

    omniScriptHeaderDef: {};
    omniResume: boolean;
    omniSeedJson: object;
    omniJsonDef: object;
    omniJsonData: object;
    omniCustomState: Record<string, any>;
    omniJsonDataStr: string;

    dispatchOmniEventUtil(ref: object, detail: object, name: string): void;

    omniUpdateDataJson(
      input: object, 
      aggregateOverride: boolean
    ): void;

    applyCallResp(
      response: object,
      usePubSub: boolean
    ): void;

    omniStateSave(
      input: object,
      key: string,
      usePubsub: boolean
    ): void;

    omniGetSaveState(
      key: string
    ): object;

    omniGetMergeField(
      mergeFieldString: string
    ): string;

    omniNextStep(): void;
    omniPrevStep(): void;
    omniNavigateTo(element: string): void;

    omniValidate(showMessage: boolean): void;
    omniSaveForLater(auto: boolean): void;
    omniRemoteCall(params: object, enableSpinner: boolean): Promise<any|{
      error: boolean,
      errorMessage?: string
    }>

    checkValidity(): boolean;
    reportValidity(): boolean;
  }
  export function OmniscriptBaseMixin<T>(
    base: new (...args: any[]) => T
  ): new (...args: any[]) => OmniscriptBaseItf & T;
}
