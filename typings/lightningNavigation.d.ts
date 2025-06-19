declare module "lightning/navigation" {
  class NavigationItf {
    static Navigate: string;
    static GenerateUrl: string;
  }

  type NavigationMixinItf<T> = NavigationItf & T;

  export function NavigationMixin<T>(base: { new(): T }): new(...args: any) => NavigationMixinItf<T>;

  export type PageReference = any;
  export const CurrentPageReference: PageReference;
}
