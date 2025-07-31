# JobTracker CRM Chrome Extension

This Chrome extension allows you to extract job data from job posting websites and send it directly to your JobTracker CRM.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `chrome-extension` folder
4. The extension will appear in your browser toolbar

## Setup

1. Click the extension icon and sign in with your JobTracker CRM account
2. Or right-click on any webpage and select "Save to JobTracker CRM"

## Supported Websites

The extension can extract job data from:
- LinkedIn Jobs
- Indeed
- Glassdoor
- AngelList/Wellfound
- Generic job posting sites

## Usage

1. Navigate to a job posting
2. Click the JobTracker extension icon
3. Click "Extract Job Data" to auto-fill the form
4. Review and edit the information
5. Click "Save to CRM" to add the job to your tracker

## Features

- **Auto-extraction**: Automatically detects and extracts job information
- **Smart parsing**: Works with major job sites' HTML structures
- **Manual editing**: Always review and edit extracted data before saving
- **Direct integration**: Saves directly to your Firebase-powered CRM
- **Secure authentication**: Uses Firebase Auth for secure login

## Configuration

Access the extension options page to:
- Configure your CRM API URL
- Manage authentication
- View usage instructions

## File Structure

```
chrome-extension/
├── manifest.json      # Extension configuration
├── popup.html         # Main popup interface
├── popup.js          # Popup logic and API calls
├── content.js        # Job data extraction logic
├── background.js     # Background service worker
├── options.html      # Settings page
└── options.js        # Settings management
```

## Development

To modify the extension:

1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the JobTracker extension
4. Test your changes

## Security Notes

- The extension only extracts publicly visible job data
- All authentication is handled securely through Firebase
- No sensitive data is stored locally beyond auth tokens
- Data transmission uses HTTPS

## Troubleshooting

**Extension not working on a job site?**
- Check the browser console for errors
- The site might have a unique HTML structure
- You can manually enter job data in the popup

**Login issues?**
- Make sure you're using the same email as your CRM account
- Check that the API URL is configured correctly
- Try clearing authentication in the options page

**Data not saving?**
- Ensure you're connected to the internet
- Check that your CRM server is running
- Verify the API endpoint in options