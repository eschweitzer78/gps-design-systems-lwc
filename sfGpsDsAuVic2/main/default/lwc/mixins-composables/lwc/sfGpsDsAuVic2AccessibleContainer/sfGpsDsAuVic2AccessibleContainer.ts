const checkLeftMouseButton = (event: any) => {
  // https://stackoverflow.com/a/3944291
  event = event || window.event;
  return "buttons" in event ? event.buttons === 1 : event.button === 1;
};

export default class useAccessibleContainer {
  up?: number;
  down = 0;
  isLeftBtn = false;

  constructor(container: HTMLElement, trigger: HTMLElement) {
    container.addEventListener("pointerdown", (event) => {
      if (checkLeftMouseButton(event)) {
        this.isLeftBtn = true;
        this.down = +new Date();
      }
    });

    container.addEventListener("pointerup", (event) => {
      if (this.isLeftBtn) {
        event.preventDefault();
        this.up = +new Date();

        // Add 200ms delay to allow text selection
        if (this.up - this.down < 200) {
          // Only fire a click if the target is not the trigger el
          if (trigger !== event.target) {
            trigger.click();
          }
        }
      }
    });
  }
}
