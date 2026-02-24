# gps-design-systems-lwc

[![CI Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/CI/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3ACI) [![Packaging Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/Packaging/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3A%22Packaging%22) [![codecov](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc/branch/main/graph/badge.svg)](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc)

This repository is a collection of Accelerators to support the use of selected Governments' Design Systems on the Salesforce platform. They mostly comprise of Lightning Web Components (LWCs) for use in Salesforce Experience Cloud or Salesforce Communities for Public Sector Solutions but also of Experience Cloud templates, Apex business logic, static resources etc. It is mandatory that target orgs have the Omnistudio capabilities.

Most Design System Accelerators will work both with the Omnistudio Managed Package Runtime and Standard Runtime and will be distributed as two distinct packages. There is a dependency on the Omnistudio Managed Package for use with the Omnistudio Managed Package Runtime.

While we strongly recommend staying on the Omnistudio Managed Package Runtime for now, the Standard Runtime versions can be tested for preview purposes. Note that there are currently known challenges with the Typeahead and File Omnistudio form elements in Standard Runtime.

**Note for existing users**: DO NOT install Standard Runtime packages if you already have the Managed Package Runtime packages. We will provide further guidance on that migration in due time -- but contact us for further details prior if required. Also note that multiple Accelerators from this collection cannot be installed as packages in the same org; consider source code deployment in that setup.

Do read our [change log](./CHANGELOG.md) if you plan on updating an already installed package in order to check for changes in behaviour or configuration changes.

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
- `sfGpsDsCaOn` is the folder for code and assets to the Design System of Ontario, Canada (alpha).

## Installing beta versions using Unlocked Packages

Follow this set of instructions if you want to deploy the library in its most recent build to a more permanent environment than a Scratch org or if you don't want to install the local developement tools.

You can use a non source-tracked orgs such as a free [Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/), or one of your sandboxes.

While installing, expand the advanced options to pick the `Compile only the Apex in the package` option.

1. Log in to your org

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcnSIAS" title="sfGpsDs">this link</a> to install the `sfGpsDs` unlocked package in your org (only when developing your own design system or as a dependency for a third-party) for Omnistudio Managed Package Runtime.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=0t0000000000000000" title="sfGpsDsSr">this link</a> to install the `sfGpsDs` unlocked package in your org (only when developing your own design system or as a dependency for a third-party) for Omnistudio Standard Runtime.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcnXIAS" title="sfGpsDsAuNswFull">this link</a> to install the `sfGpsDsAuNsw` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Managed Package Runtime. **Note**: Former users (pre-3.4), you may need to upgrade with deprecate only if you have been actively using `sfGpsDsAuNswHeaderComm` which is now superseded by `sfGpsDsAuNswHeaderV2Comm`.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t000000000000000" title="sfGpsDsAuNswSr">this link</a> to install the `sfGpsDsAuNsw` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Standard Runtime.**Note**: DO NOT install this if you have the Managed Package Runtime package installed. We will need to release a specific version of the Omnistudio Managed Package Runtime package removing all components so they can be safely deprecated and superseded by their equivalent in the Standard Runtime package version.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcncIAC" title="sfGpsDsAuNswSFull">this link</a> to install the `sfGpsDsAuNswS` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Managed Package Runtime.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcnhIAC" title="sfGpsDsAuQldFull">this link</a> to install the `sfGpsDsAuQld` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Managed Package Runtime.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t000000000000000" title="sfGpsDsAuQldSr">this link</a> to install the `sfGpsDsAuQld` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Standard Runtime.**Note**: DO NOT install this if you have the Managed Package Runtime package installed. We will need to release a specific version of the Omnistudio Managed Package Runtime package removing all components so they can be safely deprecated and superseded by their equivalent in the Standard Runtime package version.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pc7kIAC" title="sfGpsDsAuVic1Full">this link</a> to install the `sfGpsDsAuVic` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Managed Package Runtime. **Note**: this library is now deprecated.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcnmIAC" title="sfGpsDsAuVic2Full">this link</a> to install the `sfGpsDsAuVic2` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Managed Package Runtime.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t000000000000000" title="sfGpsDsAuVic2Sr">this link</a> to install the `sfGpsDsAuVic2` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Standard Runtime.**Note**: DO NOT install this if you have the Managed Package Runtime package installed. We will need to release a specific version of the Omnistudio Managed Package Runtime package removing all components so they can be safely deprecated and superseded by their equivalent in the Standard Runtime package version.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcnrIAC" title="sfGpsDsFrGovFull">this link</a> to install the `sfGpsDsFrGov` unlocked package in your org (with `sfGpsDs` included) for Omnistudio Managed Package Runtime.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcnwIAC" title="sfGpsDsUkGovFull">this link</a> to install the `sfGpsDsUkGov` unlocked package in your org (with `sfGpsDs included`) for Omnistudio Managed Package Runtime.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pco1IAC" title="sfGpsDsCaOnFull">this link</a> to install the `sfGpsDsCaOn` unlocked package in your org (with `sfGpsDs included`) for Omnistudio Standard Runtime.

## Installing the production versions using Unlocked Packages

Kindly note that the packages might be the same as for non-production orgs (see above) if the latest successful build has alreay been promoted for production. It is highly advisable to have sufficient testing mileage in a sandbox with a given version prior to installing it in production.

Make sure you fully understand the [support](./SUPPORT.md) and [security](./SECURITY.md) implications of installing those assets in production. The applicable [license](./LICENSE.md) has also wide-ranging disclaimer provisions.

While installing, you can expand the advanced options to pick the `Compile only the Apex in the package` option if you know that your local Apex may raise issues as the installation would otherwise be aborted in abundance of caution. It is however advisable to deal with those issues before setting forth with the installation if possible.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pc9qIAC">this link</a> to install the `sfGpsDs` unlocked package for Omnistudio Managed Package Runtime in your production org (v2.8.0.4 released on 28/04/2025 -- only when using your own design system or a dependent third-party's).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000Pcd3IAC">this link</a> to install the `sfGpsDsAuNsw` unlocked package for Omnistudio Managed Package Runtime in your production org (v3.4.0.1 released on 08/12/2025).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcA0IAK">this link</a> to install the `sfGpsDsAuNswS` unlocked package for Omnistudio Managed Package Runtime in your production org (v2.8.0.4 released on 28/04/2025).

1. Please [reach out](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) if you would like to install the `sfGpsDsAuQld` unlocked package in a production org. We would like to collect feedback and may be able to provide early adopter support.

1. Please [reach out](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) if you would like to install the `sfGpsDsAuVic2` unlocked package in a production org. We would like to collect feedback and may be able to provide early adopter support.

1. Please [reach out](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) if you would like to install the `sfGpsDsFrGov` unlocked package in a production org. We would like to collect feedback and may be able to provide early adopter support.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ4000000PcAKIA0">this link</a> to install the `sfGpsDsUkGov` unlocked package for Omnistudio Managed Package Runtime in your production org (v1.4.0.4 released on 12/02/2025). Please [do let us know](https://github.com/eschweitzer78/gps-design-systems-lwc/discussions/categories/access-to-limited-prod-releases) when doing so for non-educational use as we aim at supporting early adopters and gathering feedback.

## Support, security, contributions and code of conduct

Do read our other guidelines:

- [support](./SUPPORT.md)
- [troubleshooting](./TROUBLESHOOT.md)
- [security](./SECURITY.md)
- [contribution](./CONTRIBUTION.md)
- [code of conduct](./CODE_OF_CONDUCT.md)
