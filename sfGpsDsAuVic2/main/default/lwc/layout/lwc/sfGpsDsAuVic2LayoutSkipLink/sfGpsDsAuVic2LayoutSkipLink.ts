import { 
  LightningElement, 
  api 
} from "lwc";

export default 
class SfGpsDsAuVic2LayoutSkipLink 
extends LightningElement {
  // @ts-ignore
  @api 
  targetId?: string;

  get computedHref() {
    return this.targetId ? `#${this.targetId}` : "#";
  }
}
