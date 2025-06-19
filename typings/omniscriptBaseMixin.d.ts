declare module "omnistudio/omniscriptBaseMixin" {
  type BaseItf = {
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
    );

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

  export type BaseMixinItf<T> = BaseItf & T;

  export function OmniscriptBaseMixin<T>(base: class): new(...args: any) => BaseMixinItf<T>;
}
