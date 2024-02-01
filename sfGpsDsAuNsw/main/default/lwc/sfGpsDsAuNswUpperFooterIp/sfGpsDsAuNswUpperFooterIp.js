import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class SfGpsDsAuNswLowerFooterIp extends SfGpsDsNavigation {
  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      /* eslint-disable-next-line no-unused-vars */
      let cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/",
          imageUrl: null,
          label: "Popular",
          target: "CurrentWindow",
          subMenu: [
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/about-nsw/school-holidays",
              imageUrl: null,
              label: "NSW school holidays",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/departments-and-agencies/department-of-education/careersnsw",
              imageUrl: null,
              label: "Careers NSW",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/visas-and-migration/skilled-visas/skilled-work-regional-visa-subclass-491",
              imageUrl: null,
              label: "Skilled Work Regional visa (subclass 491)",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/driving-boating-and-transport/driver-and-rider-licences/driver-licences/driver-licence-tests/driver-knowledge-test",
              imageUrl: null,
              label: "Driver Knowledge Test (DKT)",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/covid-19/testing-managing/advice-for-confirmed",
              imageUrl: null,
              label:
                "Testing positive to COVID-19 and managing COVID-19 safely at home",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/driving-boating-and-transport/demerits-penalties-and-offences/offences/search-offences-and-penalties",
              imageUrl: null,
              label: "Search offences and penalties",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/money-and-taxes/fines-and-fees/fines/pay-your-fine",
              imageUrl: null,
              label: "Pay your fine",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/search",
              imageUrl: null,
              label: "Search",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/family-and-relationships/family-history-search",
              imageUrl: null,
              label: "Family history search",
              subMenu: [],
              target: "CurrentWindow"
            }
          ]
        },
        {
          actionType: "ExternalLink",
          actionValue:
            "https://www.nsw.gov.au/nsw-government/about-this-website",
          imageUrl: null,
          label: "About this website",
          target: "CurrentWindow",
          subMenu: [
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/nsw-government/access-nsw-government-information",
              imageUrl: null,
              label: "Access to information",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/accessibility-statement",
              imageUrl: null,
              label: "Accessibility statement",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/nsw-government/copyright",
              imageUrl: null,
              label: "Copyright",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/nsw-government/disclaimer",
              imageUrl: null,
              label: "Disclaimer",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/nsw-government/privacy-statement",
              imageUrl: null,
              label: "Privacy statement",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.service.nsw.gov.au/nswgovdirectory",
              imageUrl: null,
              label: "NSW Government directory",
              subMenu: [],
              target: "CurrentWindow"
            }
          ]
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/departments-and-agencies",
          imageUrl: null,
          label: "Departments",
          target: "CurrentWindow",
          subMenu: [
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/the-cabinet-office",
              imageUrl: null,
              label: "Cabinet Office",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/departments-and-agencies/customer-service",
              imageUrl: null,
              label: "Customer Service",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.dcj.nsw.gov.au/",
              imageUrl: null,
              label: "Communities and Justice",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/departments-and-agencies/department-of-education",
              imageUrl: null,
              label: "Education",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/departments-and-agencies/enterprise-investment-trade",
              imageUrl: null,
              label: "Enterprise, Investment and Trade",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.health.nsw.gov.au/",
              imageUrl: null,
              label: "Health",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.dpie.nsw.gov.au/",
              imageUrl: null,
              label: "Planning and Environment",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/premiers-department",
              imageUrl: null,
              label: "Premier’s Department",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/departments-and-agencies/department-of-regional-nsw",
              imageUrl: null,
              label: "Regional NSW",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.transport.nsw.gov.au/",
              imageUrl: null,
              label: "Transport",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.treasury.nsw.gov.au/",
              imageUrl: null,
              label: "Treasury",
              subMenu: [],
              target: "CurrentWindow"
            }
          ]
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government",
          imageUrl: null,
          label: "NSW Government",
          target: "CurrentWindow",
          subMenu: [
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/nsw-government/premier-of-nsw",
              imageUrl: null,
              label: "The Premier",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/nsw-government/ministers",
              imageUrl: null,
              label: "NSW Ministers",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.parliament.nsw.gov.au/members/pages/all-members.aspx",
              imageUrl: null,
              label: "Find your local Member of Parliament",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://boards.dpc.nsw.gov.au/",
              imageUrl: null,
              label: "Boards and Committees",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://iworkfor.nsw.gov.au/",
              imageUrl: null,
              label: "Find a job in NSW Government",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/about-nsw",
              imageUrl: null,
              label: "About NSW",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/nsw-government/communications",
              imageUrl: null,
              label: "NSW Government Communications",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/nsw-government/unsolicited-proposals",
              imageUrl: null,
              label: "Unsollicited proposals",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/nsw-government/projects-and-initiatives",
              imageUrl: null,
              label: "Projects and initiatives",
              subMenu: [],
              target: "CurrentWindow"
            }
          ]
        }
      ]);
    }
  }

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  @api className;

  handleNavClick(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }
}
