import { createElement } from "lwc";
import SfGpsDsAuVicAccordion from "c/sfGpsDsAuVicAccordion";
import { setup } from "@sa11y/jest";

const tag = "c-sf-gps-ds-au-vic-accordion";
const childTag = "c-sf-gps-ds-au-vic-accordion-item";
const expandAllLabel = "Open all";
const collapseAllLabel = "Close all";
const simpleContent = [{ title: "Accordion", content: "How are you?" }];
const compositeContent = [
  { title: "Accordion", content: "How are you?" },
  { title: "Accordion 2", content: "Very well thank you!" }
];
const collapseBtnSelect = ".rpl-accordion__collapse-btn";

describe("c-sf-gps-ds-au-vic-accordion", () => {
  beforeAll(() => {
    setup();
  });

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not have the expand/collapse all buttons by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVicAccordion
    });

    element.accordions = simpleContent;
    document.body.appendChild(element);

    const expandAllButton = element.querySelector(collapseBtnSelect);
    expect(expandAllButton).toBeNull();
  });

  it("is fully collapsed by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVicAccordion
    });

    element.accordions = simpleContent;
    document.body.appendChild(element);

    const childAccordions = element.querySelectorAll(childTag);
    childAccordions.forEach((childAccordion) =>
      expect(childAccordion.closed).toBe(true)
    );
  });

  it("does have the expand all button when configured for that", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVicAccordion
    });

    element.accordions = simpleContent;
    element.showButtons = true;
    document.body.appendChild(element);

    const expandAllButtons = element.querySelectorAll(collapseBtnSelect);
    expect(expandAllButtons.length).toBe(1);

    const expandAll = expandAllButtons[0];
    expect(expandAll).not.toBeNull();
    expect(expandAll.textContent).toBe(expandAllLabel);
  });

  it("is fully expanded when someone clicks on expand all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVicAccordion
    });

    element.accordions = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    let expandAll = element.querySelector(collapseBtnSelect);
    expect(expandAll).not.toBeNull();
    expandAll.click();

    return Promise.resolve().then(() => {
      const childAccordions = element.querySelectorAll(childTag);
      childAccordions.forEach((childAccordion) =>
        expect(childAccordion.closed).toBe(false)
      );

      // now the collapsed button should be there
      const collapseAll = element.querySelector(collapseBtnSelect);
      expect(collapseAll).not.toBeNull();
      expect(collapseAll.textContent).toBe(collapseAllLabel);
    });
  });

  it("is fully collapsed when someone clicks on expand all and then collapse all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVicAccordion
    });

    element.accordions = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    const expandAll = element.querySelector(collapseBtnSelect);
    expect(expandAll).not.toBeNull();
    expandAll.click();

    return Promise.resolve().then(() => {
      // collapseAll should now be the enabled button as tested above
      const collapseAll = element.querySelector(collapseBtnSelect);
      expect(collapseAll).not.toBeNull();
      collapseAll.click();

      return Promise.resolve().then(() => {
        const childAccordions = element.querySelectorAll(childTag);
        childAccordions.forEach((childAccordion) =>
          expect(childAccordion.closed).toBe(true)
        );
      });
    });
  });
});
