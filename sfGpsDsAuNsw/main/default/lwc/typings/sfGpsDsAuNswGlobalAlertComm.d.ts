declare module "c/sfGpsDsAuNswGlobalAlertComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { AlertType, CtaStyle } from "c/sfGpsDsAuNswGlobalAlert";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswGlobalAlertComm 
  extends SfGpsDsLwc {
    //title: string;
    copy?: string;
    as: AlertType;
    ctaStyle: CtaStyle;
    className?: string;
    cta?: string;

    // private

    _cta: PropertyAccessor<Link>;
  }
}
