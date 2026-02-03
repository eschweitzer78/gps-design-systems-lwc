import { r as o, h as t } from './p-Cc98g_3o.js';
import { v as i, a as s, I as a } from './p-_eQ6Jzc4.js';
import { C as e } from './p-CJXRCL8b.js';
const r =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const l = class {
	constructor(t) {
		o(this, t);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const o = new e();
			o.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-transport-walk> ')
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
		const o = new e();
		o.addDesignSystemTag()
			.addMonospaceText(' colour ')
			.addRegularText('on')
			.addMonospaceText(' <ontario-icon-transport-walk> ')
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
				key: '8239b6c01f0e61a40a97fcbaf277195284530569',
				class: `ontario-icon ontario-icon--${this.iconColourState} ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			t(
				'svg',
				{
					key: '278bad7bdb09e9e81c2ab5c171907083d3bf6e76',
					class: 'svg-icon',
					style: { fill: `${this.iconCustomColourState}`, stroke: `${this.iconCustomColourState}` },
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'transport-walk',
				},
				t('path', {
					key: '2738ae1fe7baf1f98fdad139dd0d8941a617c8c3',
					d: 'M13.326 5.407a1.96 1.96 0 0 0 1.954-1.953A1.96 1.96 0 0 0 13.326 1.5a1.96 1.96 0 0 0-1.953 1.953 1.96 1.96 0 0 0 1.954 1.953zm-3.614 3.32L6.977 22.5h2.05l1.758-7.814 2.05 1.954v5.86h1.954v-7.326l-2.05-1.953.586-2.93c1.27 1.465 3.026 2.442 5.174 2.442V10.78c-1.856 0-3.22-.977-4.002-2.344l-.977-1.563c-.39-.586-.977-.977-1.66-.977-.193 0-.56.005-.78.098L6 8.142v4.59h1.953v-3.32l1.758-.684z',
				}),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'], colour: ['validateColour'] };
	}
};
l.style = r;
export { l as ontario_icon_transport_walk };
//# sourceMappingURL=p-dd22c335.entry.js.map
