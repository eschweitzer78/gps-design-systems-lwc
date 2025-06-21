declare module "c/sfGpsDsAuNswStepsComm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement"; 
  import type { CStyle } from "c/sfGpsDsAuNswSteps";
  import type { Header } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswStepsComm 
  extends SfGpsDsLwc {
    type?: string;
    cstyle?: CStyle;
    headingLevel?: string;

    // @ts-ignore
    firstChild?: boolean;
    className?: string;

    get content(): string | undefined;
    set content(markdown: string);

    // private

    _content: Header[];
    _contentOriginal?: string;

    get _isEmpty(): boolean;
  }
}
