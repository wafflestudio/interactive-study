import browser from 'webextension-polyfill';

console.log('Hello from the background!');

browser.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details);
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  try {
    if (message.tabId && message.action) {
      chrome.tabs.sendMessage(message.tabId, { action: message.action });
    }
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error });
  }
});
