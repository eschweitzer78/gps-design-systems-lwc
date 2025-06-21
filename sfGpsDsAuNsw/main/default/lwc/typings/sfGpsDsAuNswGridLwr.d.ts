declare module "c/sfGpsDsAuNswGridLwr" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  type GridType = 
    "default" | 
    "spaced" | 
    "flushed";

  export default 
  class sfGpsDsAuNswGridLwr 
  extends SfGpsDsElement {
    col1ClassName?: string;
    col2ClassName?: string;
    col3ClassName?: string;
    col4ClassName?: string;
    col5ClassName?: string;
    col6ClassName?: string;
    col7ClassName?: string;
    col8ClassName?: string;
    col9ClassName?: string;
    col10ClassName?: string;
    col11ClassName?: string;
    col12ClassName?: string;
    className?: string;

    type?: GridType;

    // private

    _type: PropertyAccessor<string>;
    
    get computedClassName(): any;
  }
}
