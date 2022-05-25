import mdEngine from "c/sfGpsDsMarkdown";

describe("c-sf-gps-ds-markdown", () => {
  afterEach(() => {});

  it("puts simple text in a paragraph", () => {
    expect(mdEngine.renderEscaped("There is no data")).toBe(
      "<p>There is no data</p>\n"
    );
  });

  it("puts single hash to h1", () => {
    expect(mdEngine.renderEscaped("# Heading")).toBe("<h1>Heading</h1>\n");
  });

  it("puts double hash to h2", () => {
    expect(mdEngine.renderEscaped("## Heading")).toBe("<h2>Heading</h2>\n");
  });

  it("puts single double star item to strong in a paragraph", () => {
    expect(mdEngine.renderEscaped("**strong**")).toBe(
      "<p><strong>strong</strong></p>\n"
    );
  });

  it("puts double star item to strong with other word all in a paragraph", () => {
    expect(mdEngine.renderEscaped("**strong** word")).toBe(
      "<p><strong>strong</strong> word</p>\n"
    );
  });

  it("emphasizes single star item with other word all in a paragraph", () => {
    expect(mdEngine.renderEscaped("*emphasized* word")).toBe(
      "<p><em>emphasized</em> word</p>\n"
    );
  });

  it("puts greater sign to blockquote", () => {
    expect(mdEngine.renderEscaped("> quote")).toBe(
      "<blockquote>\n<p>quote</p>\n</blockquote>\n"
    );
  });

  it("builds an ordered list for numbered items", () => {
    expect(mdEngine.renderEscaped("1. First item\n2. Second item\n")).toBe(
      "<ol>\n<li>First item</li>\n<li>Second item</li>\n</ol>\n"
    );
  });

  it("builds an unordered list for hyphenized items", () => {
    expect(mdEngine.renderEscaped("- First item\n- Second item\n")).toBe(
      "<ul>\n<li>First item</li>\n<li>Second item</li>\n</ul>\n"
    );
  });

  it("builds a code block for backquoted items", () => {
    expect(mdEngine.renderEscaped("`code`")).toBe("<p><code>code</code></p>\n");
  });

  it("blurbs a fenced code block for backquoted items", () => {
    expect(
      mdEngine.renderEscaped('```javascript\nlet s = "Hello";\nalert(s);\n```')
    ).toBe(
      '<pre><code class="language-javascript">let s = &quot;Hello&quot;;\nalert(s);\n</code></pre>\n'
    );
  });

  it("creates an hr for three hyphens in a row", () => {
    expect(mdEngine.renderEscaped("---")).toBe("<hr />\n");
  });

  it("creates links for items between square brackets", () => {
    expect(mdEngine.renderEscaped("[link](https://url.to)")).toBe(
      '<p><a href="https://url.to">link</a></p>\n'
    );
  });
});
