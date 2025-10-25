# Privacy Practices & Chrome Web Store Requirements

## Capital One Offers Sorter Extension

### Host Permission Justification

**Required Permission**: `*://*.capitaloneoffers.com/*`

**Justification**: 
This extension requires access to Capital One's offers website (capitaloneoffers.com) to function properly. The extension:

1. **Core Functionality**: Only operates on Capital One offers pages to sort credit card offers by mileage value
2. **Domain-Specific**: Designed exclusively for Capital One's offers platform and has no functionality on other websites
3. **User Benefit**: Helps users quickly identify the most valuable credit card offers by sorting them by miles/rewards value
4. **Minimal Scope**: Only accesses the specific offers page content needed for sorting functionality
5. **No Data Collection**: Does not collect, store, or transmit any user data or personal information

The host permission is essential because the extension needs to:
- Inject sorting scripts into the Capital One offers page
- Parse offer information (miles, multipliers) from the page content
- Reorder offers using DOM manipulation
- Load additional offers when "View More Offers" button is present

**Justification for Remote Code Execution**:

This extension uses content script injection to execute sorting functionality on Capital One offers pages. The remote code execution is necessary because:

1. **Page Interaction**: The extension must interact with and modify the DOM of Capital One's offers page to sort offers
2. **Dynamic Content**: Capital One's offers page loads content dynamically, requiring script injection to access and manipulate offer elements
3. **User-Initiated Action**: Code execution only occurs when the user explicitly clicks the extension icon and chooses to sort offers
4. **Local Processing**: All code execution happens locally in the user's browser - no data is sent to external servers
5. **Transparent Functionality**: The injected code is open source and performs only the advertised sorting functionality

**Security Measures**:
- Code is bundled and minified during build process
- No external dependencies or remote resources are loaded
- All functionality is contained within the extension package
- No network requests are made to external domains

### Data Usage Compliance

**Data Collection**: This extension does NOT collect, store, or transmit any user data.

**Compliance Statement**:
- ✅ **No Personal Data**: Extension does not access, collect, or store any personal information
- ✅ **No Usage Analytics**: No tracking, analytics, or usage data collection
- ✅ **No Network Requests**: Extension makes no external network requests
- ✅ **Local Storage Only**: Only stores user preferences (sort order, filter settings) locally in browser
- ✅ **No Third-Party Services**: No integration with external services or APIs
- ✅ **Open Source**: All code is transparent and auditable

**Data Processing**:
- Extension only processes publicly available offer information displayed on Capital One's website
- All processing occurs locally in the user's browser
- No data is transmitted to any external servers
- User preferences are stored locally using Chrome's storage API

**Privacy Protection**:
- Extension operates entirely client-side
- No cookies or tracking mechanisms
- No user authentication or account linking
- No data sharing with third parties

### Developer Certification

I certify that this extension's data usage complies with Chrome Web Store Developer Program Policies:

1. **Transparency**: All functionality is clearly described and operates as advertised
2. **Minimal Permissions**: Only requests necessary permissions for core functionality
3. **No Data Collection**: Extension does not collect any user data or personal information
4. **User Control**: Users can disable or uninstall the extension at any time
5. **Security**: Extension uses secure coding practices and does not introduce security vulnerabilities
6. **Compliance**: Extension complies with all applicable privacy laws and regulations

### Technical Implementation Details

**Permissions Used**:
- `activeTab`: To detect when user is on Capital One offers page
- `scripting`: To inject sorting functionality into the offers page
- `storage`: To save user preferences locally

**Host Permissions**:
- `*://*.capitaloneoffers.com/*`: Required to access Capital One's offers website

**No External Dependencies**:
- All code is bundled within the extension
- No external libraries or resources loaded at runtime
- No network requests to external domains

---

**Developer**: Ravi Thakkar
**Extension Version**: 1.0.0  
**Last Updated**: 10-25-2025
**Compliance Verified**: ✅
