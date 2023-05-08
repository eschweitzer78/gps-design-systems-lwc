/*! SWE 4.1.0 2023023T1010 */
// TODO - this lib is no more required - please do testing on Squiz and some other projects and then remove this
/**
 * Resize Events
 * @version 2.1
 * Changelog:
 *   * 0.5 Added API bind() function to make it easier to add listeners.
 *   * 0.6 Added support for window height changes
 *   * 0.7 Clean up outstanding bugs (duplicate event firing) and refactor.
 *   * 2.0 This version breaks the previous API, and ditches text-resize detection in favour of pure speeeed (optimised for modern browsers that zoom).
 *   * 2.1 Add support to register watchers that can detect size changes on individual elements (and then throw x-width-change and x-height-change events). Throttle helpers also added.
 *
 * There is no consistency between browser implementations of the window resize event
 * (some trigger as the window is resized, some only trigger as the user drops the resize handle).
 * This extension polls to detect these changes, and reports them immediately as custom events
 * ('x-window-resize', 'x-window-width-resize', or 'x-window-height-resize') that other code can listen for and react to accordingly.
 * Resize Events also send an 'x-initial-size' event on load.
 *
 * The custom events triggered are sent with emPixels, textHeight and windowWidth variables.
 * emPixels is a unit that estimates much space you have to work with but is resolution, text size
 * and zoom level independant. Use this value to base layout decisions on, and the layout will
 * always fit.
 *
 * @author Andrew Ramsden <http://irama.org/>
 *
 * @see http://irama.org/web/dhtml/resize-events/
 * @license GNU GENERAL PUBLIC LICENSE (GPL) <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery (tested with 1.6.2) <http://jquery.com/>
 */
/*
ResizeEvents Required CSS...
	.resize-events-watcher {
		display: block;
		height: auto;
		width: auto;
		margin: 0;
		padding: 0;
		clear: both;
	}
	.resize-events-watcher:after {
		visibility: hidden;
		display: block;
		content: "";
		clear: both;
		height: 0;
	}
	* html .resize-events-watcher             { zoom: 1; }
	*:first-child+html .resize-events-watcher { zoom: 1; }

*/

var ResizeEvents = {
	eventElement: document,
	initialised: false,
	timeoutID: null,
	currentWindowWidth: null,
	currentWindowHeight: null,
	heartbeatThrottleCount: 0,
	watchedElements: [],
	throttleStates: {},
	//textSizeTestElement  : null,
	conf: {
		//textResizeEvent           : 'x-text-resize',
		windowResizeEvent: 'x-window-resize',
		windowWidthResizeEvent: 'x-window-width-resize',
		windowHeightResizeEvent: 'x-window-height-resize',
		elementWidthResizeEvent: 'x-width-change',
		elementHeightResizeEvent: 'x-height-change',
		initialResizeEvent: 'x-initial-sizes',
		watcherClass: 'resize-events-watcher',
		framesPerHeartbeat: 6 // 60 frames per second, 10 hearbeats per second = 6 frames per heartbeat
	}
};

