import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api mode; // landscape, stacked, minimal
  @api label;
  @api className;
}
