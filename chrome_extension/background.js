/**
 * Meta Ad Library Scraper Pro - Background Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Meta Ad Library Scraper Pro installed successfully.');
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateBadge') {
    const count = message.count || 0;
    const tabId = sender.tab ? sender.tab.id : null;
    if (tabId) {
      chrome.action.setBadgeText({
        tabId: tabId,
        text: count > 0 ? String(count) : ''
      });
      chrome.action.setBadgeBackgroundColor({
        tabId: tabId,
        color: '#1F4E5A'
      });
    }
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'downloadFile') {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename || 'meta_ad_asset',
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, downloadId });
      }
    });
    return true; // Async response
  }
});
