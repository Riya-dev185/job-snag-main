// JobTracker CRM Extension Options Script

class OptionsManager {
  constructor() {
    this.initializeElements();
    this.loadSettings();
    this.attachEventListeners();
    this.loadAccountInfo();
  }

  initializeElements() {
    this.apiUrlInput = document.getElementById('apiUrl');
    this.saveSettingsBtn = document.getElementById('saveSettings');
    this.clearAuthBtn = document.getElementById('clearAuth');
    this.settingsStatus = document.getElementById('settingsStatus');
    this.accountInfo = document.getElementById('accountInfo');
  }

  attachEventListeners() {
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    this.clearAuthBtn.addEventListener('click', () => this.clearAuthentication());
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['apiUrl']);
      if (result.apiUrl) {
        this.apiUrlInput.value = result.apiUrl;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async saveSettings() {
    const apiUrl = this.apiUrlInput.value.trim();
    
    if (!apiUrl) {
      this.showStatus('API URL is required', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ apiUrl });
      this.showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('Failed to save settings', 'error');
    }
  }

  async loadAccountInfo() {
    try {
      const result = await chrome.storage.local.get(['userEmail', 'authToken']);
      if (result.userEmail && result.authToken) {
        this.accountInfo.innerHTML = `
          <p><strong>Signed in as:</strong> ${result.userEmail}</p>
          <p><strong>Status:</strong> Active</p>
        `;
      } else {
        this.accountInfo.innerHTML = '<p>Not signed in</p>';
      }
    } catch (error) {
      console.error('Error loading account info:', error);
      this.accountInfo.innerHTML = '<p>Error loading account information</p>';
    }
  }

  async clearAuthentication() {
    if (confirm('Are you sure you want to clear your authentication? You will need to sign in again.')) {
      try {
        await chrome.storage.local.remove(['authToken', 'userEmail']);
        this.showStatus('Authentication cleared successfully!', 'success');
        this.loadAccountInfo();
      } catch (error) {
        console.error('Error clearing authentication:', error);
        this.showStatus('Failed to clear authentication', 'error');
      }
    }
  }

  showStatus(message, type = 'success') {
    this.settingsStatus.textContent = message;
    this.settingsStatus.className = `status ${type}`;
    this.settingsStatus.style.display = 'block';
    
    setTimeout(() => {
      this.settingsStatus.style.display = 'none';
    }, 3000);
  }
}

// Initialize options when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});