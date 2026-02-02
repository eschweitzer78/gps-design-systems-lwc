/**
 * Test data fixtures for sfGpsDsCaOn E2E tests
 */

/**
 * Ontario addresses for map/geocoding tests
 */
export const testAddresses = {
  toronto: {
    full: '40 St Clair Ave W, Toronto, ON M4V 1M2',
    street: '40 St Clair Ave W',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M4V 1M2',
    coordinates: { lat: 43.6879, lng: -79.3943 }
  },
  ottawa: {
    full: '50 Rideau St, Ottawa, ON K1N 9J7',
    street: '50 Rideau St',
    city: 'Ottawa',
    province: 'ON',
    postalCode: 'K1N 9J7',
    coordinates: { lat: 45.4265, lng: -75.6935 }
  },
  kingston: {
    full: '216 Ontario St, Kingston, ON K7L 2Z3',
    street: '216 Ontario St',
    city: 'Kingston',
    province: 'ON',
    postalCode: 'K7L 2Z3',
    coordinates: { lat: 44.2312, lng: -76.4860 }
  }
};

/**
 * Coordinates in different formats for coordinate input tests
 */
export const testCoordinates = {
  utmZone17: {
    easting: '630000',
    northing: '4830000',
    zone: '17'
  },
  utmZone18: {
    easting: '450000',
    northing: '5000000',
    zone: '18'
  },
  decimal: {
    latitude: '43.6879',
    longitude: '-79.3943'
  },
  dms: {
    latDegrees: '43',
    latMinutes: '41',
    latSeconds: '16.44',
    latDirection: 'N',
    lngDegrees: '79',
    lngMinutes: '23',
    lngSeconds: '39.48',
    lngDirection: 'W'
  }
};

/**
 * NAICS code test data
 */
export const testNaicsCodes = {
  agriculture: {
    sector: '11',
    sectorLabel: '11 Agriculture, forestry, fishing and hunting',
    subSector: '111',
    subSectorLabel: '111 Crop production',
    industryGroup: '1111',
    industryGroupLabel: '1111 Oilseed and grain farming',
    industry: '11111',
    industryLabel: '11111 Soybean farming',
    nationalIndustry: '111110',
    nationalIndustryLabel: '111110 Soybean farming'
  },
  manufacturing: {
    sector: '31',
    sectorLabel: '31 Manufacturing',
    subSector: '311',
    subSectorLabel: '311 Food manufacturing',
    industryGroup: '3111',
    industryGroupLabel: '3111 Animal food manufacturing',
    industry: '31111',
    industryLabel: '31111 Animal food manufacturing',
    nationalIndustry: '311111',
    nationalIndustryLabel: '311111 Dog and cat food manufacturing'
  }
};

/**
 * Search test queries
 */
export const searchQueries = {
  validQuery: 'test search query',
  shortQuery: 'te', // Below minChars threshold
  noResultsQuery: 'xyznonexistent12345',
  specialChars: "O'Brien & Co."
};

/**
 * Form field test data
 */
export const formFieldData = {
  text: {
    label: 'Full Name',
    value: 'John Smith',
    placeholder: 'Enter your full name'
  },
  email: {
    label: 'Email Address',
    value: 'john.smith@example.com',
    invalidValue: 'not-an-email'
  },
  phone: {
    label: 'Phone Number',
    value: '416-555-1234',
    invalidValue: 'abc'
  },
  date: {
    label: 'Date of Birth',
    day: '15',
    month: '6',
    year: '1990',
    isoDate: '1990-06-15'
  },
  textarea: {
    label: 'Comments',
    value: 'This is a test comment with multiple lines.\nSecond line here.',
    maxLength: 500
  }
};

/**
 * Dropdown options test data
 */
export const dropdownOptions = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
  { label: 'Option 4', value: 'opt4' },
  { label: 'Option 5', value: 'opt5' }
];

/**
 * Checkbox/Radio options test data
 */
export const selectionOptions = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' }
];

/**
 * Multi-step form test data
 */
export const multiStepFormData = {
  steps: [
    { label: 'Personal Information', number: 1 },
    { label: 'Contact Details', number: 2 },
    { label: 'Additional Information', number: 3 },
    { label: 'Review & Submit', number: 4 }
  ],
  currentStep: 1,
  totalSteps: 4
};

/**
 * Modal test content
 */
export const modalContent = {
  title: 'Confirm Action',
  body: 'Are you sure you want to proceed with this action?',
  confirmButton: 'Confirm',
  cancelButton: 'Cancel'
};

/**
 * Accordion test content
 */
export const accordionContent = {
  sections: [
    { heading: 'Section 1', content: 'Content for section 1' },
    { heading: 'Section 2', content: 'Content for section 2' },
    { heading: 'Section 3', content: 'Content for section 3' }
  ]
};

/**
 * Table test data
 */
export const tableData = {
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'quantity', label: 'Quantity', isNumeric: true },
    { key: 'price', label: 'Price', isNumeric: true }
  ],
  rows: [
    { name: 'Item A', quantity: 10, price: '$100.00' },
    { name: 'Item B', quantity: 25, price: '$250.00' },
    { name: 'Item C', quantity: 15, price: '$75.00' }
  ],
  footer: { name: 'Total', quantity: 50, price: '$425.00' }
};
