# Einstein Search Integration

This guide explains how to use the Ontario Design System search components with Salesforce Einstein Search.

## Overview

The search components support two integration modes:

| Mode         | Method                 | Best For                              |
| ------------ | ---------------------- | ------------------------------------- |
| **SOSL**     | `getSearchSuggestions` | Standard search, works everywhere     |
| **Einstein** | `searchWithEinstein`   | Experience Cloud with personalization |

Both methods automatically leverage Einstein Search when it's enabled in your org.

## Quick Start

### 1. Add the Component

```html
<c-sf-gps-ds-ca-on-search-einstein
  label="Search"
  placeholder="Search for articles..."
  object-types="Knowledge__kav,Account,Contact"
  max-results="10"
  onselect="{handleSearchSelect}"
></c-sf-gps-ds-ca-on-search-einstein>
```

### 2. Handle Selection

```javascript
handleSearchSelect(event) {
  const { id, label, objectType, url } = event.detail;
  // Navigate to the selected record
  this[NavigationMixin.Navigate]({
    type: 'standard__webPage',
    attributes: { url }
  });
}
```

## Components

### sfGpsDsCaOnSearchEinstein

Complete search component with built-in Apex integration.

#### Properties

| Property        | Type    | Default           | Description             |
| --------------- | ------- | ----------------- | ----------------------- |
| `label`         | String  | "Search"          | Input label             |
| `placeholder`   | String  | "Search..."       | Placeholder text        |
| `hintText`      | String  |                   | Helper text             |
| `maxResults`    | Integer | 10                | Max results to show     |
| `minChars`      | Integer | 2                 | Min chars before search |
| `debounceMs`    | Integer | 300               | Debounce delay          |
| `objectTypes`   | String  | "Account,Contact" | Objects to search       |
| `useEinstein`   | Boolean | false             | Use Connect API         |
| `searchGroup`   | String  | "ALL"             | Einstein search scope   |
| `noResultsText` | String  |                   | No results message      |

#### Events

| Event    | Detail                           | Description             |
| -------- | -------------------------------- | ----------------------- |
| `select` | `{ id, label, objectType, url }` | User selected a result  |
| `submit` | `{ value }`                      | User pressed Enter      |
| `clear`  |                                  | User cleared the search |

### sfGpsDsCaOnSearch

UI-only component (no Apex). Use when you need custom search logic.

## Apex Controller

### Methods

#### getSearchSuggestions (SOSL)

```apex
@AuraEnabled(cacheable=true)
public static List<SearchResult> getSearchSuggestions(
    String searchTerm,    // Search query
    String objectTypes,   // Comma-separated objects
    Integer maxResults    // Max results per object
)
```

#### searchWithEinstein (Connect API)

```apex
@AuraEnabled(cacheable=true)
public static List<SearchResult> searchWithEinstein(
    String searchTerm,   // Search query
    String searchGroup,  // ALL, NAME, EMAIL, PHONE, SIDEBAR
    Integer maxResults   // Max total results
)
```

### SearchResult Class

```apex
public class SearchResult {
  @AuraEnabled
  public String id; // Record ID
  @AuraEnabled
  public String label; // Display name
  @AuraEnabled
  public String objectType; // Object label
  @AuraEnabled
  public String url; // Navigation URL
}
```

## Einstein Search Configuration

### Enabling Einstein Search

1. Go to **Setup** → **Einstein Search**
2. Click **Enable Einstein Search**
3. Configure searchable objects
4. Wait for initial indexing (can take hours)

### Requirements

| Feature         | Requirement                      |
| --------------- | -------------------------------- |
| Einstein Search | Enterprise Edition or higher     |
| Connect API     | Experience Cloud site            |
| Personalization | Einstein enabled + user activity |

### Search Groups

| Group     | Searches              |
| --------- | --------------------- |
| `ALL`     | All indexed fields    |
| `NAME`    | Name fields only      |
| `EMAIL`   | Email fields only     |
| `PHONE`   | Phone fields only     |
| `SIDEBAR` | Global search sidebar |

## Usage Examples

### Basic Knowledge Search

```html
<c-sf-gps-ds-ca-on-search-einstein
  label="Search Help Articles"
  object-types="Knowledge__kav"
  max-results="8"
  onselect="{handleArticleSelect}"
></c-sf-gps-ds-ca-on-search-einstein>
```

