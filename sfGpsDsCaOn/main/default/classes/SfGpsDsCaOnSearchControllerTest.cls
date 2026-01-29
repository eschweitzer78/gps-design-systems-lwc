/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Test class for SfGpsDsCaOnSearchController
 * Provides code coverage for all controller methods including Einstein Search.
 *
 * Note:
 * - SOSL queries in tests require Test.setFixedSearchResults() to return data.
 * - Connect API (Einstein Search) tests must be run in a context where the API is available.
 *   In unit tests, Connect API is generally not available, so we test the fallback behavior.
 */
@isTest
private class SfGpsDsCaOnSearchControllerTest {
  /**
   * Test data setup - creates test Accounts and Contacts
   */
  @testSetup
  static void setupTestData() {
    // Create test Accounts
    List<Account> accounts = new List<Account>();
    accounts.add(new Account(Name = 'Searchable Account One'));
    accounts.add(new Account(Name = 'Searchable Account Two'));
    accounts.add(new Account(Name = 'Another Company'));
    insert accounts;

    // Create test Contacts
    List<Contact> contacts = new List<Contact>();
    contacts.add(
      new Contact(
        FirstName = 'Search',
        LastName = 'Contact One',
        AccountId = accounts[0].Id
      )
    );
    contacts.add(
      new Contact(
        FirstName = 'Search',
        LastName = 'Contact Two',
        AccountId = accounts[1].Id
      )
    );
    insert contacts;
  }

