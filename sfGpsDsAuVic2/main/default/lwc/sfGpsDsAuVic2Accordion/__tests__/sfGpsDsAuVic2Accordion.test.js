import { createElement } from "lwc";
import SfGpsDsAuVic2Accordion from "c/sfGpsDsAuVic2Accordion";
import { setup } from "@sa11y/jest";

const tag = "c-sf-gps-ds-au-vic2-accordion";
const childTag = "c-sf-gps-ds-au-vic2-accordion-item";
const expandAllLabel = "Open all";
const collapseAllLabel = "Close all";
const simpleContent = [{ title: "Accordion", content: "How are you?" }];
const compositeContent = [
  { title: "Accordion", content: "How are you?" },
  { title: "Accordion 2", content: "Very well thank you!" }
];
const collapseExpandBtnSelect = ".rpl-accordion__toggle-all";

describe("c-sf-gps-ds-au-vic2-accordion", () => {
  beforeAll(() => {
    setup();
  });

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not have the expand all button when empty", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = [];
    document.body.appendChild(element);

    const expandAllButton = element.shadowRoot.querySelector(
      collapseExpandBtnSelect
    );
    expect(expandAllButton).toBeNull();
  });

  it("does have the expand all button for accordions by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = compositeContent;
    document.body.appendChild(element);

    const expandAllButton = element.shadowRoot.querySelector(
      collapseExpandBtnSelect
    );
    expect(expandAllButton).not.toBeNull();
    expect(expandAllButton.textContent).toBe(expandAllLabel);
  });

  it("is fully collapsed by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = simpleContent;
    document.body.appendChild(element);

    const childAccordions = element.shadowRoot.querySelectorAll(childTag);
    childAccordions.forEach((childAccordion) =>
      expect(childAccordion.closed).toBe(true)
    );
  });

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = simpleContent;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });

  it("is fully expanded when someone clicks on expand all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = compositeContent;
    document.body.appendChild(element);

    let expandAll = element.shadowRoot.querySelector(collapseExpandBtnSelect);
    expect(expandAll).not.toBeNull();
    expandAll.click();

    return Promise.resolve().then(() => {
      const childAccordions = element.shadowRoot.querySelectorAll(childTag);
      childAccordions.forEach((childAccordion) =>
        expect(childAccordion.closed).toBe(false)
      );

      // now the collapsed button should be there
      const collapseAll = element.shadowRoot.querySelector(
        collapseExpandBtnSelect
      );
      expect(collapseAll).not.toBeNull();
      expect(collapseAll.textContent).toBe(collapseAllLabel);
    });
  });

  it("is fully collapsed when someone clicks on expand all and then collapse all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = compositeContent;
    document.body.appendChild(element);

    const expandAll = element.shadowRoot.querySelector(collapseExpandBtnSelect);
    expect(expandAll).not.toBeNull();
    expandAll.click();

    return Promise.resolve().then(() => {
      // collapseAll should now be the enabled button as tested above
      const collapseAll = element.shadowRoot.querySelector(
        collapseExpandBtnSelect
      );
      expect(collapseAll).not.toBeNull();
      collapseAll.click();

      return Promise.resolve().then(() => {
        const childAccordions = element.shadowRoot.querySelectorAll(childTag);
        childAccordions.forEach((childAccordion) =>
          expect(childAccordion.closed).toBe(true)
        );
      });
    });
  });
});
