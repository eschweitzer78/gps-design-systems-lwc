import { createElement } from "lwc";
import SfGpsDsAuVic2Accordion from "c/sfGpsDsAuVic2Accordion";
import defaultItemsFixture from "./fixtures/default";
import simpleItemsFixture from "./fixtures/sfdc-simple";
import complexItemsFixture from "./fixtures/sfdc-complex";
import { setup } from "@sa11y/jest";

const tag = "c-sf-gps-ds-au-vic2-accordion";
const childTag = "c-sf-gps-ds-au-vic2-accordion-item";
const expandAllLabel = "Open all";
const collapseAllLabel = "Close all";
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

    element.items = complexItemsFixture;
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

    element.items = simpleItemsFixture;
    document.body.appendChild(element);

    const childAccordions = element.shadowRoot.querySelectorAll(childTag);
    childAccordions.forEach((childAccordion) =>
      expect(childAccordion.closed).toBe(true)
    );
  });

  it("is fully expanded when user clicks on expand all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = complexItemsFixture;
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

  it("is fully collapsed when user clicks on expand all and then collapse all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = complexItemsFixture;
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

  it("is accessible", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    element.items = simpleItemsFixture;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });

  /* vic-sdp */

  const baseProps = {
    title: "Title",
    items: defaultItemsFixture
  };

  it("show numbered accordions", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuVic2Accordion
    });

    Object.assign(element, {
      ...baseProps,
      numbered: true
    });

    document.body.appendChild(element);

    const childrenAccordions = element.shadowRoot.querySelectorAll(
      ".rpl-accordion__item-number"
    );
    expect(childrenAccordions).toHaveLength(element.items.length);
    expect(childrenAccordions[0].textContent).toContain("1");
    expect(childrenAccordions[1].textContent).toContain("2");
    expect(childrenAccordions[2].textContent).toContain("3");
  });
});
