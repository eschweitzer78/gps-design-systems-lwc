# gps-design-systems-lwc

[![CI Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/CI/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3ACI) [![Packaging Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/Packaging/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3A%22Packaging%22) [![codecov](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc/branch/main/graph/badge.svg)](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc)

A collection of Salesforce Lightning Web Components (LWCs) for selected Governments' Design Systems. The collection
covers Salesforce Experience Cloud as well as Salesforce Communities for Public Sector Solutions (Omnistudio), and may be extended in the future to help with Salesforce Flows provided they're surfaced via an Experience Cloud community.

Note that at this stage there is a dependency on Omnistudio **242.11 (at the minimum)**.

Do read our [change log](./CHANGELOG.md) if you plan on updating already installed packages in order to check for changes in behaviour or configuration changes.

## Structure

- sfGpsDs is the folder for code that is reusable across individual design systems supported by this repo and sfdx project; it must be installed as a first step.
- sfGpsDsAuNsw is the folder for code and assets pertaining to the Design System of New South Wales, Australia; check the [documentation web site](https://nswds.dsforce.dev)
- sfGpsDsAuNswS is the folder for code and assets pertaining to the specific Design System of Service NSW, New South Wales, Australia; check the [documentation website](https://nsws.dsforce.dev)
- sfGpsDsAuVic is the folder for code and assets to the Design System of Victoria, Australia (pilot, no production without prior consultation); check the [documentation website](https://vic.dsforce.dev)
- sfGpsDsUkGov is the folder for code and assets to the Design System of the United Kingdom (early alpha, no production)

## Installing beta versions using Unlocked Packages

Follow this set of instructions if you want to deploy the library in its most recent build to a more permanent environment than a Scratch org or if you don't want to install the local developement tools. You can use a non source-tracked orgs such as a free [Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/), or one of your sandboxes.

1. Log in to your org

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lCa7AAE" title="sfGpsDs">this link</a> to install the sfGpsDs unlocked package in your org.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lMg5AAE" title="sfGpsDsAuNsw">this link</a> to install the sfGpsDsAuNsw unlocked package in your org.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lMgFAAU" title="sfGpsDsAuNswS">this link</a> to install the sfGpsDsAuNswS unlocked package in your org.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lCeoAAE" title="sfGpsDsAuVic">this link</a> to install the sfGpsDsAuVic unlocked package in your org.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lKE4AAM" title="sfGpsDsUkGov">this link</a> to install the sfGpsDsUkGov unlocked package in your org.

1. Click <a href="https://test.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lKE9AAM" title="sfGpsDsUkGovFull">this link</a> to install the full sfGpsDsUkGov unlocked package in your org (including sfGpsDs).

## Installing the production versions using Unlocked Packages

Kindly note that the packages might be the same as for non-production orgs (see above) if the latest successful build has alreay been promoted for production.

Make sure you fully understand the [support](./SUPPORT.md) and [security](./SECURITY.md) implications of installing those assets in production. The applicable [license](./LICENSE.md) has also wide-ranging disclaimer provisions.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0v0AAA">this link</a> to install the sfGpsDs unlocked package in your production org (v1.8.2.2 released on 22/06/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lMg5AAE">this link</a> to install the sfGpsDsAuNsw unlocked package in your production org (v1.8.3.3 released on 28/08/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000lMgFAAU">this link</a> to install the sfGpsDsAuNswS unlocked package in your production org (v1.8.3.3 on 28/08/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0tnAAA">this link</a> to install the sfGpsDsAuVic unlocked package in your production org (v1.8.0.2 on 16/06/2023). Please **do let us know** when doing so for non-educational use as we aim at supporting early adopters and gathering feedback.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000HzyGAAS
   " title="sfGpsDsUkGov">this link</a> to install the sfGpsDsUkGov unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=0055j000005KB7aAAG
   " title="sfGpsDsUkGovFull">this link</a> to install the full sfGpsDsUkGov unlocked package in your org (including sfGpsDs).

## Support, security, contributions and code of conduct

Do read our other guidelines:

- [support](./SUPPORT.md)
- [security](./SECURITY.md)
- [contribution](./CONTRIBUTION.md)
- [code of conduct](./CODE_OF_CONDUCT.md)
