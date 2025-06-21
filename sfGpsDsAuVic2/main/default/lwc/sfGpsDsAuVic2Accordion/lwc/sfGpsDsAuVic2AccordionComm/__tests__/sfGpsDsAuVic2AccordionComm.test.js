import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuVic2AccordionComm from "c/sfGpsDsAuVic2AccordionComm";

const tag = "c-sf-gps-ds-au-vic-accordion-comm";
const compositeContent =
  "# Accordion\\n\\nHow are you?\\n\\n# Accordion 2\\n\\nVery well thank you!\\n";

describe("c-sf-gps-ds-au-vic2-accordion-comm", () => {
  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2AccordionComm
    });

    element.content = compositeContent;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
