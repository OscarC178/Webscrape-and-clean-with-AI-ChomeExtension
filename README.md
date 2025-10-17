# RAG Text Scraper - Chrome Extension

RAG Text Scraper is a powerful Chrome extension designed to extract clean, article-focused text from web pages. It's built for developers and researchers who need high-quality text data for Retrieval-Augmented Generation (RAG) systems. The extension can operate on a single page or in bulk on a list of URLs, with an optional AI-powered cleaning step to ensure the output is pristine.

---

## Features

* **Bulk Scraping:** Scrape a list of URLs from the popup's text area.
* **Single Page Mode:** Scrape the currently active tab with a single click.
* **Intelligent Extraction:** Uses Mozilla's Readability.js library to remove ads, banners, and other boilerplate content.
* **Optional AI Cleaning:** Further refines the extracted text using an LLM to correct paragraphing and remove any remaining artifacts.
* **Multi-Provider Support:** Configure the AI cleaning to use Google (Gemini), OpenAI (GPT), or Anthropic (Claude).
* **No-Fuss Downloads:** Each scraped article is saved as a neatly formatted `.txt` file.

---

## How It Works

The extension operates in two main stages: **Extraction** and **Cleaning**.

1.  **Extraction:** When you start a job, the extension opens each URL in a new, inactive tab. It then injects Mozilla's Readability.js library, which is expertly designed to find the core "readable" content of a page, stripping away everything else. This raw text is then sent to the next stage.
2.  **AI Cleaning (Optional):** If the "Clean with AI" checkbox is ticked, the extracted text is sent to your chosen AI provider. The AI is given a specific prompt to act as a text-processing expert, focusing on fixing paragraphs, removing duplicate sentences, and deleting irrelevant text fragments without summarizing or changing the original meaning.

---

## Configuration (Options Page)

Before using the AI features, you must configure the settings. Right-click the extension icon and select **"Options"**.



* **AI Provider:** Select the LLM provider you want to use for the cleaning process. The default is Google Gemini.
* **API Key:** This is your secret key for your chosen AI provider. The extension needs this to make requests on your behalf. See the section below for instructions on how to get one.
* **API Requests Per Minute (RPM):** This setting is crucial for preventing errors. It tells the extension how many AI cleaning requests it can make per minute to stay within your provider's limits.

---

## Getting an API Key

To use the AI cleaning feature, you need an API key. Many providers offer a generous free tier that is perfect for testing and personal use.

### Google AI Studio (Gemini) - Recommended

Google's free tier is excellent for getting started.

1.  Go to **[Google AI Studio](https://aistudio.google.com/)**.
2.  Sign in with your Google account.
3.  Click the **"Get API key"** button in the left sidebar.
4.  Click **"Create API key in new project"**.
5.  Copy the generated key and paste it into the extension's options page.

### Other Providers

* **OpenAI (GPT):** New accounts often receive free credits, which are great for initial testing. Get your key at the **[OpenAI API keys page](https://platform.openai.com/api-keys)**.
* **Anthropic (Claude):** Anthropic also provides starting credits for new accounts. Get your key from the **[Anthropic console](https://console.anthropic.com/dashboard)**.

---

## Optimizing Your Rate Limit

A rate limit is a cap on how many times you can call an API in a given period. If you send too many requests too quickly, your API key will be temporarily blocked. The `Requests Per Minute (RPM)` setting in the options helps you avoid this.

* **Find Your Limit:** The most important step is to check the documentation for your specific AI provider and plan. Free tiers often have lower limits than paid tiers.
* **Start Conservatively:** If you are unsure, start with a low number like `10`.
* **Check the Docs:** As of late 2025, common free tier limits are:
    * **Google Gemini (gemini-2.5-flash):** Up to 15 RPM.
    * **OpenAI:** Varies by model and account status; check your account's rate limit page.
 
    * 
    * **Anthropic:** Varies; check the official documentation for free tier limits.


## The Model Performance Trade-Off ⚖️

Choosing an AI model for cleaning involves a trade-off between speed, cost, and quality. However, for preparing content for RAG, the goal is not perfection, but **high-quality, cost-effective processing at scale**.

### Why "Lite" Models Are Recommended (e.g., Gemini 2.5 Flash)

For this extension, **lite models are the recommended and most practical choice**. ⚡

* **Speed and Cost:** They are incredibly fast and cheap, allowing you to process hundreds or even thousands of articles quickly and without significant API costs. This is the primary advantage.
* **Sufficient Quality:** While not flawless, their ability to clean text is **more than sufficient for RAG purposes**. The prompt is designed to make even these smaller models highly effective at removing the vast majority of noise (ads, menus, etc.) and fixing common formatting issues.
* **The Right Tool for the Job:** The minor errors a lite model might make—like missing a single stray word or an imperfect paragraph break—are often insignificant when the text is chunked and vectorized for a RAG system. The immense gain in processing speed is a far more valuable asset.

### When to Consider a Powerful Model (e.g., Gemini 2.5 Pro)

Powerful models offer the highest quality cleaning but should be seen as a specialized tool for specific needs rather than the default.

* **Niche Use Cases:** You might consider a powerful model if you are preparing a small, highly curated dataset for a mission-critical application where even the slightest formatting error could be a problem.
* **The Downside:** For bulk processing, they are significantly **slower and more expensive**, making them impractical for large-scale data collection. For most RAG workflows, this is simply overkill.

**In short: Start with a lite model like Gemini 2.5 Flash.** It hits the sweet spot of speed, cost, and quality that makes this tool truly powerful for building RAG knowledge bases.
The extension automatically calculates and waits for the correct delay between API calls in a bulk job based on the RPM you set. For example, an RPM of `10` will result in a 6-second delay between each AI cleaning task (60 seconds / 10 requests = 6 seconds/request).
