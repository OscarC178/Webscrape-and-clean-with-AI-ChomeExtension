<<<<<<< HEAD
// background.js

let isJobRunning = false;
=======
// background.js (with final race condition fix)

let isJobRunning = false; // Global flag to prevent multiple jobs
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9

// --- Helper Functions ---
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- AI Cleaning Logic (with robust response handling) ---
const AI_PROMPT = `You are a text processing expert specializing in cleaning scraped web content for a Retrieval-Augmented Generation (RAG) system. Your task is to reformat the provided text to ensure perfect paragraphing and remove any irrelevant artifacts from the scraping process.

Instructions:
- Correct any spacing or paragraphing errors. Ensure each distinct paragraph is separated by a single double newline (\\n\\n).
- Remove any fully duplicate sentences or entire duplicate paragraphs.
- Delete standalone navigation elements, footer text, or other non-article text (e.g., "Word template:", "Find out more about:", "Click here", "Related articles").
- Merge sentence fragments into coherent paragraphs where it is obvious they belong together.
- Do not summarize, invent, or change the meaning of the original text. The output must be the cleaned, full text of the article. Preserve the original wording.

Here is the text to clean:
---
`;

async function cleanTextWithAI(scrapedText, settings) {
<<<<<<< HEAD
  // The 'settings' object now correctly contains aiProvider, apiKey, and aiModel
  const { aiProvider, apiKey, aiModel } = settings;
=======
  const { aiProvider, apiKey } = settings;
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
  if (!apiKey) {
    return "[AI CLEANING FAILED: API Key not set]\n\n" + scrapedText;
  }

  let endpoint, headers, body;
  const fullPrompt = AI_PROMPT + scrapedText + "\n---";
  switch (aiProvider) {
    case 'openai':
      endpoint = 'https://api.openai.com/v1/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
<<<<<<< HEAD
      body = JSON.stringify({ model: aiModel, messages: [{ role: "user", content: fullPrompt }]});
=======
      body = JSON.stringify({ model: "gpt-5-nano", messages: [{ role: "user", content: fullPrompt }]});
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
      break;
    case 'anthropic':
      endpoint = 'https://api.anthropic.com/v1/messages';
      headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
<<<<<<< HEAD
      body = JSON.stringify({ model: aiModel, max_tokens: 4096, messages: [{ role: "user", content: fullPrompt }]});
      break;
    case 'google':
    default:
      // CORRECTED: The model name from settings is now used to build the endpoint
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKey}`;
=======
      body = JSON.stringify({ model: "claude-3-5-haiku-20241022", max_tokens: 4096, messages: [{ role: "user", content: fullPrompt }]});
      break;
    case 'google':
    default:
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }]});
      break;
  }
  try {
    const response = await fetch(endpoint, { method: 'POST', headers, body });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorBody}`);
    }
    const data = await response.json();
    let cleanedText = '';

    if (aiProvider === 'openai' && data.choices && data.choices.length > 0) {
        cleanedText = data.choices[0].message.content;
    } else if (aiProvider === 'anthropic' && data.content && data.content.length > 0) {
        cleanedText = data.content[0].text;
    } else if (aiProvider === 'google' && data.candidates && data.candidates.length > 0) {
        cleanedText = data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("API returned an empty or invalid response structure.");
    }

    return cleanedText.trim();
  } catch (error) {
    console.error('AI Cleaning Error:', error);
    return `[AI CLEANING FAILED: ${error.message}]\n\n` + scrapedText;
  }
}

// --- High-Performance Scraping Logic ---
function scrapeAndProcessUrl(url) {
    return new Promise((resolve, reject) => {
        let tabId;
        const timeout = setTimeout(() => {
            if (tabId) chrome.tabs.remove(tabId);
            reject(new Error(`Timeout while scraping ${url}`));
        }, 30000);

        chrome.tabs.create({ url, active: false })
            .then(tab => {
                tabId = tab.id;
                const onUpdatedListener = (updatedTabId, info) => {
                    if (updatedTabId === tabId && info.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(onUpdatedListener);
                        chrome.scripting.executeScript({
                            target: { tabId },
                            files: ['Readability.js', 'content.js']
                        }).catch(err => reject(new Error(`Injection failed for ${url}: ${err.message}`)));
                    }
                };
                chrome.tabs.onUpdated.addListener(onUpdatedListener);
            })
            .catch(err => reject(new Error(`Failed to create tab for ${url}: ${err.message}`)));

        const onMessageListener = (request, sender) => {
            if (request.command === 'scrapedData' && sender.tab && sender.tab.id === tabId) {
                clearTimeout(timeout);
                chrome.runtime.onMessage.removeListener(onMessageListener);
                chrome.tabs.remove(tabId);
                resolve(request.data);
            }
        };
        chrome.runtime.onMessage.addListener(onMessageListener);
    });
}

