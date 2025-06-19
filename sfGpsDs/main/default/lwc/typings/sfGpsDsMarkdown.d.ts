declare module "c/sfGpsDsMarkdown" {
  export interface Link {
    url?: string,
    text?: string,
    index?: number
  }

  export interface Header {
    title?: string,
    html?: string,
    index: number
  }

  export class sfGpsDsMarkdown {
    parse(
      markdown: string
    ): Node;
    render(
      markdown: string, 
      attribute?: string
    ): string;
    renderEscaped(
      markdown: string, 
      attribute?: string
    ): string;
    renderEscapedUnpackFirstP(
      markdown: string, 
      attribute?: string
    ): string;
    renderNode(
      node: Node, 
      attribute?: string
    ): string;
    renderLinks(
      markdown: string, 
      attribute?: string
    ): string;
    extractLinks(
      markdown: string
    ): Link[];
    extractFirstLink(
      markdown: string
    ): Link;
    extractH1s(
      markdown: string
    ): Header[];
    decodeEntities(
      str: string
    ): string;
  }

  const renderer: sfGpsDsMarkdown;

  export default renderer;
}
