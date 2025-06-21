/* 

Copyright 2020 Digital.NSW

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

import type { SwipeEventDetail } from "c/sfGpsDsAuNswCardCarousel";

function getSign(x: number) {
  return Math.sign ? Math.sign(x) : (x > 0 ? 1 : 0) - (x < 0 ? 1 : 0) || +x;
}

type Tuple = [ number | null, number | null ];

class SwipeContent {
  element: HTMLElement;
  delta: Tuple;
  dragging: boolean;
  intervalId: number | NodeJS.Timeout | false;
  changedTouches: TouchList | false;
  boundHandleEvent: (event: MouseEvent | TouchEvent) => void;

  constructor(element: HTMLElement) {
    this.element = element;
    this.delta = [null, null];
    this.dragging = false;
    this.intervalId = false;
    this.changedTouches = false;
    this.boundHandleEvent = this.handleEvent.bind(this);
    this.init();
  }

  init() {
    this.element.addEventListener("mousedown", this.boundHandleEvent);
    this.element.addEventListener("touchstart", this.boundHandleEvent, {
      passive: true
    });
  }

  initDragging() {
    this.element.addEventListener("mousemove", this.boundHandleEvent);
    this.element.addEventListener("touchmove", this.boundHandleEvent, {
      passive: true
    });
    this.element.addEventListener("mouseup", this.boundHandleEvent);
    this.element.addEventListener("mouseleave", this.boundHandleEvent);
    this.element.addEventListener("touchend", this.boundHandleEvent);
  }

  cancelDragging() {
    if (this.intervalId) {
      if (!window.requestAnimationFrame) {
        clearInterval(this.intervalId);
      } else {
        window.cancelAnimationFrame(this.intervalId as number);
      }
      this.intervalId = false;
    }
    this.element.removeEventListener("mousemove", this.boundHandleEvent);
    this.element.removeEventListener("touchmove", this.boundHandleEvent);
    this.element.removeEventListener("mouseup", this.boundHandleEvent);
    this.element.removeEventListener("mouseleave", this.boundHandleEvent);
    this.element.removeEventListener("touchend", this.boundHandleEvent);
  }

  handleEvent(event: MouseEvent | TouchEvent) {
    switch (event.type) {
      case "mousedown":
      case "touchstart":
        this.startDrag(event);
        break;

      case "mousemove":
      case "touchmove":
        this.drag(event);
        break;

      case "mouseup":
      case "mouseleave":
      case "touchend":
        this.endDrag(event);
        break;

      default:
        console.log(`${event.type}.`);
    }
  }

  startDrag(event: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.initDragging();
    this.delta = [
      parseInt(`${this.unify(event).clientX}`, 10),
      parseInt(`${this.unify(event).clientY}`, 10)
    ];

    this.emitSwipeEvents("dragstart", this.delta, event.target as HTMLElement);
  }

  endDrag(event: MouseEvent | TouchEvent) {
    this.cancelDragging();

    const dx = parseInt(`${this.unify(event).clientX}`, 10);
    const dy = parseInt(`${this.unify(event).clientY}`, 10);

    if (this.delta && (this.delta[0] || this.delta[0] === 0)) {
      const s = getSign(dx - this.delta[0]);

      if (Math.abs(dx - this.delta[0]) > 30) {
        if (s < 0) {
          this.emitSwipeEvents("swipeleft", [dx, dy]);
        } else {
          this.emitSwipeEvents("swiperight", [dx, dy]);
        }
      }

      this.delta[0] = null;
    }

    if (this.delta && (this.delta[1] || this.delta[1] === 0)) {
      const y = getSign(dy - this.delta[1]);

      if (Math.abs(dy - this.delta[1]) > 30) {
        if (y < 0) {
          this.emitSwipeEvents("swipeup", [dx, dy]);
        } else {
          this.emitSwipeEvents("swipedown", [dx, dy]);
        }
      }

      this.delta[1] = null;
    }

    this.emitSwipeEvents("dragend", [dx, dy]);
    this.dragging = false;
  }

  drag(event: MouseEvent | TouchEvent) {
    if (!this.dragging) return;

    if (!window.requestAnimationFrame) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.intervalId = setTimeout(() => {
        this.emitDrag(event);
      }, 250);
    } else {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.intervalId = window.requestAnimationFrame(() => {
        this.emitDrag(event);
      });
    }
  }

  unify(event: MouseEvent | TouchEvent): Touch | DragEvent {
    this.changedTouches = (event as TouchEvent).changedTouches;
    return this.changedTouches ? this.changedTouches[0] : event as DragEvent;
  }

  emitDrag(event: MouseEvent | TouchEvent) {
    this.emitSwipeEvents("dragging", [
      parseInt(`${this.unify(event).clientX}`, 10),
      parseInt(`${this.unify(event).clientY}`, 10)
    ]);
  }

  emitSwipeEvents(
    eventName: string, 
    detail: Tuple, 
    el?: HTMLElement
  ): void {
    const eventDetail: SwipeEventDetail = {
      x: detail[0] as number,
      y: detail[1] as number,
      origin: el
    };

    this.element.dispatchEvent(
      new CustomEvent(eventName, { 
        detail: eventDetail
      })
    );
  }
}

export default SwipeContent;