### Einstein-Powered Search

```html
<c-sf-gps-ds-ca-on-search-einstein
  label="Search"
  use-einstein="true"
  search-group="ALL"
  max-results="15"
  onselect="{handleSelect}"
></c-sf-gps-ds-ca-on-search-einstein>
```

### Multi-Object Search

```html
<c-sf-gps-ds-ca-on-search-einstein
  label="Find Records"
  object-types="Account,Contact,Case,Knowledge__kav"
  max-results="5"
  onselect="{handleSelect}"
></c-sf-gps-ds-ca-on-search-einstein>
```

### Custom UI with Wire Adapter

```javascript
import { wire } from "lwc";
import getSearchSuggestions from "@salesforce/apex/SfGpsDsCaOnSearchController.getSearchSuggestions";

export default class CustomSearch extends LightningElement {
  searchTerm = "";

  @wire(getSearchSuggestions, {
    searchTerm: "$searchTerm",
    objectTypes: "Account,Contact",
    maxResults: 10
  })
  searchResults;

  handleInput(event) {
    this.searchTerm = event.target.value;
  }
}
```

## Security Considerations

### Apex Security

The controller uses `with sharing` to respect:

- Record-level security (sharing rules)
- Field-level security (FLS)
- Object permissions

### Input Sanitization

```apex
// Search terms are escaped to prevent SOSL injection
String sanitizedTerm = String.escapeSingleQuotes(searchTerm.trim());
```

### Error Handling

```apex
try {
    // Search logic
} catch (Exception e) {
    System.debug(LoggingLevel.ERROR, 'Search error: ' + e.getMessage());
    // Return empty results - don't expose error details
}
```

## Performance

### Caching

Both methods use `@AuraEnabled(cacheable=true)`:

- Results cached on client
- Same search term returns cached results
- Cache invalidates on data changes

### Debouncing

The component debounces input (default 300ms):

- Prevents excessive API calls
- Smooth user experience
- Configurable via `debounceMs`

### Result Limits

| Limit           | Value   |
| --------------- | ------- |
| SOSL per object | 50 max  |
| Einstein total  | 100 max |
| Default shown   | 10      |

## Troubleshooting

### No Results Appearing

1. **Check minimum characters** - Default is 2
2. **Verify object permissions** - User must have access
3. **Check searchable fields** - Objects must be searchable
4. **Einstein indexing** - May take time after enabling

### Einstein Not Working

1. **Check Network ID** - Only works in Experience Cloud
2. **Verify Einstein enabled** - Setup → Einstein Search
3. **Check fallback** - Should fall back to SOSL

### Slow Search

1. **Increase debounce** - Try 500ms
2. **Reduce objects** - Search fewer object types
3. **Lower max results** - Reduce to 5-10

## Testing

### Unit Test Example

```apex
@isTest
static void testSearchSuggestions() {
    // Create test data
    Account acc = new Account(Name = 'Test Account');
    insert acc;

    Test.startTest();
    Test.setFixedSearchResults(new List<Id>{ acc.Id });

    List<SfGpsDsCaOnSearchController.SearchResult> results =
        SfGpsDsCaOnSearchController.getSearchSuggestions('Test', 'Account', 10);
    Test.stopTest();

    System.assertNotEquals(0, results.size());
}
```

### LWC Test Example

```javascript
import { createElement } from "lwc";
import SearchEinstein from "c/sfGpsDsCaOnSearchEinstein";

describe("c-sf-gps-ds-ca-on-search-einstein", () => {
  it("renders search component", () => {
    const element = createElement("c-sf-gps-ds-ca-on-search-einstein", {
      is: SearchEinstein
    });
    element.label = "Search";
    document.body.appendChild(element);

    const searchComponent = element.shadowRoot.querySelector(
      "c-sf-gps-ds-ca-on-search"
    );
    expect(searchComponent).not.toBeNull();
  });
});
```

## Resources

- [Einstein Search Documentation](https://help.salesforce.com/s/articleView?id=sf.search_einstein.htm)
- [Connect API Search](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_ConnectAPI_Search_static_methods.htm)
- [SOSL Reference](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl.htm)
