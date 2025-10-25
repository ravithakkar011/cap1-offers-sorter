// background.ts - Capital One Offers Sorter Service Worker

console.log('[C1 Sorter] Background service worker loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('[C1 Sorter] Extension installed');
});

