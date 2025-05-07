# gps-design-systems-lwc

[![CI Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/CI/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3ACI) [![Packaging Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/Packaging/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3A%22Packaging%22) [![codecov](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc/branch/main/graph/badge.svg)](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc)

A collection of Salesforce Lightning Web Components (LWCs) for selected Governments' Design Systems. The collection
covers Salesforce Experience Cloud as well as Salesforce Communities for Public Sector Solutions (Omnistudio), and may be extended in the future to help with Salesforce Flows provided they're surfaced via an Experience Cloud community.

Note that at this stage there is a dependency on Omnistudio **251.1 (at the minimum)**, which is the version we built and tested against. You also need to stay on the Omnistudio Managed Package runtime as the standard runtime is not quite on parity yet when it comes to overrides, which we do leverage quite a bit.

Do read our [change log](./CHANGELOG.md) if you plan on updating already installed packages in order to check for changes in behaviour or configuration changes.

Please submit issues on our [development repo](https://github.com/eschweitzer78/gps-design-systems-lwc) if you are currently on the @SalesforceLabs GitHub.

## Structure

- `sfGpsDs` is the folder for code that is reusable across individual design systems supported by this repo and sfdx project; it is now fully packaged with the design systems library below but the directory is kept for clarity, deployment as source code or as a dependency package for third party design systems
- `sfGpsDsAuNsw` is the folder for code and assets pertaining to the Design System of New South Wales, Australia; check the [documentation web site](https://nswds.dsforce.dev)
- `sfGpsDsAuNswS` is the folder for code and assets pertaining to the specific Design System of Service NSW, New South Wales, Australia; check the [documentation website](https://nsws.dsforce.dev)
- `sfGpsDsAuQld` is the folder for code and assets to the Design System of Queensland, Australia aka Queensland Health Design System (pilot, source code and sandbox only); check the [documentation website](https://qld.dsforce.dev)
- `sfGpsDsAuVic` is the folder for code and assets to the Design System of Victoria, Australia aka Ripple v1 (deprecating, no production without prior consultation as VIC DPC SDP has deprecated that design system and we plan on stopping distribution by 1 Oct 2025); check the [documentation website](https://vic.dsforce.dev)
- `sfGpsDsAuVic2` is the folder for code and assets to the Design System of Victoria v2, Australia aka Ripple v2 (pilot, no production without prior consultation); check the [documentation website](https://vic2.dsforce.dev)
- `sfGpsDsFrGov` is the folder for code and assets to the Design System of France (alpha, sandbox only); check the [documentation page](docs/DSFR_README.md)
- `sfGpsDsUkGov` is the folder for code and assets to the Design System of the United Kingdom (pilot, no production without prior consultation); check the [documentation website](https://uk.dsforce.dev)

## Installing beta versions using Unlocked Packages

Follow this set of instructions if you want to deploy the library in its most recent build to a more permanent environment than a Scratch org or if you don't want to install the local developement tools. You can use a non source-tracked orgs such as a free [Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/), or one of your sandboxes.

1. Log in to your org

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcCpIAK" title="sfGpsDs">this link</a> to install the `sfGpsDs` unlocked package in your org (only when developing your own design system or as a dependency for a third-party).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcCzIAK" title="sfGpsDsAuNswFull">this link</a> to install the `sfGpsDsAuNsw` unlocked package in your org (with `sfGpsDs` included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcD9IAK" title="sfGpsDsAuNswSFull">this link</a> to install the `sfGpsDsAuNswS` unlocked package in your org (with `sfGpsDs` included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcERIA0" title="sfGpsDsAuQldFull">this link</a> to install the `sfGpsDsAuQld` unlocked package in your org (with `sfGpsDs` included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pc7kIAC" title="sfGpsDsAuVic1Full">this link</a> to install the `sfGpsDsAuVic` unlocked package in your org (with `sfGpsDs` included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcDxIAK" title="sfGpsDsAuVic2Full">this link</a> to install the `sfGpsDsAuVic2` unlocked package in your org (with `sfGpsDs` included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcDOIA0" title="sfGpsDsFrGovFull">this link</a> to install the `sfGpsDsFrGov` unlocked package in your org (with `sfGpsDs` included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcDTIA0" title="sfGpsDsUkGovFull">this link</a> to install the `sfGpsDsUkGov` unlocked package in your org (with `sfGpsDs included`).

## Installing the production versions using Unlocked Packages

Kindly note that the packages might be the same as for non-production orgs (see above) if the latest successful build has alreay been promoted for production.

Make sure you fully understand the [support](./SUPPORT.md) and [security](./SECURITY.md) implications of installing those assets in production. The applicable [license](./LICENSE.md) has also wide-ranging disclaimer provisions.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pc9qIAC">this link</a> to install the `sfGpsDs` unlocked package in your production org (v2.8.0.4 released on 28/04/2025 -- only when using your own design system or a dependent third-party's).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pc9vIAC">this link</a> to install the `sfGpsDsAuNsw` unlocked package in your production org (v2.8.0.4 released on 28/04/2025).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcA0IAK">this link</a> to install the `sfGpsDsAuNswS` unlocked package in your production org (v2.8.0.4 released on 28/04/2025).

1. Please [reach out](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) if you would like to install the `sfGpsDsAuQld` unlocked package in a production org. We would like to collect feedback and may be able to provide early adopter support.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pc7kIAC">this link</a> to install the `sfGpsDsAuVic` unlocked package in your production org (v2.7.1.1 released on 21/02/2025). Please [do let us know](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) when doing so for non-educational use as we plan on stopping distribution by 1/10/2025.

1. Please [reach out](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) if you would like to install the `sfGpsDsAuVic2` unlocked package in a production org. We would like to collect feedback and may be able to provide early adopter support.

1. Please [reach out](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) if you would like to install the `sfGpsDsFrGov` unlocked package in a production org. We would like to collect feedback and may be able to provide early adopter support.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcAKIA0">this link</a> to install the `sfGpsDsUkGov` unlocked package in your production org (v1.4.0.4 released on 12/02/2025). Please [do let us know](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) when doing so for non-educational use as we aim at supporting early adopters and gathering feedback.

## Support, security, contributions and code of conduct

Do read our other guidelines:

- [support](./SUPPORT.md)
- [troubleshooting](./TROUBLESHOOT.md)
- [security](./SECURITY.md)
- [contribution](./CONTRIBUTION.md)
- [code of conduct](./CODE_OF_CONDUCT.md)
