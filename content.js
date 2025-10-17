// Guard clause: check if the script has already been run on this page
if (typeof window.hasRun === 'undefined') {
  
  /**
   * Converts an HTML string into plain text, preserving paragraph breaks.
   */
  function htmlToTextWithParagraphs(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textBlocks = [];
    for (const childNode of tempDiv.childNodes) {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        // We only want the text content of the element itself, not its children's children in a big blob
        let directText = Array.from(childNode.childNodes)
                             .filter(n => n.nodeType === Node.TEXT_NODE)
                             .map(n => n.textContent.trim())
                             .join(' ');
        let elementText = (childNode.textContent || "").trim();

        if (elementText.length > 0) {
          textBlocks.push(elementText);
        }
      }
    }
    return textBlocks.join('\n\n');
  }

  /**
   * Tries to find a "last modified" or "published" date on the page.
   */
  function findLastModifiedDate() {
    // ... (This function remains unchanged)
    const timeTag = document.querySelector('time[datetime]');
    if (timeTag && timeTag.getAttribute('datetime')) {
      return new Date(timeTag.getAttribute('datetime')).toDateString();
    }
    const patterns = [
      /(last updated|modified|updated on|published on|last modified on):?\s*([a-z]{3,9}\s\d{1,2},?\s\d{4})/i,
      /(\d{1,2}\s[a-z]{3,9}\s\d{4})/i
    ];
    const bodyText = document.body.innerText;
    for (const pattern of patterns) {
      const match = bodyText.match(pattern);
      if (match && match[0]) {
        if (new Date(match[0]).toString() !== 'Invalid Date') {
            return new Date(match[0]).toDateString();
        }
      }
    }
    return null;
  }

  // --- Main Execution ---

  let articleTitle = document.title;
  let articleTextContent = '';

  const readableArticle = new Readability(document.cloneNode(true)).parse();
  const bodyTextLength = document.body.innerText.length;

  if (readableArticle && readableArticle.textContent.length > (bodyTextLength * 0.35)) {
    console.log("Using Readability.js result.");
    articleTitle = readableArticle.title;
    articleTextContent = htmlToTextWithParagraphs(readableArticle.content);
  } else {
    console.log("Readability.js result was too short. Using fallback method.");
    const mainContent = document.querySelector('main, article, #main, #content, .main, .content');
    if (mainContent) {
      // **THE FIX IS HERE: Use htmlToTextWithParagraphs on the fallback's HTML**
      articleTextContent = htmlToTextWithParagraphs(mainContent.innerHTML);
    } else {
      // **AND HERE: Final fallback also uses the paragraph-preserving function**
      articleTextContent = htmlToTextWithParagraphs(document.body.innerHTML);
    }
  }

  chrome.runtime.sendMessage({
    command: 'scrapedData',
    data: {
      title: articleTitle,
      textContent: articleTextContent,
      url: window.location.href,
      lastModifiedDate: findLastModifiedDate()
    }
  });
  
  window.hasRun = true;
}