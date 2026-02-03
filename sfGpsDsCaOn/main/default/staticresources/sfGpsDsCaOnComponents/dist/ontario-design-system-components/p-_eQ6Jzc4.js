function e(e) {
	const r = typeof e !== 'string' || e === '';
	return r;
}
function r(e) {
	const r = typeof e !== 'object';
	return r;
}
function n(e, r) {
	return r.includes(e);
}
function t(e) {
	if (e) {
		const r = typeof e !== 'string' ? e.detail : e;
		if (r && (r === 'en' || r === 'fr')) return r;
		else return 'en';
	}
	return 'en';
}
const a = ['black', 'blue', 'grey', 'white', 'inherit'];
function l(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e['default'] : e;
}
var u;
var i;
function o() {
	if (i) return u;
	i = 1;
	u = (function (e) {
		var r = {};
		function n(t) {
			if (r[t]) return r[t].exports;
			var a = (r[t] = { i: t, l: false, exports: {} });
			return e[t].call(a.exports, a, a.exports, n), (a.l = true), a.exports;
		}
		return (
			(n.m = e),
			(n.c = r),
			(n.d = function (e, r, t) {
				n.o(e, r) || Object.defineProperty(e, r, { enumerable: true, get: t });
			}),
			(n.r = function (e) {
				'undefined' != typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
					Object.defineProperty(e, '__esModule', { value: true });
			}),
			(n.t = function (e, r) {
				if ((1 & r && (e = n(e)), 8 & r)) return e;
				if (4 & r && 'object' == typeof e && e && e.__esModule) return e;
				var t = Object.create(null);
				if (
					(n.r(t), Object.defineProperty(t, 'default', { enumerable: true, value: e }), 2 & r && 'string' != typeof e)
				)
					for (var a in e)
						n.d(
							t,
							a,
							function (r) {
								return e[r];
							}.bind(null, a),
						);
				return t;
			}),
			(n.n = function (e) {
				var r =
					e && e.__esModule
						? function () {
								return e.default;
							}
						: function () {
								return e;
							};
				return n.d(r, 'a', r), r;
			}),
			(n.o = function (e, r) {
				return Object.prototype.hasOwnProperty.call(e, r);
			}),
			(n.p = ''),
			n((n.s = 0))
		);
	})([
		function (e, r, n) {
			n.r(r),
				n.d(r, 'validateHTMLColorName', function () {
					return u;
				}),
				n.d(r, 'validateHTMLColorSpecialName', function () {
					return i;
				}),
				n.d(r, 'validateHTMLColorHex', function () {
					return o;
				}),
				n.d(r, 'validateHTMLColorRgb', function () {
					return g;
				}),
				n.d(r, 'validateHTMLColorHsl', function () {
					return y;
				}),
				n.d(r, 'validateHTMLColorHwb', function () {
					return G;
				}),
				n.d(r, 'validateHTMLColorLab', function () {
					return S;
				}),
				n.d(r, 'validateHTMLColorLch', function () {
					return L;
				}),
				n.d(r, 'validateHTMLColor', function () {
					return m;
				});
			const t = (e) => e && 'string' == typeof e,
				a = [
					'AliceBlue',
					'AntiqueWhite',
					'Aqua',
					'Aquamarine',
					'Azure',
					'Beige',
					'Bisque',
					'Black',
					'BlanchedAlmond',
					'Blue',
					'BlueViolet',
					'Brown',
					'BurlyWood',
					'CadetBlue',
					'Chartreuse',
					'Chocolate',
					'Coral',
					'CornflowerBlue',
					'Cornsilk',
					'Crimson',
					'Cyan',
					'DarkBlue',
					'DarkCyan',
					'DarkGoldenrod',
					'DarkGray',
					'DarkGrey',
					'DarkGreen',
					'DarkKhaki',
					'DarkMagenta',
					'DarkOliveGreen',
					'DarkOrange',
					'DarkOrchid',
					'DarkRed',
					'DarkSalmon',
					'DarkSeaGreen',
					'DarkSlateBlue',
					'DarkSlateGray',
					'DarkSlateGrey',
					'DarkTurquoise',
					'DarkViolet',
					'DeepPink',
					'DeepSkyBlue',
					'DimGray',
					'DimGrey',
					'DodgerBlue',
					'FireBrick',
					'FloralWhite',
					'ForestGreen',
					'Fuchsia',
					'Gainsboro',
					'GhostWhite',
					'Gold',
					'Goldenrod',
					'Gray',
					'Grey',
					'Green',
					'GreenYellow',
					'HoneyDew',
					'HotPink',
					'IndianRed',
					'Indigo',
					'Ivory',
					'Khaki',
					'Lavender',
					'LavenderBlush',
					'LawnGreen',
					'LemonChiffon',
					'LightBlue',
					'LightCoral',
					'LightCyan',
					'LightGoldenrodYellow',
					'LightGray',
					'LightGrey',
					'LightGreen',
					'LightPink',
					'LightSalmon',
					'LightSalmon',
					'LightSeaGreen',
					'LightSkyBlue',
					'LightSlateGray',
					'LightSlateGrey',
					'LightSteelBlue',
					'LightYellow',
					'Lime',
					'LimeGreen',
					'Linen',
					'Magenta',
					'Maroon',
					'MediumAquamarine',
					'MediumBlue',
					'MediumOrchid',
					'MediumPurple',
					'MediumSeaGreen',
					'MediumSlateBlue',
					'MediumSlateBlue',
					'MediumSpringGreen',
					'MediumTurquoise',
					'MediumVioletRed',
					'MidnightBlue',
					'MintCream',
					'MistyRose',
					'Moccasin',
					'NavajoWhite',
					'Navy',
					'OldLace',
					'Olive',
					'OliveDrab',
					'Orange',
					'OrangeRed',
					'Orchid',
					'PaleGoldenrod',
					'PaleGreen',
					'PaleTurquoise',
					'PaleVioletRed',
					'PapayaWhip',
					'PeachPuff',
					'Peru',
					'Pink',
					'Plum',
					'PowderBlue',
					'Purple',
					'RebeccaPurple',
					'Red',
					'RosyBrown',
					'RoyalBlue',
					'SaddleBrown',
					'Salmon',
					'SandyBrown',
					'SeaGreen',
					'SeaShell',
					'Sienna',
					'Silver',
					'SkyBlue',
					'SlateBlue',
					'SlateGray',
					'SlateGrey',
					'Snow',
					'SpringGreen',
					'SteelBlue',
					'Tan',
					'Teal',
					'Thistle',
					'Tomato',
					'Turquoise',
					'Violet',
					'Wheat',
					'White',
					'WhiteSmoke',
					'Yellow',
					'YellowGreen',
				],
				l = ['currentColor', 'inherit', 'transparent'],
				u = (e) => {
					let r = false;
					return t(e) && a.map((n) => (e.toLowerCase() === n.toLowerCase() && (r = true), null)), r;
				},
				i = (e) => {
					let r = false;
					return t(e) && l.map((n) => (e.toLowerCase() === n.toLowerCase() && (r = true), null)), r;
				},
				o = (e) => {
					if (t(e)) {
						const r = /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i;
						return e && r.test(e);
					}
					return false;
				},
				s = '(([\\d]{0,5})((\\.([\\d]{1,5}))?))',
				d = `(${s}%)`,
				c = '(([0-9]|[1-9][0-9]|100)%)',
				f = `(${c}|(0?((\\.([\\d]{1,5}))?))|1)`,
				h = `([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?)([\\s]{1,5})${`(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?`}([\\s]{0,5})\\)`,
				$ = '(-?(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360)(deg)?)',
				g = (e) => {
					if (t(e)) {
						const r = '([\\s]{0,5})([\\d]{1,5})%?([\\s]{0,5}),?',
							n = '((([\\s]{0,5}),?([\\s]{0,5}))|(([\\s]{1,5})))',
							t = new RegExp(
								`^(rgb)a?\\(${`${r}${n}`}${`${r}${n}`}${`${r}${n}`}(${'(\\/?([\\s]{0,5})(0?\\.?([\\d]{1,5})%?([\\s]{0,5}))?|1|0)'})?\\)$`,
							);
						return e && t.test(e);
					}
					return false;
				},
				y = (e) => {
					if (t(e)) {
						const r = new RegExp(
							`^(hsl)a?\\((([\\s]{0,5})(${$}|${'(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-9][0-9]|400)grad)'}|${'((([0-5])?\\.([\\d]{1,5})|6\\.([0-9]|1[0-9]|2[0-8])|[0-6])rad)'}|${'((0?((\\.([\\d]{1,5}))?)|1)turn)'})((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?|,?)([\\s]{0,5})(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?\\)$`,
						);
						return e && r.test(e);
					}
					return false;
				},
				G = (e) => {
					if (t(e)) {
						const r = new RegExp(`^(hwb\\(([\\s]{0,5})${$}([\\s]{1,5}))((0|${c})([\\s]{1,5}))((0|${c})${h}$`);
						return e && r.test(e);
					}
					return false;
				},
				S = (e) => {
					if (t(e)) {
						const r = '(-?(([0-9]|[1-9][0-9]|1[0-5][0-9])((\\.([\\d]{1,5}))?)?|160))',
							n = new RegExp(`^(lab\\(([\\s]{0,5})${d}([\\s]{1,5})${r}([\\s]{1,5})${r}${h}$`);
						return e && n.test(e);
					}
					return false;
				},
				L = (e) => {
					if (t(e)) {
						const r = '((([0-9]|[1-9][0-9])?((\\.([\\d]{1,5}))?)|100)(%)?)',
							n = '' + s,
							t = `((${$})|(0|${f})|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360))`,
							a = `(\\/([\\s]{0,5})${f})`,
							l = new RegExp(`^lch\\(${`(([\\s]{0,5})${r}([\\s]{1,5})${n}([\\s]{1,5})${t}([\\s]{0,5})(${a})?)`}\\)$`);
						return e && l.test(e);
					}
					return false;
				},
				m = (e) => !!((e && o(e)) || g(e) || y(e) || G(e) || S(e) || L(e));
			r.default = (e) => !!((e && o(e)) || u(e) || i(e) || g(e) || y(e) || G(e) || S(e) || L(e));
		},
	]);
	return u;
}
var s = o();
var d = l(s);
export { a as I, d as a, t as b, e as c, r as d, n as v };
//# sourceMappingURL=p-_eQ6Jzc4.js.map
