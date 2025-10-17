const providerSelect = document.getElementById('aiProvider');
const apiKeyInput = document.getElementById('apiKey');
const rateLimitInput = document.getElementById('rateLimit');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

// Save settings to chrome.storage.sync
function saveOptions() {
  const provider = providerSelect.value;
  const apiKey = apiKeyInput.value;
  const rateLimit = parseInt(rateLimitInput.value, 10);

  if (!apiKey) {
    statusDiv.textContent = 'Error: API Key cannot be empty.';
    statusDiv.style.color = '#dc3545'; // Red for error
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
    return;
  }

  chrome.storage.sync.set({
    aiProvider: provider,
    apiKey: apiKey,
    rateLimit: rateLimit || 10 // Default to 10 if empty or invalid
  }, () => {
    statusDiv.textContent = 'Settings saved successfully!';
    statusDiv.style.color = '#28a745'; // Green for success
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
  });
}

// Load saved settings when the page is opened
function restoreOptions() {
  // Set default values
  chrome.storage.sync.get({
    aiProvider: 'google',
    apiKey: '',
    rateLimit: 10
  }, (items) => {
    providerSelect.value = items.aiProvider;
    apiKeyInput.value = items.apiKey;
    rateLimitInput.value = items.rateLimit;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);

