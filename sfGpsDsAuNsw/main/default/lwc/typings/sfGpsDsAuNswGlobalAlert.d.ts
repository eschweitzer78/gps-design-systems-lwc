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
  }

  export type CtaStyle = 
    "button" | 
    "link";

  export default 
  class SfGpsDsAuNswGlobalAlert 
  extends SfGpsDsElement {
    // title: string;
    copy?: string;
    ctaText?: string;
    ctaHref?: string;
    className?: string;

    as?: AlertType;
    ctaStyle?: CtaStyle;
    ctaPreventDefault?: boolean;

    // private

    _isClosed?: boolean;
    _as: PropertyAccessor<AlertValue>;
    _ctaStyle: PropertyAccessor<CtaStyle>;
    _ctaPreventDefault: PropertyAccessor<boolean>

    get space(): boolean;
    get computedClassName(): any;
    get computedButtonClassName(): any;
    get _isCtaLinkStyle(): boolean;
    get _isCtaButtonStyle(): boolean;

    handleCtaClick(event: MouseEvent): void;
    handleCloseClick(event: MouseEvent): void;
  }
}
