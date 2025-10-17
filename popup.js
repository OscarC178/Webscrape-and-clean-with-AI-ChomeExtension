const urlListEditor = document.getElementById('urlListEditor');
const optionsButton = document.getElementById('optionsButton');
const startButton = document.getElementById('startButton');
const scrapeCurrentButton = document.getElementById('scrapeCurrentButton');
const getAllTabsButton = document.getElementById('getAllTabsButton');
const statusDiv = document.getElementById('status');
const aiCleanCheckbox = document.getElementById('aiCleanCheckbox');

const invalidPatterns = [
  /^chrome:\/\//i, /^about:/i, /^javascript:/i, /^data:/i,
  /^file:\/\//i, /^https:\/\/chrome\.google\.com\/webstore/i
];

// --- Rich Text Editor and Validation ---

function isValidUrl(url) {
  if (!url || url.trim() === '') return true; // Allow empty lines
  try {
    new URL(url);
    const isInvalidPattern = invalidPatterns.some(pattern => pattern.test(url));
    return !isInvalidPattern;
  } catch (e) {
    return false;
  }
}

function validateAndHighlight() {
  const lines = urlListEditor.innerText.split('\n');
  let html = '';
  let hasInvalidUrl = false;
  
  // Use a document fragment for performance
  const fragment = document.createDocumentFragment();

  for (const line of lines) {
    const trimmedLine = line.trim();
    const div = document.createElement('div');
    if (trimmedLine === '') {
      div.innerHTML = '<br>'; // Preserve empty lines
    } else if (isValidUrl(trimmedLine)) {
      div.className = 'valid-url';
      div.textContent = trimmedLine;
    } else {
      div.className = 'invalid-url';
      div.textContent = trimmedLine;
      hasInvalidUrl = true;
    }
    fragment.appendChild(div);
  }
  
  // Avoid cursor jumping by checking for actual changes
  if (urlListEditor.innerHTML !== fragment.innerHTML) {
      // Preserve cursor position logic can be complex in contenteditable
      // For simplicity, we'll replace the content. The user can re-place the cursor.
      urlListEditor.innerHTML = '';
      urlListEditor.appendChild(fragment);
  }

  updateStatus(lines, hasInvalidUrl);
  saveUrlsToSession(); // Save on every validation
}

function updateStatus(lines, hasInvalidUrl) {
  const validUrls = lines.filter(line => isValidUrl(line.trim()) && line.trim() !== '');
  
  if (hasInvalidUrl) {
    statusDiv.innerHTML = '<span style="color: #d8000c;">Please remove the highlighted invalid URLs to proceed.</span>';
    startButton.disabled = true;
  } else if (validUrls.length === 0) {
    statusDiv.innerHTML = 'Enter URLs to begin.';
    startButton.disabled = true;
  } else {
    const useAI = aiCleanCheckbox.checked;
    const RECOMMENDED_LIMIT = 20;
    let statusText = `${validUrls.length} valid URLs found.`;
    if (useAI && validUrls.length > RECOMMENDED_LIMIT) {
      statusText += `<br><small style="color: #e67e22;">Note: Large AI jobs may take a few minutes.</small>`;
    }
    statusDiv.innerHTML = statusText;
    startButton.disabled = false;
  }
}


// --- Session Storage for URLs ---

function saveUrlsToSession() {
  const urls = urlListEditor.innerText;
  // Use session storage which persists until the browser is closed.
  chrome.storage.session.set({ 'savedUrls': urls });
}
// Just before the 'loadUrlsFromSession()' line
optionsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
async function loadUrlsFromSession() {
  // Set access level for session storage
  
  await chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
  const data = await chrome.storage.session.get('savedUrls');
  if (data.savedUrls) {
    urlListEditor.innerText = data.savedUrls;
    validateAndHighlight();
  }
}

// --- Event Listeners ---

urlListEditor.addEventListener('input', validateAndHighlight);
aiCleanCheckbox.addEventListener('change', validateAndHighlight);

startButton.addEventListener('click', async () => { // <-- Add async
  const validUrls = urlListEditor.innerText.split('\n').filter(url => isValidUrl(url.trim()) && url.trim() !== '');
  const useAI = aiCleanCheckbox.checked;

  if (validUrls.length > 0) {
    await chrome.runtime.sendMessage({ command: 'startBulkScrape', urls: validUrls, useAI: useAI }); // <-- Add await
    window.close();
  }
});

scrapeCurrentButton.addEventListener('click', async () => { // <-- Add async
  const useAI = aiCleanCheckbox.checked;
  await chrome.runtime.sendMessage({ command: 'scrapeCurrentTab', useAI: useAI }); // <-- Add await
  window.close();
});

getAllTabsButton.addEventListener('click', () => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    // Filter out invalid tab URLs before displaying
    const urlsFromTabs = tabs.map(tab => tab.url).filter(url => isValidUrl(url));
    urlListEditor.innerText = urlsFromTabs.join('\n');
    validateAndHighlight();
  });

  const originalText = getAllTabsButton.textContent;
  getAllTabsButton.textContent = "URLs copied to text area!";
  getAllTabsButton.disabled = true;

  setTimeout(() => {
    getAllTabsButton.textContent = originalText;
    getAllTabsButton.disabled = false;
  }, 2000);
});

// Initial load
loadUrlsFromSession();

