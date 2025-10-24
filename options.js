const providerSelect = document.getElementById('aiProvider');
const apiKeyInput = document.getElementById('apiKey');
const rateLimitInput = document.getElementById('rateLimit');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');
const modelSelect = document.getElementById('aiModel');

// API Key Links
const googleKeyLink = document.getElementById('googleKeyLink');
const openaiKeyLink = document.getElementById('openaiKeyLink');
const anthropicKeyLink = document.getElementById('anthropicKeyLink');

// Defines the models available for each provider, adhering to user preferences
const models = {
  google: [
    { name: 'Gemini 2.5 Flash (Recommended)', value: 'gemini-2.5-flash' },
    { name: 'Gemini 2.5 Pro (Powerful)', value: 'gemini-2.5-pro' },
    { name: 'Gemini 2.5 Flash Lite (Fastest)', value: 'gemini-2.5-flash-lite' }
  ],
  openai: [
    { name: 'GPT-4o Mini (Fast & Cost-Effective)', value: 'gpt-4o-mini' },
    { name: 'GPT-4o (Powerful)', value: 'gpt-4o' }
  ],
  anthropic: [
    { name: 'Claude 3 Haiku (Fastest)', value: 'claude-3-haiku-20240307' },
    { name: 'Claude 3.5 Sonnet (Powerful)', value: 'claude-3-5-sonnet-20240620' }
  ]
};

// Function to update the API key link visibility
function updateApiKeyLink() {
    const provider = providerSelect.value;
    googleKeyLink.style.display = 'none';
    openaiKeyLink.style.display = 'none';
    anthropicKeyLink.style.display = 'none';

    if (provider === 'google') {
        googleKeyLink.style.display = 'block';
    } else if (provider === 'openai') {
        openaiKeyLink.style.display = 'block';
    } else if (provider === 'anthropic') {
        anthropicKeyLink.style.display = 'block';
    }
}

// Function to update the model dropdown based on the selected provider
function updateModelOptions() {
  const provider = providerSelect.value;
  const availableModels = models[provider] || [];

  modelSelect.innerHTML = ''; // Clear existing options

  // Populate with new options
  availableModels.forEach(model => {
    const option = document.createElement('option');
    option.value = model.value;
    option.textContent = model.name;
    modelSelect.appendChild(option);
  });
  
  // Also update the API key link when the provider changes
  updateApiKeyLink();
}

// Save settings to chrome.storage.sync
function saveOptions() {
  const provider = providerSelect.value;
  const apiKey = apiKeyInput.value;
  const rateLimit = parseInt(rateLimitInput.value, 10);
  const model = modelSelect.value;

  if (!apiKey) {
    statusDiv.textContent = 'Error: API Key cannot be empty.';
    statusDiv.style.color = '#c0392b';
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
    return;
  }
   if (!rateLimit || rateLimit < 1) {
    statusDiv.textContent = 'Error: Rate Limit must be a number greater than 0.';
    statusDiv.style.color = '#c0392b';
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
    return;
  }


  chrome.storage.sync.set({
    aiProvider: provider,
    apiKey: apiKey,
    rateLimit: rateLimit, // Use the validated rate limit
    aiModel: model
  }, () => {
    statusDiv.textContent = 'Settings saved successfully!';
    statusDiv.style.color = '#229954';
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
  });
}

// Load saved settings when the page is opened
function restoreOptions() {
  chrome.storage.sync.get({
    aiProvider: 'google',
    apiKey: '',
    rateLimit: 15,
    aiModel: 'gemini-2.5-flash'
  }, (items) => {
    providerSelect.value = items.aiProvider;
    apiKeyInput.value = items.apiKey;
    rateLimitInput.value = items.rateLimit;
    
    updateModelOptions(); // Populate models and set API key link visibility
    
    // Set saved model value, or default to first available option if saved one isn't valid
    if (items.aiModel && modelSelect.querySelector(`option[value="${items.aiModel}"]`)) {
      modelSelect.value = items.aiModel;
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
providerSelect.addEventListener('change', updateModelOptions);