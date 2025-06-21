declare module "c/sfGpsDsAuNswFooterComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type CStyle = 
    "default" | 
    "custom" | 
    "dark" | 
    "light";
  
  export default 
  class SfGpsDsAuNswFooterComm 
  extends SfGpsDsLwc {
    upperFooterMode: string;
    upperFooterNavigationDevName?: string;
    upperFooterIpName?: string;
    upperFooterInputJSON?: string;
    upperFooterOptionsJSONN?: string;
    upperFooterClassName?: string;

    mode: string;
    navigationDevName?: string;
    ipName?: string;
    inputJSON?: string;
    optionsJSON?: string;

    statement?: string;
    linkedInUrl?: string;
    twitterXUrl?: string;
    facebookUrl?: string;
    copyrightMention?: string;
    builtMention?: string;
    lowerFooterClassName?: string;
    className?: string;

    cstyle?: CStyle;

    // private
    
    _cstyle: PropertyAccessor<string>

    get computedClassName(): any;
    get computedShowUpperFooter(): boolean;
  }
}
