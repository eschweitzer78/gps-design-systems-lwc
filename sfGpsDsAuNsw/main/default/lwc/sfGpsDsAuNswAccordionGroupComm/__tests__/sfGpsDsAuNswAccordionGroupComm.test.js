import { createElement } from "lwc";
import SfGpsDsAuNswAccordionGroupComm from "c/sfGpsDsAuNswAccordionGroupComm";

const tag = "c-sf-gps-ds-au-nsw-accordion-group-comm";
const childTag = "c-sf-gps-ds-au-nsw-accordion-comm";
const expandAllLabel = "Expand all";
const collapseAllLabel = "Collapse all";
const simpleContent = "# Accordion\n\nHow are you?";
const compositeContent =
  "# Accordion\n\nHow are you?\n\n# Accordion2\n\nVery well thank you!";
const enabledBtnSelect = "button:not([disabled])";
const disabledBtnSelect = "button:disabled";
const toggleClassSelect = ".nsw-accordion__toggle";

describe("c-sf-gps-ds-au-nsw-accordion-group-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is does not have the expand/collapse all buttons by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionGroupComm
    });

    element.content = simpleContent;
    document.body.appendChild(element);

    const toggle = element.shadowRoot.querySelector(toggleClassSelect);
    expect(toggle).toBeNull();
  });

  it("is fully collapsed by default", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionGroupComm
    });

    element.content = simpleContent;
    document.body.appendChild(element);

    const childAccordions = element.shadowRoot.querySelectorAll(childTag);
    childAccordions.forEach((childAccordion) =>
      expect(childAccordion.closed).toBe(true)
    );
  });

  it("is does have the expand/collapse all buttons when configured to", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionGroupComm
    });

    element.content = simpleContent;
    element.showButtons = true;
    document.body.appendChild(element);

    const toggle = element.shadowRoot.querySelector(toggleClassSelect);
    expect(toggle).not.toBeNull();

    const expandAll = element.shadowRoot.querySelector(enabledBtnSelect);
    expect(expandAll).not.toBeNull();
    expect(expandAll.textContent).toBe(expandAllLabel);

    const collapsedAll = element.shadowRoot.querySelector(disabledBtnSelect);
    expect(collapsedAll).not.toBeNull();
    expect(collapsedAll.textContent).toBe(collapseAllLabel);
  });

  it("is fully expanded when someone clicks on expand all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionGroupComm
    });

    element.content = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    let expandAll = element.shadowRoot.querySelector(enabledBtnSelect);
    expect(expandAll).not.toBeNull();
    expandAll.click();

    return Promise.resolve().then(() => {
      const childAccordions = element.shadowRoot.querySelectorAll(childTag);
      childAccordions.forEach((childAccordion) =>
        expect(childAccordion.closed).toBe(false)
      );

      // now the expand all button should be disabled
      expandAll = element.shadowRoot.querySelector(disabledBtnSelect);
      expect(expandAll).not.toBeNull();
      expect(expandAll.textContent).toBe(expandAllLabel);

      // now the collapsed button should be enabled
      const collapseAll = element.shadowRoot.querySelector(enabledBtnSelect);
      expect(collapseAll).not.toBeNull();
      expect(collapseAll.textContent).toBe(collapseAllLabel);
    });
  });

  it("is fully collapsed when someone clicks on expand all and then collapse all", () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionGroupComm
    });

    element.content = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    const expandAll = element.shadowRoot.querySelector(enabledBtnSelect);
    expect(expandAll).not.toBeNull();
    expandAll.click();

    return Promise.resolve().then(() => {
      // collapseAll should now be the enabled button as tested above
      const collapseAll = element.shadowRoot.querySelector(enabledBtnSelect);
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
      is: SfGpsDsAuNswAccordionGroupComm
    });

    element.content = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    await expect(element).toBeAccessible();
  });

  it("is accessible when expanded", async () => {
    const element = createElement(tag, {
      is: SfGpsDsAuNswAccordionGroupComm
    });

    element.content = compositeContent;
    element.showButtons = true;
    document.body.appendChild(element);

    const expandAll = element.shadowRoot.querySelector(enabledBtnSelect);
    expect(expandAll).not.toBeNull();
    expandAll.click();

    return Promise.resolve().then(async () => {
      await expect(element).toBeAccessible();
    });
  });
});
