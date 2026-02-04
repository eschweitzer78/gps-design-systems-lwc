declare module "c/sfGpsDsCaOnCardCollectionLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";  
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  export type CardsPerRow = "1" | "2" | "3" | "4"

  export default 
  class SfGpsDsCaOnCardCollectionLwr
  extends SfGpsDsLwc {
    cardsPerRow?: CardsPerRow;
    className?: string;
  
    // private

    _cardsPerRow: PropertyAccessor<CardsPerRow>;
    get computedClassName(): any;
  }
}
