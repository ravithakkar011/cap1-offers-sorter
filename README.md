# Capital One Offers Sorter (TypeScript + React)

A Chrome extension built with **TypeScript** and **React** that sorts Capital One credit card offers by miles. Features comprehensive debugging and type-safe development.

## ✨ Features

- ⚛️ **TypeScript + React** - Fully typed, modern development
- 🏆 **Sort by Highest Miles** - Best offers first
- 📊 **Sort by Lowest Miles** - Smaller offers first
- 🔄 **Auto-Load All Offers** - Clicks "View More Offers" automatically
- 🎯 **Smart Parsing** - Handles flat miles and multipliers
- 🐛 **Enhanced Debugging** - Comprehensive console logging
- 🔒 **Type Safety** - Catch errors at compile time

## 🚀 Quick Start

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Build the extension
npm run build

# 3. Load in Chrome
# - Go to chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select the cap1-offers-sorter folder
```

### Usage

1. Navigate to https://capitaloneoffers.com/feed
2. Click the extension icon
3. Choose "Highest Miles" or "Lowest Miles"
4. Click "Sort Offers"
5. Watch offers reorder automatically!

## 🛠️ Development

### Commands

```bash
# Build with type checking
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Type check only (no build)
npm run type-check
```

### Project Structure

```
cap1-offers-sorter/
├── src/
│   ├── App.tsx          # TypeScript React component
│   ├── App.css          # Styles
│   ├── main.tsx         # React entry point
│   └── types.ts         # Type definitions
├── content.js           # Content script with logging
├── background.js        # Service worker
├── manifest.json        # Extension manifest
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Build configuration
```

## 📝 TypeScript Features

### Type-Safe Message Passing

```typescript
interface SortResponse {
  success: boolean;
  message: string;
  count: number;
  loadedMore?: boolean;
}

const response = await chrome.tabs.sendMessage<unknown, SortResponse>(
  tabId,
  { type: "SORT_OFFERS", sortBy: "miles-desc" }
);
// response is fully typed!
```

### Strict Type Checking

```typescript
const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
// Can only be "desc" or "asc"
```

## 🐛 Debugging

### Console Logging

The extension includes detailed console logging:

```javascript
[C1 Sorter] Content script loaded
[C1 Sorter] Starting offer container search...
[C1 Sorter] Found 45 offers, now parsing...
[C1 Sorter] Offer 1: 60000 miles - "Retailer Name..."
[C1 Sorter] Sort completed successfully
```

### Multiple Detection Strategies

If offers aren't found, the console shows:
- Which detection strategies were tried
- How many elements were found
- Sample text from those elements
- Why elements were accepted/rejected

### Debugging Steps

1. Open the offers page
2. Press **F12** to open DevTools
3. Look for `[C1 Sorter]` messages
4. Check what elements are being detected
5. Share console output if you need help

## 🔧 How It Works

### Smart Detection

Uses multiple strategies to find offers:
1. Capital One's specific CSS classes
2. Elements containing "miles" text
3. Filters out navigation/headers
4. Validates element size and content

### Mile Parsing

- **"5X miles"** → 5,000 (for comparison)
- **"10,000 miles"** → 10,000
- **"Up to 60,000 miles"** → 60,000

### Sorting Method

- Uses CSS `order` property
- Non-destructive reordering
- Preserves page functionality

## 🔍 Troubleshooting

### Extension Not Loading?

```bash
# Rebuild from scratch
rm -rf node_modules dist
npm install
npm run build
```

Then reload in Chrome.

### React Errors?

If you see React errors (#418, #423):
1. Go to `chrome://extensions/`
2. **Remove** the extension completely
3. **Load unpacked** again
4. This clears cached old versions

### No Offers Found?

Check console logs for:
```
[C1 Sorter] Found X elements containing "mile"
[C1 Sorter]   Element 1: DIV.class "text preview..."
```

This shows exactly what the extension is detecting.

### TypeScript Errors?

```bash
# Check types without building
npm run type-check
```

## 📦 Build Output

```
dist/popup.html   (0.37 kB)  - Popup HTML
dist/popup.css    (2.89 kB)  - Compiled styles
dist/popup.js     (147 kB)   - React app bundle
```

## 🎯 Testing Checklist

- [ ] Extension loads in Chrome without errors
- [ ] Popup opens without React errors
- [ ] Goes to https://capitaloneoffers.com/feed
- [ ] Console shows content script loaded
- [ ] Click extension icon shows offer count
- [ ] Click "Sort Offers" works
- [ ] Console shows detailed sorting logs
- [ ] Offers reorder on page
- [ ] Green confirmation banner appears

## 🔒 Privacy

This extension:
- ✅ Only runs on Capital One domains
- ✅ Does not collect or transmit data
- ✅ Does not track browsing
- ✅ Only stores preferences locally
- ✅ Completely open source

## 📚 Documentation

- `TYPESCRIPT_CONVERSION.md` - TypeScript migration details
- `QUICKSTART.md` - Quick setup guide
- This file - Full documentation

## 🎊 Version History

### v1.0.0 (TypeScript)
- Full TypeScript conversion
- Type-safe React components
- Enhanced debugging
- Multiple DOM detection strategies
- Better error handling
- Vite build system

## 💡 Tips

- **Check console logs** - They're super detailed!
- **Look for `[C1 Sorter]`** - Easy to filter
- **Use TypeScript** - Catch errors early
- **Share console output** - Makes debugging easier

## 🤝 Contributing

This is TypeScript now! Contributions welcome:
1. Fork the repo
2. Make changes in `src/`
3. Run `npm run type-check`
4. Run `npm run build`
5. Test in Chrome
6. Submit PR

## 📄 License

MIT License - feel free to use and modify!

---

**Built with TypeScript, React, and ❤️**

**Note**: This is an independent tool and is not affiliated with, endorsed by, or sponsored by Capital One Financial Corporation.
