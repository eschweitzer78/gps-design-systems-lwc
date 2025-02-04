import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api date; // string in iso format
  @api locationPrefix;
  @api location;
  @api authorPrefix;
  @api author;
  @api className;
}
