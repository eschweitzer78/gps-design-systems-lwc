import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicButtonComm extends SfGpsDsLwc {
  @api href;
  @api target;
  @api theme;
  @api disabled = false;
  @api label;
  @api className;
}
