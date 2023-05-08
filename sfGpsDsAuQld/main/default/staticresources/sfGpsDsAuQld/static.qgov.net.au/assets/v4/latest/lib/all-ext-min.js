/*! SWE 4.1.0 2023023T1010 */
/*
 * generate-id
 * http://bboyle.github.com/Generate-ID
 *
 * Copyright (c) 2013 Ben Boyle
 * Licensed under the MIT license.
 */

(function( $ ) {
  'use strict';


  /**
   * Assigns a unique value to `@id` unless hasAttribute( 'id' ) is true
   *
   * @param preferredId string to use for id value
   *
   * @return jquery object (chaining supported)
   */
  $.fn.generateId = function( preferredId ) {

    var i = 1;

    if ( ! preferredId ) {
      preferredId = 'id';
    } else {
      preferredId = $.trim( preferredId.toLowerCase().replace( /[^a-z0-9_]+/g, ' ' )).replace( /\s+/g, '-' );
    }

    return this.each(function() {

      var id;

      if ( ! this.getAttribute( 'id' )) {

        id = preferredId;
        while ( document.getElementById( id )) {
          id = preferredId + String( i );
          i++;
        }
        this.setAttribute( 'id', id );
      }
    });

  };


}( jQuery ));

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

/*
 * jQuery history plugin
 * 
 * The MIT License
 * 
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Copyright (c) 2010 Takayuki Miwa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($) {
    var locationWrapper = {
        put: function(hash, win) {
            
            
            (win || window).location.hash = this.encoder(hash);
            
        },
        get: function(win) {
            var hash = ((win || window).location.hash).replace(/^#/, '');
            try {
                return $.browser.mozilla ? hash : decodeURIComponent(hash);
            }
            catch (error) {
                return hash;
            }
        },
        encoder: encodeURIComponent
    };

    var iframeWrapper = {
        id: "__jQuery_history",
        init: function() {
            var html = '<iframe id="'+ this.id +'" style="display:none" src="javascript:false;" />';
            $("body").prepend(html);
            return this;
        },
        _document: function() {
            return $("#"+ this.id)[0].contentWindow.document;
        },
        put: function(hash) {
            var doc = this._document();
            doc.open();
            doc.close();
            locationWrapper.put(hash, doc);
        },
        get: function() {
            return locationWrapper.get(this._document());
        }
    };

    function initObjects(options) {
        options = $.extend({
                unescape: false
            }, options || {});

        locationWrapper.encoder = encoder(options.unescape);

        function encoder(unescape_) {
            if(unescape_ === true) {
                return function(hash){ return hash; };
            }
            if(typeof unescape_ == "string" &&
               (unescape_ = partialDecoder(unescape_.split("")))
               || typeof unescape_ == "function") {
                return function(hash) { return unescape_(encodeURIComponent(hash)); };
            }
            return encodeURIComponent;
        }

        function partialDecoder(chars) {
            var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
            return function(enc) { return enc.replace(re, decodeURIComponent); };
        }
    }

    var implementations = {};

    implementations.base = {
        callback: undefined,
        type: undefined,

        check: function() {},
        load:  function(hash) {  },
        init:  function(callback, options) {
            initObjects(options);
            self.callback = callback;
            self._options = options;
            self._init();
        },

        _init: function() {},
        _options: {}
    };

    implementations.timer = {
        _appState: undefined,
        _init: function() {
            var current_hash = locationWrapper.get();
            self._appState = current_hash;
            self.callback(current_hash);
            setInterval(self.check, 100);
        },
        check: function() {
            var current_hash = locationWrapper.get();
            if(current_hash != self._appState) {
                self._appState = current_hash;
                self.callback(current_hash);
            }
        },
        load: function(hash) {
            
            if(hash != self._appState) {
                locationWrapper.put(hash);
                self._appState = hash;
                self.callback(hash);
            }
        }
    };

    implementations.iframeTimer = {
        _appState: undefined,
        _init: function() {
            var current_hash = locationWrapper.get();
            self._appState = current_hash;
            iframeWrapper.init().put(current_hash);
            self.callback(current_hash);
            setInterval(self.check, 100);
        },
        check: function() {
            var iframe_hash = iframeWrapper.get(),
                location_hash = locationWrapper.get();

            if (location_hash != iframe_hash) {
                if (location_hash == self._appState) {    // user used Back or Forward button
                    self._appState = iframe_hash;
                    locationWrapper.put(iframe_hash);
                    self.callback(iframe_hash); 
                } else {                              // user loaded new bookmark
                    self._appState = location_hash;  
                    iframeWrapper.put(location_hash);
                    self.callback(location_hash);
                }
            }
        },
        load: function(hash) {
            
            if(hash != self._appState) {
                locationWrapper.put(hash);
                iframeWrapper.put(hash);
                self._appState = hash;
                self.callback(hash);
            }
        }
    };

    implementations.hashchangeEvent = {
        _init: function() {
            self.callback(locationWrapper.get());
            $(window).bind('hashchange', self.check);
        },
        check: function() {
            self.callback(locationWrapper.get());
        },
        load: function(hash) {
            
            locationWrapper.put(hash);
        }
    };

    var self = $.extend({}, implementations.base);

    /*
    if($.browser.msie && ($.browser.version < 8 || document.documentMode < 8)) {
        self.type = 'iframeTimer';
    } else */
    if("onhashchange" in window) {
        self.type = 'hashchangeEvent';
    } else {
        self.type = 'timer';
    }


    $.extend(self, implementations[self.type]);
    $.history = self;
})(jQuery);

/*
 * "Float like a butterfly"
 *              Muhammad Ali (a not-so-lightboxer).
 *
 * jquery.butterfly is a fairly light-weight and fully accessible lightbox implementation for jQuery.
 *
 * jquery.butterfly.js
 * @version 0.13
 * Changelog:
 *   *  0.1 Initial implementation.
 *   *  0.2: Support for window resizing added.
 *   *  0.3: Support added for callback functions (open/close/resize pre and post events). Error handling added for when lightbox target resource doesn't exist.
 *   *  0.4: Accessibility features added (controlling focus for user initiated lightboxes, keyboard support) - as per: http://irama.org/web/dhtml/lightbox/#accessibility
 *   *  0.5: Bug fixes for webkit. Blocked IE6 (no LB for them). Basic caption support (thanks to Ray Latchmanan). Gallery support.
 *   *  0.6: ARIA style keyboard support for navigating through galleries. Keyboard access now trapped in lightbox while lightbox is open. Support for preloading next image in galleries.
 *   *  0.7: Captions can be configured to come from link title attribute, link text (including any img alt text within), or not be displayed at all.
 *   *  0.8: Added ability to load pages in an iFrame (kicks in automatically for external-domain URLs).
 *   *  0.9: Support restored for IE6 (all thanks to the perseverance of github.com/bboyle - he has more patience than I). Added support for back button (through jquery.history.js)
 *   *  0.10: Set default close icon; fixing issues reported by jslint; minor jquery optimisations
 *   *  0.11: Fix for jQuery 1.8 compatibility issue
 *   *  0.12: Fix for captions extending outside lightbox (thanks to Roger Kowallis)
 *   *  0.13: Added option to treat links as image links (overriding automatic type detection). Handy for image URLs that don't have an image file extension (like Google Charts API URLs)
 *
 * @author Andrew Ramsden <http://irama.org/>
 * @see http://irama.org/web/dhtml/butterfly/
 * @license GNU GENERAL PUBLIC LICENSE (GPL) <http://www.gnu.org/licenses/gpl.html>
 *
 * @requires jQuery (tested with 1.8.3) <http://jquery.com/>
 * @requires jQuery jARIA plugin <http://outstandingelephant.com/jaria/>
 *
 * @optional (but reccommended) jQuery ResizeEvents plugin <http://irama.org/web/dhtml/resize-events/>
 * @optional (but reccommended) jQuery Got Style? plugin <http://irama.org/web/dhtml/got-style/>
 * @optional (but reccommended) jQuery ARIA keyboard navigation plugin <http://irama.org/web/dhtml/aria/key-nav/>
 *
 */
jQuery.butterfly = {};

jQuery.butterfly.defaultOptions = {
	contentDefaultWidth: null, // For content (can be em, % or px) - null default means 50em if pxToEm is available or 700px otherwise (a good line length for legibility)
	contentDefaultHeight: '100%', // For content (can be em, % or px)
	mediaMaxWidth: '100%', // For images (can be em, % or px)
	mediaMaxHeight: '100%', // For images (can be em, % or px)
	treatAsMedia: false, // Set to true for content to be resized as if it's media (good for video content)
	lightBoxMargin: null, // Margin around screen (can be em, % or px) - null default === 2em if pxToEm is available or 20px otherwise
	animateResize: true,
	animationSpeed: 150,
	useIframe: 'autodetect', // load contents in an iframe (good for cross-domain URLs). Options are: 'autodetect' (will load iframe for external URLs), true (will load in an iframe). false (will atempt to load with ajax).
	collapseHeightWhenPossible: true, // When content is shorter than available height, collapse height of lightbox
	reuseFragment: false, // When using a fragment from the same page as the link, reuse the same DOM nodes (persisting their state) or clone a new copy?
	closeButton: true, // Should we have a close button?
	closeButtonImage: 'https://static.qgov.net.au/assets/v4/latest/lib/ext/butterfly/close.png', // Set to the path of your close button image
	closeButtonCorner: 'tr', // Top left 'tl' or top right 'tr' or bottom left (bl) or bottom right (br) - top left is the most intuitive option that doesn't overlap scrollabrs
	clickOverlayCloses: true, // Will clicking the overlay layer (the dark tinted area) close the lightbox?
	preloadLoadingImage: '', // Specify an image path here and it will be preloaded
	preloadGalleryControlsSprite: '', // Specify an image path here and it will be preloaded
	galleryControlWidth: 49, // width of each control (default based on sprite that ships with butterfly)
	galleryControlHeight: 85, // height of each control (default based on sprite that ships with butterfly)
	galleryMode: 'rel', // Allow navigation between lightboxed images? Options are: rel (all links that have the same 'rel' attribute), 'container' (all links within the one container), 'all' (all linked images), or nothing '' (don't use galleries)
	galleryContainers: '', // CSS selectors specifying elements that contain linked images to form discrete galleries. e.g: '.gallery-pets, #gallery-flowers'
	galleryLoops: false, // When you reach the end of the gallery, should 'next' take you back to the begining? (and vice versa)
	captionMode: 'title', // Whether to use captions, and if so, where to grab the caption text from? Options are: 'title' (the title attribute of the link), 'text' (any text within the link, including image alt text), or nothing '' (don't display captions)
	preloadNextGalleryImage: true, // Should the next lightbox be preloaded if it's an image?
	zoomFromClicked: false, // Experimental
	callbackPreOpen: null, // Six callback functions can be defined that will be called at various points in the opening, closing and resizing of lightboxes
	callbackPreResize: null,
	callbackPostResize: null,
	callbackPostOpen: null,
	callbackPreClose: null,
	callbackPostClose: null,
	treatAsImage: false // If set to true, will treat all links as image links (overriding automatic type detection).
};

jQuery.butterfly.conf = {
	overlayOpacity: '.7',
	lightboxClass: 'lightbox',
	lightboxLinkSelector: 'a.lightbox'
};

jQuery.butterfly.linkCount = 0;

/**
 * Standard key mappings
 */
	DOM_VK_END    = 35;
	DOM_VK_HOME   = 36;
	DOM_VK_LEFT   = 37;
	DOM_VK_UP     = 38;
	DOM_VK_RIGHT  = 39;
	DOM_VK_DOWN   = 40;
	DOM_VK_ESCAPE = 27;

