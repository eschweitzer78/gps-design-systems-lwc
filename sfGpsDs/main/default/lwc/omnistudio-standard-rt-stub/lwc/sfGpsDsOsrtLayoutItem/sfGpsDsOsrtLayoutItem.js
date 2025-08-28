import { LightningElement, api } from "lwc";
export default class LayoutItem extends LightningElement {
  @api size;
  @api smallDeviceSize;
  @api mediumDeviceSize;
  @api largeDeviceSize;
  @api padding;
  @api alignmentBump;
  @api flexibility;
}
