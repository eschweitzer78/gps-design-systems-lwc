import { r as t, h as o } from './p-Cc98g_3o.js';
import { v as i, a as s, I as a } from './p-_eQ6Jzc4.js';
import { C as e } from './p-CJXRCL8b.js';
const r =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const l = class {
	constructor(o) {
		t(this, o);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const t = new e();
			t.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-twitter-alt> ')
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
		const t = i(this.colour, a);
		if (t) {
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
		const t = new e();
		t.addDesignSystemTag()
			.addMonospaceText(' colour ')
			.addRegularText('on')
			.addMonospaceText(' <ontario-icon-twitter-alt> ')
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
		return o(
			'div',
			{
				key: '7072860b7f161bc3fa148ac9619ba029a9d517bc',
				class: `ontario-icon ontario-icon--${this.iconColourState} ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			o(
				'svg',
				{
					key: 'e6975e0a1b7b2a263f1978ca074b00526485f008',
					class: 'svg-icon',
					style: { fill: `${this.iconCustomColourState}`, stroke: `${this.iconCustomColourState}` },
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'twitter-alt',
				},
				o('path', {
					key: '0e82a4cb5a1e7cd3dbaa0e4eb905248dffd968a0',
					d: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm12.7 6.33c.48-.4 1.04-.88 1.3-1.4-.4.2-.9.34-1.44.4.5-.36.9-.83 1.12-1.47-.52.28-1.05.52-1.7.64-1.55-1.87-5.26-.35-4.6 2.45-2.6-.16-4.2-1.34-5.52-2.8-.75 1.22-.1 3.07.8 3.58-.46-.03-.8-.17-1.14-.33.04 1.54.9 2.28 2.08 2.68-.36.07-.76.1-1.14.03C7.8 14.2 8.58 14.86 9.9 15c-.9.76-2.56 1.3-3.9 1.08 1.15.73 2.46 1.3 4.28 1.23 4.4-.2 7.36-3.36 7.43-7.98z',
				}),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'], colour: ['validateColour'] };
	}
};
l.style = r;
export { l as ontario_icon_twitter_alt };
//# sourceMappingURL=p-d131b3d0.entry.js.map
