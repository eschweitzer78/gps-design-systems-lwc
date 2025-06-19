import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswTabContainerLwr from "c/sfGpsDsAuNswTabContainerLwr";

const ELT_TAG = "c-sf-gps-ds-au-nsw-container-lwr";

describe("c-sf-gps-ds-au-nsw-tab-container-lwr", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    window.$A = undefined;
  });

  it("does not show in Aura", () => {
    window.$A = "hello";

    // Arrange
    let element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTabContainerLwr
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const tabSet = element.shadowRoot.querySelector(
      "c-sf-gps-ds-au-nsw-tab-set-lwr"
    );
    expect(tabSet).toBeNull();

    const error = element.shadowRoot.querySelector(
      "c-sf-gps-ds-configuration-error"
    );
    expect(error).not.toBeNull();
  });

  it("does show in LWR with no tabs by default", () => {
    // Arrange
    let element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTabContainerLwr
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const tabSet = element.shadowRoot.querySelector(
      "c-sf-gps-ds-au-nsw-tab-set-lwr"
    );
    expect(tabSet).not.toBeNull();

    const tabs = element.shadowRoot.querySelectorAll(
      "c-sf-gps-ds-au-nsw-tab-lwr"
    );
    expect(tabs.length).toBe(0);

    const error = element.shadowRoot.querySelector(
      "c-sf-gps-ds-configuration-error"
    );
    expect(error).toBeNull();
  });

  it("does show in LWR with tabs if configured so", () => {
    // Arrange
    let element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswTabContainerLwr
    });

    // Act
    element.tab1Label = "Tab 1";
    element.tab2Label = "Tab 2";
    document.body.appendChild(element);

    // Assert
    const tabSet = element.shadowRoot.querySelector(
      "c-sf-gps-ds-au-nsw-tab-set-lwr"
    );
    expect(tabSet).not.toBeNull();

    const tabs = element.shadowRoot.querySelectorAll(
      "c-sf-gps-ds-au-nsw-tab-lwr"
    );
    expect(tabs.length).toBe(2);

    const error = element.shadowRoot.querySelector(
      "c-sf-gps-ds-configuration-error"
    );
    expect(error).toBeNull();
  });
});
