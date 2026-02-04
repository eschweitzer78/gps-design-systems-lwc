import { r as o, h as i } from './p-Cc98g_3o.js';
import { v as t, a as s, I as e } from './p-_eQ6Jzc4.js';
import { C as l } from './p-CJXRCL8b.js';
const a =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const c = class {
	constructor(i) {
		o(this, i);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const o = new l();
			o.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-settings> ')
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
		const o = new l();
		o.addDesignSystemTag()
			.addMonospaceText(' colour ')
			.addRegularText('on')
			.addMonospaceText(' <ontario-icon-settings> ')
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
				key: '96f3b089b6b9dd3d125135fb9c8bd72b697688c4',
				class: `ontario-icon ontario-icon--${this.iconColourState} ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			i(
				'svg',
				{
					key: '7b61221c1881300ef8d14c3ccf124f8ed049fe2a',
					class: 'svg-icon',
					style: { fill: `${this.iconCustomColourState}`, stroke: `${this.iconCustomColourState}` },
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'settings',
				},
				i('path', {
					key: '47ac8ae75c2936567067d8ad4dfa86e83de6f8c7',
					d: 'M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5zm7.43-2.53a7.77 7.77 0 0 0 .07-.97 8.55 8.55 0 0 0-.07-1l2.1-1.63c.2-.15.24-.42.12-.64l-2-3.46a.49.49 0 0 0-.61-.22l-2.5 1c-.52-.4-1.06-.73-1.7-.98l-.37-2.65c-.04-.24-.25-.42-.5-.42h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.6-1.7.98l-2.5-1a.49.49 0 0 0-.61.22l-2 3.46c-.13.22-.07.5.12.64L4.57 11l-.07 1a7.77 7.77 0 0 0 .07.97l-2.1 1.66c-.2.15-.25.42-.12.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.06.74 1.7 1l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65a7.28 7.28 0 0 0 1.69-.99l2.5 1c.22.08.5 0 .6-.22l2-3.46c.12-.22.07-.5-.12-.64l-2.1-1.66z',
				}),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'], colour: ['validateColour'] };
	}
};
c.style = a;
export { c as ontario_icon_settings };
//# sourceMappingURL=p-5447e1f9.entry.js.map
