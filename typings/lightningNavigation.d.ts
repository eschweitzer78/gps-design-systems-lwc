declare module "lightning/navigation" {
  interface NavigationItf {
    static Navigate: string,
    static GenerateUrl: string,
  }

  type NavigationMixinItf<T> = NavigationItf & T;

  export function NavigationMixin<T>(base: class): new(...args: any) => NavigationMixinItf<T>;

  export type PageReference = any;
  export const CurrentPageReference: PageReference;
}
