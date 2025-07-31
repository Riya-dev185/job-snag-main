// JobTracker CRM Extension Background Script

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: 'saveToJobTracker',
    title: 'Save to JobTracker CRM',
    contexts: ['page', 'selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToJobTracker') {
    // Open the popup
    chrome.action.openPopup();
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup automatically
  // No additional code needed as popup.html is configured in manifest
});