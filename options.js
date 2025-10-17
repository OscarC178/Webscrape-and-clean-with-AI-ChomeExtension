const providerSelect = document.getElementById('aiProvider');
const apiKeyInput = document.getElementById('apiKey');
const rateLimitInput = document.getElementById('rateLimit');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');
<<<<<<< HEAD
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
=======
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9

// Save settings to chrome.storage.sync
function saveOptions() {
  const provider = providerSelect.value;
  const apiKey = apiKeyInput.value;
  const rateLimit = parseInt(rateLimitInput.value, 10);
<<<<<<< HEAD
  const model = modelSelect.value;

  if (!apiKey) {
    statusDiv.textContent = 'Error: API Key cannot be empty.';
    statusDiv.style.color = '#dc3545';
=======

  if (!apiKey) {
    statusDiv.textContent = 'Error: API Key cannot be empty.';
    statusDiv.style.color = '#dc3545'; // Red for error
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
    return;
  }

  chrome.storage.sync.set({
    aiProvider: provider,
    apiKey: apiKey,
<<<<<<< HEAD
    rateLimit: rateLimit || 60,
    aiModel: model
  }, () => {
    statusDiv.textContent = 'Settings saved successfully!';
    statusDiv.style.color = '#28a745';
=======
    rateLimit: rateLimit || 10 // Default to 10 if empty or invalid
  }, () => {
    statusDiv.textContent = 'Settings saved successfully!';
    statusDiv.style.color = '#28a745'; // Green for success
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
    setTimeout(() => { statusDiv.textContent = ''; }, 3000);
  });
}

// Load saved settings when the page is opened
function restoreOptions() {
<<<<<<< HEAD
  chrome.storage.sync.get({
    aiProvider: 'google',
    apiKey: '',
    rateLimit: 60,
    aiModel: 'gemini-2.5-flash'
=======
  // Set default values
  chrome.storage.sync.get({
    aiProvider: 'google',
    apiKey: '',
    rateLimit: 10
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
  }, (items) => {
    providerSelect.value = items.aiProvider;
    apiKeyInput.value = items.apiKey;
    rateLimitInput.value = items.rateLimit;
<<<<<<< HEAD
    
    updateModelOptions(); // Populate the models dropdown first
    
    // Set saved value, or default to first available option if saved one isn't valid for the provider
    if (items.aiModel && modelSelect.querySelector(`option[value="${items.aiModel}"]`)) {
      modelSelect.value = items.aiModel;
    }
=======
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
<<<<<<< HEAD
providerSelect.addEventListener('change', updateModelOptions);
=======

>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