/*global qg*/
(function ($) { /* start closure */
	'use strict';

	/* http://paulirish.com/2011/requestanimationframe-for-smart-animating/ */
	window.requestAnimFrame = (function () {
	  return window.requestAnimationFrame ||
			  window.webkitRequestAnimationFrame ||
			  window.mozRequestAnimationFrame ||
			  window.oRequestAnimationFrame ||
			  window.msRequestAnimationFrame ||
			  function (/* function */ callback, /* DOMElement */ element) {
				window.setTimeout(callback, 1000 / 60);
			  };
	}());

	/**
	 * A simple way to add a listener for resize events.
	 *
	 * @param String events A space delimited list of events that should trigger this handler.
	 * @param function handler The handler function to be called when an event occurs.
	 */
	ResizeEvents.bind = function (events, handler) {
		// on DOMReady
		$(function () {
			// initialise if it hasn't happened already
			if (ResizeEvents.initialised !== true) {
				ResizeEvents.initialise();
			}
		});

		$(ResizeEvents.eventElement).bind(events, handler);
	};

	/**
	 * Initialisation
	 */
	ResizeEvents.initialise = function () {
		if (ResizeEvents.initialised === true) {
			return; // already initialised
		}
		// initialise variables
		var windowWidthNow = $(window).width(),
			windowHeightNow = $(window).height();

		ResizeEvents.currentWindowWidth = windowWidthNow;
		ResizeEvents.currentWindowHeight = windowHeightNow;
		// trigger onload
		$(ResizeEvents.eventElement).trigger(ResizeEvents.conf.initialResizeEvent, [ windowWidthNow, windowHeightNow ]);
		// flag initialisation complete
		ResizeEvents.initialised = true;

		$(window).resize(ResizeEvents.handleWindowResize);
	};

	/**
	 * A watcher can be assigned to keep tabs on the width/height of an element.
	 * The watcher will trigger an 'x-height-change' or 'x-width-change' event when it detects a change.
	 *
	 * @param String watchWhichDimensions Which dimension to watch ('width', 'height' or 'width height' to watch both dimensions).
	 * @param String innerElementSelector A jQuery selector to select a flexible container within. Optional, if not set, an inner element will be generated.
	 */
	$.fn.registerWatcher = function (watchWhichDimensions, /* optional */ innerElementSelector) {
		var watchWidth = watchWhichDimensions.indexOf('width') !== -1,
			watchHeight = watchWhichDimensions.indexOf('height') !== -1
		;

		if (typeof innerElementSelector === 'undefined') {
			$(this).wrapInner('<div class="' + ResizeEvents.conf.watcherClass + '"></div>');
			innerElementSelector = '.' + ResizeEvents.conf.watcherClass;
		}

		$(this).each(function () {
			$(this).data('resizeEvents', {
				'watchWidth': watchWidth,
				'previousWidth': null,
				'watchHeight': watchHeight,
				'previousHeight': null,
				'innerElementSelector': innerElementSelector
			});

			/*$(this).find(innerElementSelector).eq(0)
				.css({
					//'overflow' : 'hidden',
					'display'  : 'block',
					'height'   : 'auto',
					'width'    : 'auto',
					'margin'   : '0',
					'padding'  : '0',
					'clear'    : 'both'
				})
			;*/
		});

		ResizeEvents.watchedElements[ResizeEvents.watchedElements.length] = $(this);
		//alert(ResizeEvents.watchedElements.length);
		if (ResizeEvents.watchedElements.length === 1) {
			// Heart-starter: Setup initialisation code
			ResizeEvents.heartbeat();
		}
	};

	ResizeEvents.heartbeat = function () {
		/* Throttle heartbeats */
		if (ResizeEvents.heartbeatThrottleCount++ % ResizeEvents.conf.framesPerHeartbeat !== 0) {
			window.requestAnimFrame(ResizeEvents.heartbeat);
			return;
		}

		var currentWidth = null,
			currentHeight = null,
			n,

			resizeWatchFunction = function () {
				var $this = $(this),
					elementData = $this.data('resizeEvents'),
					$inner = $this.find(elementData.innerElementSelector).eq(0)
					;

				if (
					elementData.watchWidth &&
					(currentWidth = $inner.width()) !== elementData.previousWidth
				) {
					$this.trigger(ResizeEvents.conf.elementWidthResizeEvent, [currentWidth]);
					elementData.previousWidth = currentWidth;
					//$.debug('Width change: '+currentWidth);
				}

				if (
					elementData.watchHeight &&
					(currentHeight = $inner.height()) !== elementData.previousHeight
				) {
					$this.trigger(ResizeEvents.conf.elementHeightResizeEvent, [currentHeight]);
					elementData.previousHeight = currentHeight;
					//$.debug('Height change: '+currentHeight);
				}

				$this.data('resizeEvents', elementData);
			}
			;

		for (n = 0; n < ResizeEvents.watchedElements.length; n++) {
			ResizeEvents.watchedElements[n].each(resizeWatchFunction);
		}

		window.requestAnimFrame(ResizeEvents.heartbeat);
	};

	ResizeEvents.handleWindowResize = function () {
		// Ensure that recalculations happen at most once every 200 ms (for IE6)
		if (qg.oldIE && qg.oldIEversion < 7 && ResizeEvents.throttle(ResizeEvents.handleWindowResize, 200)) {
			return;
		}

		ResizeEvents.broadcastWindowResize();
	};

	ResizeEvents.broadcastWindowResize = function () {
		ResizeEvents.timeoutID = null;
		//alert('test');
		// get current values
		var windowWidthNow = $(window).width(),
			windowHeightNow = $(window).height(),
			widthChanged = false;

		// test for window width change
		if (ResizeEvents.currentWindowWidth !== windowWidthNow) {
			// Send custom event
			$(ResizeEvents.eventElement).trigger(ResizeEvents.conf.windowWidthResizeEvent, [ windowWidthNow, windowHeightNow ]);
			$(ResizeEvents.eventElement).trigger(ResizeEvents.conf.windowResizeEvent, [ windowWidthNow, windowHeightNow ]);
			// update current height
			ResizeEvents.currentWindowWidth = windowWidthNow;
			widthChanged = true;
		}

		// test for window height change
		if (ResizeEvents.currentWindowHeight !== windowHeightNow) {
			// Send custom event
			$(ResizeEvents.eventElement).trigger(ResizeEvents.conf.windowHeightResizeEvent, [ windowWidthNow, windowHeightNow ]);
			if (!widthChanged) { // don't send window-resize event twice
				$(ResizeEvents.eventElement).trigger(ResizeEvents.conf.windowResizeEvent, [ windowWidthNow, windowHeightNow ]);
			}
			// update current height
			ResizeEvents.currentWindowHeight = windowHeightNow;
		}
	};

	/**
	 * Event throttling, ensures a function is only run at most once per timeout interval.
	 *
	 * @param Function callback The function being throttled.
	 * @param integer timeoutInterval A period of time in ms before the function will run.
	 * @return Boolean true if the function should be throttled, false if it should be left to run.
	 */
	ResizeEvents.throttle = function (callback, timeoutInterval) {
		var id = (callback.toString()).match(/ResizeEvents\.throttle\s*\(\s*([^,\s]+)/)[1];
		//alert(id);
		if (ResizeEvents.throttleStates[id] === true) {
			ResizeEvents.throttleStates[id] = null;
			return false; // Don't throttle
		}
		if (ResizeEvents.throttleStates[id] !== null) {
			window.clearTimeout(ResizeEvents.throttleStates[id]);
		}
		ResizeEvents.throttleStates[id] = window.setTimeout(function () {
			ResizeEvents.releaseThrottle(id, callback);
		}, timeoutInterval);
		return true; // Throttle
	};
	ResizeEvents.releaseThrottle = function (id, callback) {
		ResizeEvents.throttleStates[id] = true;
		callback.apply();
	};
}(jQuery)); /* end closure */
