# Capital One Offers Sorter

A Chrome extension built with TypeScript and React that automatically sorts Capital One credit card offers by miles value. Simply navigate to the Capital One offers page, click the extension icon, and choose to sort by highest or lowest miles. The extension intelligently parses different mile formats (like "5X miles" or "10,000 miles"), automatically loads additional offers, and reorders them using CSS without affecting the page's functionality.

This project features comprehensive TypeScript typing, detailed console logging for debugging, and multiple DOM detection strategies to ensure reliable offer parsing. The extension only runs on Capital One domains, doesn't collect any data, and stores preferences locally. Built with modern web technologies including Vite for fast development and React for a clean popup interface.

**Shoutout to [noritheshibadev](https://github.com/noritheshibadev) for giving me this cool small project to work on!** 🚀

## Quick Start

```bash
npm install
npm run build
# Load the dist folder as an unpacked extension in Chrome
```

Navigate to https://capitaloneoffers.com/feed and use the extension to sort your offers by miles value.

---

**Note**: This is an independent tool and is not affiliated with, endorsed by, or sponsored by Capital One Financial Corporation.
