declare module "c/sfGpsDsOnWindowResize" {
  export default class SfGpsDsOnWindowResize {
    bind(handler: (event: Event) => any): void;
    unbind(): void;
  }
}