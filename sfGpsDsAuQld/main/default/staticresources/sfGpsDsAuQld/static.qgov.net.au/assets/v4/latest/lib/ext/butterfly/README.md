butterfly
=========

"Float like a butterfly"
	Muhammad Ali (a not-so-lightboxer).

jquery.butterfly is a fairly light-weight and fully accessible lightbox implementation for jQuery.

@version 0.91

Changelog
---------
* 0.1: Initial implementation.
* 0.2: Support for window resizing added.
* 0.3: Support added for callback functions (open/close/resize pre and post events). Error handling added for when lightbox target resource doesn't exist.
* 0.4: Accessibility features added (controlling focus for user initiated lightboxes, keyboard support) - as per: http://irama.org/web/dhtml/lightbox/#accessibility
* 0.5: Bug fixes for webkit. Blocked IE6 (no LB for them). Basic caption support (thanks to Ray Latchmanan). Gallery support.
* 0.6: ARIA style keyboard support for navigating through galleries. Keyboard access now trapped in lightbox while lightbox is open. Support for preloading next image in galleries.
* 0.7: Captions can be configured to come from link title attribute, link text (including any img alt text within), or not be displayed at all.
* 0.8: Added ability to load pages in an iFrame (kicks in automatically for external-domain URLs).
* 0.9: Support restored for IE6 (all thanks to the perseverance of github.com/bboyle - he has more patience than I). Added support for back button (through jquery.history.js)
* 0.91: Renamed class `.caption` to `.jb-caption` to reduce risk of conflicts

License
-------

GNU GENERAL PUBLIC LICENSE (GPL) <http://www.gnu.org/licenses/gpl.html>


Examples
--------

See [http://irama.org/web/dhtml/butterfly/](http://irama.org/web/dhtml/butterfly/)