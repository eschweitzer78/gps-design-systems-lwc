declare module "c/sfGpsDsAuNswGlobalAlertContainerComm" {
  import type SfGpsDsIpLwc from "c/sfGpsDsLwc";
  import type { AlertType, CtaStyle } from "c/sfGpsDsAuNswGlobalAlert";

  export interface GlobalAlertData {
    alertId?: string;
    title?: string;
    copy?: string;
    as?: AlertType;
    ctaStyle: CtaStyle;
    cta?: string;
    cookie?: string;
  }

  export default 
  class SfGpsDsAuNswGlobalAlertContainerComm 
  extends SfGpsDsIpLwc {
    get isEmpty(): boolean;

    // private

    mapIpData(data: object | object[]): GlobalAlertData;
  }
}
