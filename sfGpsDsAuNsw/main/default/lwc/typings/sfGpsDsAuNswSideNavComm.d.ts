
declare module "c/sfGpsDsAuNswSideNavComm" { 
  import type SfGpsDsNavigation from "c/sfGpsDsNavigation"; 
  import type SfGpsDsNavigationService from "c/SfGpsDsNavigationService";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswSideNavComm
  extends SfGpsDsNavigation {
    parentText?: string;
    className?: string;
    titleLink?: string;

    // private

    _titleLink: PropertyAccessor<Link>;

    get _title(): string | undefined;
    get _url(): string | undefined;
    get navSvc(): SfGpsDsNavigationService;

    handleNavigate(
      event: CustomEvent
    ): any;
  }
}
