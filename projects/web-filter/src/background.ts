import browser from 'webextension-polyfill';

console.log('Hello from the background!');

browser.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details);
});

chrome.runtime.onMessage.addListener((message) => {
  chrome.runtime.sendMessage(message);
});
