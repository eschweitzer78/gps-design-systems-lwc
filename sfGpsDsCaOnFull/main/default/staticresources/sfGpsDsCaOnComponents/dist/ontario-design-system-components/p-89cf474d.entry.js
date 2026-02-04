import { r as c, a as e, h as i } from './p-Cc98g_3o.js';
import { C as o } from './p-CJXRCL8b.js';
const t =
	'.ontario-icon svg,.ontario-icon{display:inline-block;stroke-width:0;stroke:currentColor;fill:currentColor;vertical-align:middle;overflow:hidden}.ontario-icon--blue svg{stroke:#0066CC;fill:#0066CC}.ontario-icon--grey svg{stroke:#666666;fill:#666666}.ontario-icon--black svg{stroke:#1A1A1A;fill:#1A1A1A}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}.ontario-icon--white svg{stroke:#FFFFFF;fill:#FFFFFF}';
const a = class {
	constructor(e) {
		c(this, e);
	}
	iconWidth = 24;
	iconWidthState;
	validateWidth() {
		if (isNaN(this.iconWidth) || (!isNaN(this.iconWidth) && this.iconWidth <= 0)) {
			const c = new o();
			c.addDesignSystemTag()
				.addMonospaceText(' icon-width ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-interac-fr> ')
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
			const c = new o();
			c.addDesignSystemTag()
				.addMonospaceText(' colour ')
				.addRegularText('on')
				.addMonospaceText(' <ontario-icon-interac-fr> ')
				.addRegularText('cannot be set. The provided colour is ignored.')
				.printMessage();
		}
	}
	componentWillLoad() {
		this.validateColour();
		this.validateWidth();
	}
	render() {
		return i(
			'div',
			{
				key: 'b97247b7a171eafe596d654af091c85562c9e4ad',
				class: `ontario-icon ontario-icon--width-${this.iconWidthState}`,
				style: { width: `${this.iconWidthState}px` },
			},
			i(
				'svg',
				{
					key: '51d6387c73b07d195baeb0b34602ef48103b3b4e',
					class: 'svg-icon',
					role: 'img',
					xmlns: 'http://www.w3.org/2000/svg',
					viewBox: '0 0 24 24',
					id: 'interac-fr',
				},
				i('path', {
					'key': '94443d38843f2b5e7886732b01b3464b72dc0075',
					'fill-rule': 'evenodd',
					'd': 'M15.998 18.442c0 .7-.584 1.285-1.285 1.285H1.827c-.7 0-1.285-.584-1.285-1.285V5.556c0-.7.584-1.285 1.285-1.285h12.886c.7 0 1.285.584 1.285 1.285v12.886z',
					'fill': '#ecaa20',
				}),
				i('path', {
					key: 'ea96fcb2d2cf547034cf22cadf82e4e1c7fe0f96',
					d: 'M37.876 4H1.827C.97 4 .27 4.7.27 5.557v12.886C.27 19.3.97 20 1.827 20h36.05c.856 0 1.557-.7 1.557-1.557V5.557c0-.856-.7-1.557-1.557-1.557zM1.827 19.728c-.7 0-1.285-.584-1.285-1.285V5.557c0-.7.584-1.285 1.285-1.285h12.886c.7 0 1.285.584 1.285 1.285v12.886c0 .7-.584 1.285-1.285 1.285H1.827zm37.333-1.285c0 .7-.584 1.285-1.285 1.285H15.57c.428-.273.662-.74.662-1.285V5.557c0-.545-.273-1.012-.662-1.285h22.307c.7 0 1.285.584 1.285 1.285v12.886z',
					fill: '#fff',
				}),
				i('path', {
					key: '12cc76626bc790c4a743b6d89ce15778556045d3',
					d: 'M16.27 5.556v12.886c0 .545-.272 1.012-.662 1.285h22.307c.7 0 1.285-.584 1.285-1.285V5.556c0-.7-.584-1.285-1.285-1.285H15.608c.39.31.662.78.662 1.285z',
					fill: '#636466',
				}),
				i('path', {
					key: 'dfe5150899dc0f25b32db8bb046162c82472b77d',
					d: 'M21.993 9.684v.545h-1.246v.857h1.168v.584h-1.168v.934h1.285v.584h-1.986V9.684h1.947zm.467.856h.662v.3a.72.72 0 0 1 .662-.389c.428 0 .662.234.662.74v1.946h-.662v-1.83c0-.273-.078-.35-.273-.35-.233 0-.35.156-.35.428v1.752h-.7V10.54zm4.204-.856h-.662v3.504h.662V9.684zm.584-.04h.662v.584h-.662v-.584zm0 .895h.662v2.647h-.662V10.54zm3.192 0v2.5c0 .7-.3 1.05-1.1 1.05-.584 0-.895-.272-.895-.7h.662c0 .078.04.156.117.195a.55.55 0 0 0 .234.078c.273 0 .4-.195.4-.467v-.35c-.156.195-.35.3-.584.3-.545 0-.818-.35-.818-1.324 0-.623.078-1.363.818-1.363.195 0 .428.078.545.35v-.272h.623zm-1.012 2.063c.273 0 .35-.3.35-.74 0-.662-.078-.895-.35-.895-.3 0-.35.234-.35.934.04.4.078.7.35.7zm1.596-2.063h.662v.3a.72.72 0 0 1 .662-.389c.428 0 .662.234.662.74v1.946h-.662v-1.83c0-.273-.078-.35-.273-.35-.234 0-.35.156-.35.428v1.752h-.7V10.54zm3.076 1.402v.195c0 .3.078.623.35.623.234 0 .3-.156.35-.506h.623c-.04.623-.3.973-.973.973-.973 0-1.012-.74-1.012-1.402 0-.7.156-1.363 1.05-1.363.78 0 .973.545.973 1.324v.156H34.1zm.7-.4c0-.4-.078-.623-.35-.623s-.35.273-.35.506v.117h.7z',
					fill: '#fff',
				}),
				i(
					'g',
					{ key: 'd5859d3efcb16c2967aef4afb8e85e0f3305e4db', fill: '#000' },
					i('path', {
						key: 'b63d48ffa650b183edaff7259f96ee11291e04df',
						d: 'M2.84 12.954c-.234-.04-.35.04-.35.04V11.01l.74-.156v.3s.195-.428.74-.545c.584-.117.78.195.78.7v1.985l-.78.195v-1.87c0-.3-.156-.35-.3-.3-.234.04-.4.3-.4.584v1.285c0-.04-.156-.195-.428-.234zm6.345-.74V9.45l.74-.156v.35s.195-.467.623-.584c.117-.04.195 0 .195 0v.7s-.156 0-.4.078c-.273.117-.4.35-.4.7v1.518l-.78.156z',
					}),
					i('path', {
						key: 'bac7d84c6d3ee598a2ab5d83c8a7577ea862cab4',
						d: 'M5.37 13.11s-.117-.195-.117-.818V10.93l-.39.078v-.584l.39-.078V9.76l.78-.195v.623l.545-.117v.584l-.545.117v1.402c0 .623.156.78.156.78l-.818.156z',
					}),
					i('path', {
						key: '51387aaf07d56d9cbb1e24d466cafa2c472045ff',
						d: 'M6.654 11.474c0-.506.078-.856.234-1.13.195-.3.467-.545.895-.623.856-.195 1.13.3 1.13.973v.35l-1.48.35v.04c0 .467.117.7.4.623.273-.04.3-.195.35-.428v-.117l.7-.156v.117c0 .273-.078.934-1.05 1.168-.934.195-1.168-.4-1.168-1.168zm1.13-1.246c-.234.04-.4.312-.4.7l.74-.195v-.117c.04-.3-.04-.467-.35-.4zM13.3 9.84c-.04-.856.195-1.518 1.13-1.713.584-.117.817.04.934.156.117.156.156.35.156.623v.04l-.74.156v-.117c0-.3-.078-.428-.3-.4-.273.078-.4.35-.4.856v.234c0 .545.078.78.4.7.272-.078.3-.3.3-.506v-.156l.74-.156v.117c0 .7-.4 1.13-1.05 1.285-.934.272-1.13-.273-1.168-1.13zm-2.53 1.167c0-.623.4-.856.934-1.1.506-.195.506-.3.506-.506 0-.156-.078-.273-.3-.234a.36.36 0 0 0-.312.35v.156l-.7.156s0-.234.04-.428c.117-.4.467-.623 1.05-.78.74-.195 1.012.156 1.012.662v1.246c0 .584.117.662.117.662l-.7.156s-.078-.117-.078-.234c0 0-.156.4-.7.506-.545.195-.856-.117-.856-.623zm1.48-.856s-.156.117-.4.233-.35.273-.35.467.117.3.3.273c.234-.04.4-.273.4-.545 0-.195.04-.4.04-.428z',
					}),
					i('path', {
						'key': '1393beb022357d725c29d5ed2c8536de3b530500',
						'fill-rule': 'evenodd',
						'd': 'M3.5 14.16l1.207.818a.68.68 0 0 1 .272.545v3.62h-1.4a1.31 1.31 0 0 1-1.324-1.324v-4.165a.45.45 0 0 1 .467-.467c.273 0 .467.234.467.467v2.375c0 .078.04.117.117.117s.117-.078.117-.156c.078-.04.078-1.83.078-1.83z',
					}),
					i('path', {
						key: 'c4155798d56dcfd7f60491b26892d48f4dcc6fc2',
						d: 'M1 14.433c-.04.078-.078.156-.078.234 0 .234.195.428.428.428h.078c.04 0 .35-.078.584-.117v-.74L1 14.433zm0 1.014c-.04.078-.078.156-.078.233 0 .234.195.428.428.428h.078c.04 0 .35-.078.584-.117v-.78L1 15.447zm0 1.01c-.04.078-.078.156-.078.234 0 .234.195.428.428.428h.078c.04 0 .35-.078.584-.117v-.74L1 16.458zm.204-2.376V9.644l.818-.195v4.438l-.818.195zm12.73-7.6h.234l.156.7h.04l.156-.7h.234v.973h-.156v-.818l-.195.818h-.117l-.195-.818v.818h-.156v-.973zm.974 0h.272c.3 0 .35.195.35.467s-.04.467-.35.467h-.272v-.934zm.156.856h.117c.117 0 .195-.078.195-.35s-.04-.35-.195-.35h-.117v.7z',
					}),
				),
			),
		);
	}
	static get watchers() {
		return { iconWidth: ['validateWidth'] };
	}
};
a.style = t;
export { a as ontario_icon_interac_fr };
//# sourceMappingURL=p-89cf474d.entry.js.map
