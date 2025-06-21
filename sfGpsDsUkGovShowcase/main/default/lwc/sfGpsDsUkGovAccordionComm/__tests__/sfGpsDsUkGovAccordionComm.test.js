import { createElement } from "@lwc/engine-dom";
import SfGpsDsUkGovAccordionComm from "c/sfGpsDsUkGovAccordionComm";

const tag = "c-sf-gps-ds-uk-gov-accordion-comm";
const compositeContent =
  "# Accordion\\n\\nHow are you?\\n\\n# Accordion 2\\n\\nVery well thank you!\\n";

describe("c-sf-gps-ds-uk-gov-accordion-comm", () => {
  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsUkGovAccordionComm
    });

    element.title = "Accordion";
    element.content = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });
});
