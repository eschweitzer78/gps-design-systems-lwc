# Decision Explainer Component - Setup Guide

This guide covers the setup required to use the Ontario Design System Decision Explainer component, which integrates with Salesforce's Business Rules Engine DecisionExplainer API.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Connected App Setup](#connected-app-setup)
3. [Named Credential Configuration](#named-credential-configuration)
4. [Permission Set Configuration](#permission-set-configuration)
5. [Expression Set Configuration](#expression-set-configuration)
6. [Component Deployment](#component-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up the Decision Explainer component, ensure you have:

- [ ] Salesforce org with **Business Rules Engine** enabled
- [ ] **System Administrator** profile or equivalent permissions
- [ ] Access to **Setup** menu
- [ ] Expression Sets configured with explainability message templates
- [ ] (Optional) OmniStudio license if using Integration Procedures

### Required Salesforce Features

| Feature               | Description                      | How to Enable                                    |
| --------------------- | -------------------------------- | ------------------------------------------------ |
| Business Rules Engine | Core feature for expression sets | Setup → Feature Settings → Business Rules Engine |
| Expression Sets       | Define business rules            | Setup → Expression Sets                          |
| Decision Explainer    | Explainability API               | Enabled with Business Rules Engine               |
| API Access            | REST API capabilities            | Included in most editions                        |

---

## Connected App Setup

A Connected App is required to authenticate API requests for the Decision Explainer. Follow these steps to create and configure it.

### Step 1: Create the Connected App

1. Navigate to **Setup** → **App Manager**
2. Click **New Connected App**
3. Fill in the **Basic Information**:

   | Field              | Value                                                                                      |
   | ------------------ | ------------------------------------------------------------------------------------------ |
   | Connected App Name | `Ontario DS Decision Explainer`                                                            |
   | API Name           | `Ontario_DS_Decision_Explainer`                                                            |
   | Contact Email      | Your admin email                                                                           |
   | Description        | `Connected App for Decision Explainer API integration in Ontario Design System components` |

4. Check **Enable OAuth Settings**

### Step 2: Configure OAuth Settings

1. In the **OAuth Settings** section, configure:

   | Setting                                    | Value                                                                           |
   | ------------------------------------------ | ------------------------------------------------------------------------------- |
   | Callback URL                               | `https://login.salesforce.com/services/oauth2/callback` (or your My Domain URL) |
   | Selected OAuth Scopes                      | See table below                                                                 |
   | Require Proof Key for Code Exchange (PKCE) | ✓ Recommended                                                                   |
   | Require Secret for Web Server Flow         | ✓ Recommended                                                                   |
   | Require Secret for Refresh Token Flow      | ✓ Recommended                                                                   |

2. **Required OAuth Scopes:**

   | Scope                             | API Name                        | Purpose                       |
   | --------------------------------- | ------------------------------- | ----------------------------- |
   | Access Connect REST API resources | `chatter_api`                   | Required for ConnectApi calls |
   | Manage user data via APIs         | `api`                           | General API access            |
   | Perform requests at any time      | `refresh_token, offline_access` | Token refresh                 |
   | Access custom permissions         | `custom_permissions`            | Permission checks             |

3. Click **Save**

### Step 3: Note Your Credentials

After saving, note the following (you'll need these for Named Credentials):

- **Consumer Key** (Client ID)
- **Consumer Secret** (Client Secret) - Click "Click to reveal"

> ⚠️ **Security Note:** Store these credentials securely. Never commit them to version control.

### Step 4: Manage Connected App Policies

1. After creation, click **Manage** on the Connected App
2. Click **Edit Policies**
3. Configure the following:

   | Setting              | Recommended Value                                                           |
   | -------------------- | --------------------------------------------------------------------------- |
   | Permitted Users      | Admin approved users are pre-authorized                                     |
   | IP Relaxation        | Relax IP restrictions (for testing) or Enforce IP restrictions (production) |
   | Refresh Token Policy | Refresh token is valid until revoked                                        |
   | Session Timeout      | 2 hours (or as per your security policy)                                    |

4. Click **Save**

---

## Named Credential Configuration

Named Credentials provide a secure way to store and use authentication in Apex callouts. This is the recommended approach for production.

### Step 1: Create an External Credential

1. Navigate to **Setup** → **Named Credentials** → **External Credentials**
2. Click **New**
3. Configure:

   | Field                    | Value                                      |
   | ------------------------ | ------------------------------------------ |
   | Label                    | `Decision Explainer API`                   |
   | Name                     | `Decision_Explainer_API`                   |
   | Authentication Protocol  | OAuth 2.0                                  |
   | Authentication Flow Type | Client Credentials with Client Secret Flow |

4. Add the Authentication Provider:
   - **Identity Provider URL**: `https://login.salesforce.com` (or your My Domain)
   - **Consumer Key**: From Connected App
   - **Consumer Secret**: From Connected App
   - **Scopes**: `api chatter_api`

5. Click **Save**

### Step 2: Create the Named Credential

1. Navigate to **Setup** → **Named Credentials** → **Named Credentials**
2. Click **New**
3. Configure:

   | Field                         | Value                                     |
   | ----------------------------- | ----------------------------------------- |
   | Label                         | `Decision Explainer`                      |
   | Name                          | `Decision_Explainer`                      |
   | URL                           | `https://[YOUR_DOMAIN].my.salesforce.com` |
   | External Credential           | Decision Explainer API                    |
   | Generate Authorization Header | ✓ Checked                                 |
   | Allow Formulas in HTTP Header | ✓ Checked                                 |
   | Allow Formulas in HTTP Body   | ✓ Checked                                 |

4. Click **Save**

### Step 3: Create a Principal

1. On the External Credential, click **New** under Principals
2. Configure:

   | Field           | Value                        |
   | --------------- | ---------------------------- |
   | Parameter Name  | `DecisionExplainerPrincipal` |
   | Sequence Number | 1                            |
   | Identity Type   | Named Principal              |

3. Click **Save**
4. Add authentication parameters as needed

---

## Permission Set Configuration

Create a permission set to grant users access to the Decision Explainer functionality.

### Step 1: Create Permission Set

1. Navigate to **Setup** → **Permission Sets**
2. Click **New**
3. Configure:

   | Field       | Value                                                     |
   | ----------- | --------------------------------------------------------- |
   | Label       | `Ontario DS Decision Explainer User`                      |
   | API Name    | `Ontario_DS_Decision_Explainer_User`                      |
   | Description | `Grants access to Decision Explainer components and APIs` |
   | License     | None (or Salesforce if required)                          |

4. Click **Save**

### Step 2: Configure Apex Class Access

1. In the Permission Set, click **Apex Class Access**
2. Click **Edit**
3. Add the following classes:
   - `SfGpsDsCaOnDecisionExplainerController`

4. Click **Save**

### Step 3: Configure External Credential Principal Access

1. In the Permission Set, click **External Credential Principal Access**
2. Click **Edit**
3. Add: `Decision_Explainer_API - DecisionExplainerPrincipal`
4. Click **Save**

### Step 4: Configure Object Permissions (if needed)

If your expression sets reference custom objects, add appropriate object permissions:

1. Click **Object Settings**
2. For each relevant object, grant:
   - Read access (minimum)
   - Field-level access as needed

### Step 5: Assign Permission Set to Users

1. Click **Manage Assignments**
2. Click **Add Assignments**
3. Select users who need Decision Explainer access
4. Click **Assign**

---

## Expression Set Configuration

The Decision Explainer component requires properly configured Expression Sets with explainability enabled.

### Step 1: Create or Open an Expression Set

1. Navigate to **Setup** → **Expression Sets**
2. Create a new Expression Set or open an existing one
3. Note the **API Name** - you'll need this for the component

### Step 2: Enable Decision Explainer

For each step in your Expression Set:

1. Select the step element
2. In the properties panel, find **Decision Explainer**
3. Check **Show decision explanation**
4. Configure:

   | Setting                  | Description                                      |
   | ------------------------ | ------------------------------------------------ |
   | When Step Returns Output | Explainability template for successful execution |
   | When Step Errors         | Explainability template for errors               |
   | Include in Output        | Whether to show detailed calculations            |

### Step 3: Create Explainability Message Templates

1. Navigate to **Setup** → **Explainability Message Templates**
2. Click **New**
3. Create templates for each step:

   ```
   Example Templates:

   Name: EligibilityCheckPass
   Message: Based on your income of {!income} and {!dependents} dependents,
            you meet the eligibility criteria for this benefit.

   Name: EligibilityCheckFail
   Message: Unfortunately, based on the information provided, you do not
            meet the eligibility criteria at this time.
   ```

4. Associate templates with Expression Set steps

### Step 4: Activate the Expression Set

1. Click **Activate** on your Expression Set version
2. Test using the built-in testing tool before deploying

---

## Component Deployment

### Step 1: Deploy the Component

Using Salesforce CLI:

```bash
# Deploy the Ontario DS package including Decision Explainer
sf project deploy start -d sfGpsDsCaOn

# Or deploy specific metadata
sf project deploy start -m ApexClass:SfGpsDsCaOnDecisionExplainerController
sf project deploy start -m ApexClass:SfGpsDsCaOnDecisionExplainerControllerTest
sf project deploy start -m LightningComponentBundle:sfGpsDsCaOnDecisionExplainer
sf project deploy start -m LightningComponentBundle:sfGpsDsCaOnDecisionExplainerComm
```

### Step 2: Verify Deployment

```bash
# Run tests to verify
sf apex run test -n SfGpsDsCaOnDecisionExplainerControllerTest -r human
```

### Step 3: Add to Experience Cloud Page

1. Open **Experience Builder**
2. Navigate to your page
3. Drag **Ontario - Decision Explainer** from Components
4. Configure properties:

   | Property                | Value                                     |
   | ----------------------- | ----------------------------------------- |
   | Heading                 | Your heading text                         |
   | Expression Set API Name | Your expression set API name              |
   | Evaluation Method       | `expressionSet` or `integrationProcedure` |
   | Input Variables (JSON)  | JSON with input data or merge fields      |
   | Default View Mode       | `concise` or `detailed`                   |
   | Auto Evaluate on Load   | Enable if pre-populating inputs           |

5. **Publish** the site

---

## Troubleshooting

### Common Issues and Solutions

#### "Expression set evaluation failed" Error

**Cause:** Expression Set not found or not activated

**Solution:**

1. Verify the Expression Set API Name is correct
2. Ensure the Expression Set version is activated
3. Check user has access to the Expression Set

#### "Unauthorized" or 401 Error

**Cause:** Connected App not authorized or credentials invalid

**Solution:**

1. Verify Connected App is configured correctly
2. Check Named Credential is properly linked
3. Ensure user has External Credential Principal Access
4. Re-authorize the Connected App if needed

#### "OmniStudio is not available" Error

**Cause:** Trying to use Integration Procedure method without OmniStudio

**Solution:**

1. Switch to `expressionSet` evaluation method
2. Or install/enable OmniStudio package

#### No Explanations Showing

**Cause:** Explainability not enabled on Expression Set steps

**Solution:**

1. Edit Expression Set version
2. Enable "Show decision explanation" on each step
3. Associate Explainability Message Templates
4. Reactivate the Expression Set version

#### "Access denied" Error

**Cause:** Missing permissions

**Solution:**

1. Verify user has the Decision Explainer permission set
2. Check Apex Class Access includes the controller
3. Verify object permissions if using custom objects

### Debug Mode

To enable debug logging:

1. Navigate to **Setup** → **Debug Logs**
2. Add a trace flag for the user
3. Set **Apex Code** level to `DEBUG` or `FINE`
4. Reproduce the issue
5. Review logs for detailed error information

### Test the API Directly

You can test the API using Workbench or Postman:

```
GET /services/data/v62.0/connect/expression-sets/{expressionSetApiName}/evaluate
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "inputDataMap": {
    "income": 50000,
    "dependents": 2
  },
  "includeExplanations": true
}
```

---

## Security Considerations

1. **Principle of Least Privilege:** Only grant necessary permissions
2. **Named Credentials:** Always use Named Credentials for API authentication
3. **Connected App Policies:** Use Admin-approved users in production
4. **IP Restrictions:** Enable IP restrictions for production Connected Apps
5. **Audit Logging:** Monitor API usage through Event Monitoring
6. **Sensitive Data:** Use "Include in Output = false" for sensitive calculations

---

## Related Documentation

- [Ontario DS Component API](./COMPONENT_API.md)
- [Salesforce Business Rules Engine Documentation](https://help.salesforce.com/s/articleView?id=sf.business_rules_engine.htm)
- [Expression Sets Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_connect.meta/api_connect/connect_resources_expression_sets.htm)
- [Decision Explainer for Expression Sets](https://help.salesforce.com/s/articleView?id=sf.decision_explainer.htm)

---

## Support

For issues with the Ontario DS Decision Explainer component:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Salesforce Debug Logs
3. Open an issue in the repository with:
   - Error message
   - Steps to reproduce
   - Expression Set configuration (sanitized)
   - Apex debug logs