(function( $, ResizeEvents ) {// start closure
	'use strict';


	// functions and vars
	var resizeLightBox, closeLightBox, initLightBox, openLightBox, loadLightBoxContent,
		lightBoxKeypress, overlayClicked, loadLightBoxComplete, galleryControlsClick,
		isImage, parsePixels, findOffsetToCentre, checkForContent;


	// helper functions

	/**
	 * Get the keycode of an event
	 */
	function getKeyCode(evt) {
		evt = evt || window.event;

		if (evt.keyCode) {
			return evt.keyCode;
		} else if (evt.which) {
			return evt.which;
		}
		return null;
	}

	/**
	 * jQuery plugin that returns the text nodes within the target element, combined/concatenated with any alt text.
	 */
	$.fn.accessibleText = function() {
		if (this.is('img')) {
			return this.attr( 'alt' );
		} else if (this.is('input')) {
			return this.attr( 'value' );
		} else {
			return $.map( this.contents(), function( domElement ) {
				if ( domElement.nodeType === 3 ) {
					return domElement.data;
				} else if ( domElement.nodeType === 1 ) {
					var $element = $( domElement );
					if ( $element.is( 'img, input' ) || $element.find( 'img[alt], input[value]' ).length > 0 ) {
						return $element.accessibleText();
					} else {
						return $element.text();
					}
				}
			}).join( '' );
		}
	};


	// On DOMLoad
	$(function() {
		/*// IE6 fails, bail here.
			if ($.browser.msie && $.browser.version < 7) {
				return;
			}
		*/

		// If ResizeEvents plugin is available, listen for resize events
		if (typeof ResizeEvents !== 'undefined') {
			$(this).each(function(){
				ResizeEvents.bind (
					'x-text-resize x-window-resize', // no need to catch 'x-initial-sizes', lightbox not open initially
					resizeLightBox
				);
			});
		}

		/**
		 * A plugin to centre a visible element on the screen
		 */
		$.fn.centre = function () {
			return this.css({
				'position': 'fixed',
				'top': ( $(window).height() - this.outerHeight() ) / 2 + 'px',
				'left': ( $(window).width() - this.outerWidth() ) / 2 + 'px'
			});
		};

		// Create containers
		$( document.body )
			.append( '<div id="jb-overlay"></div><div id="jb-window"><div id="jb-window-inner"><div id="jb-window-content" style="width: auto; height: auto;" tabindex="0"></div></div></div>')
			.bind( 'keydown', lightBoxKeypress )
		;

		$( '#jb-overlay' )
			.fadeTo( 0, $.butterfly.conf.overlayOpacity, function() {
				// hide when animation complete
				$( this ).hide();
			})
		;
		$( '#jb-window' )
			.hide()
			.click( overlayClicked )
		;
		$( '#jb-window-inner' )
			.centre()
		;
		$( '#jb-window-content' )
			.css({
				overflow: 'hidden'
			})
			.hide()
		;

		$.history.init(
			function( hash ){
				if( hash === '' ) {
					closeLightBox.apply();
				} else {
					// restore the state from hash
					if( /^!/.test( hash )) {
						hash = hash.substring( 1 );
						$( '#' + hash ).trigger( 'click', [/*storeState*/false] );
					}
				}
			},
			{ unescape: ',/' }
		);
	});


	$.fn.butterfly = function( options ) {

		// IE6 fails, bail here.
			/*if ($.browser.msie && $.browser.version < 7) {
				return;
			}*/

		options = typeof options !== 'undefined' ? options : {};

		// Pre-load images
		if (options.closeButtonImage) {
			$('<img src="'+options.closeButtonImage+'" alt="" />');
		}
		if (options.preloadLoadingImage) {
			$('<img src="'+options.preloadLoadingImage+'" alt="" />');
		}
		if (options.preloadGalleryControlsSprite) {
			$('<img src="'+options.preloadGalleryControlsSprite+'" alt="" />');
		}

		// Initialise lightbox links for each match
		return this.each(function () {
			initLightBox.apply(this, [options]);
		});
	};


	initLightBox = function( options ) {
		var pxToEmExists = (typeof Number.prototype.pxToEm !== 'undefined') ? true : false;

		// Merge runtime options with defaults
		// Note: The first argument sent to extend is an empty object to
		// prevent extend from overriding the default $.AKN.defaultOptions object.
			options = (typeof options === 'undefined')
				? $.butterfly.defaultOptions
				: $.extend({}, $.butterfly.defaultOptions, options)
			;

		if (options.lightBoxMargin === null) {
			// if no margin specified, use 2em if pxToEm available, otherwise use 20px
			options.lightBoxMargin = pxToEmExists ? '2em' : '20px' ;
		}
		if (options.contentDefaultWidth === null) {
			// if no default width specified, use 50em if pxToEm available, otherwise use 700px (good line lengths for legibility)
			options.contentDefaultWidth = pxToEmExists ? '50em' : '700px' ;
		}

		// Assign an id if none exists
			if (typeof $(this).attr('id') === 'undefined' || $(this).attr('id') === '') { // cater for jquery 1.6 and previous versions
				$(this).attr('id', $.butterfly.conf.lightboxClass+'-uid-'+$.butterfly.linkCount);
			}
			options.linkID = $(this).attr('id');
			$.butterfly.linkCount++;

		$(this).data('options', options);
		$(this).addClass($.butterfly.conf.lightboxClass);
		$(this).click(openLightBox);
	};


	openLightBox = function( e, storeState ) {
		var options, originalTrigger, href, location, title, linkText, thisLink, selector, previousOptions;

		if (typeof e !== 'undefined') {
			e.preventDefault(); // so that links aren't followed
		}

		// Add state to history
		storeState = (typeof storeState !== 'undefined') ? storeState : true ;
		if (storeState) {
			$.history.load('!'+$(this).attr('id'));
			return; // This function will be called again by history.load after storing the state in the hash
		}

		// when opening, overflow should always be set to hidden (it is changed as appropriate later once the content loads)
		$('#jb-window-inner').css('overflow','hidden');

		// if lightbox is open already and fragment was reused... clean up
		if ($('#jb-overlay').is(':visible')) {
			options = $('#jb-overlay').data('options');
			if (options.linkType === 'fragment' && options.reuseFragment) {
				$('.jb-placeholder').remove();
			}
			originalTrigger = options.originalTrigger;
		} else {
			// if opening for the first time, set the original trigger
			originalTrigger = this;
		}

		// get target content
		location = window.location.href.replace( /#.*$/, '' );
		href = $(this).attr('href');
		if ( href.indexOf( location ) === 0 ) {
			href = href.substring( location.length );
		}
		title = $(this).attr('title');
		linkText = $(this).accessibleText();

		// get options
		options = $(this).data('options');
		options.href = href;
		options.title = title;
		options.linkText = linkText;
		options.trigger = this; // current trigger element
		options.originalTrigger = originalTrigger; // original trigger element

		// custom class?
		document.getElementById( 'jb-window-inner' ).className = options.className || '';

		if (options.treatAsImage || isImage(href)) {
			options.linkType = 'image';
		} else if (href.substring(0,1) === '#') {
			options.linkType = 'fragment';
		} else if (options.useIframe === true || (options.useIframe !== false && this.hostname !== window.location.hostname)) {
			options.linkType = 'iframe';
			options.useIframe = true;
			options.contentDefaultWidth = '100%';
			options.contentDefaultHeight = '100%';
		} else {
			options.linkType = 'ajax';
		}

		// run preOpen callback function
		if (options.callbackPreOpen !== null && typeof options.callbackPreOpen === 'function') {
			options.callbackPreOpen.apply(this);
		}

		// add/remove close button
		if (options.closeButton) {
			if ($('#jb-close-button').length === 0) {
				$('#jb-window').prepend('<a href="#" id="jb-close-button"><img src="'+options.closeButtonImage+'" alt="Close lightbox" /></a>');
				$('#jb-close-button').click(closeLightBox);
			}
		} else {
			$('#jb-close-button').remove();
		}

		// add class if overlay can be clicked to close
		if (options.clickOverlayCloses) {
			$('#jb-window').addClass('reactive');
		} else {
			$('#jb-window').removeClass('reactive');
		}

		// Find and store details of gallery (if configured)
		thisLink = $(this);
		if (options.galleryContainers !== '') {
			options.galleryMode = 'container';
		}
		options.gallerySelector = '';
		switch (options.galleryMode) {
			case 'all':
				options.gallerySelector = $.butterfly.conf.lightboxLinkSelector;
			break;
			case 'container':
				$.each( options.galleryContainers.split( ',' ), function() {
					selector = this + ' ' + $.butterfly.conf.lightboxLinkSelector;
					if ( thisLink.is( selector )) {
						options.gallerySelector = selector;
						return false; // we found the container, break loop
					}
				});
			break;
			// default: do nothing
		}
		if (options.gallerySelector === '' && $(this).attr('rel') !== '') {
			options.gallerySelector = $.butterfly.conf.lightboxLinkSelector+'[rel="'+$(this).attr('rel')+'"]';
		}

		// grab previousOptions
		previousOptions = $('#jb-overlay').data('options') || {};

		// assign link options to lightbox
		$(this).data('options', options);
		$('#jb-overlay').data('options', options);

		// Temporarily focus here, until loading is complete
		$('#jb-window').append('<p id="jb-loading">Loading...</p>');
		$('#jb-loading').attr('tabindex', '0').focus();

		if ($('#jb-overlay').is(':visible')) {
			// if lightbox is open:

			// cleanup after fragment positioning
			if (previousOptions.linkType === 'fragment' && previousOptions.reuseFragment) {
				$('.jb-placeholder').after($(previousOptions.href));
				$('.jb-placeholder').remove();
				$(previousOptions.href).disableFocussableElements();
			}

			// hide/clear content
			$('#jb-window-content')
				.hide()
				.empty()
			;
			$('#jb-window').addClass('loading');

			loadLightBoxContent.apply(this, [loadLightBoxComplete]);

		} else {
			// if lightbox is closed:
			// Disable focussable elements
			$( document.body ).disableFocussableElements( '#jb-window *' );

			// hide button
			$('#jb-close-button').hide();

			// hide gallery controls
			$('#jb-gallery-controls').hide();

			// show overlay
			$('#jb-overlay').fadeIn(options.animationSpeed).centre();

			// open small lightbox with loading spinner
			$('#jb-window')
				.addClass('loading')
				.show()
			;

			// to zoom or not to zoom?
			if (options.zoomFromClicked) {
				// align window with clicked element (for 'zoom in' effect)
				$('#jb-window-inner').css({
					top: $(this).offset().top,
					left: $(this).offset().left,
					width: $(this).width(),
					height: $(this).height()
				});
			} else {
				// just centre
				$('#jb-window-inner')
					.css({
						width: '100px',
						height: '100px'
					})
					.centre()
				;
			}

			// load new content to hidden layer
			loadLightBoxContent.apply(this, [loadLightBoxComplete]);
		}
		// for any images in the lightbox, if they are now physically smaller than the relevant max-size, add click-to-zoom capability
	};


	loadLightBoxComplete = function(){
		// once loaded
			// init options
			var options = $('#jb-overlay').data('options');

			// restore focussable elements inside content (in case content cloned from current page)
			$('#jb-window').restoreFocussableElements();

			// remove spinner
			$('#jb-window').removeClass('loading');


			// Redundant settimeout for webkit, cause otherwise dimensions are 0 when image loaded from cache. Thanks JKS! <http://stackoverflow.com/users/144149/jks>
			// @see http://stackoverflow.com/questions/318630/get-real-image-width-and-height-with-javascript-in-safari-chrome#answer-4909227
			setTimeout(function(){

				// Establish appropriate classes for new content type before fade in
				$('#jb-window').removeClass('type-media type-image type-fragment type-ajax');
				switch (options.linkType) {
					case 'image':
						$('#jb-window').addClass('type-image type-media');
						$('#jb-window-inner').css('overflow','hidden');
					break;
					case 'fragment':
						$('#jb-window').addClass('type-fragment');
						$('#jb-window-inner').css('overflow','auto');
					break;
					case 'iframe':
						$('#jb-window').addClass('type-iframe');
						$('#jb-window-inner').css('overflow','hidden');
					break;
					case 'ajax':
						$('#jb-window').addClass('type-ajax');
						$('#jb-window-inner').css('overflow','auto');
					break;
				}
				if (options.treatAsMedia) {
					$('#jb-window').addClass('type-media');
				}

				// resize
				resizeLightBox.apply(this, [function(){
					var nextControl;

					if (options.linkType === 'iframe') {
						$('#jb-window-content').css('visibility', 'visible');
					}
					// fade in new content
					$('#jb-window-content').fadeIn(options.animationSpeed, function(){

						// set focus to start of lightbox content
						$('#jb-window-content')
							//.attr('tabindex',0) // add to tab index (now occurs during initialisation)
							.focus() // set focus
						;

						// Remove temporary loading message
						$('#jb-loading').remove();

						// run postOpen callback function
						if (options.callbackPostOpen !== null && typeof options.callbackPostOpen === 'function') {
							options.callbackPostOpen.apply(this);
						}

						// preload next gallery image?
						nextControl = $('#jb-gallery-next');
						if (
							options.preloadNextGalleryImage &&
							nextControl.length > 0 &&
							nextControl.is(':visible') &&
							nextControl.attr('href') !== '#' &&
							isImage(nextControl.attr('href'))
						) {
							$('<img src="'+nextControl.attr('href')+'" alt="" />');
						}
					});
				}]);
			}, 0);
	};


	resizeLightBox = function( callback ) {

		var options = $('#jb-overlay').data('options'),
			lbMargin, availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, mediaMaxWidth, mediaMaxHeight, w, h,
			reductionRatio, prevWidth, topLeft, animationSpeed, buttonWidth, buttonHeight, buttonLeft, buttonTop, prevTop, prevLeft, nextTop, nextLeft;

		if (typeof options === 'undefined') {
			return; // options haven't been assigned to lightbox overlay yet
		}

		lbMargin = parseInt(parsePixels(options.lightBoxMargin), 10);

		availableWidth = $('#jb-window').width() - (lbMargin * 2);
		availableHeight = $('#jb-window').height() - (lbMargin * 2);

		// find current default/max dimensions (convert to pixels if necessary)
		contentDefaultWidth = parsePixels(options.contentDefaultWidth, availableWidth);
		contentDefaultHeight = parsePixels(options.contentDefaultHeight, availableHeight);
		mediaMaxWidth = parsePixels(options.mediaMaxWidth, availableWidth);
		mediaMaxHeight = parsePixels(options.mediaMaxHeight, availableHeight);


		// run preResize callback function
			if (options.callbackPreResize !== null && typeof options.callbackPreResize === 'function') {
				options.callbackPreResize.apply($('#jb-window'), [availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, mediaMaxWidth, mediaMaxHeight]);
			}

		/*// IE6 needs help with resizing the overlay and window
		if (
			$.browser.msie && $.browser.version === 6
		) {

			$('#jb-overlay, #jb-window').css({
				position: 'absolute',
				top: 0-$( document.body ).css('margin-top'),
				left: 0-$( document.body ).css('margin-left'),
				width: $(window).width(),
				height: $(window).height()
			});

		}
			*/

		if (options.linkType === 'image' || options.treatAsMedia) {



			// measure content size
			w = $('#jb-window-content').lightBoxContentWidth();
			h = $('#jb-window-content').lightBoxContentHeight();


			// compare dimensions against max width and height
			if (w > mediaMaxWidth) {
				reductionRatio = w / mediaMaxWidth;
				w = mediaMaxWidth;
				h = h / reductionRatio;
				// $.debug('w ratio = '+reductionRatio);
			}
			if (h > mediaMaxHeight) {
				reductionRatio = h / mediaMaxHeight;
				h = mediaMaxHeight;
				w = w / reductionRatio;
				// $.debug('h ratio = '+reductionRatio);
			}

			// compare dimensions against available width and height
			if (w > availableWidth) {
				reductionRatio = w / availableWidth;
				w = availableWidth;
				h = h * reductionRatio;
				// $.debug('w ratio = '+reductionRatio);
			}
			if (h > availableHeight) {
				reductionRatio = h / availableHeight;
				h = availableHeight;
				w = w * reductionRatio;
				// $.debug('h ratio = '+reductionRatio);
			}
			// $.debug('max img width = '+options.mediaMaxWidth);
			// $.debug('max img height = '+options.mediaMaxHeight);

		} else if (options.linkType === 'iframe') {

			w = contentDefaultWidth;
			h = contentDefaultHeight;

		} else {

			// not an image or treat as media (must be content fragment)

			// $.debug('contentDefaultWidth = '+options.contentDefaultWidth);
			// $.debug('contentDefaultHeight = '+options.contentDefaultHeight);

			// measure content width
			w = $('#jb-window-content').lightBoxContentWidth();

			if (
				contentDefaultWidth === '' ||
				contentDefaultWidth === '100%' ||
				availableWidth < contentDefaultWidth
			) {
				w = availableWidth;
			} else {
				w = contentDefaultWidth;
			}

			if (options.collapseHeightWhenPossible) {

				// set new width temporarily
				prevWidth = $('#jb-window-inner').width();
				//$('#jb-window-inner').width(w); // not kicking in fast enough, use animate to lock in new width
				$('#jb-window-inner').animate({width: w}, 0);

				// measure height
				h = $('#jb-window-content').lightBoxContentHeight( false );

				// set width back to previous value
				$('#jb-window-inner').width(prevWidth);

				if (
					availableHeight < h
				) {
					h = availableHeight;
				// } else {
					// do nothing
					// h = contentDefaultHeight;
				}

			} else {

				// same height for all content boxes (based on contentDefaultHeight)
				h = $('#jb-window-content').lightBoxContentHeight();
				if (
					contentDefaultHeight === '' ||
					contentDefaultHeight === '100%' ||
					availableHeight < contentDefaultHeight
				) {
					h = availableHeight;
				} else {
					h = contentDefaultHeight;
				}
			}
		}

		// $.debug('availableWidth = '+availableWidth);
		// $.debug('availableHeight = '+availableHeight);
		// $.debug('final w = '+w);
		// $.debug('final h = '+h);

		topLeft = findOffsetToCentre(w, h);

		// if not animating resize, set speed to 0
		animationSpeed = options.animateResize ? options.animationSpeed : 0;

		$('#jb-close-button').hide();
		$('#jb-gallery-controls').hide();

		if (options.linkType === 'iframe') {
			$('#jb-window-inner iframe').css('visibility','hidden');
		}

		$('#jb-window-inner').animate({
			'width' : w,
			'height' : h,
			'left' : topLeft[1],
			'top' : topLeft[0]
		}, animationSpeed, 0, function() {

			options = $('#jb-overlay').data('options');
			w = $('#jb-window-inner').width();
			h = $('#jb-window-inner').height();


			// Show iframe
			if (options.linkType === 'iframe') {
				$('#jb-window-inner iframe')
					.width(w)
					.height(h)
				;
				$('#jb-window-inner iframe').css('visibility','visible');
			}

			// Show close button
			if ($('#jb-close-button').length > 0) {
				buttonWidth = parseInt($('#jb-close-button').width(), 10);
				buttonHeight = parseInt($('#jb-close-button').height(), 10);

				switch (options.closeButtonCorner) {
					case 'tr':
						buttonLeft = topLeft[1] + w - buttonWidth/2;
						buttonTop = topLeft[0] - buttonHeight/2;
					break;
					case 'br':
						buttonLeft = topLeft[1] + w - buttonWidth/2;
						buttonTop = topLeft[0] + h - buttonHeight/2;
					break;
					case 'bl':
						buttonLeft = topLeft[1] - buttonWidth/2;
						buttonTop = topLeft[0] + h - buttonHeight/2;
					break;
					default:
					// case 'tl':
						buttonLeft = topLeft[1] - buttonWidth/2;
						buttonTop = topLeft[0] - buttonHeight/2;
				}

				$('#jb-close-button')
					.css({
						position: 'absolute',
						'z-index': '999999',
						left: buttonLeft,
						top: buttonTop
					})
					.show()
				;
			}

			// Are gallery controls relevant?
			if ($('#jb-gallery-controls').is('.active')) {
				// Position gallery controls
					prevTop = topLeft[0] + h/2 - options.galleryControlHeight/2;
					prevLeft = topLeft[1] - options.galleryControlWidth;
					$('#jb-gallery-prev').css({top: prevTop, left: prevLeft});

					nextTop = topLeft[0] + h/2 - options.galleryControlHeight/2;
					nextLeft = topLeft[1] + w;
					$('#jb-gallery-next').css({top: nextTop, left: nextLeft});

				// Show gallery controls
					$('#jb-gallery-controls')
						//.fadeIn()
						.show() // faster!
					;
			}

			// run postResize callback function
			if (options.callbackPostResize !== null && typeof options.callbackPostResize === 'function') {
				options.callbackPostResize.apply($('#jb-window'), [availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, mediaMaxWidth, mediaMaxHeight]);
			}

			if (typeof callback !== 'undefined' && typeof callback.apply !== 'undefined') {
				callback.apply();
			}
		});
	};


	loadLightBoxContent = function( callback ) {

		var options = $( '#jb-overlay' ).data( 'options' ),
			href = options.href,
			caption, gallerySet, prevControl, nextControl, prevLink, nextLink,
			lbMargin, availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, ajaxHref;

		// Populate caption
		switch (options.captionMode) {
			case 'title':
				caption = options.title ? '<p class=\'jb-caption\'><span>' + options.title + '</span></p>':'';
			break;
			case 'text':
				caption = options.linkText ? '<p class=\'jb-caption\'><span>' + options.linkText + '</span></p>':'';
			break;
			default:
				caption = '';
			break;
		}


		// remove previous error states
		$('#jb-window').removeClass('error-no-content');

		// Setup/adjust gallery (next/prev) links
		// Find the gallery set
		gallerySet = $(options.gallerySelector);

		$('#jb-gallery-controls').removeClass('active');

		if (gallerySet.length > 1 && gallerySet.isInSet('#'+options.linkID)) {

			// Setup the HTML for the gallery controls
			if ($('#jb-gallery-controls').length === 0) {
				$('#jb-window').append('<div id="jb-gallery-controls"></div>');
				prevControl = $('<a id="jb-gallery-prev" href="#">Previous</a>').click(galleryControlsClick);
				nextControl = $('<a id="jb-gallery-next" href="#">Next</a>').click(galleryControlsClick);
				$('#jb-gallery-controls').append(prevControl).append(nextControl);
				prevControl.add(nextControl).css({
					position: 'absolute',
					'z-index': '99999',
					display: 'block',
					overflow: 'hidden'
				});
			} else {
				prevControl = $('#jb-gallery-prev');
				nextControl = $('#jb-gallery-next');
				prevControl.add(nextControl)
					.removeClass('disabled')
					.attr('tabindex', '0')
					.attr('title', '')
					.show()
				;
			}
			$('#jb-gallery-controls').hide();
			$('#jb-gallery-controls').addClass('active');


			// Find previous link
			prevLink = gallerySet.prevInSet('#'+options.linkID);
			if (prevLink === false) {
				if (options.galleryLoops) {
					prevLink = gallerySet.lastInSet();
				} else {
					prevLink = $('<a href="#" id=""></a>');
					prevControl
						.addClass('disabled')
						.attr('tabindex', '-1')
						// hide it or it traps mouse clicks
						.hide()
					;
				}
			}
			prevControl
				.attr('href', prevLink.attr('href'))
				.data('linkID', prevLink.attr('id'))
				.attr('title', $.trim( prevLink.accessibleText() ))
			;

			// Find next link
			nextLink = gallerySet.nextInSet('#'+options.linkID);
			if (nextLink === false) {
				if (options.galleryLoops) {
					nextLink = gallerySet.firstInSet();
				} else {
					nextLink = $('<a href="#" id=""></a>');
					nextControl
						.addClass('disabled')
						.attr('tabindex', '-1')
						// hide it or it traps mouse clicks
						.hide()
					;
				}
			}
			nextControl
				.attr('href', nextLink.attr('href'))
				.data('linkID', nextLink.attr('id'))
				.attr('title', $.trim( nextLink.accessibleText() ))
			;

		} else {
			$('#jb-gallery-controls').hide();
		}

		switch (options.linkType) {
			case 'fragment': // internal page fragment

				if (options.reuseFragment) {
					$(href).after('<span class="jb-placeholder"></span>');
					$('#jb-window-content').empty().append($(href)); // href becomes a selector for an id fragment
				} else {
					$('#jb-window-content').empty().append($(href).clone(true));
				}

				checkForContent.apply(this, [options.linkType, href]);
				callback.apply(this);
			break;

			case 'image': // link to image

					$('#jb-window-content').empty().append(
						'<img src="'+href+'" alt="" style="max-width: 100%; max-height: 100%; float: left;" />'+caption
					);
					$('#jb-window-content img')
						.error(function(){
							checkForContent.apply(this, [options.linkType, href, callback]);
						})
						.data('full-width', '')
						.data('full-height', '')
						.load(callback)
					;
			break;

			case 'iframe': // link to iframe URL
					$('#jb-window-content').show().css('visibility', 'hidden');
					$('#jb-window-content').empty().append(
						'<iframe src="'+href+'" title="'+caption+'" width="100%" height="1000" />'
					);
					$('#jb-window-content').css('visibility', 'hidden');

					lbMargin = parseInt(parsePixels(options.lightBoxMargin), 10);
					availableWidth = $('#jb-window').width() - (lbMargin * 2);
					availableHeight = $('#jb-window').height() - (lbMargin * 2);
					// find current default/max dimensions (convert to pixels if necessary)
					contentDefaultWidth = parsePixels(options.contentDefaultWidth, availableWidth);
					contentDefaultHeight = parsePixels(options.contentDefaultHeight, availableHeight);

					$('#jb-window-content > iframe')
						.width(contentDefaultWidth)
						.height(contentDefaultHeight)
						.error(function(){
							checkForContent.apply(this, [options.linkType, href, callback]);
						})
						.load(callback)
					;
			break;

			default:
			// case 'ajax':
			// case '': // link to external page (or fragment of a page)
				// ajax call on remote file
				$.ajaxSetup ({
					cache: true
				});
				if (href.indexOf('#') !== -1) {
					ajaxHref = href.split('#').join(' #');
				} else {
					ajaxHref = href;
				}
				$('#jb-window-content').empty().load(ajaxHref, function(){
					checkForContent.apply(this, [options.linkType, href]);
					callback.apply(this);
				});
		}
	};


	checkForContent = function( linkType, href, callback ) {
		// check if no content loaded
		var wasError = false,
			options;

		// checkForContent only called for images on .error()
		// otherwise, if no children() exist
		if (linkType === 'image' || $('#jb-window-content').children().length === 0) {
			wasError = true;
		}

		if (wasError) {
			options = $('#jb-overlay').data('options');
			options.linkType = 'fragment';
			options.treatAsMedia = false;
			$('#jb-overlay').data('options', options);
			$('#jb-window')
				.removeClass('type-image type-media')
				.addClass('type-fragment error-no-content')
			;
			$('#jb-window-content').empty().append('<p>There was an error loading lightbox content. <strong>'+$(options.trigger).text()+'</strong> (<samp>'+href+'</samp>) could not be found.</p>');
		}
		if (typeof callback !== 'undefined') {
			callback.apply(this);
		}
	};


	closeLightBox = function( evt ) {
		var options, href, originalTriggerEL;

		if ( evt ) {
			evt.preventDefault(); // prevent click from following link
		}

		if ($('#jb-window:hidden').length) {
			return; // Already closed, do nothing
		}

		options = $('#jb-overlay').data('options');
		href = options.href;

		// run preClose callback function
		if (options.callbackPreClose !== null && typeof options.callbackPreClose === 'function') {
			options.callbackPreClose.apply(options.trigger);
		}

		// cleanup after fragment positioning
		if (options.linkType === 'fragment' && options.reuseFragment) {
			$('.jb-placeholder').after($(href));
			$('.jb-placeholder').remove();
		}


		// Restore all focussable elements
		$( document.body ).restoreFocussableElements();

		$('#jb-overlay').fadeOut(options.animationSpeed);
		$('#jb-window').hide();
		$('#jb-window-content').hide();

		// return focus to original trigger element
		originalTriggerEL = $(options.originalTrigger);
		if (typeof originalTriggerEL.attr('tabindex') === 'undefined') {
			originalTriggerEL.attr('tabindex',0);
		}
		originalTriggerEL.focus();

		// Remove temporary loading message
		$('#jb-loading').remove();

		// run postClose callback function
		if (options.callbackPostClose !== null && typeof options.callbackPostClose === 'function') {
			options.callbackPostClose.apply(options.trigger);
		}

		// TODO pop history? ... if this was a gallery, pop the entire gallery?
		// window.history.back();

		// Go back to previous screen, maintain screen pos and re-set focus
		var screenPos = $(window).scrollTop();
		$.history.load( '' );
		$(window).scrollTop( screenPos );
		$(originalTriggerEL).focus();
	};

	var progressFromLightbox = function (evt) {
		// TODO: Add option to progress from this lightbox, leaving it in the history
	}


	/**
	 * A plugin to measure the width of an element accurately (even if it is hidden)
	 */
	$.fn.lightBoxContentWidth = function () {

		var jbWindow = this.closest('#jb-window'),
			jbWindowInner = $('#jb-window-inner'),
			isImageType = jbWindow.hasClass('type-media') ? true : false,
			isImageMedia = jbWindow.hasClass('media-image') ? true : false,
			currentWidth = jbWindowInner.width(),
			currentHeight = jbWindowInner.height(),
			currentLeft = jbWindowInner.css('left'),
			currentTop = jbWindowInner.css('top'),
			fullWidth
		;

		// relax size for measurement
		/*
		if (
			$.browser.msie &&
			$.browser.version === 7 &&
			isImageType &&
			isImageMedia &&
			this.find('img').outerWidth(true) === 0 // IE7 width === 0 on initial load
		) { // only works with '100%' for IE7 on initial load
			jbWindowInner.css({
				width: '100%',
				height: '100%',
				left:0,
				top:0
			});
		} else { // must use 'auto' for all other situations
			jbWindowInner.css({
				width: 'auto',
				height: 'auto',
				left:0,
				top:0
			});
		}
		*/
		jbWindowInner.css({
			width: 'auto',
			height: 'auto',
			left:0,
			top:0
		});


		// if element is hidden, unhide it, then measure
		if ( this.css('display') === 'none') {

			// make element display for a nanosecond
				this.css('display', 'block');

			// measure
				if (isImageType) {
					fullWidth = this.find('img').outerWidth(true);
				} else {
					fullWidth = this.outerWidth(true);
				}
			// restore
				this.css('display', 'none');

		} else {
			fullWidth = this.outerWidth(true);
		}


		// reinstate previous size/position
		jbWindowInner.css({'left':currentLeft,'top':currentTop});
		jbWindowInner.animate({
			width: currentWidth,
			height: currentHeight//,
				//left: curentLeft,
				//top: currentTop
		},0);

		return fullWidth;
	};


	/**
	 * A plugin to measure the height of an element accurately (even if it is hidden)
	 */
	$.fn.lightBoxContentHeight = function( relaxWidth ) {

		var jbWindow = this.closest('#jb-window'),
			jbWindowInner = jbWindow.find( '#jb-window-inner' ),
			isImageType = jbWindow.hasClass('type-media') ? true : false,
			isImageMedia = jbWindow.hasClass('media-image') ? true : false,

			// always relax height
			currentWidth = jbWindowInner.width(),
			currentHeight = jbWindowInner.height(),
			currentLeft = jbWindowInner.css('left'),
			currentTop = jbWindowInner.css('top'),

			fullHeight
		;

		relaxWidth = typeof relaxWidth !== 'undefined' ? relaxWidth : true;

		// relax size for measurement
		/*
		if (
			$.browser.msie &&
			$.browser.version === 7 &&
			isImageType &&
			isImageMedia &&
			this.find('img').outerWidth(true) === 0 // IE7 width === 0 on initial load
		) { // only works with '100%' for IE7 on initial load
			$('#jb-window-inner').height('100%');
			if (relaxWidth) {
				$('#jb-window-inner').width('100%').css({left:0,top:0});
			}
		} else { // must use 'auto' for all other situations
			$('#jb-window-inner').height('auto');
			if (relaxWidth) {
				$('#jb-window-inner').width('auto').css({left:0,top:0});
			}
		}
		*/

		// Lifted code
		$('#jb-window-inner').height('auto');
		if (relaxWidth) {
			$('#jb-window-inner').width('auto').css({left:0,top:0});
		}
		// END Lifted code

		// if element is hidden, unhide it, then measure
		if ( this.css('display') === 'none' ) {

			// make element display for a nanosecond
			this.css('display', 'block');

			// measure
			fullHeight = this.outerHeight(true);

			// restore
			this.css('display', 'none');


		} else {
			fullHeight = $(this).outerHeight(true);
		}

		// reinstate previous size
			$('#jb-window-inner')
				.width(currentWidth)
				.height(currentHeight)
				.css({left:currentLeft,top:currentTop})
			;

		return fullHeight;
	};


	overlayClicked = function( evt ) {
		var options = $('#jb-overlay').data('options');

		if ( evt.target === $('#jb-window').get(0) && options.clickOverlayCloses ) {
			closeLightBox.apply();
		// } else {
			// do nothing
		}
	};


	/**
	 * Key pressed on keyboard
	 */
	lightBoxKeypress = function( evt ) {
		var evtKeyCode;

		//$.debug('Key pressed: '+evt.keyCode);

		// If lightbox is not open or if modifier keys are down, ignore key presses
		if (
			!$('#jb-overlay').is(':visible') ||
			evt.ctrlKey ||
			evt.altKey ||
			evt.shiftKey ||
			evt.metaKey
		) {
			return true; /* facilitate further bubbling */
		}

		// Get the key that was pressed
		evtKeyCode = getKeyCode(evt);


		// handle keypresses here
		switch (evtKeyCode) {
			case DOM_VK_UP:
			case DOM_VK_LEFT:
				$('#jb-gallery-prev').click();
			break;
			case DOM_VK_DOWN:
			case DOM_VK_RIGHT:
				$('#jb-gallery-next').click();
			break;
			case DOM_VK_HOME:
				$($('#jb-overlay').data('options').gallerySelector).firstInSet().click();
			break;
			case DOM_VK_END:
				$($('#jb-overlay').data('options').gallerySelector).lastInSet().click();
			break;
			case DOM_VK_ESCAPE:
				closeLightBox.apply();
			break;
			default:
				// A different (untracked) key was pressed, just ignore it
				return true; /* facilitate further bubbling */
		}

		// Event already handled, prevent default
		evt.preventDefault();
	};


	/**
	 * Someone activated gallery 'next' or 'prev' links
	 */
	galleryControlsClick = function( evt ) {
		var lightboxLink,
			$this = $( this );

		// Prevent default action
		evt.preventDefault();

		// find the gallery link, and activate it
		if ( $this.data( 'linkID' ) !== '' ) {

			$( '#jb-gallery-controls' ).hide(); // hide gallery controls for the transition

			lightboxLink = $( '#' + $this.data( 'linkID' ));
			return lightboxLink.click();
		}
	};





	findOffsetToCentre = function( w, h ) {
		var topOffset = ( $(window).height() - h ) / 2,
			leftOffset = ( $(window).width() - w ) / 2;

		//// $.debug ('w = '+w+' | h = '+h+' | top = '+top+' | left = '+left);

		return [ topOffset, leftOffset ];
	};


	/**
	 * Find if the node is in the set of nodes
	 */
	$.fn.isInSet = function( currentElement ) {
		return this.index( $( currentElement )) !== -1;
	};


	/**
	 * Find the next node in the currently selected set of nodes
	 */
	$.fn.nextInSet = function( currentElement ) {
		var currentIndex = this.index( $( currentElement ));
		if ( this.length > currentIndex + 1 ) {
			return this.eq( currentIndex + 1 );
		} else {
			return false;
		}
	};


	/**
	 * Find the previous node in the currently selected set of nodes
	 */
	$.fn.prevInSet = function( currentElement ) {
		var currentIndex = this.index( $( currentElement ));
		if ( currentIndex > 0 ) {
			return this.eq( currentIndex - 1 );
		} else {
			return false;
		}
	};


	/**
	 * Find the first node in the currently selected set of nodes
	 */
	$.fn.firstInSet = function() {
		if ( this.length > 0 ) {
			return this.eq( 0 );
		} else {
			return false;
		}
	};


	/**
	 * Find the last node in the currently selected set of nodes
	 */
	$.fn.lastInSet = function() {
		if ( this.length > 0 ) {
			return this.eq( -1 );
		} else {
			return false;
		}
	};


	/**
	 * from: http://stackoverflow.com/questions/1933501/how-to-put-targetblank-in-jquery
	 */
	isImage = function( fileName ) {

		if (typeof fileName === 'undefined' || fileName === '') {
			return false;
		}
		var pos = String( fileName ).lastIndexOf( '.' ),
			extension;

		if (pos === -1 ) {
			return false;
		} else {
			return ( /^\.(jpg|png|gif|bmp|jpeg)$/i ).test( fileName.substring( pos ));
		}
	};


	/**
	 * Disable all focussable elements outside the lightbox. Stores previous tabindex for later restoration
	 * Currently targets links, common form elements and anything with tabindex > -1
	 * @see http://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus
	 */
	$.fn.disableFocussableElements = function( excludeElements ) {
		excludeElements = excludeElements || '';
		var focussable = this.find( 'a, input, button, area, frame, iframe, [tabindex]' ).not( excludeElements ).not( '*[tabindex="-1"]' );

		focussable.each(function() {
			var $this = $( this ),
				prevTabIndex = $this.attr( 'tabindex' )
			;

			prevTabIndex = typeof ( prevTabIndex ) === 'undefined' || prevTabIndex === '' ? '' : prevTabIndex;

			$this
				.data( 'prevTabIndex', prevTabIndex )
				.addClass( 'jb-unfocussed' )
				.attr( 'tabindex', '-1' )
			;
		});
	};


	/**
	 * Restore all focussable elements outside the lightbox.
	 */
	$.fn.restoreFocussableElements = function() {
		var focussable = this.find( '.jb-unfocussed' );

		focussable.each(function() {
			var $this = $( this ),
				prevTabIndex = $this.data( 'prevTabIndex' );

			switch ( prevTabIndex ) {
				case '':
					$this.removeAttr( 'tabindex' );
				break;
				default:
					$this.attr( 'tabindex', prevTabIndex );
			}

			$this.removeClass( 'jb-unfocussed' );
		});
	};


	/**
	 * Converts % or em values to a number of pixels (integer).
	 * Use pxToEm (reverse mode) to convert em values to pixels (if the plugin is available)
	 * @param String input The dimenion to be converted (may include % or em or px)
	 * @param integer centDimension The dimension that represents 100%
	 * @return integer Converted dimension in pixels
	 */
	parsePixels = function( input, centDimension ) {

		centDimension = typeof centDimension !== 'undefined' ? centDimension : $( document.body ).width() ;

		input = input
			.replace('px','') // remove px units if present
			.replace(/^\s+|\s+$/g,"") // trim leading and trailing whitespace
		;

		if (!isNaN(input)) {
			// int already, return as pixels
			return parseInt(input, 10);

		} else if (input.substr(input.length - 1) === '%') {
			// %, convert to pixels

			if (typeof centDimension !== 'undefined') {
				input = parseInt(input
					.substr(0, input.length - 1) // strip unit
					.replace(/^\s+|\s+$/g,"") // trim
				, 10);
				return input/100 * parseInt(centDimension, 10);
			} else {
				$.debug('Warning: percentage unit was supplied to parsePixels() but could not be calculated because centDimension was not supplied.');
				return parseInt(input, 10);
			}

		} else if (input.substr(input.length - 2) === 'em') {
			// em, check for pxToEm and convert (or warn)
			if (typeof Number.prototype.pxToEm !== 'undefined') {
				input = parseInt(input
					.substr(0, input.length - 2) // strip unit
					.replace(/^\s+|\s+$/g,"") // trim
				, 10);
				input = input.pxToEm({
				   reverse: true
				});
				return input.substr(0, input.length - 2); // strip unit px;

			} else {
				$.debug('Warning: em unit was supplied to parsePixels() but could not be calulated because pxToEm plugin was not found.');
				return parseInt(input, 10);
			}
		} else {
			// unknown units, warn
			$.debug('Warning: unknown unit was supplied. parsePixels() can support px, em or % units only.');
			return parseInt(input, 10);
		}
	};


}( jQuery, ResizeEvents ));
/* end closure */

/*!
  * Bootstrap v4.6.2 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("jquery")):"function"==typeof define&&define.amd?define(["exports","jquery"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).bootstrap={},t.jQuery)}(this,(function(t,e){"use strict";function n(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var i=n(e);function o(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function r(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function a(){return a=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},a.apply(this,arguments)}function s(t,e){return s=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},s(t,e)}var l="transitionend";var u={TRANSITION_END:"bsTransitionEnd",getUID:function(t){do{t+=~~(1e6*Math.random())}while(document.getElementById(t));return t},getSelectorFromElement:function(t){var e=t.getAttribute("data-target");if(!e||"#"===e){var n=t.getAttribute("href");e=n&&"#"!==n?n.trim():""}try{return document.querySelector(e)?e:null}catch(t){return null}},getTransitionDurationFromElement:function(t){if(!t)return 0;var e=i.default(t).css("transition-duration"),n=i.default(t).css("transition-delay"),o=parseFloat(e),r=parseFloat(n);return o||r?(e=e.split(",")[0],n=n.split(",")[0],1e3*(parseFloat(e)+parseFloat(n))):0},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(t){i.default(t).trigger(l)},supportsTransitionEnd:function(){return Boolean(l)},isElement:function(t){return(t[0]||t).nodeType},typeCheckConfig:function(t,e,n){for(var i in n)if(Object.prototype.hasOwnProperty.call(n,i)){var o=n[i],r=e[i],a=r&&u.isElement(r)?"element":null===(s=r)||"undefined"==typeof s?""+s:{}.toString.call(s).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(o).test(a))throw new Error(t.toUpperCase()+': Option "'+i+'" provided type "'+a+'" but expected type "'+o+'".')}var s},findShadowRoot:function(t){if(!document.documentElement.attachShadow)return null;if("function"==typeof t.getRootNode){var e=t.getRootNode();return e instanceof ShadowRoot?e:null}return t instanceof ShadowRoot?t:t.parentNode?u.findShadowRoot(t.parentNode):null},jQueryDetection:function(){if("undefined"==typeof i.default)throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");var t=i.default.fn.jquery.split(" ")[0].split(".");if(t[0]<2&&t[1]<9||1===t[0]&&9===t[1]&&t[2]<1||t[0]>=4)throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}};u.jQueryDetection(),i.default.fn.emulateTransitionEnd=function(t){var e=this,n=!1;return i.default(this).one(u.TRANSITION_END,(function(){n=!0})),setTimeout((function(){n||u.triggerTransitionEnd(e)}),t),this},i.default.event.special[u.TRANSITION_END]={bindType:l,delegateType:l,handle:function(t){if(i.default(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}};var f="bs.alert",d=i.default.fn.alert,c=function(){function t(t){this._element=t}var e=t.prototype;return e.close=function(t){var e=this._element;t&&(e=this._getRootElement(t)),this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},e.dispose=function(){i.default.removeData(this._element,f),this._element=null},e._getRootElement=function(t){var e=u.getSelectorFromElement(t),n=!1;return e&&(n=document.querySelector(e)),n||(n=i.default(t).closest(".alert")[0]),n},e._triggerCloseEvent=function(t){var e=i.default.Event("close.bs.alert");return i.default(t).trigger(e),e},e._removeElement=function(t){var e=this;if(i.default(t).removeClass("show"),i.default(t).hasClass("fade")){var n=u.getTransitionDurationFromElement(t);i.default(t).one(u.TRANSITION_END,(function(n){return e._destroyElement(t,n)})).emulateTransitionEnd(n)}else this._destroyElement(t)},e._destroyElement=function(t){i.default(t).detach().trigger("closed.bs.alert").remove()},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this),o=n.data(f);o||(o=new t(this),n.data(f,o)),"close"===e&&o[e](this)}))},t._handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this)}},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}}]),t}();i.default(document).on("click.bs.alert.data-api",'[data-dismiss="alert"]',c._handleDismiss(new c)),i.default.fn.alert=c._jQueryInterface,i.default.fn.alert.Constructor=c,i.default.fn.alert.noConflict=function(){return i.default.fn.alert=d,c._jQueryInterface};var h="bs.button",p=i.default.fn.button,m="active",g='[data-toggle^="button"]',_='input:not([type="hidden"])',v=".btn",b=function(){function t(t){this._element=t,this.shouldAvoidTriggerChange=!1}var e=t.prototype;return e.toggle=function(){var t=!0,e=!0,n=i.default(this._element).closest('[data-toggle="buttons"]')[0];if(n){var o=this._element.querySelector(_);if(o){if("radio"===o.type)if(o.checked&&this._element.classList.contains(m))t=!1;else{var r=n.querySelector(".active");r&&i.default(r).removeClass(m)}t&&("checkbox"!==o.type&&"radio"!==o.type||(o.checked=!this._element.classList.contains(m)),this.shouldAvoidTriggerChange||i.default(o).trigger("change")),o.focus(),e=!1}}this._element.hasAttribute("disabled")||this._element.classList.contains("disabled")||(e&&this._element.setAttribute("aria-pressed",!this._element.classList.contains(m)),t&&i.default(this._element).toggleClass(m))},e.dispose=function(){i.default.removeData(this._element,h),this._element=null},t._jQueryInterface=function(e,n){return this.each((function(){var o=i.default(this),r=o.data(h);r||(r=new t(this),o.data(h,r)),r.shouldAvoidTriggerChange=n,"toggle"===e&&r[e]()}))},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}}]),t}();i.default(document).on("click.bs.button.data-api",g,(function(t){var e=t.target,n=e;if(i.default(e).hasClass("btn")||(e=i.default(e).closest(v)[0]),!e||e.hasAttribute("disabled")||e.classList.contains("disabled"))t.preventDefault();else{var o=e.querySelector(_);if(o&&(o.hasAttribute("disabled")||o.classList.contains("disabled")))return void t.preventDefault();"INPUT"!==n.tagName&&"LABEL"===e.tagName||b._jQueryInterface.call(i.default(e),"toggle","INPUT"===n.tagName)}})).on("focus.bs.button.data-api blur.bs.button.data-api",g,(function(t){var e=i.default(t.target).closest(v)[0];i.default(e).toggleClass("focus",/^focus(in)?$/.test(t.type))})),i.default(window).on("load.bs.button.data-api",(function(){for(var t=[].slice.call(document.querySelectorAll('[data-toggle="buttons"] .btn')),e=0,n=t.length;e<n;e++){var i=t[e],o=i.querySelector(_);o.checked||o.hasAttribute("checked")?i.classList.add(m):i.classList.remove(m)}for(var r=0,a=(t=[].slice.call(document.querySelectorAll('[data-toggle="button"]'))).length;r<a;r++){var s=t[r];"true"===s.getAttribute("aria-pressed")?s.classList.add(m):s.classList.remove(m)}})),i.default.fn.button=b._jQueryInterface,i.default.fn.button.Constructor=b,i.default.fn.button.noConflict=function(){return i.default.fn.button=p,b._jQueryInterface};var y="carousel",E="bs.carousel",w=i.default.fn[y],T="active",C="next",S="prev",N="slid.bs.carousel",D=".active.carousel-item",A={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},k={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},I={TOUCH:"touch",PEN:"pen"},O=function(){function t(t,e){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(e),this._element=t,this._indicatorsElement=this._element.querySelector(".carousel-indicators"),this._touchSupported="ontouchstart"in document.documentElement||navigator.maxTouchPoints>0,this._pointerEvent=Boolean(window.PointerEvent||window.MSPointerEvent),this._addEventListeners()}var e=t.prototype;return e.next=function(){this._isSliding||this._slide(C)},e.nextWhenVisible=function(){var t=i.default(this._element);!document.hidden&&t.is(":visible")&&"hidden"!==t.css("visibility")&&this.next()},e.prev=function(){this._isSliding||this._slide(S)},e.pause=function(t){t||(this._isPaused=!0),this._element.querySelector(".carousel-item-next, .carousel-item-prev")&&(u.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},e.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._updateInterval(),this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},e.to=function(t){var e=this;this._activeElement=this._element.querySelector(D);var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)i.default(this._element).one(N,(function(){return e.to(t)}));else{if(n===t)return this.pause(),void this.cycle();var o=t>n?C:S;this._slide(o,this._items[t])}},e.dispose=function(){i.default(this._element).off(".bs.carousel"),i.default.removeData(this._element,E),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},e._getConfig=function(t){return t=a({},A,t),u.typeCheckConfig(y,t,k),t},e._handleSwipe=function(){var t=Math.abs(this.touchDeltaX);if(!(t<=40)){var e=t/this.touchDeltaX;this.touchDeltaX=0,e>0&&this.prev(),e<0&&this.next()}},e._addEventListeners=function(){var t=this;this._config.keyboard&&i.default(this._element).on("keydown.bs.carousel",(function(e){return t._keydown(e)})),"hover"===this._config.pause&&i.default(this._element).on("mouseenter.bs.carousel",(function(e){return t.pause(e)})).on("mouseleave.bs.carousel",(function(e){return t.cycle(e)})),this._config.touch&&this._addTouchEventListeners()},e._addTouchEventListeners=function(){var t=this;if(this._touchSupported){var e=function(e){t._pointerEvent&&I[e.originalEvent.pointerType.toUpperCase()]?t.touchStartX=e.originalEvent.clientX:t._pointerEvent||(t.touchStartX=e.originalEvent.touches[0].clientX)},n=function(e){t._pointerEvent&&I[e.originalEvent.pointerType.toUpperCase()]&&(t.touchDeltaX=e.originalEvent.clientX-t.touchStartX),t._handleSwipe(),"hover"===t._config.pause&&(t.pause(),t.touchTimeout&&clearTimeout(t.touchTimeout),t.touchTimeout=setTimeout((function(e){return t.cycle(e)}),500+t._config.interval))};i.default(this._element.querySelectorAll(".carousel-item img")).on("dragstart.bs.carousel",(function(t){return t.preventDefault()})),this._pointerEvent?(i.default(this._element).on("pointerdown.bs.carousel",(function(t){return e(t)})),i.default(this._element).on("pointerup.bs.carousel",(function(t){return n(t)})),this._element.classList.add("pointer-event")):(i.default(this._element).on("touchstart.bs.carousel",(function(t){return e(t)})),i.default(this._element).on("touchmove.bs.carousel",(function(e){return function(e){t.touchDeltaX=e.originalEvent.touches&&e.originalEvent.touches.length>1?0:e.originalEvent.touches[0].clientX-t.touchStartX}(e)})),i.default(this._element).on("touchend.bs.carousel",(function(t){return n(t)})))}},e._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.which){case 37:t.preventDefault(),this.prev();break;case 39:t.preventDefault(),this.next()}},e._getItemIndex=function(t){return this._items=t&&t.parentNode?[].slice.call(t.parentNode.querySelectorAll(".carousel-item")):[],this._items.indexOf(t)},e._getItemByDirection=function(t,e){var n=t===C,i=t===S,o=this._getItemIndex(e),r=this._items.length-1;if((i&&0===o||n&&o===r)&&!this._config.wrap)return e;var a=(o+(t===S?-1:1))%this._items.length;return-1===a?this._items[this._items.length-1]:this._items[a]},e._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),o=this._getItemIndex(this._element.querySelector(D)),r=i.default.Event("slide.bs.carousel",{relatedTarget:t,direction:e,from:o,to:n});return i.default(this._element).trigger(r),r},e._setActiveIndicatorElement=function(t){if(this._indicatorsElement){var e=[].slice.call(this._indicatorsElement.querySelectorAll(".active"));i.default(e).removeClass(T);var n=this._indicatorsElement.children[this._getItemIndex(t)];n&&i.default(n).addClass(T)}},e._updateInterval=function(){var t=this._activeElement||this._element.querySelector(D);if(t){var e=parseInt(t.getAttribute("data-interval"),10);e?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,this._config.interval=e):this._config.interval=this._config.defaultInterval||this._config.interval}},e._slide=function(t,e){var n,o,r,a=this,s=this._element.querySelector(D),l=this._getItemIndex(s),f=e||s&&this._getItemByDirection(t,s),d=this._getItemIndex(f),c=Boolean(this._interval);if(t===C?(n="carousel-item-left",o="carousel-item-next",r="left"):(n="carousel-item-right",o="carousel-item-prev",r="right"),f&&i.default(f).hasClass(T))this._isSliding=!1;else if(!this._triggerSlideEvent(f,r).isDefaultPrevented()&&s&&f){this._isSliding=!0,c&&this.pause(),this._setActiveIndicatorElement(f),this._activeElement=f;var h=i.default.Event(N,{relatedTarget:f,direction:r,from:l,to:d});if(i.default(this._element).hasClass("slide")){i.default(f).addClass(o),u.reflow(f),i.default(s).addClass(n),i.default(f).addClass(n);var p=u.getTransitionDurationFromElement(s);i.default(s).one(u.TRANSITION_END,(function(){i.default(f).removeClass(n+" "+o).addClass(T),i.default(s).removeClass("active "+o+" "+n),a._isSliding=!1,setTimeout((function(){return i.default(a._element).trigger(h)}),0)})).emulateTransitionEnd(p)}else i.default(s).removeClass(T),i.default(f).addClass(T),this._isSliding=!1,i.default(this._element).trigger(h);c&&this.cycle()}},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this).data(E),o=a({},A,i.default(this).data());"object"==typeof e&&(o=a({},o,e));var r="string"==typeof e?e:o.slide;if(n||(n=new t(this,o),i.default(this).data(E,n)),"number"==typeof e)n.to(e);else if("string"==typeof r){if("undefined"==typeof n[r])throw new TypeError('No method named "'+r+'"');n[r]()}else o.interval&&o.ride&&(n.pause(),n.cycle())}))},t._dataApiClickHandler=function(e){var n=u.getSelectorFromElement(this);if(n){var o=i.default(n)[0];if(o&&i.default(o).hasClass("carousel")){var r=a({},i.default(o).data(),i.default(this).data()),s=this.getAttribute("data-slide-to");s&&(r.interval=!1),t._jQueryInterface.call(i.default(o),r),s&&i.default(o).data(E).to(s),e.preventDefault()}}},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"Default",get:function(){return A}}]),t}();i.default(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",O._dataApiClickHandler),i.default(window).on("load.bs.carousel.data-api",(function(){for(var t=[].slice.call(document.querySelectorAll('[data-ride="carousel"]')),e=0,n=t.length;e<n;e++){var o=i.default(t[e]);O._jQueryInterface.call(o,o.data())}})),i.default.fn[y]=O._jQueryInterface,i.default.fn[y].Constructor=O,i.default.fn[y].noConflict=function(){return i.default.fn[y]=w,O._jQueryInterface};var x="collapse",j="bs.collapse",L=i.default.fn[x],P="show",F="collapse",R="collapsing",B="collapsed",H="width",M='[data-toggle="collapse"]',q={toggle:!0,parent:""},Q={toggle:"boolean",parent:"(string|element)"},W=function(){function t(t,e){this._isTransitioning=!1,this._element=t,this._config=this._getConfig(e),this._triggerArray=[].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'));for(var n=[].slice.call(document.querySelectorAll(M)),i=0,o=n.length;i<o;i++){var r=n[i],a=u.getSelectorFromElement(r),s=[].slice.call(document.querySelectorAll(a)).filter((function(e){return e===t}));null!==a&&s.length>0&&(this._selector=a,this._triggerArray.push(r))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}var e=t.prototype;return e.toggle=function(){i.default(this._element).hasClass(P)?this.hide():this.show()},e.show=function(){var e,n,o=this;if(!(this._isTransitioning||i.default(this._element).hasClass(P)||(this._parent&&0===(e=[].slice.call(this._parent.querySelectorAll(".show, .collapsing")).filter((function(t){return"string"==typeof o._config.parent?t.getAttribute("data-parent")===o._config.parent:t.classList.contains(F)}))).length&&(e=null),e&&(n=i.default(e).not(this._selector).data(j))&&n._isTransitioning))){var r=i.default.Event("show.bs.collapse");if(i.default(this._element).trigger(r),!r.isDefaultPrevented()){e&&(t._jQueryInterface.call(i.default(e).not(this._selector),"hide"),n||i.default(e).data(j,null));var a=this._getDimension();i.default(this._element).removeClass(F).addClass(R),this._element.style[a]=0,this._triggerArray.length&&i.default(this._triggerArray).removeClass(B).attr("aria-expanded",!0),this.setTransitioning(!0);var s="scroll"+(a[0].toUpperCase()+a.slice(1)),l=u.getTransitionDurationFromElement(this._element);i.default(this._element).one(u.TRANSITION_END,(function(){i.default(o._element).removeClass(R).addClass("collapse show"),o._element.style[a]="",o.setTransitioning(!1),i.default(o._element).trigger("shown.bs.collapse")})).emulateTransitionEnd(l),this._element.style[a]=this._element[s]+"px"}}},e.hide=function(){var t=this;if(!this._isTransitioning&&i.default(this._element).hasClass(P)){var e=i.default.Event("hide.bs.collapse");if(i.default(this._element).trigger(e),!e.isDefaultPrevented()){var n=this._getDimension();this._element.style[n]=this._element.getBoundingClientRect()[n]+"px",u.reflow(this._element),i.default(this._element).addClass(R).removeClass("collapse show");var o=this._triggerArray.length;if(o>0)for(var r=0;r<o;r++){var a=this._triggerArray[r],s=u.getSelectorFromElement(a);null!==s&&(i.default([].slice.call(document.querySelectorAll(s))).hasClass(P)||i.default(a).addClass(B).attr("aria-expanded",!1))}this.setTransitioning(!0),this._element.style[n]="";var l=u.getTransitionDurationFromElement(this._element);i.default(this._element).one(u.TRANSITION_END,(function(){t.setTransitioning(!1),i.default(t._element).removeClass(R).addClass(F).trigger("hidden.bs.collapse")})).emulateTransitionEnd(l)}}},e.setTransitioning=function(t){this._isTransitioning=t},e.dispose=function(){i.default.removeData(this._element,j),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},e._getConfig=function(t){return(t=a({},q,t)).toggle=Boolean(t.toggle),u.typeCheckConfig(x,t,Q),t},e._getDimension=function(){return i.default(this._element).hasClass(H)?H:"height"},e._getParent=function(){var e,n=this;u.isElement(this._config.parent)?(e=this._config.parent,"undefined"!=typeof this._config.parent.jquery&&(e=this._config.parent[0])):e=document.querySelector(this._config.parent);var o='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]',r=[].slice.call(e.querySelectorAll(o));return i.default(r).each((function(e,i){n._addAriaAndCollapsedClass(t._getTargetFromElement(i),[i])})),e},e._addAriaAndCollapsedClass=function(t,e){var n=i.default(t).hasClass(P);e.length&&i.default(e).toggleClass(B,!n).attr("aria-expanded",n)},t._getTargetFromElement=function(t){var e=u.getSelectorFromElement(t);return e?document.querySelector(e):null},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this),o=n.data(j),r=a({},q,n.data(),"object"==typeof e&&e?e:{});if(!o&&r.toggle&&"string"==typeof e&&/show|hide/.test(e)&&(r.toggle=!1),o||(o=new t(this,r),n.data(j,o)),"string"==typeof e){if("undefined"==typeof o[e])throw new TypeError('No method named "'+e+'"');o[e]()}}))},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"Default",get:function(){return q}}]),t}();i.default(document).on("click.bs.collapse.data-api",M,(function(t){"A"===t.currentTarget.tagName&&t.preventDefault();var e=i.default(this),n=u.getSelectorFromElement(this),o=[].slice.call(document.querySelectorAll(n));i.default(o).each((function(){var t=i.default(this),n=t.data(j)?"toggle":e.data();W._jQueryInterface.call(t,n)}))})),i.default.fn[x]=W._jQueryInterface,i.default.fn[x].Constructor=W,i.default.fn[x].noConflict=function(){return i.default.fn[x]=L,W._jQueryInterface};var U="undefined"!=typeof window&&"undefined"!=typeof document&&"undefined"!=typeof navigator,V=function(){for(var t=["Edge","Trident","Firefox"],e=0;e<t.length;e+=1)if(U&&navigator.userAgent.indexOf(t[e])>=0)return 1;return 0}(),Y=U&&window.Promise?function(t){var e=!1;return function(){e||(e=!0,window.Promise.resolve().then((function(){e=!1,t()})))}}:function(t){var e=!1;return function(){e||(e=!0,setTimeout((function(){e=!1,t()}),V))}};function z(t){return t&&"[object Function]"==={}.toString.call(t)}function K(t,e){if(1!==t.nodeType)return[];var n=t.ownerDocument.defaultView.getComputedStyle(t,null);return e?n[e]:n}function X(t){return"HTML"===t.nodeName?t:t.parentNode||t.host}function G(t){if(!t)return document.body;switch(t.nodeName){case"HTML":case"BODY":return t.ownerDocument.body;case"#document":return t.body}var e=K(t),n=e.overflow,i=e.overflowX,o=e.overflowY;return/(auto|scroll|overlay)/.test(n+o+i)?t:G(X(t))}function $(t){return t&&t.referenceNode?t.referenceNode:t}var J=U&&!(!window.MSInputMethodContext||!document.documentMode),Z=U&&/MSIE 10/.test(navigator.userAgent);function tt(t){return 11===t?J:10===t?Z:J||Z}function et(t){if(!t)return document.documentElement;for(var e=tt(10)?document.body:null,n=t.offsetParent||null;n===e&&t.nextElementSibling;)n=(t=t.nextElementSibling).offsetParent;var i=n&&n.nodeName;return i&&"BODY"!==i&&"HTML"!==i?-1!==["TH","TD","TABLE"].indexOf(n.nodeName)&&"static"===K(n,"position")?et(n):n:t?t.ownerDocument.documentElement:document.documentElement}function nt(t){return null!==t.parentNode?nt(t.parentNode):t}function it(t,e){if(!(t&&t.nodeType&&e&&e.nodeType))return document.documentElement;var n=t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING,i=n?t:e,o=n?e:t,r=document.createRange();r.setStart(i,0),r.setEnd(o,0);var a,s,l=r.commonAncestorContainer;if(t!==l&&e!==l||i.contains(o))return"BODY"===(s=(a=l).nodeName)||"HTML"!==s&&et(a.firstElementChild)!==a?et(l):l;var u=nt(t);return u.host?it(u.host,e):it(t,nt(e).host)}function ot(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top",n="top"===e?"scrollTop":"scrollLeft",i=t.nodeName;if("BODY"===i||"HTML"===i){var o=t.ownerDocument.documentElement,r=t.ownerDocument.scrollingElement||o;return r[n]}return t[n]}function rt(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=ot(e,"top"),o=ot(e,"left"),r=n?-1:1;return t.top+=i*r,t.bottom+=i*r,t.left+=o*r,t.right+=o*r,t}function at(t,e){var n="x"===e?"Left":"Top",i="Left"===n?"Right":"Bottom";return parseFloat(t["border"+n+"Width"])+parseFloat(t["border"+i+"Width"])}function st(t,e,n,i){return Math.max(e["offset"+t],e["scroll"+t],n["client"+t],n["offset"+t],n["scroll"+t],tt(10)?parseInt(n["offset"+t])+parseInt(i["margin"+("Height"===t?"Top":"Left")])+parseInt(i["margin"+("Height"===t?"Bottom":"Right")]):0)}function lt(t){var e=t.body,n=t.documentElement,i=tt(10)&&getComputedStyle(n);return{height:st("Height",e,n,i),width:st("Width",e,n,i)}}var ut=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},ft=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),dt=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},ct=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};function ht(t){return ct({},t,{right:t.left+t.width,bottom:t.top+t.height})}function pt(t){var e={};try{if(tt(10)){e=t.getBoundingClientRect();var n=ot(t,"top"),i=ot(t,"left");e.top+=n,e.left+=i,e.bottom+=n,e.right+=i}else e=t.getBoundingClientRect()}catch(t){}var o={left:e.left,top:e.top,width:e.right-e.left,height:e.bottom-e.top},r="HTML"===t.nodeName?lt(t.ownerDocument):{},a=r.width||t.clientWidth||o.width,s=r.height||t.clientHeight||o.height,l=t.offsetWidth-a,u=t.offsetHeight-s;if(l||u){var f=K(t);l-=at(f,"x"),u-=at(f,"y"),o.width-=l,o.height-=u}return ht(o)}function mt(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=tt(10),o="HTML"===e.nodeName,r=pt(t),a=pt(e),s=G(t),l=K(e),u=parseFloat(l.borderTopWidth),f=parseFloat(l.borderLeftWidth);n&&o&&(a.top=Math.max(a.top,0),a.left=Math.max(a.left,0));var d=ht({top:r.top-a.top-u,left:r.left-a.left-f,width:r.width,height:r.height});if(d.marginTop=0,d.marginLeft=0,!i&&o){var c=parseFloat(l.marginTop),h=parseFloat(l.marginLeft);d.top-=u-c,d.bottom-=u-c,d.left-=f-h,d.right-=f-h,d.marginTop=c,d.marginLeft=h}return(i&&!n?e.contains(s):e===s&&"BODY"!==s.nodeName)&&(d=rt(d,e)),d}function gt(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.ownerDocument.documentElement,i=mt(t,n),o=Math.max(n.clientWidth,window.innerWidth||0),r=Math.max(n.clientHeight,window.innerHeight||0),a=e?0:ot(n),s=e?0:ot(n,"left"),l={top:a-i.top+i.marginTop,left:s-i.left+i.marginLeft,width:o,height:r};return ht(l)}function _t(t){var e=t.nodeName;if("BODY"===e||"HTML"===e)return!1;if("fixed"===K(t,"position"))return!0;var n=X(t);return!!n&&_t(n)}function vt(t){if(!t||!t.parentElement||tt())return document.documentElement;for(var e=t.parentElement;e&&"none"===K(e,"transform");)e=e.parentElement;return e||document.documentElement}function bt(t,e,n,i){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],r={top:0,left:0},a=o?vt(t):it(t,$(e));if("viewport"===i)r=gt(a,o);else{var s=void 0;"scrollParent"===i?"BODY"===(s=G(X(e))).nodeName&&(s=t.ownerDocument.documentElement):s="window"===i?t.ownerDocument.documentElement:i;var l=mt(s,a,o);if("HTML"!==s.nodeName||_t(a))r=l;else{var u=lt(t.ownerDocument),f=u.height,d=u.width;r.top+=l.top-l.marginTop,r.bottom=f+l.top,r.left+=l.left-l.marginLeft,r.right=d+l.left}}var c="number"==typeof(n=n||0);return r.left+=c?n:n.left||0,r.top+=c?n:n.top||0,r.right-=c?n:n.right||0,r.bottom-=c?n:n.bottom||0,r}function yt(t){return t.width*t.height}function Et(t,e,n,i,o){var r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===t.indexOf("auto"))return t;var a=bt(n,i,r,o),s={top:{width:a.width,height:e.top-a.top},right:{width:a.right-e.right,height:a.height},bottom:{width:a.width,height:a.bottom-e.bottom},left:{width:e.left-a.left,height:a.height}},l=Object.keys(s).map((function(t){return ct({key:t},s[t],{area:yt(s[t])})})).sort((function(t,e){return e.area-t.area})),u=l.filter((function(t){var e=t.width,i=t.height;return e>=n.clientWidth&&i>=n.clientHeight})),f=u.length>0?u[0].key:l[0].key,d=t.split("-")[1];return f+(d?"-"+d:"")}function wt(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o=i?vt(e):it(e,$(n));return mt(n,o,i)}function Tt(t){var e=t.ownerDocument.defaultView.getComputedStyle(t),n=parseFloat(e.marginTop||0)+parseFloat(e.marginBottom||0),i=parseFloat(e.marginLeft||0)+parseFloat(e.marginRight||0);return{width:t.offsetWidth+i,height:t.offsetHeight+n}}function Ct(t){var e={left:"right",right:"left",bottom:"top",top:"bottom"};return t.replace(/left|right|bottom|top/g,(function(t){return e[t]}))}function St(t,e,n){n=n.split("-")[0];var i=Tt(t),o={width:i.width,height:i.height},r=-1!==["right","left"].indexOf(n),a=r?"top":"left",s=r?"left":"top",l=r?"height":"width",u=r?"width":"height";return o[a]=e[a]+e[l]/2-i[l]/2,o[s]=n===s?e[s]-i[u]:e[Ct(s)],o}function Nt(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function Dt(t,e,n){return(void 0===n?t:t.slice(0,function(t,e,n){if(Array.prototype.findIndex)return t.findIndex((function(t){return t.name===n}));var i=Nt(t,(function(t){return t.name===n}));return t.indexOf(i)}(t,0,n))).forEach((function(t){t.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=t.function||t.fn;t.enabled&&z(n)&&(e.offsets.popper=ht(e.offsets.popper),e.offsets.reference=ht(e.offsets.reference),e=n(e,t))})),e}function At(){if(!this.state.isDestroyed){var t={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};t.offsets.reference=wt(this.state,this.popper,this.reference,this.options.positionFixed),t.placement=Et(this.options.placement,t.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),t.originalPlacement=t.placement,t.positionFixed=this.options.positionFixed,t.offsets.popper=St(this.popper,t.offsets.reference,t.placement),t.offsets.popper.position=this.options.positionFixed?"fixed":"absolute",t=Dt(this.modifiers,t),this.state.isCreated?this.options.onUpdate(t):(this.state.isCreated=!0,this.options.onCreate(t))}}function kt(t,e){return t.some((function(t){var n=t.name;return t.enabled&&n===e}))}function It(t){for(var e=[!1,"ms","Webkit","Moz","O"],n=t.charAt(0).toUpperCase()+t.slice(1),i=0;i<e.length;i++){var o=e[i],r=o?""+o+n:t;if("undefined"!=typeof document.body.style[r])return r}return null}function Ot(){return this.state.isDestroyed=!0,kt(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.position="",this.popper.style.top="",this.popper.style.left="",this.popper.style.right="",this.popper.style.bottom="",this.popper.style.willChange="",this.popper.style[It("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function xt(t){var e=t.ownerDocument;return e?e.defaultView:window}function jt(t,e,n,i){var o="BODY"===t.nodeName,r=o?t.ownerDocument.defaultView:t;r.addEventListener(e,n,{passive:!0}),o||jt(G(r.parentNode),e,n,i),i.push(r)}function Lt(t,e,n,i){n.updateBound=i,xt(t).addEventListener("resize",n.updateBound,{passive:!0});var o=G(t);return jt(o,"scroll",n.updateBound,n.scrollParents),n.scrollElement=o,n.eventsEnabled=!0,n}function Pt(){this.state.eventsEnabled||(this.state=Lt(this.reference,this.options,this.state,this.scheduleUpdate))}function Ft(){var t,e;this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=(t=this.reference,e=this.state,xt(t).removeEventListener("resize",e.updateBound),e.scrollParents.forEach((function(t){t.removeEventListener("scroll",e.updateBound)})),e.updateBound=null,e.scrollParents=[],e.scrollElement=null,e.eventsEnabled=!1,e))}function Rt(t){return""!==t&&!isNaN(parseFloat(t))&&isFinite(t)}function Bt(t,e){Object.keys(e).forEach((function(n){var i="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&Rt(e[n])&&(i="px"),t.style[n]=e[n]+i}))}var Ht=U&&/Firefox/i.test(navigator.userAgent);function Mt(t,e,n){var i=Nt(t,(function(t){return t.name===e})),o=!!i&&t.some((function(t){return t.name===n&&t.enabled&&t.order<i.order}));if(!o){var r="`"+e+"`",a="`"+n+"`";console.warn(a+" modifier is required by "+r+" modifier in order to work, be sure to include it before "+r+"!")}return o}var qt=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],Qt=qt.slice(3);function Wt(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=Qt.indexOf(t),i=Qt.slice(n+1).concat(Qt.slice(0,n));return e?i.reverse():i}var Ut={placement:"bottom",positionFixed:!1,eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(t){var e=t.placement,n=e.split("-")[0],i=e.split("-")[1];if(i){var o=t.offsets,r=o.reference,a=o.popper,s=-1!==["bottom","top"].indexOf(n),l=s?"left":"top",u=s?"width":"height",f={start:dt({},l,r[l]),end:dt({},l,r[l]+r[u]-a[u])};t.offsets.popper=ct({},a,f[i])}return t}},offset:{order:200,enabled:!0,fn:function(t,e){var n,i=e.offset,o=t.placement,r=t.offsets,a=r.popper,s=r.reference,l=o.split("-")[0];return n=Rt(+i)?[+i,0]:function(t,e,n,i){var o=[0,0],r=-1!==["right","left"].indexOf(i),a=t.split(/(\+|\-)/).map((function(t){return t.trim()})),s=a.indexOf(Nt(a,(function(t){return-1!==t.search(/,|\s/)})));a[s]&&-1===a[s].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var l=/\s*,\s*|\s+/,u=-1!==s?[a.slice(0,s).concat([a[s].split(l)[0]]),[a[s].split(l)[1]].concat(a.slice(s+1))]:[a];return u=u.map((function(t,i){var o=(1===i?!r:r)?"height":"width",a=!1;return t.reduce((function(t,e){return""===t[t.length-1]&&-1!==["+","-"].indexOf(e)?(t[t.length-1]=e,a=!0,t):a?(t[t.length-1]+=e,a=!1,t):t.concat(e)}),[]).map((function(t){return function(t,e,n,i){var o=t.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+o[1],a=o[2];return r?0===a.indexOf("%")?ht("%p"===a?n:i)[e]/100*r:"vh"===a||"vw"===a?("vh"===a?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*r:r:t}(t,o,e,n)}))})),u.forEach((function(t,e){t.forEach((function(n,i){Rt(n)&&(o[e]+=n*("-"===t[i-1]?-1:1))}))})),o}(i,a,s,l),"left"===l?(a.top+=n[0],a.left-=n[1]):"right"===l?(a.top+=n[0],a.left+=n[1]):"top"===l?(a.left+=n[0],a.top-=n[1]):"bottom"===l&&(a.left+=n[0],a.top+=n[1]),t.popper=a,t},offset:0},preventOverflow:{order:300,enabled:!0,fn:function(t,e){var n=e.boundariesElement||et(t.instance.popper);t.instance.reference===n&&(n=et(n));var i=It("transform"),o=t.instance.popper.style,r=o.top,a=o.left,s=o[i];o.top="",o.left="",o[i]="";var l=bt(t.instance.popper,t.instance.reference,e.padding,n,t.positionFixed);o.top=r,o.left=a,o[i]=s,e.boundaries=l;var u=e.priority,f=t.offsets.popper,d={primary:function(t){var n=f[t];return f[t]<l[t]&&!e.escapeWithReference&&(n=Math.max(f[t],l[t])),dt({},t,n)},secondary:function(t){var n="right"===t?"left":"top",i=f[n];return f[t]>l[t]&&!e.escapeWithReference&&(i=Math.min(f[n],l[t]-("right"===t?f.width:f.height))),dt({},n,i)}};return u.forEach((function(t){var e=-1!==["left","top"].indexOf(t)?"primary":"secondary";f=ct({},f,d[e](t))})),t.offsets.popper=f,t},priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:function(t){var e=t.offsets,n=e.popper,i=e.reference,o=t.placement.split("-")[0],r=Math.floor,a=-1!==["top","bottom"].indexOf(o),s=a?"right":"bottom",l=a?"left":"top",u=a?"width":"height";return n[s]<r(i[l])&&(t.offsets.popper[l]=r(i[l])-n[u]),n[l]>r(i[s])&&(t.offsets.popper[l]=r(i[s])),t}},arrow:{order:500,enabled:!0,fn:function(t,e){var n;if(!Mt(t.instance.modifiers,"arrow","keepTogether"))return t;var i=e.element;if("string"==typeof i){if(!(i=t.instance.popper.querySelector(i)))return t}else if(!t.instance.popper.contains(i))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),t;var o=t.placement.split("-")[0],r=t.offsets,a=r.popper,s=r.reference,l=-1!==["left","right"].indexOf(o),u=l?"height":"width",f=l?"Top":"Left",d=f.toLowerCase(),c=l?"left":"top",h=l?"bottom":"right",p=Tt(i)[u];s[h]-p<a[d]&&(t.offsets.popper[d]-=a[d]-(s[h]-p)),s[d]+p>a[h]&&(t.offsets.popper[d]+=s[d]+p-a[h]),t.offsets.popper=ht(t.offsets.popper);var m=s[d]+s[u]/2-p/2,g=K(t.instance.popper),_=parseFloat(g["margin"+f]),v=parseFloat(g["border"+f+"Width"]),b=m-t.offsets.popper[d]-_-v;return b=Math.max(Math.min(a[u]-p,b),0),t.arrowElement=i,t.offsets.arrow=(dt(n={},d,Math.round(b)),dt(n,c,""),n),t},element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:function(t,e){if(kt(t.instance.modifiers,"inner"))return t;if(t.flipped&&t.placement===t.originalPlacement)return t;var n=bt(t.instance.popper,t.instance.reference,e.padding,e.boundariesElement,t.positionFixed),i=t.placement.split("-")[0],o=Ct(i),r=t.placement.split("-")[1]||"",a=[];switch(e.behavior){case"flip":a=[i,o];break;case"clockwise":a=Wt(i);break;case"counterclockwise":a=Wt(i,!0);break;default:a=e.behavior}return a.forEach((function(s,l){if(i!==s||a.length===l+1)return t;i=t.placement.split("-")[0],o=Ct(i);var u=t.offsets.popper,f=t.offsets.reference,d=Math.floor,c="left"===i&&d(u.right)>d(f.left)||"right"===i&&d(u.left)<d(f.right)||"top"===i&&d(u.bottom)>d(f.top)||"bottom"===i&&d(u.top)<d(f.bottom),h=d(u.left)<d(n.left),p=d(u.right)>d(n.right),m=d(u.top)<d(n.top),g=d(u.bottom)>d(n.bottom),_="left"===i&&h||"right"===i&&p||"top"===i&&m||"bottom"===i&&g,v=-1!==["top","bottom"].indexOf(i),b=!!e.flipVariations&&(v&&"start"===r&&h||v&&"end"===r&&p||!v&&"start"===r&&m||!v&&"end"===r&&g),y=!!e.flipVariationsByContent&&(v&&"start"===r&&p||v&&"end"===r&&h||!v&&"start"===r&&g||!v&&"end"===r&&m),E=b||y;(c||_||E)&&(t.flipped=!0,(c||_)&&(i=a[l+1]),E&&(r=function(t){return"end"===t?"start":"start"===t?"end":t}(r)),t.placement=i+(r?"-"+r:""),t.offsets.popper=ct({},t.offsets.popper,St(t.instance.popper,t.offsets.reference,t.placement)),t=Dt(t.instance.modifiers,t,"flip"))})),t},behavior:"flip",padding:5,boundariesElement:"viewport",flipVariations:!1,flipVariationsByContent:!1},inner:{order:700,enabled:!1,fn:function(t){var e=t.placement,n=e.split("-")[0],i=t.offsets,o=i.popper,r=i.reference,a=-1!==["left","right"].indexOf(n),s=-1===["top","left"].indexOf(n);return o[a?"left":"top"]=r[n]-(s?o[a?"width":"height"]:0),t.placement=Ct(e),t.offsets.popper=ht(o),t}},hide:{order:800,enabled:!0,fn:function(t){if(!Mt(t.instance.modifiers,"hide","preventOverflow"))return t;var e=t.offsets.reference,n=Nt(t.instance.modifiers,(function(t){return"preventOverflow"===t.name})).boundaries;if(e.bottom<n.top||e.left>n.right||e.top>n.bottom||e.right<n.left){if(!0===t.hide)return t;t.hide=!0,t.attributes["x-out-of-boundaries"]=""}else{if(!1===t.hide)return t;t.hide=!1,t.attributes["x-out-of-boundaries"]=!1}return t}},computeStyle:{order:850,enabled:!0,fn:function(t,e){var n=e.x,i=e.y,o=t.offsets.popper,r=Nt(t.instance.modifiers,(function(t){return"applyStyle"===t.name})).gpuAcceleration;void 0!==r&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");var a,s,l=void 0!==r?r:e.gpuAcceleration,u=et(t.instance.popper),f=pt(u),d={position:o.position},c=function(t,e){var n=t.offsets,i=n.popper,o=n.reference,r=Math.round,a=Math.floor,s=function(t){return t},l=r(o.width),u=r(i.width),f=-1!==["left","right"].indexOf(t.placement),d=-1!==t.placement.indexOf("-"),c=e?f||d||l%2==u%2?r:a:s,h=e?r:s;return{left:c(l%2==1&&u%2==1&&!d&&e?i.left-1:i.left),top:h(i.top),bottom:h(i.bottom),right:c(i.right)}}(t,window.devicePixelRatio<2||!Ht),h="bottom"===n?"top":"bottom",p="right"===i?"left":"right",m=It("transform");if(s="bottom"===h?"HTML"===u.nodeName?-u.clientHeight+c.bottom:-f.height+c.bottom:c.top,a="right"===p?"HTML"===u.nodeName?-u.clientWidth+c.right:-f.width+c.right:c.left,l&&m)d[m]="translate3d("+a+"px, "+s+"px, 0)",d[h]=0,d[p]=0,d.willChange="transform";else{var g="bottom"===h?-1:1,_="right"===p?-1:1;d[h]=s*g,d[p]=a*_,d.willChange=h+", "+p}var v={"x-placement":t.placement};return t.attributes=ct({},v,t.attributes),t.styles=ct({},d,t.styles),t.arrowStyles=ct({},t.offsets.arrow,t.arrowStyles),t},gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:function(t){var e,n;return Bt(t.instance.popper,t.styles),e=t.instance.popper,n=t.attributes,Object.keys(n).forEach((function(t){!1!==n[t]?e.setAttribute(t,n[t]):e.removeAttribute(t)})),t.arrowElement&&Object.keys(t.arrowStyles).length&&Bt(t.arrowElement,t.arrowStyles),t},onLoad:function(t,e,n,i,o){var r=wt(o,e,t,n.positionFixed),a=Et(n.placement,r,e,t,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return e.setAttribute("x-placement",a),Bt(e,{position:n.positionFixed?"fixed":"absolute"}),n},gpuAcceleration:void 0}}},Vt=function(){function t(e,n){var i=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};ut(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(i.update)},this.update=Y(this.update.bind(this)),this.options=ct({},t.Defaults,o),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=e&&e.jquery?e[0]:e,this.popper=n&&n.jquery?n[0]:n,this.options.modifiers={},Object.keys(ct({},t.Defaults.modifiers,o.modifiers)).forEach((function(e){i.options.modifiers[e]=ct({},t.Defaults.modifiers[e]||{},o.modifiers?o.modifiers[e]:{})})),this.modifiers=Object.keys(this.options.modifiers).map((function(t){return ct({name:t},i.options.modifiers[t])})).sort((function(t,e){return t.order-e.order})),this.modifiers.forEach((function(t){t.enabled&&z(t.onLoad)&&t.onLoad(i.reference,i.popper,i.options,t,i.state)})),this.update();var r=this.options.eventsEnabled;r&&this.enableEventListeners(),this.state.eventsEnabled=r}return ft(t,[{key:"update",value:function(){return At.call(this)}},{key:"destroy",value:function(){return Ot.call(this)}},{key:"enableEventListeners",value:function(){return Pt.call(this)}},{key:"disableEventListeners",value:function(){return Ft.call(this)}}]),t}();Vt.Utils=("undefined"!=typeof window?window:global).PopperUtils,Vt.placements=qt,Vt.Defaults=Ut;var Yt=Vt,zt="dropdown",Kt="bs.dropdown",Xt=i.default.fn[zt],Gt=new RegExp("38|40|27"),$t="disabled",Jt="show",Zt="dropdown-menu-right",te="hide.bs.dropdown",ee="hidden.bs.dropdown",ne="click.bs.dropdown.data-api",ie="keydown.bs.dropdown.data-api",oe='[data-toggle="dropdown"]',re=".dropdown-menu",ae={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle",display:"dynamic",popperConfig:null},se={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string",popperConfig:"(null|object)"},le=function(){function t(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}var e=t.prototype;return e.toggle=function(){if(!this._element.disabled&&!i.default(this._element).hasClass($t)){var e=i.default(this._menu).hasClass(Jt);t._clearMenus(),e||this.show(!0)}},e.show=function(e){if(void 0===e&&(e=!1),!(this._element.disabled||i.default(this._element).hasClass($t)||i.default(this._menu).hasClass(Jt))){var n={relatedTarget:this._element},o=i.default.Event("show.bs.dropdown",n),r=t._getParentFromElement(this._element);if(i.default(r).trigger(o),!o.isDefaultPrevented()){if(!this._inNavbar&&e){if("undefined"==typeof Yt)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");var a=this._element;"parent"===this._config.reference?a=r:u.isElement(this._config.reference)&&(a=this._config.reference,"undefined"!=typeof this._config.reference.jquery&&(a=this._config.reference[0])),"scrollParent"!==this._config.boundary&&i.default(r).addClass("position-static"),this._popper=new Yt(a,this._menu,this._getPopperConfig())}"ontouchstart"in document.documentElement&&0===i.default(r).closest(".navbar-nav").length&&i.default(document.body).children().on("mouseover",null,i.default.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),i.default(this._menu).toggleClass(Jt),i.default(r).toggleClass(Jt).trigger(i.default.Event("shown.bs.dropdown",n))}}},e.hide=function(){if(!this._element.disabled&&!i.default(this._element).hasClass($t)&&i.default(this._menu).hasClass(Jt)){var e={relatedTarget:this._element},n=i.default.Event(te,e),o=t._getParentFromElement(this._element);i.default(o).trigger(n),n.isDefaultPrevented()||(this._popper&&this._popper.destroy(),i.default(this._menu).toggleClass(Jt),i.default(o).toggleClass(Jt).trigger(i.default.Event(ee,e)))}},e.dispose=function(){i.default.removeData(this._element,Kt),i.default(this._element).off(".bs.dropdown"),this._element=null,this._menu=null,null!==this._popper&&(this._popper.destroy(),this._popper=null)},e.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},e._addEventListeners=function(){var t=this;i.default(this._element).on("click.bs.dropdown",(function(e){e.preventDefault(),e.stopPropagation(),t.toggle()}))},e._getConfig=function(t){return t=a({},this.constructor.Default,i.default(this._element).data(),t),u.typeCheckConfig(zt,t,this.constructor.DefaultType),t},e._getMenuElement=function(){if(!this._menu){var e=t._getParentFromElement(this._element);e&&(this._menu=e.querySelector(re))}return this._menu},e._getPlacement=function(){var t=i.default(this._element.parentNode),e="bottom-start";return t.hasClass("dropup")?e=i.default(this._menu).hasClass(Zt)?"top-end":"top-start":t.hasClass("dropright")?e="right-start":t.hasClass("dropleft")?e="left-start":i.default(this._menu).hasClass(Zt)&&(e="bottom-end"),e},e._detectNavbar=function(){return i.default(this._element).closest(".navbar").length>0},e._getOffset=function(){var t=this,e={};return"function"==typeof this._config.offset?e.fn=function(e){return e.offsets=a({},e.offsets,t._config.offset(e.offsets,t._element)),e}:e.offset=this._config.offset,e},e._getPopperConfig=function(){var t={placement:this._getPlacement(),modifiers:{offset:this._getOffset(),flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return"static"===this._config.display&&(t.modifiers.applyStyle={enabled:!1}),a({},t,this._config.popperConfig)},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this).data(Kt);if(n||(n=new t(this,"object"==typeof e?e:null),i.default(this).data(Kt,n)),"string"==typeof e){if("undefined"==typeof n[e])throw new TypeError('No method named "'+e+'"');n[e]()}}))},t._clearMenus=function(e){if(!e||3!==e.which&&("keyup"!==e.type||9===e.which))for(var n=[].slice.call(document.querySelectorAll(oe)),o=0,r=n.length;o<r;o++){var a=t._getParentFromElement(n[o]),s=i.default(n[o]).data(Kt),l={relatedTarget:n[o]};if(e&&"click"===e.type&&(l.clickEvent=e),s){var u=s._menu;if(i.default(a).hasClass(Jt)&&!(e&&("click"===e.type&&/input|textarea/i.test(e.target.tagName)||"keyup"===e.type&&9===e.which)&&i.default.contains(a,e.target))){var f=i.default.Event(te,l);i.default(a).trigger(f),f.isDefaultPrevented()||("ontouchstart"in document.documentElement&&i.default(document.body).children().off("mouseover",null,i.default.noop),n[o].setAttribute("aria-expanded","false"),s._popper&&s._popper.destroy(),i.default(u).removeClass(Jt),i.default(a).removeClass(Jt).trigger(i.default.Event(ee,l)))}}}},t._getParentFromElement=function(t){var e,n=u.getSelectorFromElement(t);return n&&(e=document.querySelector(n)),e||t.parentNode},t._dataApiKeydownHandler=function(e){if(!(/input|textarea/i.test(e.target.tagName)?32===e.which||27!==e.which&&(40!==e.which&&38!==e.which||i.default(e.target).closest(re).length):!Gt.test(e.which))&&!this.disabled&&!i.default(this).hasClass($t)){var n=t._getParentFromElement(this),o=i.default(n).hasClass(Jt);if(o||27!==e.which){if(e.preventDefault(),e.stopPropagation(),!o||27===e.which||32===e.which)return 27===e.which&&i.default(n.querySelector(oe)).trigger("focus"),void i.default(this).trigger("click");var r=[].slice.call(n.querySelectorAll(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)")).filter((function(t){return i.default(t).is(":visible")}));if(0!==r.length){var a=r.indexOf(e.target);38===e.which&&a>0&&a--,40===e.which&&a<r.length-1&&a++,a<0&&(a=0),r[a].focus()}}}},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"Default",get:function(){return ae}},{key:"DefaultType",get:function(){return se}}]),t}();i.default(document).on(ie,oe,le._dataApiKeydownHandler).on(ie,re,le._dataApiKeydownHandler).on(ne+" keyup.bs.dropdown.data-api",le._clearMenus).on(ne,oe,(function(t){t.preventDefault(),t.stopPropagation(),le._jQueryInterface.call(i.default(this),"toggle")})).on(ne,".dropdown form",(function(t){t.stopPropagation()})),i.default.fn[zt]=le._jQueryInterface,i.default.fn[zt].Constructor=le,i.default.fn[zt].noConflict=function(){return i.default.fn[zt]=Xt,le._jQueryInterface};var ue="bs.modal",fe=i.default.fn.modal,de="modal-open",ce="fade",he="show",pe="modal-static",me="hidden.bs.modal",ge="show.bs.modal",_e="focusin.bs.modal",ve="resize.bs.modal",be="click.dismiss.bs.modal",ye="keydown.dismiss.bs.modal",Ee="mousedown.dismiss.bs.modal",we=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",Te={backdrop:!0,keyboard:!0,focus:!0,show:!0},Ce={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},Se=function(){function t(t,e){this._config=this._getConfig(e),this._element=t,this._dialog=t.querySelector(".modal-dialog"),this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollbarWidth=0}var e=t.prototype;return e.toggle=function(t){return this._isShown?this.hide():this.show(t)},e.show=function(t){var e=this;if(!this._isShown&&!this._isTransitioning){var n=i.default.Event(ge,{relatedTarget:t});i.default(this._element).trigger(n),n.isDefaultPrevented()||(this._isShown=!0,i.default(this._element).hasClass(ce)&&(this._isTransitioning=!0),this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),i.default(this._element).on(be,'[data-dismiss="modal"]',(function(t){return e.hide(t)})),i.default(this._dialog).on(Ee,(function(){i.default(e._element).one("mouseup.dismiss.bs.modal",(function(t){i.default(t.target).is(e._element)&&(e._ignoreBackdropClick=!0)}))})),this._showBackdrop((function(){return e._showElement(t)})))}},e.hide=function(t){var e=this;if(t&&t.preventDefault(),this._isShown&&!this._isTransitioning){var n=i.default.Event("hide.bs.modal");if(i.default(this._element).trigger(n),this._isShown&&!n.isDefaultPrevented()){this._isShown=!1;var o=i.default(this._element).hasClass(ce);if(o&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),i.default(document).off(_e),i.default(this._element).removeClass(he),i.default(this._element).off(be),i.default(this._dialog).off(Ee),o){var r=u.getTransitionDurationFromElement(this._element);i.default(this._element).one(u.TRANSITION_END,(function(t){return e._hideModal(t)})).emulateTransitionEnd(r)}else this._hideModal()}}},e.dispose=function(){[window,this._element,this._dialog].forEach((function(t){return i.default(t).off(".bs.modal")})),i.default(document).off(_e),i.default.removeData(this._element,ue),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._isTransitioning=null,this._scrollbarWidth=null},e.handleUpdate=function(){this._adjustDialog()},e._getConfig=function(t){return t=a({},Te,t),u.typeCheckConfig("modal",t,Ce),t},e._triggerBackdropTransition=function(){var t=this,e=i.default.Event("hidePrevented.bs.modal");if(i.default(this._element).trigger(e),!e.isDefaultPrevented()){var n=this._element.scrollHeight>document.documentElement.clientHeight;n||(this._element.style.overflowY="hidden"),this._element.classList.add(pe);var o=u.getTransitionDurationFromElement(this._dialog);i.default(this._element).off(u.TRANSITION_END),i.default(this._element).one(u.TRANSITION_END,(function(){t._element.classList.remove(pe),n||i.default(t._element).one(u.TRANSITION_END,(function(){t._element.style.overflowY=""})).emulateTransitionEnd(t._element,o)})).emulateTransitionEnd(o),this._element.focus()}},e._showElement=function(t){var e=this,n=i.default(this._element).hasClass(ce),o=this._dialog?this._dialog.querySelector(".modal-body"):null;this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),i.default(this._dialog).hasClass("modal-dialog-scrollable")&&o?o.scrollTop=0:this._element.scrollTop=0,n&&u.reflow(this._element),i.default(this._element).addClass(he),this._config.focus&&this._enforceFocus();var r=i.default.Event("shown.bs.modal",{relatedTarget:t}),a=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,i.default(e._element).trigger(r)};if(n){var s=u.getTransitionDurationFromElement(this._dialog);i.default(this._dialog).one(u.TRANSITION_END,a).emulateTransitionEnd(s)}else a()},e._enforceFocus=function(){var t=this;i.default(document).off(_e).on(_e,(function(e){document!==e.target&&t._element!==e.target&&0===i.default(t._element).has(e.target).length&&t._element.focus()}))},e._setEscapeEvent=function(){var t=this;this._isShown?i.default(this._element).on(ye,(function(e){t._config.keyboard&&27===e.which?(e.preventDefault(),t.hide()):t._config.keyboard||27!==e.which||t._triggerBackdropTransition()})):this._isShown||i.default(this._element).off(ye)},e._setResizeEvent=function(){var t=this;this._isShown?i.default(window).on(ve,(function(e){return t.handleUpdate(e)})):i.default(window).off(ve)},e._hideModal=function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._showBackdrop((function(){i.default(document.body).removeClass(de),t._resetAdjustments(),t._resetScrollbar(),i.default(t._element).trigger(me)}))},e._removeBackdrop=function(){this._backdrop&&(i.default(this._backdrop).remove(),this._backdrop=null)},e._showBackdrop=function(t){var e=this,n=i.default(this._element).hasClass(ce)?ce:"";if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement("div"),this._backdrop.className="modal-backdrop",n&&this._backdrop.classList.add(n),i.default(this._backdrop).appendTo(document.body),i.default(this._element).on(be,(function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"===e._config.backdrop?e._triggerBackdropTransition():e.hide())})),n&&u.reflow(this._backdrop),i.default(this._backdrop).addClass(he),!t)return;if(!n)return void t();var o=u.getTransitionDurationFromElement(this._backdrop);i.default(this._backdrop).one(u.TRANSITION_END,t).emulateTransitionEnd(o)}else if(!this._isShown&&this._backdrop){i.default(this._backdrop).removeClass(he);var r=function(){e._removeBackdrop(),t&&t()};if(i.default(this._element).hasClass(ce)){var a=u.getTransitionDurationFromElement(this._backdrop);i.default(this._backdrop).one(u.TRANSITION_END,r).emulateTransitionEnd(a)}else r()}else t&&t()},e._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},e._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},e._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=Math.round(t.left+t.right)<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},e._setScrollbar=function(){var t=this;if(this._isBodyOverflowing){var e=[].slice.call(document.querySelectorAll(we)),n=[].slice.call(document.querySelectorAll(".sticky-top"));i.default(e).each((function(e,n){var o=n.style.paddingRight,r=i.default(n).css("padding-right");i.default(n).data("padding-right",o).css("padding-right",parseFloat(r)+t._scrollbarWidth+"px")})),i.default(n).each((function(e,n){var o=n.style.marginRight,r=i.default(n).css("margin-right");i.default(n).data("margin-right",o).css("margin-right",parseFloat(r)-t._scrollbarWidth+"px")}));var o=document.body.style.paddingRight,r=i.default(document.body).css("padding-right");i.default(document.body).data("padding-right",o).css("padding-right",parseFloat(r)+this._scrollbarWidth+"px")}i.default(document.body).addClass(de)},e._resetScrollbar=function(){var t=[].slice.call(document.querySelectorAll(we));i.default(t).each((function(t,e){var n=i.default(e).data("padding-right");i.default(e).removeData("padding-right"),e.style.paddingRight=n||""}));var e=[].slice.call(document.querySelectorAll(".sticky-top"));i.default(e).each((function(t,e){var n=i.default(e).data("margin-right");"undefined"!=typeof n&&i.default(e).css("margin-right",n).removeData("margin-right")}));var n=i.default(document.body).data("padding-right");i.default(document.body).removeData("padding-right"),document.body.style.paddingRight=n||""},e._getScrollbarWidth=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},t._jQueryInterface=function(e,n){return this.each((function(){var o=i.default(this).data(ue),r=a({},Te,i.default(this).data(),"object"==typeof e&&e?e:{});if(o||(o=new t(this,r),i.default(this).data(ue,o)),"string"==typeof e){if("undefined"==typeof o[e])throw new TypeError('No method named "'+e+'"');o[e](n)}else r.show&&o.show(n)}))},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"Default",get:function(){return Te}}]),t}();i.default(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',(function(t){var e,n=this,o=u.getSelectorFromElement(this);o&&(e=document.querySelector(o));var r=i.default(e).data(ue)?"toggle":a({},i.default(e).data(),i.default(this).data());"A"!==this.tagName&&"AREA"!==this.tagName||t.preventDefault();var s=i.default(e).one(ge,(function(t){t.isDefaultPrevented()||s.one(me,(function(){i.default(n).is(":visible")&&n.focus()}))}));Se._jQueryInterface.call(i.default(e),r,this)})),i.default.fn.modal=Se._jQueryInterface,i.default.fn.modal.Constructor=Se,i.default.fn.modal.noConflict=function(){return i.default.fn.modal=fe,Se._jQueryInterface};var Ne=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],De=/^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i,Ae=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;function ke(t,e,n){if(0===t.length)return t;if(n&&"function"==typeof n)return n(t);for(var i=(new window.DOMParser).parseFromString(t,"text/html"),o=Object.keys(e),r=[].slice.call(i.body.querySelectorAll("*")),a=function(t,n){var i=r[t],a=i.nodeName.toLowerCase();if(-1===o.indexOf(i.nodeName.toLowerCase()))return i.parentNode.removeChild(i),"continue";var s=[].slice.call(i.attributes),l=[].concat(e["*"]||[],e[a]||[]);s.forEach((function(t){(function(t,e){var n=t.nodeName.toLowerCase();if(-1!==e.indexOf(n))return-1===Ne.indexOf(n)||Boolean(De.test(t.nodeValue)||Ae.test(t.nodeValue));for(var i=e.filter((function(t){return t instanceof RegExp})),o=0,r=i.length;o<r;o++)if(i[o].test(n))return!0;return!1})(t,l)||i.removeAttribute(t.nodeName)}))},s=0,l=r.length;s<l;s++)a(s);return i.body.innerHTML}var Ie="tooltip",Oe="bs.tooltip",xe=i.default.fn.tooltip,je=new RegExp("(^|\\s)bs-tooltip\\S+","g"),Le=["sanitize","whiteList","sanitizeFn"],Pe="fade",Fe="show",Re="show",Be="out",He="hover",Me="focus",qe={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},Qe={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent",customClass:"",sanitize:!0,sanitizeFn:null,whiteList:{"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},popperConfig:null},We={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string|function)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)",customClass:"(string|function)",sanitize:"boolean",sanitizeFn:"(null|function)",whiteList:"object",popperConfig:"(null|object)"},Ue={HIDE:"hide.bs.tooltip",HIDDEN:"hidden.bs.tooltip",SHOW:"show.bs.tooltip",SHOWN:"shown.bs.tooltip",INSERTED:"inserted.bs.tooltip",CLICK:"click.bs.tooltip",FOCUSIN:"focusin.bs.tooltip",FOCUSOUT:"focusout.bs.tooltip",MOUSEENTER:"mouseenter.bs.tooltip",MOUSELEAVE:"mouseleave.bs.tooltip"},Ve=function(){function t(t,e){if("undefined"==typeof Yt)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}var e=t.prototype;return e.enable=function(){this._isEnabled=!0},e.disable=function(){this._isEnabled=!1},e.toggleEnabled=function(){this._isEnabled=!this._isEnabled},e.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=i.default(t.currentTarget).data(e);n||(n=new this.constructor(t.currentTarget,this._getDelegateConfig()),i.default(t.currentTarget).data(e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n)}else{if(i.default(this.getTipElement()).hasClass(Fe))return void this._leave(null,this);this._enter(null,this)}},e.dispose=function(){clearTimeout(this._timeout),i.default.removeData(this.element,this.constructor.DATA_KEY),i.default(this.element).off(this.constructor.EVENT_KEY),i.default(this.element).closest(".modal").off("hide.bs.modal",this._hideModalHandler),this.tip&&i.default(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},e.show=function(){var t=this;if("none"===i.default(this.element).css("display"))throw new Error("Please use show on visible elements");var e=i.default.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){i.default(this.element).trigger(e);var n=u.findShadowRoot(this.element),o=i.default.contains(null!==n?n:this.element.ownerDocument.documentElement,this.element);if(e.isDefaultPrevented()||!o)return;var r=this.getTipElement(),a=u.getUID(this.constructor.NAME);r.setAttribute("id",a),this.element.setAttribute("aria-describedby",a),this.setContent(),this.config.animation&&i.default(r).addClass(Pe);var s="function"==typeof this.config.placement?this.config.placement.call(this,r,this.element):this.config.placement,l=this._getAttachment(s);this.addAttachmentClass(l);var f=this._getContainer();i.default(r).data(this.constructor.DATA_KEY,this),i.default.contains(this.element.ownerDocument.documentElement,this.tip)||i.default(r).appendTo(f),i.default(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new Yt(this.element,r,this._getPopperConfig(l)),i.default(r).addClass(Fe),i.default(r).addClass(this.config.customClass),"ontouchstart"in document.documentElement&&i.default(document.body).children().on("mouseover",null,i.default.noop);var d=function(){t.config.animation&&t._fixTransition();var e=t._hoverState;t._hoverState=null,i.default(t.element).trigger(t.constructor.Event.SHOWN),e===Be&&t._leave(null,t)};if(i.default(this.tip).hasClass(Pe)){var c=u.getTransitionDurationFromElement(this.tip);i.default(this.tip).one(u.TRANSITION_END,d).emulateTransitionEnd(c)}else d()}},e.hide=function(t){var e=this,n=this.getTipElement(),o=i.default.Event(this.constructor.Event.HIDE),r=function(){e._hoverState!==Re&&n.parentNode&&n.parentNode.removeChild(n),e._cleanTipClass(),e.element.removeAttribute("aria-describedby"),i.default(e.element).trigger(e.constructor.Event.HIDDEN),null!==e._popper&&e._popper.destroy(),t&&t()};if(i.default(this.element).trigger(o),!o.isDefaultPrevented()){if(i.default(n).removeClass(Fe),"ontouchstart"in document.documentElement&&i.default(document.body).children().off("mouseover",null,i.default.noop),this._activeTrigger.click=!1,this._activeTrigger.focus=!1,this._activeTrigger.hover=!1,i.default(this.tip).hasClass(Pe)){var a=u.getTransitionDurationFromElement(n);i.default(n).one(u.TRANSITION_END,r).emulateTransitionEnd(a)}else r();this._hoverState=""}},e.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},e.isWithContent=function(){return Boolean(this.getTitle())},e.addAttachmentClass=function(t){i.default(this.getTipElement()).addClass("bs-tooltip-"+t)},e.getTipElement=function(){return this.tip=this.tip||i.default(this.config.template)[0],this.tip},e.setContent=function(){var t=this.getTipElement();this.setElementContent(i.default(t.querySelectorAll(".tooltip-inner")),this.getTitle()),i.default(t).removeClass("fade show")},e.setElementContent=function(t,e){"object"!=typeof e||!e.nodeType&&!e.jquery?this.config.html?(this.config.sanitize&&(e=ke(e,this.config.whiteList,this.config.sanitizeFn)),t.html(e)):t.text(e):this.config.html?i.default(e).parent().is(t)||t.empty().append(e):t.text(i.default(e).text())},e.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},e._getPopperConfig=function(t){var e=this;return a({},{placement:t,modifiers:{offset:this._getOffset(),flip:{behavior:this.config.fallbackPlacement},arrow:{element:".arrow"},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){return e._handlePopperPlacementChange(t)}},this.config.popperConfig)},e._getOffset=function(){var t=this,e={};return"function"==typeof this.config.offset?e.fn=function(e){return e.offsets=a({},e.offsets,t.config.offset(e.offsets,t.element)),e}:e.offset=this.config.offset,e},e._getContainer=function(){return!1===this.config.container?document.body:u.isElement(this.config.container)?i.default(this.config.container):i.default(document).find(this.config.container)},e._getAttachment=function(t){return qe[t.toUpperCase()]},e._setListeners=function(){var t=this;this.config.trigger.split(" ").forEach((function(e){if("click"===e)i.default(t.element).on(t.constructor.Event.CLICK,t.config.selector,(function(e){return t.toggle(e)}));else if("manual"!==e){var n=e===He?t.constructor.Event.MOUSEENTER:t.constructor.Event.FOCUSIN,o=e===He?t.constructor.Event.MOUSELEAVE:t.constructor.Event.FOCUSOUT;i.default(t.element).on(n,t.config.selector,(function(e){return t._enter(e)})).on(o,t.config.selector,(function(e){return t._leave(e)}))}})),this._hideModalHandler=function(){t.element&&t.hide()},i.default(this.element).closest(".modal").on("hide.bs.modal",this._hideModalHandler),this.config.selector?this.config=a({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},e._fixTitle=function(){var t=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},e._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||i.default(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),i.default(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusin"===t.type?Me:He]=!0),i.default(e.getTipElement()).hasClass(Fe)||e._hoverState===Re?e._hoverState=Re:(clearTimeout(e._timeout),e._hoverState=Re,e.config.delay&&e.config.delay.show?e._timeout=setTimeout((function(){e._hoverState===Re&&e.show()}),e.config.delay.show):e.show())},e._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||i.default(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),i.default(t.currentTarget).data(n,e)),t&&(e._activeTrigger["focusout"===t.type?Me:He]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState=Be,e.config.delay&&e.config.delay.hide?e._timeout=setTimeout((function(){e._hoverState===Be&&e.hide()}),e.config.delay.hide):e.hide())},e._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},e._getConfig=function(t){var e=i.default(this.element).data();return Object.keys(e).forEach((function(t){-1!==Le.indexOf(t)&&delete e[t]})),"number"==typeof(t=a({},this.constructor.Default,e,"object"==typeof t&&t?t:{})).delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),u.typeCheckConfig(Ie,t,this.constructor.DefaultType),t.sanitize&&(t.template=ke(t.template,t.whiteList,t.sanitizeFn)),t},e._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},e._cleanTipClass=function(){var t=i.default(this.getTipElement()),e=t.attr("class").match(je);null!==e&&e.length&&t.removeClass(e.join(""))},e._handlePopperPlacementChange=function(t){this.tip=t.instance.popper,this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},e._fixTransition=function(){var t=this.getTipElement(),e=this.config.animation;null===t.getAttribute("x-placement")&&(i.default(t).removeClass(Pe),this.config.animation=!1,this.hide(),this.show(),this.config.animation=e)},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this),o=n.data(Oe),r="object"==typeof e&&e;if((o||!/dispose|hide/.test(e))&&(o||(o=new t(this,r),n.data(Oe,o)),"string"==typeof e)){if("undefined"==typeof o[e])throw new TypeError('No method named "'+e+'"');o[e]()}}))},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"Default",get:function(){return Qe}},{key:"NAME",get:function(){return Ie}},{key:"DATA_KEY",get:function(){return Oe}},{key:"Event",get:function(){return Ue}},{key:"EVENT_KEY",get:function(){return".bs.tooltip"}},{key:"DefaultType",get:function(){return We}}]),t}();i.default.fn.tooltip=Ve._jQueryInterface,i.default.fn.tooltip.Constructor=Ve,i.default.fn.tooltip.noConflict=function(){return i.default.fn.tooltip=xe,Ve._jQueryInterface};var Ye="bs.popover",ze=i.default.fn.popover,Ke=new RegExp("(^|\\s)bs-popover\\S+","g"),Xe=a({},Ve.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),Ge=a({},Ve.DefaultType,{content:"(string|element|function)"}),$e={HIDE:"hide.bs.popover",HIDDEN:"hidden.bs.popover",SHOW:"show.bs.popover",SHOWN:"shown.bs.popover",INSERTED:"inserted.bs.popover",CLICK:"click.bs.popover",FOCUSIN:"focusin.bs.popover",FOCUSOUT:"focusout.bs.popover",MOUSEENTER:"mouseenter.bs.popover",MOUSELEAVE:"mouseleave.bs.popover"},Je=function(t){var e,n;function o(){return t.apply(this,arguments)||this}n=t,(e=o).prototype=Object.create(n.prototype),e.prototype.constructor=e,s(e,n);var a=o.prototype;return a.isWithContent=function(){return this.getTitle()||this._getContent()},a.addAttachmentClass=function(t){i.default(this.getTipElement()).addClass("bs-popover-"+t)},a.getTipElement=function(){return this.tip=this.tip||i.default(this.config.template)[0],this.tip},a.setContent=function(){var t=i.default(this.getTipElement());this.setElementContent(t.find(".popover-header"),this.getTitle());var e=this._getContent();"function"==typeof e&&(e=e.call(this.element)),this.setElementContent(t.find(".popover-body"),e),t.removeClass("fade show")},a._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},a._cleanTipClass=function(){var t=i.default(this.getTipElement()),e=t.attr("class").match(Ke);null!==e&&e.length>0&&t.removeClass(e.join(""))},o._jQueryInterface=function(t){return this.each((function(){var e=i.default(this).data(Ye),n="object"==typeof t?t:null;if((e||!/dispose|hide/.test(t))&&(e||(e=new o(this,n),i.default(this).data(Ye,e)),"string"==typeof t)){if("undefined"==typeof e[t])throw new TypeError('No method named "'+t+'"');e[t]()}}))},r(o,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"Default",get:function(){return Xe}},{key:"NAME",get:function(){return"popover"}},{key:"DATA_KEY",get:function(){return Ye}},{key:"Event",get:function(){return $e}},{key:"EVENT_KEY",get:function(){return".bs.popover"}},{key:"DefaultType",get:function(){return Ge}}]),o}(Ve);i.default.fn.popover=Je._jQueryInterface,i.default.fn.popover.Constructor=Je,i.default.fn.popover.noConflict=function(){return i.default.fn.popover=ze,Je._jQueryInterface};var Ze="scrollspy",tn="bs.scrollspy",en=i.default.fn[Ze],nn="active",on="position",rn=".nav, .list-group",an={offset:10,method:"auto",target:""},sn={offset:"number",method:"string",target:"(string|element)"},ln=function(){function t(t,e){var n=this;this._element=t,this._scrollElement="BODY"===t.tagName?window:t,this._config=this._getConfig(e),this._selector=this._config.target+" .nav-link,"+this._config.target+" .list-group-item,"+this._config.target+" .dropdown-item",this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,i.default(this._scrollElement).on("scroll.bs.scrollspy",(function(t){return n._process(t)})),this.refresh(),this._process()}var e=t.prototype;return e.refresh=function(){var t=this,e=this._scrollElement===this._scrollElement.window?"offset":on,n="auto"===this._config.method?e:this._config.method,o=n===on?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),[].slice.call(document.querySelectorAll(this._selector)).map((function(t){var e,r=u.getSelectorFromElement(t);if(r&&(e=document.querySelector(r)),e){var a=e.getBoundingClientRect();if(a.width||a.height)return[i.default(e)[n]().top+o,r]}return null})).filter(Boolean).sort((function(t,e){return t[0]-e[0]})).forEach((function(e){t._offsets.push(e[0]),t._targets.push(e[1])}))},e.dispose=function(){i.default.removeData(this._element,tn),i.default(this._scrollElement).off(".bs.scrollspy"),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},e._getConfig=function(t){if("string"!=typeof(t=a({},an,"object"==typeof t&&t?t:{})).target&&u.isElement(t.target)){var e=i.default(t.target).attr("id");e||(e=u.getUID(Ze),i.default(t.target).attr("id",e)),t.target="#"+e}return u.typeCheckConfig(Ze,t,sn),t},e._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},e._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},e._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},e._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;)this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&("undefined"==typeof this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o])}},e._activate=function(t){this._activeTarget=t,this._clear();var e=this._selector.split(",").map((function(e){return e+'[data-target="'+t+'"],'+e+'[href="'+t+'"]'})),n=i.default([].slice.call(document.querySelectorAll(e.join(","))));n.hasClass("dropdown-item")?(n.closest(".dropdown").find(".dropdown-toggle").addClass(nn),n.addClass(nn)):(n.addClass(nn),n.parents(rn).prev(".nav-link, .list-group-item").addClass(nn),n.parents(rn).prev(".nav-item").children(".nav-link").addClass(nn)),i.default(this._scrollElement).trigger("activate.bs.scrollspy",{relatedTarget:t})},e._clear=function(){[].slice.call(document.querySelectorAll(this._selector)).filter((function(t){return t.classList.contains(nn)})).forEach((function(t){return t.classList.remove(nn)}))},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this).data(tn);if(n||(n=new t(this,"object"==typeof e&&e),i.default(this).data(tn,n)),"string"==typeof e){if("undefined"==typeof n[e])throw new TypeError('No method named "'+e+'"');n[e]()}}))},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"Default",get:function(){return an}}]),t}();i.default(window).on("load.bs.scrollspy.data-api",(function(){for(var t=[].slice.call(document.querySelectorAll('[data-spy="scroll"]')),e=t.length;e--;){var n=i.default(t[e]);ln._jQueryInterface.call(n,n.data())}})),i.default.fn[Ze]=ln._jQueryInterface,i.default.fn[Ze].Constructor=ln,i.default.fn[Ze].noConflict=function(){return i.default.fn[Ze]=en,ln._jQueryInterface};var un="bs.tab",fn=i.default.fn.tab,dn="active",cn="fade",hn="show",pn=".active",mn="> li > .active",gn=function(){function t(t){this._element=t}var e=t.prototype;return e.show=function(){var t=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&i.default(this._element).hasClass(dn)||i.default(this._element).hasClass("disabled")||this._element.hasAttribute("disabled"))){var e,n,o=i.default(this._element).closest(".nav, .list-group")[0],r=u.getSelectorFromElement(this._element);if(o){var a="UL"===o.nodeName||"OL"===o.nodeName?mn:pn;n=(n=i.default.makeArray(i.default(o).find(a)))[n.length-1]}var s=i.default.Event("hide.bs.tab",{relatedTarget:this._element}),l=i.default.Event("show.bs.tab",{relatedTarget:n});if(n&&i.default(n).trigger(s),i.default(this._element).trigger(l),!l.isDefaultPrevented()&&!s.isDefaultPrevented()){r&&(e=document.querySelector(r)),this._activate(this._element,o);var f=function(){var e=i.default.Event("hidden.bs.tab",{relatedTarget:t._element}),o=i.default.Event("shown.bs.tab",{relatedTarget:n});i.default(n).trigger(e),i.default(t._element).trigger(o)};e?this._activate(e,e.parentNode,f):f()}}},e.dispose=function(){i.default.removeData(this._element,un),this._element=null},e._activate=function(t,e,n){var o=this,r=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?i.default(e).children(pn):i.default(e).find(mn))[0],a=n&&r&&i.default(r).hasClass(cn),s=function(){return o._transitionComplete(t,r,n)};if(r&&a){var l=u.getTransitionDurationFromElement(r);i.default(r).removeClass(hn).one(u.TRANSITION_END,s).emulateTransitionEnd(l)}else s()},e._transitionComplete=function(t,e,n){if(e){i.default(e).removeClass(dn);var o=i.default(e.parentNode).find("> .dropdown-menu .active")[0];o&&i.default(o).removeClass(dn),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1)}i.default(t).addClass(dn),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),u.reflow(t),t.classList.contains(cn)&&t.classList.add(hn);var r=t.parentNode;if(r&&"LI"===r.nodeName&&(r=r.parentNode),r&&i.default(r).hasClass("dropdown-menu")){var a=i.default(t).closest(".dropdown")[0];if(a){var s=[].slice.call(a.querySelectorAll(".dropdown-toggle"));i.default(s).addClass(dn)}t.setAttribute("aria-expanded",!0)}n&&n()},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this),o=n.data(un);if(o||(o=new t(this),n.data(un,o)),"string"==typeof e){if("undefined"==typeof o[e])throw new TypeError('No method named "'+e+'"');o[e]()}}))},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}}]),t}();i.default(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',(function(t){t.preventDefault(),gn._jQueryInterface.call(i.default(this),"show")})),i.default.fn.tab=gn._jQueryInterface,i.default.fn.tab.Constructor=gn,i.default.fn.tab.noConflict=function(){return i.default.fn.tab=fn,gn._jQueryInterface};var _n="bs.toast",vn=i.default.fn.toast,bn="hide",yn="show",En="showing",wn="click.dismiss.bs.toast",Tn={animation:!0,autohide:!0,delay:500},Cn={animation:"boolean",autohide:"boolean",delay:"number"},Sn=function(){function t(t,e){this._element=t,this._config=this._getConfig(e),this._timeout=null,this._setListeners()}var e=t.prototype;return e.show=function(){var t=this,e=i.default.Event("show.bs.toast");if(i.default(this._element).trigger(e),!e.isDefaultPrevented()){this._clearTimeout(),this._config.animation&&this._element.classList.add("fade");var n=function(){t._element.classList.remove(En),t._element.classList.add(yn),i.default(t._element).trigger("shown.bs.toast"),t._config.autohide&&(t._timeout=setTimeout((function(){t.hide()}),t._config.delay))};if(this._element.classList.remove(bn),u.reflow(this._element),this._element.classList.add(En),this._config.animation){var o=u.getTransitionDurationFromElement(this._element);i.default(this._element).one(u.TRANSITION_END,n).emulateTransitionEnd(o)}else n()}},e.hide=function(){if(this._element.classList.contains(yn)){var t=i.default.Event("hide.bs.toast");i.default(this._element).trigger(t),t.isDefaultPrevented()||this._close()}},e.dispose=function(){this._clearTimeout(),this._element.classList.contains(yn)&&this._element.classList.remove(yn),i.default(this._element).off(wn),i.default.removeData(this._element,_n),this._element=null,this._config=null},e._getConfig=function(t){return t=a({},Tn,i.default(this._element).data(),"object"==typeof t&&t?t:{}),u.typeCheckConfig("toast",t,this.constructor.DefaultType),t},e._setListeners=function(){var t=this;i.default(this._element).on(wn,'[data-dismiss="toast"]',(function(){return t.hide()}))},e._close=function(){var t=this,e=function(){t._element.classList.add(bn),i.default(t._element).trigger("hidden.bs.toast")};if(this._element.classList.remove(yn),this._config.animation){var n=u.getTransitionDurationFromElement(this._element);i.default(this._element).one(u.TRANSITION_END,e).emulateTransitionEnd(n)}else e()},e._clearTimeout=function(){clearTimeout(this._timeout),this._timeout=null},t._jQueryInterface=function(e){return this.each((function(){var n=i.default(this),o=n.data(_n);if(o||(o=new t(this,"object"==typeof e&&e),n.data(_n,o)),"string"==typeof e){if("undefined"==typeof o[e])throw new TypeError('No method named "'+e+'"');o[e](this)}}))},r(t,null,[{key:"VERSION",get:function(){return"4.6.2"}},{key:"DefaultType",get:function(){return Cn}},{key:"Default",get:function(){return Tn}}]),t}();i.default.fn.toast=Sn._jQueryInterface,i.default.fn.toast.Constructor=Sn,i.default.fn.toast.noConflict=function(){return i.default.fn.toast=vn,Sn._jQueryInterface},t.Alert=c,t.Button=b,t.Carousel=O,t.Collapse=W,t.Dropdown=le,t.Modal=Se,t.Popover=Je,t.Scrollspy=ln,t.Tab=gn,t.Toast=Sn,t.Tooltip=Ve,t.Util=u,Object.defineProperty(t,"__esModule",{value:!0})}));
