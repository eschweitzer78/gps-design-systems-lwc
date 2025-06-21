import { createElement } from "@lwc/engine-dom";
import SfGpsDsTransition from "c/sfGpsDsTransition";

function mockProps(element) {
  const cbs = {
    doneEnter: {},
    doneLeave: {}
  };

  element.handleBeforeEnter = jest.fn().mockName("handleBeforeEnter");
  element.handleEnter = jest
    .fn()
    .mockName("handleEnter")
    .mockImplementation((done) => {
      cbs.doneEnter.default = done;
    });
  element.handleAfterEnter = jest.fn().mockName("handleAfterEnter");
  element.handleEnterCancelled = jest.fn().mockName("handleEnterCancelled");
  element.handleBeforeLeave = jest.fn().mockName("handleBeforeLeave");
  element.handleLeave = jest
    .fn()
    .mockName("handleLeave")
    .mockImplementation((done) => {
      cbs.doneLeave.default = done;
    });
  element.handleAfterLeave = jest.fn().mockName("handleAfterLeave");
  element.handleLeaveCancelled = jest.fn().mockName("handleLeaveCancelled");
  element.handleBeforeAppear = jest.fn().mockName("handleBeforeAppear");
  element.handleAppear = jest
    .fn()
    .mockName("handleAppear")
    .mockImplementation((done) => {
      cbs.doneEnter.default = done;
    });
  element.handleAfterAppear = jest.fn().mockName("handleAfterAppear");
  element.handleAppearCancelled = jest.fn().mockName("handleAppearCancelled");

  return cbs;
}

describe("c-sf-gps-ds-transition", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("properly handles appear = true", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-transition", {
      is: SfGpsDsTransition
    });

    const cbs = mockProps(element);

    element.appear = "";
    element.name = "fade";
    element.show = true;

    // Act
    document.body.appendChild(element);

    // Assert
    expect(element.handleBeforeAppear).toHaveBeenCalledTimes(1);
    expect(element.handleAppear).toHaveBeenCalledTimes(1);
    expect(element.handleAfterAppear).not.toHaveBeenCalled();

    expect(element.handleBeforeEnter).not.toHaveBeenCalled();
    expect(element.handleEnter).not.toHaveBeenCalled();
    expect(element.handleAfterEnter).not.toHaveBeenCalled();

    if (cbs.doneEnter.default) cbs.doneEnter.default();

    expect(element.handleAfterAppear).toHaveBeenCalledTimes(1);
    expect(element.handleAfterEnter).not.toHaveBeenCalled();
  });
});
