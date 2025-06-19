declare module "c/sfGpsDsAuNswGlobalAlert" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type AlertType = 
    "default" | 
    "light" | 
    "critical";
  
  export interface AlertValue {
    main: string,
    button: string
  };

  export type CtaStyle = 
    "button" | 
    "link";

  export default 
  class SfGpsDsAuNswGlobalAlert 
  extends SfGpsDsElement {
    title: string;
    copy: string;
    ctaText: string;
    ctaHref: string;
    className: string;

    as: AlertType;
    ctaStyle: CtaStyle;
    ctaPreventDefault: boolean;

    // private

    _isClosed: boolean;
    _as: PropertyAccessor<AlertValue>;
    _ctaStyle: PropertyAccessor<CtaStyle>;
    _ctaPreventDefault: PropertyAccessor<boolean>

    readonly space: boolean;
    readonly computedClassName: any;
    readonly computedButtonClassName: any;
    readonly _isCtaLinkStyle: boolean;
    readonly _isCtaButtonStyle: boolean;

    handleCtaClick(event: MouseEvent): void;
    handleCloseClick(event: MouseEvent): void;
  }
}
