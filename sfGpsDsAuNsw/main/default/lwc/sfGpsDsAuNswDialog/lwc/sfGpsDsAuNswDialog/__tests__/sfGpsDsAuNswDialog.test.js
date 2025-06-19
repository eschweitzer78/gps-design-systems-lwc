import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswDialog from "c/sfGpsDsAuNswDialog";

const ELT_TAG = "c-sf-gps-ds-au-nsw-dialog";

describe("c-sf-gps-ds-au-nsw-dialog", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is not open by default and has a single action", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswDialog
    });

    // Act
    element.title = "Dialog";
    element.primaryButtonText = "OK";

    document.body.appendChild(element);

    // Assert
    const dialog = element.querySelector(".nsw-dialog");

    expect(dialog).not.toBeNull();
    expect(dialog.classList).not.toContain("active");
    expect(dialog.ariaExpanded).toBe("false");
    expect(dialog.classList).toContain("nsw-dialog--single-action");
  });

  it("is has the right classes if open and is not dismissible by default", () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswDialog
    });

    // Act
    element.title = "Dialog";
    element.primaryButtonText = "OK";
    element.secondaryButtonText = "Cancel";
    element.isOpen = true;

    document.body.appendChild(element);

    // Assert
    const dialog = element.querySelector(".nsw-dialog");
    const close = element.querySelector(".nsw-dialog__close");

    expect(dialog).not.toBeNull();
    expect(dialog.classList).toContain("active");
    expect(dialog.ariaExpanded).toBe("true");
    expect(dialog.classList).not.toContain("nsw-dialog--single-action");

    expect(close).toBeNull();
  });

  it("can be dismissed by clicking if configured so", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswDialog
    });

    // Act
    element.title = "Dialog";
    element.primaryButtonText = "OK";
    element.secondaryButtonText = "Cancel";
    element.isDismissible = true;
    element.isOpen = true;

    document.body.appendChild(element);

    // Assert
    const closeButton = element.querySelector(".nsw-dialog__close button");
    const handler = jest.fn();

    expect(closeButton).not.toBeNull();

    element.addEventListener("close", handler);
    closeButton.click();

    return Promise.resolve().then(() => {
      expect(handler).toHaveBeenCalled();

      element.isOpen = false;

      return Promise.resolve().then(() => {
        const dialog = element.querySelector(".nsw-dialog");
        const close = element.querySelector(".nsw-dialog__close");

        expect(dialog).not.toBeNull();
        expect(dialog.classList).not.toContain("active");
        expect(dialog.ariaExpanded).toBe("false");

        expect(close).not.toBeNull();
      });
    });
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement(ELT_TAG, {
      is: SfGpsDsAuNswDialog
    });

    // Act
    element.title = "Dialog";
    element.primaryButtonText = "OK";
    element.secondaryButtonText = "Cancel";
    element.isDismissible = true;
    element.isOpen = true;

    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
