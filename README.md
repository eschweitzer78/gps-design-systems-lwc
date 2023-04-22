# gps-design-systems-lwc

[![CI Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/CI/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3ACI) [![Packaging Workflow](https://github.com/eschweitzer78/gps-design-systems-lwc/workflows/Packaging/badge.svg)](https://github.com/eschweitzer78/gps-design-systems-lwc/actions?query=workflow%3A%22Packaging%22) [![codecov](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc/branch/main/graph/badge.svg)](https://codecov.io/gh/eschweitzer78/gps-design-systems-lwc)

A collection of Salesforce Lightning Web Components (LWCs) for selected Governments' Design Systems. The collection
covers Salesforce Experience Cloud as well as Salesforce Communities for Public Sector Solutions (Omnistudio), and may be extended in the future to help with Salesforce Flows provided they're surfaced via an Experience Cloud community.

Note that at this stage there is a dependency on Omnistudio 242.

## Structure

- sfGpsDs is the folder for code that is reusable across individual design systems supported by this repo and sfdx project; it must be installed as a first step.
- sfGpsDsAuNsw is the folder for code and assets pertaining to the Design System of New South Wales, Australia; check the [documentation web site](https://nswds.dsforce.dev)
- sfGpsDsAuNswS is the folder for code and assets pertaining to the specific Design System of Service NSW, New South Wales, Australia; check the [documentation website](https://nsws.dsforce.dev)
- sfGpsDsAuVic is the folder for code and assets to the Design System of Victoria, Australia (pilot, no production without prior consultation); check the [documentation website](https://vic.dsforce.dev)
- sfGpsDsUkGov is the folder for code and assets to the Design System of the United Kingdom (early alpha, no production)

## Installing beta versions using Unlocked Packages

Follow this set of instructions if you want to deploy the library in its most recent build to a more permanent environment than a Scratch org or if you don't want to install the local developement tools. You can use a non source-tracked orgs such as a free [Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/), or one of your sandboxes.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0XWAAY" title="sfGpsDs">this link</a> to install the sfGpsDs unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0XbAAI" title="sfGpsDsAuNsw">this link</a> to install the sfGpsDsAuNsw unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0VLAAY" title="sfGpsDsAuNswS">this link</a> to install the sfGpsDsAuNswS unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0WiAAI" title="sfGpsDsAuVic">this link</a> to install the sfGpsDsAuVic unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0VVAAY" title="sfGpsDsUkGov">this link</a> to install the sfGpsDsUkGov unlocked package in your org.

## Installing the production versions using Unlocked Packages

Kindly note that the packages might be the same as for non-production orgs (see above) if the latest successful build has alreay been promoted for production.

Make sure you fully understand the [support](./SUPPORT.md) and [security](./SECURITY.md) implications of installing those assets in production. The applicable [license](./LICENSE.md) has also wide-ranging disclaimer provisions.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0WJAAY">this link</a> to install the sfGpsDs unlocked package in your production org (v1.5.0.7 on 17/04/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0WnAAI">this link</a> to install the sfGpsDsAuNsw unlocked package in your production org (v1.5.0.7 on 17/04/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0VLAAY">this link</a> to install the sfGpsDsAuNswS unlocked package in your production org (v1.5.0.1 on 06/04/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000h0WiAAI">this link</a> to install the sfGpsDsAuVic unlocked package in your production org (v1.5.0.2 on 06/04/2023). Please **do let us know** when doing so for non-educational use as we aim at supporting early adopters and gathering feedback.

## Support, security, contributions and code of conduct

Do read our other guidelines:

- [support](./SUPPORT.md)
- [security](./SECURITY.md)
- [contribution](./CONTRIBUTION.md)
- [code of conduct](./CODE_OF_CONDUCT.md)
