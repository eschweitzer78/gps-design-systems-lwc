declare module "c/sfGpsDsOnClickOutside" {

  export type HandlerFunction = (event: Event) => any;
  export type MiddlewareFunction = (event: Event) => Event;

  export interface HandlerObject {
    handler: HandlerFunction,
    middleware?: MiddlewareFunction,
    events?: string[],
    active?: boolean
  }

  export type Handler = HandlerFunction | HandlerObject;

  export interface HandlerEntry {
    event: string,
    tagger: (e: Event) => void,
    handler: (e: Event) => void,
    forceTag: (e: Event) => void
  }

  export type HandlerEntries = {
    [key: string]: HandlerEntry[]
  }

  export default class SfGpsDsOnClickOutside {
    bind(pel: any, ref: string, value: Handler): void;
    unbind(pel: any, ref: string): void;
    forceTag(ref: string, event: Event): void;
    
    // private

    _sfGpsDsOnClickOutside: HandlerEntries;

  }
}