/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class SfGpsDsAuNswMainNavComm extends LightningElement {
  @api megaMenu = false;
  @api className;
  @api isActive = false;

  _navItems = [
    {
      text: "About DPC",
      url: "#",
      description: "blablah1",
      subNav: [
        {
          text: "level2 1-1",
          url: "#"
        }
      ]
    },
    {
      text: "Updates",
      url: "#",
      description: "blablah2",
      subNav: [
        {
          text: "level2 2-1x",
          url: "#",
          subNav: [
            {
              text: "level3 2-1-1",
              url: "#"
            }
          ]
        },
        {
          text: "level2 2-2",
          url: "#"
        }
      ]
    }
  ];

  @api get navItems() {
    return this._navItems;
  }

  set navItems(value) {}

  handleCloseMenu() {
    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }
}
