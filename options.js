const providerSelect = document.getElementById('aiProvider');
const apiKeyInput = document.getElementById('apiKey');
const rateLimitInput = document.getElementById('rateLimit');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');
const modelSelect = document.getElementById('aiModel');

// Defines the models available for each provider
const models = {
  google: [
    { name: 'Gemini 2.5 Flash (Recommended)', value: 'gemini-2.5-flash' },
    { name: 'Gemini 2.5 Flash Lite (Fastest)', value: 'gemini-2.5-flash-lite' },
    { name: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
    { name: 'Gemini 2.0 Flash (Legacy)', value: 'gemini-2.0-flash-001' }
  ],
  openai: [
    { name: 'GPT-5 Nano (Fastest & Cheapest)', value: 'gpt-5-nano' },
    { name: 'GPT-4o Mini (Cost-Effective)', value: 'gpt-4o-mini' },
    { name: 'GPT-5 Mini (Balanced)', value: 'gpt-5-mini' },
    { name: 'GPT-5 (Powerful)', value: 'gpt-5' }
  ],
  anthropic: [
    { name: 'Claude 3 Haiku (Fast)', value: 'claude-3-haiku-20240307' },
    { name: 'Claude 3.5 Sonnet (Powerful)', value: 'claude-3-5-sonnet-20240620' }
  ]
};

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
}

// Save settings to chrome.storage.sync
function saveOptions() {
  const provider = providerSelect.value;
  const apiKey = apiKeyInput.value;
  const rateLimit = parseInt(rateLimitInput.value, 10);
  const model = modelSelect.value;

  if (!apiKey) {
    statusDiv.textContent = 'Error: API Key cannot be empty.';
    statusDiv.style.color = '#dc3545';
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
    return;
  }

  chrome.storage.sync.set({
    aiProvider: provider,
    apiKey: apiKey,
    rateLimit: rateLimit || 60,
    aiModel: model
  }, () => {
    statusDiv.textContent = 'Settings saved successfully!';
    statusDiv.style.color = '#28a745';
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
  });
}

// Load saved settings when the page is opened
function restoreOptions() {
  chrome.storage.sync.get({
    aiProvider: 'google',
    apiKey: '',
    rateLimit: 60,
    aiModel: 'gemini-2.5-flash'
  }, (items) => {
    providerSelect.value = items.aiProvider;
    apiKeyInput.value = items.apiKey;
    rateLimitInput.value = items.rateLimit;
    
    updateModelOptions(); // Populate the models dropdown first
    
    // Set saved value, or default to first available option if saved one isn't valid for the provider
    if (items.aiModel && modelSelect.querySelector(`option[value="${items.aiModel}"]`)) {
      modelSelect.value = items.aiModel;
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
providerSelect.addEventListener('change', updateModelOptions);