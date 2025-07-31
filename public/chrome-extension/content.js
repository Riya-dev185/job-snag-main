// JobTracker CRM Extension Content Script
class JobDataExtractor {
  constructor() {
    this.setupMessageListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'extractJobData') {
        const jobData = this.extractJobData();
        sendResponse({ success: true, data: jobData });
      }
      return true;
    });
  }

  extractJobData() {
    const url = window.location.href;
    const hostname = window.location.hostname;
    
    let extractedData = {
      company: '',
      position: '',
      location: '',
      salary: '',
      description: ''
    };

    // LinkedIn job extraction
    if (hostname.includes('linkedin.com')) {
      extractedData = this.extractLinkedInData();
    }
    // Indeed job extraction
    else if (hostname.includes('indeed.com')) {
      extractedData = this.extractIndeedData();
    }
    // Glassdoor job extraction
    else if (hostname.includes('glassdoor.com')) {
      extractedData = this.extractGlassdoorData();
    }
    // AngelList/Wellfound job extraction
    else if (hostname.includes('angel.co') || hostname.includes('wellfound.com')) {
      extractedData = this.extractAngelListData();
    }
    // Generic extraction for other sites
    else {
      extractedData = this.extractGenericData();
    }

    console.log('Extracted job data:', extractedData);
    return extractedData;
  }

  extractLinkedInData() {
    const data = {};
    
    // Company name
    const companyElement = document.querySelector('.jobs-unified-top-card__company-name a, .job-details-jobs-unified-top-card__company-name a, .jobs-company-name');
    data.company = companyElement ? companyElement.textContent.trim() : '';

    // Job title
    const titleElement = document.querySelector('.jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__job-title, h1.jobs-unified-top-card__job-title');
    data.position = titleElement ? titleElement.textContent.trim() : '';

    // Location
    const locationElement = document.querySelector('.jobs-unified-top-card__bullet, .job-details-jobs-unified-top-card__primary-description-container');
    data.location = locationElement ? locationElement.textContent.trim() : '';

    // Salary (if available)
    const salaryElement = document.querySelector('.jobs-details__salary-main-rail-card, .salary');
    data.salary = salaryElement ? salaryElement.textContent.trim() : '';

    return data;
  }

  extractIndeedData() {
    const data = {};
    
    // Company name
    const companyElement = document.querySelector('[data-testid="inlineHeader-companyName"] a, .jobsearch-InlineCompanyRating .jobsearch-InlineCompanyRating-companyHeader a');
    data.company = companyElement ? companyElement.textContent.trim() : '';

    // Job title
    const titleElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"] span, .jobsearch-JobInfoHeader-title span');
    data.position = titleElement ? titleElement.textContent.trim() : '';

    // Location
    const locationElement = document.querySelector('[data-testid="job-location"], .jobsearch-JobInfoHeader-subtitle div');
    data.location = locationElement ? locationElement.textContent.trim() : '';

    // Salary
    const salaryElement = document.querySelector('.jobsearch-JobInfoHeader-salary-container, .icl-u-md-mr--sm .icl-u-xs-mr--xs');
    data.salary = salaryElement ? salaryElement.textContent.trim() : '';

    return data;
  }

  extractGlassdoorData() {
    const data = {};
    
    // Company name
    const companyElement = document.querySelector('.employerName, [data-test="employer-name"]');
    data.company = companyElement ? companyElement.textContent.trim() : '';

    // Job title
    const titleElement = document.querySelector('.jobTitle, [data-test="job-title"]');
    data.position = titleElement ? titleElement.textContent.trim() : '';

    // Location
    const locationElement = document.querySelector('.location, [data-test="job-location"]');
    data.location = locationElement ? locationElement.textContent.trim() : '';

    // Salary
    const salaryElement = document.querySelector('.salary, [data-test="detailSalary"]');
    data.salary = salaryElement ? salaryElement.textContent.trim() : '';

    return data;
  }

  extractAngelListData() {
    const data = {};
    
    // Company name
    const companyElement = document.querySelector('.company h1, .startup-header-title');
    data.company = companyElement ? companyElement.textContent.trim() : '';

    // Job title
    const titleElement = document.querySelector('.job-title h1, .listing-header h1');
    data.position = titleElement ? titleElement.textContent.trim() : '';

    // Location
    const locationElement = document.querySelector('.location, .job-location');
    data.location = locationElement ? locationElement.textContent.trim() : '';

    // Salary
    const salaryElement = document.querySelector('.salary-range, .compensation');
    data.salary = salaryElement ? salaryElement.textContent.trim() : '';

    return data;
  }

  extractGenericData() {
    const data = {};
    
    // Try to find common job-related content
    const titleSelectors = [
      'h1', '.job-title', '.position-title', '[class*="title"]', '[class*="job"]'
    ];
    
    const companySelectors = [
      '.company', '.employer', '[class*="company"]', '[class*="employer"]'
    ];
    
    const locationSelectors = [
      '.location', '.job-location', '[class*="location"]'
    ];

    // Extract title
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim() && !data.position) {
        data.position = element.textContent.trim();
        break;
      }
    }

    // Extract company
    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim() && !data.company) {
        data.company = element.textContent.trim();
        break;
      }
    }

    // Extract location
    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim() && !data.location) {
        data.location = element.textContent.trim();
        break;
      }
    }

    // If we couldn't find specific elements, try the page title
    if (!data.position && !data.company) {
      const pageTitle = document.title;
      if (pageTitle.includes(' at ')) {
        const parts = pageTitle.split(' at ');
        data.position = parts[0].trim();
        data.company = parts[1].split(' - ')[0].trim();
      } else if (pageTitle.includes(' - ')) {
        const parts = pageTitle.split(' - ');
        data.position = parts[0].trim();
        data.company = parts[1].trim();
      }
    }

    return data;
  }
}

// Initialize the extractor
new JobDataExtractor();