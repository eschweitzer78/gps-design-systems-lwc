import { r as o, h as t } from './p-Cc98g_3o.js';
import { v as i, a as s, I as a } from './p-_eQ6Jzc4.js';
import { C as r } from './p-CJXRCL8b.js';
const e =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const c = class {
	constructor(t) {
		o(this, t);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const o = new r();
			o.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-transport-car> ')
				.addRegularText(
					`${isNaN(this.iconWidth) ? 'was set to a non-numeric value' : 'was set to a negative number'}; only a positive number is allowed. The default size of`,
				)
				.addMonospaceText(' 24px ')
				.addRegularText('was assumed.')
				.printMessage();
			this.iconWidthState = 24;
		} else {
			this.iconWidthState = this.iconWidth;
		}
	}
	colour = 'black';
	iconColourState;
	iconCustomColourState;
	validateColour() {
		const o = i(this.colour, a);
		if (o) {
			this.iconColourState = this.colour;
		} else {
			if (s(this.colour)) {
				this.iconCustomColourState = this.colour;
			} else {
				this.iconColourState = this.warnDefaultColour();
			}
		}
	}
	warnDefaultColour() {
		const o = new r();
		o.addDesignSystemTag()
			.addMonospaceText(' colour ')
			.addRegularText('on')
			.addMonospaceText(' <ontario-icon-transport-car> ')
			.addRegularText('was set to an invalid colour; only')
			.addMonospaceText(' black, blue, grey or white ')
			.addRegularText('are supported. The default colour')
			.addMonospaceText(' black ')
			.addRegularText('is assumed.')
			.printMessage();
		return 'black';
	}
	componentWillLoad() {
		this.validateColour();
		this.validateWidth();
	}
	render() {
		return t(
			'div',
			{
				key: '8c3f8a6519495cf8d9b2747f26fa4aedc62f74dc',
				class: `ontario-icon ontario-icon--${this.iconColourState} ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			t(
				'svg',
				{
					key: 'cf8ad362514cf669f2cf77af76db7f1fc5982425',
					class: 'svg-icon',
					style: { fill: `${this.iconCustomColourState}`, stroke: `${this.iconCustomColourState}` },
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'transport-car',
				},
				t('path', {
					key: '01c26f5bb45a032b51faaa3a26c6d47b87a6ccaf',
					d: 'M18.92 6c-.2-.6-.76-1-1.42-1h-11c-.66 0-1.2.42-1.42 1L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-6zM6.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 1 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 1 1 0 3zM5 11l1.5-4.5h11L19 11H5z',
				}),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'], colour: ['validateColour'] };
	}
};
c.style = e;
export { c as ontario_icon_transport_car };
//# sourceMappingURL=p-bd9e45d7.entry.js.map
