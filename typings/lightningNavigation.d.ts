declare module "lightning/navigation" {
  class Navigation {
    static Navigate: string;
    static GenerateUrl: string;
  }

  export function NavigationMixin<T>(
    base: new (...args: any[]) => T
  ): new (...args: any[]) => Navigation & T;

  export type PageReference = any;
  export const CurrentPageReference: PageReference;
}
