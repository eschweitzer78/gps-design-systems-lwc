import { r as i, a as o, h as t } from './p-Cc98g_3o.js';
import { C as e } from './p-CJXRCL8b.js';
const a =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const s = class {
	constructor(o) {
		i(this, o);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const i = new e();
			i.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-mastercard-alt> ')
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
	get host() {
		return o(this);
	}
	validateColour() {
		if (this.host.hasAttribute('colour')) {
			const i = new e();
			i.addDesignSystemTag()
				.addMonospaceText(' colour ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-mastercard-alt> ')
				.addRegularText('cannot be set. The provided colour is ignored.')
				.printMessage();
		}
	}
	componentWillLoad() {
		this.validateColour();
		this.validateWidth();
	}
	render() {
		return t(
			'div',
			{
				key: '231fd79682e5157711a65fcb3b6b5deddd21aea8',
				class: `ontario-icon ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			t(
				'svg',
				{
					key: '72407e787b2abb48fcad200a9ba68c5fd318676c',
					class: 'svg-icon',
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'mastercard-alt',
				},
				t('circle', { key: 'dfb1d3e9f648019d1f5b5a0a587722e1f05841fc', cx: '8', cy: '12', r: '6.5', fill: '#eb001b' }),
				t('circle', { key: '3886c20763f3eb481bc7d04e93bd551a5a4bf818', cx: '16', cy: '12', r: '6.5', fill: '#f79e1b' }),
				t('path', {
					key: '674de37b35f0750209185aebe092be71e8dc68f3',
					d: 'M12 17.124S9.5 15.5 9.5 12 12 6.876 12 6.876 14.5 8.5 14.5 12 12 17.124 12 17.124z',
					fill: '#ff5f00',
				}),
				t('path', {
					key: '3d1301398badeefee3e7492a15f49d97fbdfcb28',
					d: 'M21.173 16.85v-.3h.125v-.06H21v.06h.117v.3h.055zm.578 0v-.35h-.1l-.105.25-.105-.25h-.1v.35h.065v-.265l.098.227h.067l.098-.227v.265h.063z',
					fill: '#f79e1b',
				}),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'] };
	}
};
s.style = a;
export { s as ontario_icon_mastercard_alt };
//# sourceMappingURL=p-8d55ecee.entry.js.map
