declare module "c/sfGpsDsAuNswStepsV2Comm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 
  import type { CStyle, Size } from "c/sfGpsDsAuNswSteps";
  import type { Header } from "c/sfGpsDsMarkdown";
  import type { HeadingLevel } from "c/sfGpsDsAuNswStepsItem";

  export default 
  class SfGpsDsAuNswStepsV2Comm 
  extends SfGpsDsLwc {
    type?: string;
    cstyle?: CStyle;
    size?: Size;

    // @ts-ignore
    firstChild?: boolean;
    className?: string;

    get content(): string | undefined;
    set content(markdown: string);

    // private

    _content: Header[];
    _contentOriginal?: string;

    get _isEmpty(): boolean;
    get computedHeadingLevel(): HeadingLevel;
  }
}
