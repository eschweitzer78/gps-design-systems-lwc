/* eslint-disable no-extra-semi */
/* eslint-disable consistent-return */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-shadow */
/* eslint-disable radix */
/* eslint-disable no-else-return */
/* eslint-disable vars-on-top */
const AnimateMixin = (Base) =>
  class extends Base {
    /**
     * Calculate the requirements for the desired animation
     *
     * @memberof module:animate
     * @instance
     * @private
     *
     * @param  {integer} initialSize - The initial size of the element to animate
     * @param  {integer} endSize     - The size the element after the animation completes
     * @param  {string}  speed       - The speed of the animation in ms
     *
     * @return {object}              - Required steps, stepSize and intervalTime for the animation
     */
    calculateAnimationSpecs(initialSize, endSize, speed) {
      if (initialSize === endSize) {
        return {
          stepSize: 0,
          steps: 0,
          intervalTime: 0
        };
      }

      var distance = endSize - initialSize; // the overall distance the animation needs to travel
      var intervalTime = speed / distance; // the time each setInterval iteration will take
      var stepSize = distance < 0 ? -1 : 1; // if distance is negative then we set stepSize to -1
      var steps = Math.abs(distance / stepSize); // the amount of steps required to get to endSize
      intervalTime = speed / steps;

      // we need to adjust our animation specs if interval time exceeds 60FPS eg intervalTime < 16.67ms
      if (Math.abs(intervalTime) < 1000 / 60) {
        intervalTime = 1000 / 60; // let’s not get lower that 60FPS
        steps = Math.ceil(Math.abs(speed / intervalTime)); // we now need the steps and make sure we ceil them so -1 won't make them negative
        stepSize = distance / steps; // last thing is step sizes which are derived from all of the above
      }

      return {
        stepSize: stepSize,
        steps: steps - 1,
        intervalTime: intervalTime
      };
    }

    /**
     * Getting computed CSS styles from normal browsers and IE
     *
     * @memberof module:animate
     *
     * @param {object} element  - The DOM element we want to get the computed style from
     * @param {string} property - The CSS property
     *
     * @return {string|integer} - The CSS value for the property
     */
    getCSSPropertyBecauseIE(element, property) {
      if (typeof getComputedStyle !== "undefined") {
        return window.getComputedStyle(element)[property];
      } else {
        var space = element.currentStyle[property];

        if (space === "auto") {
          space = this.calculateAuto(element, property);
        }

        return space;
      }
    }

    /**
     * Calculate the size of the element when it’s dimension(height or width) is set to auto
     *
     * @memberof module:animate
     *
     * @param  {object} element   - The element to read auto height from
     * @param  {string} dimension - The dimension to measure
     *
     * @return {integer}          - The size of the element when at dimension(height or width) is set to 'auto'
     */
    calculateAuto(element, dimension) {
      if (dimension === "height") {
        const initialSize = element.clientHeight; // get current height
        element.style[dimension] = "auto"; // set height to auto
        const endSize = element.clientHeight; // get height again
        element.style[dimension] = initialSize + "px"; // set back to initial height
        return parseInt(endSize);
      }

      const initialSize = element.clientWidth;
      element.style[dimension] = "auto";
      const endSize = element.clientWidth;
      element.style[dimension] = initialSize + "px";
      return parseInt(endSize);
    }

    /**
     * Stop any au animation on a DOM element
     *
     * @memberof module:animate
     *
     * @param  {object} element - The element to stop animating
     */
    stop(element) {
      clearInterval(element.QLDanimation);
    }

    /**
     * The magical animation function
     *
     * @memberof module:animate
     *
     * @param  {object}         options          - The options for the animation
     * @param  {object}         options.element  - Element/s we are animating (DOM nodes)
     * @param  {string}         options.property - The CSS property to animate
     * @param  {integer|string} options.endSize  - The size the element should animate to. Can be 'auto' or pixel value
     * @param  {integer}        options.speed    - The speed of the animation in milliseconds [optional] [default: 250]
     * @param  {function}       options.callback - A function to be executed after the animation ends [optional]
     *
     * @return {unknown}                         - The return value passed on from our options.callback function [optional]
     */
    run(options) {
      // defaults
      const element = options.element;
      const speed = options.speed || 250;

      // making a callback if none was provided
      if (typeof options.callback !== "function") {
        options.callback = function () {};
      }

      // adding iteration counts
      element.QLDiteration = 0;
      element.QLDiterations = 1;

      this.stop(element); // stop any previous animations

      let initialSize = parseInt(
        this.getCSSPropertyBecauseIE(element, options.property)
      ); // the element's current size

      let endSize = options.endSize; // the element end size

      if (options.endSize === "auto") {
        // calculate what 'auto' means in pixel
        endSize = this.calculateAuto(element, options.property);
      }

      // calculate our animation specs
      let animationSpecs = this.calculateAnimationSpecs(
        initialSize,
        endSize,
        speed
      );
      let iterateCounter = initialSize;

      // set state
      if (animationSpecs.stepSize < 0) {
        element.QLDtoggleState = "closing";
      } else if (animationSpecs.stepSize > 0) {
        element.QLDtoggleState = "opening";
      }

      // scoping variable
      ((element, initialSize, iterateCounter, animationSpecs, endSize) => {
        // keep track of animation by adding it to the DOM element
        element.QLDanimation = setInterval(() => {
          // when we are at the end
          if (initialSize === endSize || animationSpecs.steps === 0) {
            this.stop(element);

            element.style[options.property] = endSize + "px"; // set to endSize
            element.QLDtoggleState = "";

            element.QLDiteration++;

            // removing auto so CSS can take over
            if (options.endSize === "auto") {
              element.style[options.property] = "";
            }

            // when all iterations have finished, run the callback
            if (element.QLDiteration >= element.QLDiterations) {
              return options.callback();
            }
          }

          // if we are still animating
          else {
            iterateCounter += animationSpecs.stepSize;
            element.style[options.property] = iterateCounter + "px";

            animationSpecs.steps--;
          }
        }, Math.abs(animationSpecs.intervalTime));
      })(element, initialSize, iterateCounter, animationSpecs, endSize);
    }

    /**
     * Toggle animation
     *
     * @memberof module:animate
     *
     * @param  {object}         options              - The options for the animation
     * @param  {object}         options.element      - Element/s we are animating (DOM nodes)
     * @param  {string}         options.property     - The CSS property to animate [optional] [default: 'height']
     * @param  {integer|string} options.closeSize    - The size the element should close to. Can be 'auto' or pixel value [optional] [default: 0]
     * @param  {integer|string} options.openSize     - The size the element should open to. Can be 'auto' or pixel value [optional] [default: 'auto']
     * @param  {integer}        options.speed        - The speed of the animation in milliseconds [optional] [default: 250]
     * @param  {function}       options.prefunction  - A function to be executed before each animation starts, passes {object} element, {string} state [optional]
     * @param  {function}       options.postfunction - A function to be executed after each animation ends, passes {object} element, {string} state [optional]
     * @param  {function}       options.callback     - A function to be executed after the animation ends, passes {object} element, {string} state [optional]
     *
     * @return {unknown}                             - The return value passed on from our options.callback function [optional]
     */
    toggle(options) {
      var element = options.element;
      const property = options.property || "height";
      const speed = options.speed || 250;
      const closeSize = options.closeSize === undefined ? 0 : options.closeSize;
      const openSize =
        options.openSize === undefined ? "auto" : options.openSize;

      // making a prefunction if none was provided
      if (typeof options.prefunction !== "function") {
        options.prefunction = function () {};
      }

      // making a postfunction if none was provided
      if (typeof options.postfunction !== "function") {
        options.postfunction = function () {};
      }

      // making a callback if none was provided
      if (typeof options.callback !== "function") {
        options.callback = function () {};
      }

      // adding iteration counts
      element.QLDtoggleInteration = 0;
      element.QLDtoggleInterations = 1;

      this.stop(element);

      var targetSize; // the size the element should open/close to after toggle is clicked
      var preState = ""; // the state we animate to for the prefunction and callback functions
      var postState = ""; // the state we animate to for the prefunction and callback functions
      var currentSize = parseInt(
        this.getCSSPropertyBecauseIE(element, options.property)
      ); // the current size of the element

      console.log(currentSize);
      if (currentSize === closeSize || element.QLDtoggleState === "closing") {
        targetSize = openSize;
        preState = "opening";
        postState = "open";
      } else if (
        currentSize !== closeSize ||
        element.QLDtoggleState === "opening"
      ) {
        targetSize = closeSize;
        preState = "closing";
        postState = "closed";
      } else {
        throw new Error("this.Toggle cannot determine state of element");
      }

      // run prefunction once per element
      options.prefunction(element, preState);

      // shoot off animation
      this.run({
        element: element,
        endSize: targetSize,
        property: property,
        speed: speed,
        callback: function () {
          // making sure we fire the callback only once
          element.QLDtoggleInteration++;

          if (element.QLDtoggleInteration === element.QLDiterations) {
            var returnParam = options.callback(element, postState);

            // run postfunction once per element
            options.postfunction(element, postState);

            return returnParam;
          }

          // run postfunction once per element
          options.postfunction(element, postState);
        }
      });
    }
  };

export default AnimateMixin;
