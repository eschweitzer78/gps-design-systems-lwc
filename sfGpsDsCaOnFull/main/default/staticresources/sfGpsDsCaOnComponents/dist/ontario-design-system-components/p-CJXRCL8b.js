var s;
(function (s) {
	s['Error'] = 'error';
	s['Info'] = 'info';
	s['Log'] = 'log';
	s['Warning'] = 'warning';
})(s || (s = {}));
var n;
(function (s) {
	s['Regular'] = 'regular';
	s['Code'] = 'code';
})(n || (n = {}));
const t = 'Ontario Design System';
const e = '12px';
const o = [
	'background-color: #367A76',
	'border: none',
	'color: white',
	'padding: 2px 5px',
	'text-align: center',
	'text-decoration: none',
	'display: inline-block',
	'cursor: pointer',
	'border-radius: 5px',
].join(';');
const r = ['font-family: sans-serif', `font-size: ${e}`].join(';');
const i = ['font-family: monospace', `font-size: ${e}`].join(';');
function a(s) {
	const n = '%c';
	return n.concat(s);
}
class c {
	message;
	styles;
	constructor() {
		this.message = '';
		this.styles = [];
	}
	addDesignSystemTag() {
		this.message = a(t);
		this.styles.push(o);
		return this;
	}
	addRegularText(s) {
		this.addText(s, r);
		return this;
	}
	addMonospaceText(s) {
		this.addText(s, i);
		return this;
	}
	printMessage(n = s.Warning) {
		const t = [this.message, ...this.styles];
		switch (n) {
			case s.Error:
				console.error.apply(null, t);
				break;
			case s.Info:
				console.info.apply(null, t);
				break;
			case s.Warning:
				console.warn.apply(null, t);
				break;
			default:
				console.log.apply(null, t);
		}
	}
	addText(s, n) {
		if (s && s?.trim().length > 0) {
			this.message += a(s);
			this.styles.push(n);
		}
	}
}
export { c as C, s as a };
//# sourceMappingURL=p-CJXRCL8b.js.map
