import { createElement } from "lwc";
import SfGpsDsAuVicAccordionComm from "c/sfGpsDsAuVicAccordionComm";

const tag = "c-sf-gps-ds-au-vic-accordion-comm";
const compositeContent =
  "# Accordion\\n\\nHow are you?\\n\\n# Accordion 2\\n\\nVery well thank you!\\n";

describe("c-sf-gps-ds-au-vic-accordion-comm", () => {
  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVicAccordionComm
    });

    element.title = "Accordion set";
    element.content = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
