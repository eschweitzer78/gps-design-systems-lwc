declare module "c/sfGpsDsDivLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsDivLwr 
  extends SfGpsDsLwc {
    type?: string;
    
    get nItems(): number;
    set nItems(value: number);

    className?: string;

    item1ClassName?: string;
    item1Id?: string;
    item2ClassName?: string;
    item2Id?: string;
    item3ClassName?: string;
    item3Id?: string;
    item4ClassName?: string;
    item4Id?: string;
    item5ClassName?: string;
    item5Id?: string;
    item6ClassName?: string;
    item6Id?: string;
    item7ClassName?: string;
    item7Id?: string;
    item8ClassName?: string;
    item8Id?: string;
    item9ClassName?: string;
    item9Id?: string;
    item10ClassName?: string;
    item10Id?: string;
    item11ClassName?: string;
    item11Id?: string;
    item12ClassName?: string;
    item12Id?: string;

    get has2(): boolean;
    get has3(): boolean;
    get has4(): boolean;
    get has5(): boolean;
    get has6(): boolean;
    get has7(): boolean;
    get has8(): boolean;
    get has9(): boolean;
    get has10(): boolean;
    get has11(): boolean;
    get has12(): boolean;

    // private

    _nItems?: number;
  }
}