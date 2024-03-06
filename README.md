# gps-design-systems-lwc

[![CI Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/CI/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3ACI) [![Packaging Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/Packaging/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3A%22Packaging%22) [![codecov](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc/branch/main/graph/badge.svg)](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc)

A collection of Salesforce Lightning Web Components (LWCs) for selected Governments' Design Systems. The collection
covers Salesforce Experience Cloud as well as Salesforce Communities for Public Sector Solutions (Omnistudio), and may be extended in the future to help with Salesforce Flows provided they're surfaced via an Experience Cloud community.

Note that at this stage there is a dependency on Omnistudio **248.5 (at the minimum)**, which is the version we built and tested against. You also need to stay on the Omnistudio Managed Package runtime as the standard runtime is not quite on parity yet when it comes to overrides, which we do leverage quite a bit.

Do read our [change log](./CHANGELOG.md) if you plan on updating already installed packages in order to check for changes in behaviour or configuration changes.

## Structure

- sfGpsDs is the folder for code that is reusable across individual design systems supported by this repo and sfdx project; it is now fully packaged with the design systems library below but the directory is kept for clarity, deployment as source code or as a dependency package for third party design systems
- sfGpsDsAuNsw is the folder for code and assets pertaining to the Design System of New South Wales, Australia; check the [documentation web site](https://nswds.dsforce.dev)
- sfGpsDsAuNswS is the folder for code and assets pertaining to the specific Design System of Service NSW, New South Wales, Australia; check the [documentation website](https://nsws.dsforce.dev)
- sfGpsDsAuVic is the folder for code and assets to the Design System of Victoria, Australia aka Ripple v1 (pilot, no production without prior consultation); check the [documentation website](https://vic.dsforce.dev) and know that we are investigating the support of Ripple v2
- sfGpsDsFrGov is the folder for code and assets to the Design System of France (alpha, only sandbox); check the [documentation page](docs/DSFR_README.md)
- sfGpsDsUkGov is the folder for code and assets to the Design System of the United Kingdom (pilot, no production without prior consultation); check the [documentation website](https://uk.dsforce.dev)

**Important note for existing users of the libraries**: we used to require to install a base package and then a package for you design system of choice. We are dropping this pattern and now ship each design system with all dependencies but kindly note that it thus prevents you from having multiple design systems on a single org unless you deploy as source code. If you installed a package prior to November 2023, see instructions further down in this document regarding how to migrate from the former model to the new one.

## Installing beta versions using Unlocked Packages

Follow this set of instructions if you want to deploy the library in its most recent build to a more permanent environment than a Scratch org or if you don't want to install the local developement tools. You can use a non source-tracked orgs such as a free [Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/), or one of your sandboxes.

1. Log in to your org

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dnflAAA" title="sfGpsDs">this link</a> to install the sfGpsDs unlocked package in your org (only when developing your own design system or as a dependency for a third-party).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dzCPAAY" title="sfGpsDsAuNswFull">this link</a> to install the sfGpsDsAuNsw unlocked package in your org (with sfGpsDs included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dytpAAA" title="sfGpsDsAuNswSFull">this link</a> to install the sfGpsDsAuNswS unlocked package in your org (with sfGpsDs included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dytuAAA" title="sfGpsDsAuVic1Full">this link</a> to install the sfGpsDsAuVic unlocked package in your org (with sfGpsDs included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dytzAAA" title="sfGpsDsFrGovFull">this link</a> to install the sfGpsDsFrGov unlocked package in your org (with sfGpsDs included).

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dyu4AAA" title="sfGpsDsUkGovFull">this link</a> to install the sfGpsDsUkGov unlocked package in your org (with sfGpsDs included).

## Installing the production versions using Unlocked Packages

Kindly note that the packages might be the same as for non-production orgs (see above) if the latest successful build has alreay been promoted for production.

Make sure you fully understand the [support](./SUPPORT.md) and [security](./SECURITY.md) implications of installing those assets in production. The applicable [license](./LICENSE.md) has also wide-ranging disclaimer provisions.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dnflAAA">this link</a> to install the sfGpsDs unlocked package in your production org (v2.2.0.1 released on 24/11/2024 -- only when using your own design system or a dependent third-party's).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dwozAAA">this link</a> to install the sfGpsDsAuNsw unlocked package in your production org (v2.3.5.1 released on 08/01/2024).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dwp4AAA">this link</a> to install the sfGpsDsAuNswS unlocked package in your production org (v2.3.5.1 on 08/01/2024).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dlHEAAY">this link</a> to install the sfGpsDsAuVic unlocked package in your production org (v2.3.5.1 on 08/01/2024). Please **do let us know** when doing so for non-educational use as we aim at supporting early adopters and gathering feedback.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000dqCoAAI">this link</a> to install the sfGpsDsUkGov unlocked package in your production org (including sfGpsDs, v1.0.3.1 on 01/12/2023). Please **do let us know** when doing so for non-educational use as we aim at supporting early adopters and gathering feedback.

## Moving away from separate base and design system libraries

With dependencies now included in each jursidiction's design system library, you will find there is a conflict on files that used to be located in the sfGpsDs library if you try to upgrade a design system, unless you make the contents of former `sfGpsDs` lib deprecated. The workflow to do so is as follows:

- upgrade `sfGpsDs` to a version we packaged with all artefacts marked as deprecated -- **this must be done on the command line** using `sfdx package install --package=04t5j000000dnflAAA --upgrade-type=DeprecateOnly` ,
- upgrade the jurisdiction's design system library to a version with the former `sfGpsDs` dependencies included using one of the links above,
- uninstall `sfGpsDs` now that all deprecated files have been absorbed.

## Support, security, contributions and code of conduct

Do read our other guidelines:

- [support](./SUPPORT.md)
- [troubleshooting](./TROUBLESHOOT.md)
- [security](./SECURITY.md)
- [contribution](./CONTRIBUTION.md)
- [code of conduct](./CODE_OF_CONDUCT.md)
