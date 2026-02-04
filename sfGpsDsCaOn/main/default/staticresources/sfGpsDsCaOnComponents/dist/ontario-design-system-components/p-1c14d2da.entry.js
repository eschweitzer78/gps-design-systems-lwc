import { r as c, a as e, h as a } from './p-Cc98g_3o.js';
import { C as t } from './p-CJXRCL8b.js';
const i =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const d = class {
	constructor(e) {
		c(this, e);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const c = new t();
			c.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-interac-fr-alt> ')
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
		return e(this);
	}
	validateColour() {
		if (this.host.hasAttribute('colour')) {
			const c = new t();
			c.addDesignSystemTag()
				.addMonospaceText(' colour ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-interac-fr-alt> ')
				.addRegularText('cannot be set. The provided colour is ignored.')
				.printMessage();
		}
	}
	componentWillLoad() {
		this.validateColour();
		this.validateWidth();
	}
	render() {
		return a(
			'div',
			{
				key: 'e93887f9e31530fe10cf6b660730f1d020669329',
				class: `ontario-icon ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			a(
				'svg',
				{
					key: '7f9fe57d2ad0325457e68220f0f2a1df1c310c6c',
					class: 'svg-icon',
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'interac-fr-alt',
				},
				a('path', {
					key: '7565e85237927e852d4448925c26997029f0985b',
					d: 'M18.463 17.052H5.548a1.62 1.62 0 0 1-1.304-.693v5.093c0 .733.57 1.304 1.304 1.304h12.915c.733 0 1.304-.57 1.304-1.304V16.36c-.285.448-.774.693-1.304.693z',
					fill: '#636466',
				}),
				a('path', {
					key: '006e1bc633cc820d4befc94d04f040a27baebab9',
					d: 'M5.548 16.807h12.915c.733 0 1.304-.57 1.304-1.304V2.59c0-.652-.49-1.222-1.14-1.304H5.548c-.733 0-1.304.57-1.304 1.304v12.915c0 .733.57 1.304 1.304 1.304z',
					fill: '#ecaa20',
				}),
				a(
					'g',
					{ key: 'ac68edfd6b0ca9265191cb4c14bf1350e6f0528f', fill: '#fff' },
					a('path', {
						key: 'f87e83eefc06e7c87491c5089358e9568925a70e',
						d: 'M18.463 1H5.548A1.55 1.55 0 0 0 4 2.548v18.904A1.55 1.55 0 0 0 5.548 23h12.915a1.55 1.55 0 0 0 1.548-1.548V2.548C20.052 1.693 19.36 1 18.463 1zM4.244 2.6c0-.733.57-1.304 1.304-1.304h13.037c.652.08 1.14.6 1.14 1.304v12.915c0 .733-.57 1.304-1.304 1.304H5.548c-.733 0-1.304-.57-1.304-1.304V2.6zm15.522 18.904c0 .733-.57 1.304-1.304 1.304H5.548c-.733 0-1.304-.57-1.304-1.304V16.4a1.62 1.62 0 0 0 1.304.693h12.915a1.62 1.62 0 0 0 1.304-.693v5.093zM7.83 18.764v.407h-.937v.6h.856v.448h-.856v.693h.937v.448H6.363v-2.607H7.83zm.326.65h.5v.244a.53.53 0 0 1 .489-.285c.326 0 .5.163.5.57V21.4h-.5v-1.344c0-.204-.08-.285-.204-.285-.163 0-.285.122-.285.326V21.4h-.5v-1.996zm3.137-.65h-.5v2.607h.5v-2.607zm.447-.04h.5v.448h-.5v-.448zm0 .692h.5v1.956h-.5v-1.956zm2.364.001V21.3c0 .53-.244.774-.815.774-.407 0-.652-.204-.652-.53h.5c0 .082.04.122.082.163s.122.04.163.04c.204 0 .285-.163.285-.367v-.285c-.122.163-.245.245-.407.245-.407 0-.6-.285-.6-.978 0-.448.08-1.018.6-1.018.122 0 .326.082.407.285v-.204h.448zm-.733 1.548c.204 0 .285-.244.285-.57 0-.5-.082-.652-.245-.652-.204 0-.244.163-.244.693-.082.285-.04.53.204.53z',
					}),
					a('path', {
						key: 'ad20212ad1bd837587f5d40ea76b986b89cd4de7',
						d: 'M14.5 19.414h.5v.244a.53.53 0 0 1 .489-.285c.326 0 .5.163.5.57V21.4h-.5v-1.344c0-.204-.08-.285-.204-.285-.163 0-.285.122-.285.326V21.4h-.5v-1.996zm2.323 1.06v.163c0 .244.08.448.244.448s.244-.122.285-.367h.448c0 .448-.244.693-.692.693-.733 0-.774-.57-.774-1.06 0-.53.122-1.018.774-1.018.57 0 .733.407.733.978v.122h-1.018v.04zm.53-.326c0-.285-.04-.448-.244-.448s-.245.204-.245.407v.08h.5v-.04z',
					}),
				),
				a(
					'g',
					{ key: 'e2ffca23f1b183dcc48cd87d53139a9cabcb5649', fill: '#000' },
					a('path', {
						key: '5a3ef90a55f8e4f106c978b96ed75dc984a0730d',
						d: 'M6.567 10.004c-.204 0-.367.04-.367.04V8.048l.733-.163v.326s.204-.448.733-.57c.57-.122.774.204.774.693v1.996l-.774.163V8.62c0-.285-.122-.367-.285-.326-.204.04-.367.285-.367.6v1.304c-.08-.04-.204-.204-.448-.204zm6.355-.774V6.46l.733-.163v.367s.204-.5.6-.57c.122-.04.204 0 .204 0v.693s-.163 0-.367.08c-.285.122-.407.326-.407.693v1.548l-.774.122z',
					}),
					a('path', {
						key: '5cf8f7db7a0be402ccc81b7d43e9dd96cd53c74d',
						d: 'M9.093 10.127s-.122-.163-.122-.815V7.926l-.367.08v-.57l.367-.08v-.61l.774-.163v.61l.53-.122v.57l-.53.122V9.19c0 .652.163.774.163.774l-.815.163z',
					}),
					a('path', {
						key: '67ce45204aae94f7b4737da734d6993e5eedb726',
						d: 'M10.356 8.495c0-.5.08-.856.204-1.14.163-.326.5-.53.896-.652.856-.204 1.14.326 1.14.978v.367l-1.507.367v.04c0 .5.082.693.407.6.245-.04.326-.204.367-.407v-.122l.693-.163v.122c0 .285-.082.937-1.06 1.14-.896.204-1.14-.326-1.14-1.14zm1.18-1.263c-.245.04-.367.285-.367.693l.733-.163V7.64c0-.326-.08-.448-.367-.407zm5.542-.366c-.04-.856.204-1.507 1.14-1.752.6-.122.815 0 .937.163s.163.326.163.6v.04l-.733.163v-.12c0-.326-.082-.448-.326-.367-.285.08-.407.326-.407.856v.244c0 .53.08.774.407.733.285-.04.326-.285.326-.53v-.122l.733-.163v.122c0 .693-.367 1.14-1.06 1.304-.978.244-1.14-.326-1.18-1.18zM14.5 8.048c0-.652.367-.856.937-1.1.53-.204.53-.326.53-.5s-.082-.285-.326-.204c-.244.04-.285.244-.326.367v.122l-.733.163s0-.204.04-.407c.122-.367.448-.652 1.06-.774.774-.163 1.018.163 1.018.693V7.64c0 .6.122.693.122.693l-.693.122s-.08-.122-.08-.244c0 0-.163.407-.693.53s-.856-.204-.856-.693zm1.467-.896s-.163.122-.367.204c-.244.122-.326.244-.326.5 0 .204.122.326.326.244.245-.04.367-.285.367-.57v-.367z',
					}),
					a('path', {
						'key': 'a2d2747984df8ea1eb4b492dd8f31ff62ef08226',
						'fill-rule': 'evenodd',
						'd': 'M7.218 11.185l1.222.855c.163.122.285.326.285.53v3.667H7.34a1.36 1.36 0 0 1-1.344-1.344v-4.156c0-.244.204-.49.49-.49a.47.47 0 0 1 .489.489v2.404c0 .082.04.122.122.122s.122-.04.122-.163v-1.915z',
					}),
					a('use', { key: '13bebd6c9719a9486e6ae1ec2f6ed8ed851400b1', href: '#B2' }),
					a('path', {
						key: '79946660d1c3a1e4cef7c0aa394801ea192ef66b',
						d: 'M4.693 12.49c-.04.08-.08.163-.08.244 0 .245.204.407.407.407h.08c.04 0 .326-.082.57-.122v-.733l-.978.204z',
					}),
					a('use', { key: '17437207fcd4d14e5afffc7b5cd1d063c1654842', href: '#B2', y: '2.036' }),
					a('path', {
						key: '6a3f2ddfab85bf73cce69f5e97d3f65b6dc79a5a',
						d: 'M4.896 11.144v-4.48l.815-.204v4.482l-.815.204zM17.7 3.484h.244l.163.733.163-.733h.244v.978h-.163v-.815l-.163.815h-.163l-.163-.815h-.04v.815H17.7v-.978z',
					}),
					a('path', {
						key: '5e884fcbbd8d255e892837d7b6f5486e799ebc6b',
						d: 'M18.667 3.484h.285c.285 0 .326.204.326.49s-.04.49-.326.49h-.285v-.978zm.163.856h.122c.122 0 .163-.08.163-.367s-.04-.367-.163-.367h-.122v.733z',
					}),
				),
				a(
					'defs',
					{ key: '5b773213c5abca63a0e879d13693301c1d9545f5' },
					a('path', {
						key: '5eba93bf556d3435e2c9496d41299c9087ee3d9f',
						id: 'B2',
						d: 'M4.693 11.47c-.04.082-.08.163-.08.245 0 .244.204.407.407.407h.08c.04 0 .326-.082.57-.122v-.733l-.978.204z',
					}),
				),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'] };
	}
};
d.style = i;
export { d as ontario_icon_interac_fr_alt };
//# sourceMappingURL=p-1c14d2da.entry.js.map
