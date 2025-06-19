declare module "c/sfGpsDsPubSub" {
  export interface PubSubCallback {
    (payload: any): void,
    uniqueObjectId: string
  }

  function register(
    eventName: string, 
    callbackobj: PubSubCallback
  ): void;

  function unregister(
    eventName: string,
    callbackobj: PubSubCallback
  ): void;

  const shouldExecuteCallbackHandler: {
    shouldExecuteCallback: (
      callback: PubSubCallback,
      payload: any
    ) => boolean
  }

  function fire(
    eventName: string, 
    action: string, 
    payload: any
  ): void;

  const m: {
    register: typeof register,
    unregister: typeof unregister,
    fire: typeof fire,
    shouldExecuteCallbackHandler: typeof shouldExecuteCallbackHandler,
  };
  
  export default m;
}