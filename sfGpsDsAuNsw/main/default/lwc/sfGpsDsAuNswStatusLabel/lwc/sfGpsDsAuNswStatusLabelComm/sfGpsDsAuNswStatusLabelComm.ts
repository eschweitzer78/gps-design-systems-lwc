import {
  LightningElement, 
  api 
} from "lwc";

import type { 
  Status 
} from "c/sfGpsDsAuNswStatusLabel";

export default 
class SfGpsDsAuNswStatusLabelComm
extends LightningElement {
  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  status?: Status;
  
  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  connectedCallback() {
    this.classList.add("nsw-scope");
  }
}
