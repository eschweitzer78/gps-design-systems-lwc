/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Controller for Ontario Design System Search component
 * Provides unified search functionality for Experience Cloud sites
 */
public with sharing class SfGpsDsCaOnSearchController {
    
    /**
     * Get search suggestions using SOSL
     * @param searchTerm The search term entered by the user
     * @param objectTypes Comma-separated list of Salesforce object API names to search
     * @param maxResults Maximum number of results to return per object type
     * @return List of SearchResult objects
     */
    @AuraEnabled(cacheable=true)
    public static List<SearchResult> getSearchSuggestions(
        String searchTerm, 
        String objectTypes,
        Integer maxResults
    ) {
        List<SearchResult> results = new List<SearchResult>();
        
        // Validate input
        if (String.isBlank(searchTerm) || searchTerm.length() < 2) {
            return results;
        }
        
        // Sanitize and escape the search term
        String sanitizedTerm = String.escapeSingleQuotes(searchTerm.trim());
        
        // Default max results if not specified
        Integer limitPerObject = (maxResults != null && maxResults > 0 && maxResults <= 50) 
            ? maxResults 
            : 10;
        
        // Parse object types or use defaults
        List<String> objects = new List<String>();
        if (String.isNotBlank(objectTypes)) {
            for (String obj : objectTypes.split(',')) {
                String trimmedObj = obj.trim();
                if (String.isNotBlank(trimmedObj)) {
                    objects.add(trimmedObj);
                }
            }
        }
        
        if (objects.isEmpty()) {
            // Default searchable objects for Experience Cloud
            objects.add('Knowledge__kav');
            objects.add('Account');
            objects.add('Contact');
        }
        
        // Build RETURNING clause for each object
        List<String> returnClauses = new List<String>();
        for (String obj : objects) {
            // Build fields based on object type
            String fields = getSearchFieldsForObject(obj);
            returnClauses.add(obj + '(' + fields + ' LIMIT ' + limitPerObject + ')');
        }
        
        // Build and execute SOSL query
        String searchQuery = 'FIND \'' + sanitizedTerm + '*\' IN ALL FIELDS RETURNING ' 
            + String.join(returnClauses, ', ');
        
        try {
            List<List<SObject>> searchResults = Search.query(searchQuery);
            
            // Process results from each object type
            for (Integer i = 0; i < searchResults.size(); i++) {
                String objectType = objects[i];
                for (SObject record : searchResults[i]) {
                    results.add(createSearchResult(record, objectType));
                }
            }
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'Search error: ' + e.getMessage());
            // Return empty results on error - don't expose error details to client
        }
        
        return results;
    }
    
    /**
     * Get appropriate fields for each object type
     */
    private static String getSearchFieldsForObject(String objectType) {
        // Knowledge articles have special fields
        if (objectType.toLowerCase().contains('knowledge')) {
            return 'Id, Title, UrlName, ArticleType';
        }
        
        // Standard objects
        return 'Id, Name';
    }
    
    /**
     * Create a SearchResult from an SObject record
     */
    private static SearchResult createSearchResult(SObject record, String objectType) {
        String recordId = (String)record.get('Id');
        String label;
        String url;
        
        // Handle Knowledge articles differently
        if (objectType.toLowerCase().contains('knowledge')) {
            label = (String)record.get('Title');
            String urlName = (String)record.get('UrlName');
            url = '/article/' + urlName;
        } else {
            label = (String)record.get('Name');
            url = '/' + recordId;
        }
        
        // Get the object label for display
        String typeLabel = getObjectLabel(objectType);
        
        return new SearchResult(recordId, label, typeLabel, url);
    }
    
    /**
     * Get the user-friendly label for an object type
     */
    private static String getObjectLabel(String objectType) {
        try {
            Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(objectType);
            if (sObjectType != null) {
                return sObjectType.getDescribe().getLabel();
            }
        } catch (Exception e) {
            System.debug(LoggingLevel.WARN, 'Could not get label for: ' + objectType);
        }
        return objectType;
    }
    
    /**
     * Search result wrapper class
     */
    public class SearchResult {
        @AuraEnabled public String id { get; set; }
        @AuraEnabled public String label { get; set; }
        @AuraEnabled public String objectType { get; set; }
        @AuraEnabled public String url { get; set; }
        
        public SearchResult(String id, String label, String objectType, String url) {
            this.id = id;
            this.label = label;
            this.objectType = objectType;
            this.url = url;
        }
    }
}
