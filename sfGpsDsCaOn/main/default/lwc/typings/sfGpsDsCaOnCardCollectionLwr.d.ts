declare module "c/sfGpsDsCaOnCardLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";  

  export default 
  class SfGpsDsCaOnCardCollectionLwr
  extends SfGpsDsLwc {
    cardsPerRow?: string;
    className?: string;
  
    // private

    get computedClassName(): any;
  }
}
