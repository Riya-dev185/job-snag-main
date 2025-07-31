// JobTracker CRM Extension Popup Script
const API_BASE = 'http://localhost:8080'; // Change to your deployed URL

class JobTrackerPopup {
  constructor() {
    this.initializeElements();
    this.attachEventListeners();
    this.checkAuthStatus();
  }

  initializeElements() {
    this.loginForm = document.getElementById('loginForm');
    this.jobForm = document.getElementById('jobForm');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('loginBtn');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.saveBtn = document.getElementById('saveBtn');
    this.statusDiv = document.getElementById('status');
    
    this.companyInput = document.getElementById('company');
    this.positionInput = document.getElementById('position');
    this.locationInput = document.getElementById('location');
    this.salaryInput = document.getElementById('salary');
    this.notesInput = document.getElementById('notes');
  }

  attachEventListeners() {
    this.loginBtn.addEventListener('click', () => this.handleLogin());
    this.logoutBtn.addEventListener('click', () => this.handleLogout());
    this.saveBtn.addEventListener('click', () => this.saveJobToCRM());
    
    // Enter key login
    this.passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleLogin();
      }
    });
  }

  async checkAuthStatus() {
    try {
      const result = await chrome.storage.local.get(['authToken', 'userEmail']);
      if (result.authToken) {
        this.showJobForm();
        await this.extractJobData(); // Auto-extract on popup open
      } else {
        this.showLoginForm();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.showLoginForm();
    }
  }

  showLoginForm() {
    this.loginForm.style.display = 'block';
    this.jobForm.style.display = 'none';
  }

  showJobForm() {
    this.loginForm.style.display = 'none';
    this.jobForm.style.display = 'block';
  }

  showStatus(message, type = 'success') {
    this.statusDiv.textContent = message;
    this.statusDiv.className = `status ${type}`;
    this.statusDiv.style.display = 'block';
    
    setTimeout(() => {
      this.statusDiv.style.display = 'none';
    }, 3000);
  }

  async handleLogin() {
    const email = this.emailInput.value;
    const password = this.passwordInput.value;

    if (!email || !password) {
      this.showStatus('Please enter email and password', 'error');
      return;
    }

    this.loginBtn.disabled = true;
    this.loginBtn.textContent = 'Signing in...';

    try {
      // Note: In a real implementation, you'd want to use Firebase Auth
      // For now, we'll simulate a successful login
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      await chrome.storage.local.set({
        authToken: mockToken,
        userEmail: email
      });

      this.showJobForm();
      this.showStatus('Successfully signed in!');
      
    } catch (error) {
      console.error('Login error:', error);
      this.showStatus('Login failed. Please try again.', 'error');
    } finally {
      this.loginBtn.disabled = false;
      this.loginBtn.textContent = 'Sign In';
    }
  }

  async handleLogout() {
    await chrome.storage.local.remove(['authToken', 'userEmail']);
    this.showLoginForm();
    this.clearForm();
  }

  clearForm() {
    this.companyInput.value = '';
    this.positionInput.value = '';
    this.locationInput.value = '';
    this.salaryInput.value = '';
    this.notesInput.value = '';
  }

  async saveJobToCRM() {
    const company = this.companyInput.value;
    const position = this.positionInput.value;

    if (!company || !position) {
      this.showStatus('Company and position are required', 'error');
      return;
    }

    this.saveBtn.disabled = true;
    this.saveBtn.textContent = 'Saving...';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const result = await chrome.storage.local.get(['authToken']);

      const jobData = {
        company: company,
        position: position,
        location: this.locationInput.value,
        salary: this.salaryInput.value,
        notes: this.notesInput.value,
        fromUrl: tab.url,
        source: 'extension',
        appliedDate: new Date().toISOString(),
        status: 'applied'
      };

      // Send to MongoDB API
      console.log('Job data to save:', jobData);
      
      // Here you would make an actual API call to your MongoDB backend
      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.authToken}`
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        this.showStatus('Job saved to CRM successfully!');
        this.clearForm();
      } else {
        throw new Error('Failed to save job');
      }
      
    } catch (error) {
      console.error('Save error:', error);
      this.showStatus('Failed to save job to CRM', 'error');
    } finally {
      this.saveBtn.disabled = false;
      this.saveBtn.textContent = 'Save to CRM';
    }
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new JobTrackerPopup();
});