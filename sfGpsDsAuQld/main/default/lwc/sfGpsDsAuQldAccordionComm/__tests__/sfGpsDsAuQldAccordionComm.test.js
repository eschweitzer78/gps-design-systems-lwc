import { createElement } from "lwc";
import SfGpsDsAuQldAccordionComm from "c/sfGpsDsAuQldAccordionComm";

const tag = "c-sf-gps-ds-au-qld-accordion-comm";
const compositeContent =
  "# Accordion\\n\\nHow are you?\\n\\n# Accordion 2\\n\\nVery well thank you!\\n";

describe("c-sf-gps-ds-au-qld-accordion-comm", () => {
  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuQldAccordionComm
    });

    element.content = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
