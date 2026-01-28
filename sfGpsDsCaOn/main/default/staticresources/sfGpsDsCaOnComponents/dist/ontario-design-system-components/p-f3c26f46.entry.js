import { r as o, h as i } from './p-Cc98g_3o.js';
import { v as t, a as s, I as e } from './p-_eQ6Jzc4.js';
import { C as a } from './p-CJXRCL8b.js';
const r =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const l = class {
	constructor(i) {
		o(this, i);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const o = new a();
			o.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-timer> ')
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
		const o = t(this.colour, e);
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
		const o = new a();
		o.addDesignSystemTag()
			.addMonospaceText(' colour ')
			.addRegularText('on')
			.addMonospaceText(' <ontario-icon-timer> ')
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
		return i(
			'div',
			{
				key: '94c2aa5e551ad4ad600c2cb87a5cb3a20cfe816d',
				class: `ontario-icon ontario-icon--${this.iconColourState} ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			i(
				'svg',
				{
					key: 'c782fd978f1e2e44c84f8c1a0226a57e794372ba',
					class: 'svg-icon',
					style: { fill: `${this.iconCustomColourState}`, stroke: `${this.iconCustomColourState}` },
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'timer',
				},
				i('path', {
					key: '374ca0c61d8f5c5a6c16dab7d95e6fa9621405e1',
					d: 'M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.6l1.42-1.42c-.43-.5-.9-1-1.4-1.4l-1.42 1.42A8.96 8.96 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.6zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z',
				}),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'], colour: ['validateColour'] };
	}
};
l.style = r;
export { l as ontario_icon_timer };
//# sourceMappingURL=p-f3c26f46.entry.js.map
