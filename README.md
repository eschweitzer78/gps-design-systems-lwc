# au-design-systems-lwc

[![CI Workflow](https://github.com/eschweitzer78/au-design-systems-lwc/workflows/CI/badge.svg)](https://github.com/eschwetzer78/au-design-systems-lwc/actions?query=workflow%3ACI) [![Packaging Workflow](https://github.com/eschweitzer78/au-design-systems-lwc/workflows/Packaging/badge.svg)](https://github.com/eschweitzer78/au-design-systems-lwc/actions?query=workflow%3A%22Packaging%22) [![codecov](https://codecov.io/gh/eschweitzer78/au-design-systems-lwc/branch/main/graph/badge.svg)](https://codecov.io/gh/eschweitzer78/au-design-systems-lwc)

A collection of Salesforce Lightning Web Components (LWCs) for Australian Governments' Design Systems. The collection
covers Salesforce Experience Cloud as well as Salesforce Communities for Public Sector Solutions (Omnistudio), and may be extended in the future to help with Salesforce Flows provided they're surfaced via an Experience Cloud community.

Note that at this stage there is a dependency on Omnistudio 240.

## Structure

- sfGpsDs is the folder for code that is reusable across individual design systems supported by this repo and sfdx project
- sfGpsDsAuNsw is the folder for code and assets pertaining to the Design System of New South Wales, Australia; check the [documentation web site](https://nsw.dsforce.dev)
- sfGpsDsAuNswS is the folder for code and assets pertaining to the specific Design System of Service NSW, New South Wales, Australia; check the [documentation website](https://nsws.dsforce.dev)
- sfGpsDsAuVic is the folder for code and assets to the Design System of Victoria, Australia (pilot, no production); check the [documentation website](https://vic.dsforce.dev)
- sfGpsDsUkGov is the folder for code and assets to the Design System of the United Kingdom (alpha, no production)

## Installing beta versions using Unlocked Packages

Follow this set of instructions if you want to deploy the library in its most recent build to a more permanent environment than a Scratch org or if you don't want to install the local developement tools. You can use a non source-tracked orgs such as a free [Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/), or one of your sandboxes.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNH6AAO" title="sfGpsDs">this link</a> to install the sfGpsDs unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNHBAA4" title="sfGpsDsAuNsw">this link</a> to install the sfGpsDsAuNsw unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNHGAA4" title="sfGpsDsAuNswS">this link</a> to install the sfGpsDsAuNswS unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNHLAA4" title="sfGpsDsAuVic">this link</a> to install the sfGpsDsAuVic unlocked package in your org.

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNHQAA4" title="sfGpsDsUkGov">this link</a> to install the sfGpsDsUkGov unlocked package in your org.

## Installing the production version using Unlocked Packages

Kindly note that the packages might be the same as for non-production orgs (see above) if the latest successful build has alreay been promoted for production.

1. Log in to your org

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNFtAAO">this link</a> to install the sfGpsDs unlocked package in your production org (v1.4.0.1 on 04/02/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNFyAAO">this link</a> to install the sfGpsDsAuNsw unlocked package in your production org (v1.4.0.1 on 04/02/2023).

1. Click <a href="https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5j000000MNG3AAO">this link</a> to install the sfGpsDsAuNswS unlocked package in your production org (v1.4.0.1 on 04/02/2023).
