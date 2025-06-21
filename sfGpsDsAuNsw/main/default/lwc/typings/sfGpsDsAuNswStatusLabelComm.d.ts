
declare module "c/sfGpsDsAuNswStatusLabelComm" { 
  import type { LightningElement } from "lwc"; 
  import type { Status } from "c/sfGpsDsAuNswStatusLabel";
  
  export default 
  class SfGpsDsAuNswStatusLabelComm 
  extends LightningElement {
    label?: string;
    status?: Status;
    className?: string;

    // private
  }
}
