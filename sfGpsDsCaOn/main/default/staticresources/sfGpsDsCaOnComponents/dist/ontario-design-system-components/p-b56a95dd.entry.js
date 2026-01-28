import { r as c, a as e, h as a } from './p-Cc98g_3o.js';
import { C as i } from './p-CJXRCL8b.js';
const t =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const o = class {
	constructor(e) {
		c(this, e);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const c = new i();
			c.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-interac-en> ')
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
			const c = new i();
			c.addDesignSystemTag()
				.addMonospaceText(' colour ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-interac-en> ')
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
				key: '151d0ff1d04ce36bc6ba450c4fde686ed73ed3fc',
				class: `ontario-icon ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			a(
				'svg',
				{
					key: 'd49c20a6acd764d7dd2953d7a58eac4e32336c42',
					class: 'svg-icon',
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'interac-en',
				},
				a('path', {
					'key': '1103a5343a8798808a50648e30584fe75c1efc32',
					'fill-rule': 'evenodd',
					'd': 'M16.008 18.403c0 .7-.584 1.285-1.285 1.285H1.837c-.7 0-1.285-.584-1.285-1.285V5.517c0-.7.584-1.285 1.285-1.285h12.886c.7 0 1.285.584 1.285 1.285v12.886z',
					'fill': '#ecaa20',
				}),
				a('path', {
					key: '94e11c885bd98b02dc383d4ca58f00639a48508b',
					d: 'M30.178 4H1.837C.98 4 .28 4.7.28 5.557v12.886C.28 19.3.98 20 1.837 20h28.34a1.56 1.56 0 0 0 1.557-1.557V5.557c0-.895-.7-1.557-1.557-1.557zM1.837 19.69c-.7 0-1.285-.584-1.285-1.285V5.518c0-.7.584-1.285 1.285-1.285h12.886c.7 0 1.285.584 1.285 1.285v12.886c0 .7-.584 1.285-1.285 1.285H1.837zm29.625-1.285c0 .7-.584 1.285-1.285 1.285h-14.56c.428-.273.662-.74.662-1.285V5.518c0-.545-.273-1.012-.662-1.285h14.56c.7 0 1.285.584 1.285 1.285v12.886z',
					fill: '#fff',
				}),
				a('path', {
					key: 'f2be9e833c2ea620c5fd7fc488308b469ff6532d',
					d: 'M16.28 5.558v12.886c0 .545-.273 1.012-.662 1.285h14.56c.7 0 1.285-.584 1.285-1.285V5.558c0-.7-.584-1.285-1.285-1.285h-14.56c.39.272.662.74.662 1.285z',
					fill: '#636466',
				}),
				a('path', {
					key: '6ee364b486dc8406b224aff3442438af9796e318',
					d: 'M19.122 9.564c1.05 0 1.207.74 1.207 1.83 0 1.05-.117 1.83-1.207 1.83-1.05 0-1.207-.74-1.207-1.83s.156-1.83 1.207-1.83zm0 3.114c.428 0 .467-.35.467-1.285s-.078-1.285-.467-1.285c-.428 0-.467.35-.467 1.285-.04.934.04 1.285.467 1.285zm1.674-2.176h.662v.3a.72.72 0 0 1 .662-.389c.428 0 .662.234.662.74V13.1h-.662v-1.83c0-.273-.078-.35-.272-.35-.234 0-.35.156-.35.428V13.1h-.662v-2.608h-.04zm3.192-.86h-.662v3.504h.662V9.643zm.584-.036h.662v.584h-.662v-.584zm0 .895h.662v2.647h-.662v-2.647zm1.246 0h.662v.3a.72.72 0 0 1 .662-.389c.428 0 .662.234.662.74V13.1h-.662v-1.83c0-.273-.078-.35-.273-.35-.233 0-.35.156-.35.428V13.1h-.662v-2.608h-.04zm3.036 1.44v.195c0 .3.078.623.35.623.234 0 .3-.156.35-.506h.623c-.04.623-.312.973-.973.973-.973 0-1.012-.74-1.012-1.402 0-.7.156-1.363 1.05-1.363.78 0 .973.545.973 1.324v.156h-1.363zm.7-.428c0-.4-.078-.623-.35-.623s-.35.273-.35.506v.117h.7z',
					fill: '#fff',
				}),
				a(
					'g',
					{ key: 'a8728c40ba1b5fefb93eb3aa98149914e541c3bf', fill: '#000' },
					a('path', {
						key: '7005354079ced76d84d7ec52ccc63bbc6188ce6b',
						d: 'M2.85 12.915c-.234-.04-.35.04-.35.04V10.97l.74-.156v.3s.195-.428.7-.545c.584-.117.78.195.78.7v1.985l-.78.195v-1.87c0-.312-.156-.35-.3-.312-.234.04-.4.312-.4.584v1.285c0-.04-.156-.195-.4-.234zm6.345-.74V9.4l.74-.156v.35s.195-.467.623-.584c.117-.04.195 0 .195 0v.7s-.156 0-.4.078c-.273.117-.4.35-.4.7v1.518l-.78.156z',
					}),
					a('path', {
						key: '70e5386d04b841c596faf0480b4e3c2915fe21cf',
						d: 'M5.38 13.068s-.117-.156-.117-.818v-1.362l-.39.078v-.584l.39-.078V9.68l.78-.195v.623l.545-.117v.584l-.545.117v1.402c0 .623.156.78.156.78l-.818.195z',
					}),
					a('path', {
						key: '7f169c3d26187643442e4cc467fcd377de804a78',
						d: 'M6.664 11.435c0-.506.078-.857.234-1.13.195-.3.467-.545.895-.623.856-.195 1.13.3 1.13.973v.35l-1.48.35v.04c0 .467.117.7.4.623.273-.04.3-.195.35-.428v-.117l.7-.156v.117c0 .273-.078.934-1.05 1.168-.934.195-1.168-.35-1.168-1.168zm1.13-1.246c-.234.04-.4.3-.4.7l.74-.195v-.117c.04-.312-.078-.467-.35-.4zm5.526-.39c-.04-.856.195-1.518 1.13-1.713.584-.117.817 0 .934.156s.156.35.156.623v.04l-.74.156v-.117c0-.3-.078-.428-.3-.4-.273.078-.4.35-.4.856v.234c0 .545.078.78.4.7.272-.04.3-.3.3-.506v-.156l.74-.156v.117c0 .7-.4 1.13-1.05 1.285-.934.3-1.13-.273-1.168-1.13zM10.8 11c0-.623.4-.856.934-1.1.506-.195.506-.3.506-.506 0-.156-.078-.273-.3-.234a.36.36 0 0 0-.312.35v.156l-.7.156s0-.234.04-.428c.117-.4.467-.623 1.05-.78.74-.156 1.012.156 1.012.662v1.246c0 .584.117.662.117.662l-.7.156s-.078-.117-.078-.234c0 0-.156.4-.7.506-.584.195-.856-.156-.856-.623zm1.44-.895s-.156.117-.4.233-.35.273-.35.467.117.3.3.273c.234-.04.4-.273.4-.545.04-.195.04-.4.04-.428z',
					}),
					a('path', {
						'key': 'd071acf5e27d74331bef797a94769ee5a815ca3e',
						'fill-rule': 'evenodd',
						'd': 'M3.472 14.122l1.246.817a.68.68 0 0 1 .272.545v3.62h-1.4a1.31 1.31 0 0 1-1.324-1.324v-4.165a.45.45 0 0 1 .467-.467c.272 0 .467.234.467.467V16c0 .078.04.117.117.117s.117-.078.117-.156c.04-.04.04-1.83.04-1.83z',
					}),
					a('path', {
						key: '8598ea94a7448377bf0f604ee5bd68618f6bbe14',
						d: 'M1.02 14.394c-.04.078-.078.156-.078.234 0 .234.195.428.428.428h.078c.04 0 .35-.078.584-.117v-.74l-1.013.195z',
					}),
					a('use', { key: '60034507beac027a9dfd34d2ec7a4f49c0431877', href: '#B3' }),
					a('use', { key: '6c0d57c59d8e2211f7ebfb66049808bbee47d956', href: '#B3', y: '1.014' }),
					a('path', {
						key: '2a22349e9e91b4bd99b58d7b36cd708a64f6501f',
						d: 'M1.214 14.045V9.607l.818-.195v4.438l-.818.195zM14.762 7.62a.78.78 0 0 1-.779-.779.78.78 0 0 1 .779-.779.78.78 0 0 1 .779.779.78.78 0 0 1-.779.779zm0-1.48a.701.701 0 1 0 0 1.402.7.7 0 0 0 .701-.701c-.04-.4-.35-.7-.7-.7z',
					}),
					a('path', {
						key: 'b4d4a45581698a7b25873b61f81ab949a5759b5e',
						d: 'M14.45 6.334h.35c.117 0 .234.078.234.234 0 .117-.04.234-.156.234.078 0 .156.078.156.195v.195c0 .04.04.078.04.078h-.156s-.04-.04-.04-.078v-.195c0-.117-.04-.156-.156-.156h-.117v.428h-.156v-.935zm.273.428c.117 0 .156-.078.156-.156 0-.117-.04-.156-.156-.156h-.117v.312h.117z',
					}),
				),
				a(
					'defs',
					{ key: '0b31c7335631813a5ba048773e3dff058da02da6' },
					a('path', {
						key: '59da551bef74af91e3a9269615c5036169d30b8e',
						id: 'B3',
						d: 'M1.02 15.406c-.04.078-.078.156-.078.234 0 .234.195.43.428.43h.078c.04 0 .35-.078.584-.117v-.74l-1.013.195z',
					}),
				),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'] };
	}
};
o.style = t;
export { o as ontario_icon_interac_en };
//# sourceMappingURL=p-b56a95dd.entry.js.map