<<<<<<< HEAD
=======

>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
chrome.runtime.onMessage.addListener(async (request) => {
  if (request.command === 'startBulkScrape' || request.command === 'scrapeCurrentTab') {
    if (isJobRunning) {
      console.log("A job is already in progress.");
      return;
    }
    isJobRunning = true;

    let urls = [];
    if (request.command === 'startBulkScrape') {
        urls = request.urls;
    } else {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (currentTab) urls.push(currentTab.url);
    }

    if (urls.length === 0) {
        isJobRunning = false;
        return;
    }

<<<<<<< HEAD
    // CORRECTED: Added 'aiModel' to the settings retrieval
    const settings = await chrome.storage.sync.get({
        aiProvider: 'google',
        apiKey: '',
        rateLimit: 60,
        aiModel: 'gemini-2.5-flash' // Default model
    });
=======
    const settings = await chrome.storage.sync.get({ aiProvider: 'google', apiKey: '', rateLimit: 10 });
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
    const useAI = request.useAI || false;

    console.log(`Starting concurrent scraping for ${urls.length} URLs...`);
    const scrapingPromises = urls.map(url => scrapeAndProcessUrl(url).catch(err => ({ error: err.message, url })));
    const results = await Promise.all(scrapingPromises);
    console.log("All scraping finished. Moving to processing and saving.");

<<<<<<< HEAD
=======
    // --- Sequential Processing (Cleaning and Saving) ---
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
    for (const result of results) {
        if (result.error) {
            console.error(`Skipping result for ${result.url} due to scraping error: ${result.error}`);
            continue;
        }

        let finalContent = result.textContent;
        if (useAI) {
<<<<<<< HEAD
            console.log(`Cleaning content from ${result.url} with model ${settings.aiModel}...`);
            finalContent = await cleanTextWithAI(result.textContent, settings); // Pass the full settings object
=======
            console.log(`Cleaning content from ${result.url}...`);
            finalContent = await cleanTextWithAI(result.textContent, settings);
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9

            if (urls.length > 1) {
                const delayTime = (60 / settings.rateLimit) * 1000;
                await delay(delayTime);
            }
        }

<<<<<<< HEAD
=======
        // **THE FIX IS HERE:** Awaiting saveData ensures the service worker
        // stays alive until the entire job is complete.
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
        await saveData({ ...result, textContent: finalContent });
    }

    console.log("Job complete.");
    isJobRunning = false;
  }
});

<<<<<<< HEAD
// --- Save Data Function ---
=======

// --- Save Data Function (MV3 Compatible & Robust) ---
>>>>>>> 81046e51301c81cbed0289962c65ea202a4d3de9
async function saveData(data) {
  const scrapeDate = new Date();
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedScrapeDate = scrapeDate.toLocaleDateString('en-GB', dateOptions);

  let fileHeader = `Source URL: ${data.url}\n`;
  fileHeader += `Scrape Date: ${formattedScrapeDate}\n`;
  if (data.lastModifiedDate) {
    fileHeader += `Last Modified: ${data.lastModifiedDate}\n`;
  }
  fileHeader += '---\n\n';

  const fullFileContent = fileHeader + data.textContent;
  const sanitizedTitle = (data.title || 'Untitled').replace(/[^\w\s-]/gi, '').trim().replace(/\s+/g, '_').toLowerCase();
  const filename = `${sanitizedTitle.substring(0, 50) || 'scraped_content'}.txt`;

  const blob = new Blob([fullFileContent], { type: 'text/plain;charset=utf-8' });

  const dataUrl = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
  });

  chrome.downloads.download({
    url: dataUrl,
    filename: filename,
    saveAs: false
  });
}