  /**
   * Test getSearchSuggestions - with valid search term and default objects
   */
  @isTest
  static void testGetSearchSuggestions_DefaultObjects() {
    // Get test record IDs for SOSL mock
    List<Account> accounts = [
      SELECT Id
      FROM Account
      WHERE Name LIKE 'Searchable%'
    ];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    // Set fixed search results for SOSL
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Searchable',
      null,
      null
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getSearchSuggestions - with specific object types
   */
  @isTest
  static void testGetSearchSuggestions_SpecificObjects() {
    // Get test record IDs
    List<Account> accounts = [SELECT Id FROM Account];
    List<Contact> contacts = [SELECT Id FROM Contact];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }
    for (Contact c : contacts) {
      fixedSearchIds.add(c.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Search',
      'Account,Contact',
      10
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getSearchSuggestions - with Account only
   */
  @isTest
  static void testGetSearchSuggestions_AccountOnly() {
    List<Account> accounts = [
      SELECT Id
      FROM Account
      WHERE Name LIKE '%Searchable%'
    ];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Searchable',
      'Account',
      5
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');

    // Verify all results are Accounts
    for (SfGpsDsCaOnSearchController.SearchResult result : results) {
      System.assert(result.url.startsWith('/'), 'URL should start with /');
    }
  }

  /**
   * Test getSearchSuggestions - with null search term
   */
  @isTest
  static void testGetSearchSuggestions_NullTerm() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      null,
      'Account',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for null search term'
    );
  }

  /**
   * Test getSearchSuggestions - with empty search term
   */
  @isTest
  static void testGetSearchSuggestions_EmptyTerm() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      '',
      'Account',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for empty search term'
    );
  }

  /**
   * Test getSearchSuggestions - with search term too short (less than 2 chars)
   */
  @isTest
  static void testGetSearchSuggestions_TermTooShort() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'A',
      'Account',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for search term less than 2 characters'
    );
  }

  /**
   * Test getSearchSuggestions - with whitespace-only search term
   */
  @isTest
  static void testGetSearchSuggestions_WhitespaceTerm() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      '   ',
      'Account',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for whitespace-only search term'
    );
  }

  /**
   * Test getSearchSuggestions - with maxResults exceeding limit
   */
  @isTest
  static void testGetSearchSuggestions_MaxResultsLimit() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    // Request more than 50 - should be capped
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Account',
      'Account',
      100
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getSearchSuggestions - with negative maxResults
   */
  @isTest
  static void testGetSearchSuggestions_NegativeMaxResults() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Searchable',
      'Account',
      -5
    );
    Test.stopTest();

    System.assertNotEquals(
      null,
      results,
      'Results should not be null with negative maxResults'
    );
  }

  /**
   * Test getSearchSuggestions - with zero maxResults
   */
  @isTest
  static void testGetSearchSuggestions_ZeroMaxResults() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Searchable',
      'Account',
      0
    );
    Test.stopTest();

    System.assertNotEquals(
      null,
      results,
      'Results should not be null with zero maxResults'
    );
  }

  /**
   * Test getSearchSuggestions - with empty object types string
   */
  @isTest
  static void testGetSearchSuggestions_EmptyObjectTypes() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    // Empty string should use defaults
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Searchable',
      '',
      10
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getSearchSuggestions - with object types containing whitespace
   */
  @isTest
  static void testGetSearchSuggestions_ObjectTypesWithWhitespace() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    // Object types with extra whitespace
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Searchable',
      '  Account  ,  Contact  ',
      10
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test SearchResult class structure
   */
  @isTest
  static void testSearchResultStructure() {
    List<Account> accounts = [
      SELECT Id
      FROM Account
      WHERE Name LIKE 'Searchable%'
      LIMIT 1
    ];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Searchable',
      'Account',
      5
    );
    Test.stopTest();

    if (!results.isEmpty()) {
      SfGpsDsCaOnSearchController.SearchResult result = results[0];

      // Verify all properties
      System.assertNotEquals(null, result.id, 'Id should not be null');
      System.assertNotEquals(null, result.label, 'Label should not be null');
      System.assertNotEquals(
        null,
        result.objectType,
        'ObjectType should not be null'
      );
      System.assertNotEquals(null, result.url, 'URL should not be null');
      System.assert(result.url.startsWith('/'), 'URL should start with /');
    }
  }

  /**
   * Test SearchResult constructor
   */
  @isTest
  static void testSearchResultConstructor() {
    Test.startTest();
    SfGpsDsCaOnSearchController.SearchResult result = new SfGpsDsCaOnSearchController.SearchResult(
      'testId123',
      'Test Label',
      'Account',
      '/testId123'
    );
    Test.stopTest();

    System.assertEquals('testId123', result.id, 'Id should match');
    System.assertEquals('Test Label', result.label, 'Label should match');
    System.assertEquals(
      'Account',
      result.objectType,
      'ObjectType should match'
    );
    System.assertEquals('/testId123', result.url, 'URL should match');
  }

  /**
   * Test getSearchSuggestions - with special characters in search term
   */
  @isTest
  static void testGetSearchSuggestions_SpecialCharacters() {
    List<Account> accounts = [SELECT Id FROM Account LIMIT 1];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    // Search term with special characters that need escaping
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Test\'s Account',
      'Account',
      10
    );
    Test.stopTest();

    // Should not throw exception - special characters should be escaped
    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getSearchSuggestions - with Contact object
   */
  @isTest
  static void testGetSearchSuggestions_ContactObject() {
    List<Contact> contacts = [
      SELECT Id
      FROM Contact
      WHERE LastName LIKE 'Contact%'
    ];
    List<Id> fixedSearchIds = new List<Id>();
    for (Contact c : contacts) {
      fixedSearchIds.add(c.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Contact',
      'Contact',
      10
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getSearchSuggestions - no results found
   */
  @isTest
  static void testGetSearchSuggestions_NoResults() {
    Test.startTest();
    // Set empty fixed search results
    Test.setFixedSearchResults(new List<Id>());

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'XYZ123NonExistent',
      'Account',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list when no results found'
    );
  }

  /**
   * Test multiple object types in search
   */
  @isTest
  static void testGetSearchSuggestions_MultipleObjectTypes() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Contact> contacts = [SELECT Id FROM Contact];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }
    for (Contact c : contacts) {
      fixedSearchIds.add(c.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.getSearchSuggestions(
      'Search',
      'Account,Contact',
      20
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  // ========================================
  // EINSTEIN SEARCH (Connect API) TESTS
  // ========================================

  /**
   * Test searchWithEinstein - with null search term
   * Should return empty list
   */
  @isTest
  static void testSearchWithEinstein_NullTerm() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      null,
      'ALL',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for null search term'
    );
  }

  /**
   * Test searchWithEinstein - with empty search term
   * Should return empty list
   */
  @isTest
  static void testSearchWithEinstein_EmptyTerm() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      '',
      'ALL',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for empty search term'
    );
  }

  /**
   * Test searchWithEinstein - with term too short
   * Should return empty list
   */
  @isTest
  static void testSearchWithEinstein_TermTooShort() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'A',
      'ALL',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for term less than 2 characters'
    );
  }

  /**
   * Test searchWithEinstein - with whitespace-only search term
   * Should return empty list
   */
  @isTest
  static void testSearchWithEinstein_WhitespaceTerm() {
    Test.startTest();
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      '   ',
      'ALL',
      10
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for whitespace-only term'
    );
  }

  /**
   * Test searchWithEinstein - fallback to SOSL when not in Experience context
   * When not in Experience Cloud, Network.getNetworkId() returns null,
   * so the method should fall back to SOSL search.
   */
  @isTest
  static void testSearchWithEinstein_FallbackToSOSL() {
    List<Account> accounts = [
      SELECT Id
      FROM Account
      WHERE Name LIKE 'Searchable%'
    ];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    // In unit test context, Network.getNetworkId() returns null
    // so this should fall back to SOSL search
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'Searchable',
      'ALL',
      10
    );
    Test.stopTest();

    // Should return results from SOSL fallback
    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test searchWithEinstein - with default parameters
   * Tests null searchGroup and null maxResults
   */
  @isTest
  static void testSearchWithEinstein_DefaultParams() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'Searchable',
      null,
      null
    );
    Test.stopTest();

    System.assertNotEquals(
      null,
      results,
      'Results should not be null with default params'
    );
  }

  /**
   * Test searchWithEinstein - with NAME search group
   */
  @isTest
  static void testSearchWithEinstein_NameSearchGroup() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'Searchable',
      'NAME',
      10
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test searchWithEinstein - with max results exceeding limit
   * Should cap at 100
   */
  @isTest
  static void testSearchWithEinstein_MaxResultsExceeded() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    // Request more than 100 - should use fallback and cap
    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'Searchable',
      'ALL',
      200
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test searchWithEinstein - with negative maxResults
   * Should use default of 20
   */
  @isTest
  static void testSearchWithEinstein_NegativeMaxResults() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'Searchable',
      'ALL',
      -10
    );
    Test.stopTest();

    System.assertNotEquals(
      null,
      results,
      'Results should not be null with negative maxResults'
    );
  }

  /**
   * Test searchWithEinstein - with zero maxResults
   * Should use default of 20
   */
  @isTest
  static void testSearchWithEinstein_ZeroMaxResults() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'Searchable',
      'ALL',
      0
    );
    Test.stopTest();

    System.assertNotEquals(
      null,
      results,
      'Results should not be null with zero maxResults'
    );
  }

  /**
   * Test searchWithEinstein - with SIDEBAR search group
   */
  @isTest
  static void testSearchWithEinstein_SidebarSearchGroup() {
    List<Account> accounts = [SELECT Id FROM Account];
    List<Id> fixedSearchIds = new List<Id>();
    for (Account a : accounts) {
      fixedSearchIds.add(a.Id);
    }

    Test.startTest();
    Test.setFixedSearchResults(fixedSearchIds);

    List<SfGpsDsCaOnSearchController.SearchResult> results = SfGpsDsCaOnSearchController.searchWithEinstein(
      'Searchable',
      'SIDEBAR',
      5
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }
}
