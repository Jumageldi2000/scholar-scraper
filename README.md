# Google Scholar Publications Scraper

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-compatible-brightgreen.svg)
![Firefox](https://img.shields.io/badge/firefox-compatible-orange.svg)

A browser extension for batch scraping publication information from Google Scholar profile pages. Easily export paper titles, abstracts, links, and publication dates to CSV format.

## 🎯 Features

✅ Extract paper titles  
✅ Extract paper links (including PDF links)  
✅ Extract abstracts  
✅ Extract publication dates and years  
✅ Automatic CSV export  
✅ Multilingual interface support  

## 📸 Screenshots

> **Note**: Add your screenshots here after installation
> - Extension popup interface
> - Scraping in progress
> - Sample CSV output

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Jumageldi2000/google-scholar-scraper.git

# Navigate to the directory
cd google-scholar-scraper

# Load the extension in Chrome:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked" and select the folder
```

## 📦 Installation

### Chrome Browser

1. **Download the extension files**
   - Download the entire `scholar-scraper` folder to your local machine

2. **Enable Developer Mode**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `scholar-scraper` folder
   - Installation complete!

### Firefox Browser

1. **Temporary Installation (for testing)**
   - Open Firefox browser
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file in the `scholar-scraper` folder

2. **Permanent Installation**
   - Package the extension as a .xpi file and submit to Firefox Add-ons store
   - Or load temporarily each time Firefox starts

## 📖 Usage

1. **Visit a Google Scholar profile page**
   ```
   https://scholar.google.com/citations?user=YOUR_USER_ID


2. **Launch the extension**
   - Click the extension icon 📚 in your browser toolbar
   - Click the "Start Scraping" button in the popup window

3. **Wait for completion**
   - Progress indicator will appear in the top right of the page
   - The extension will fetch detailed information for each paper sequentially
   - Scraping speed: approximately 1 second per paper (to avoid rate limiting)

4. **Download CSV file**
   - CSV file will download automatically when scraping completes
   - Filename format: `google_scholar_papers_[timestamp].csv`

## 📊 CSV File Format

The exported CSV file contains the following columns:

| Column | Description |
|--------|-------------|
| Index | Paper number |
| Title | Paper title |
| Year | Publication year (from list page) |
| Publication Date | Full publication date (from detail page) |
| Paper URL | Original paper link (PDF or webpage) |
| Google Scholar Detail URL | Paper detail page on Google Scholar |
| Abstract | Paper abstract/summary |

## ⚡ Important Notes

⚠️ **Scraping Speed**: To avoid Google rate limiting, the extension delays 0.8 seconds between fetching each paper

⚠️ **Network Requirements**: Requires access to Google Scholar

⚠️ **Data Completeness**: Some papers may not have abstracts or complete information; corresponding fields will be empty

⚠️ **Stay on Page**: Keep the Google Scholar page active during scraping; do not switch or close the tab

## 🔧 Troubleshooting

### Issue 1: Button click has no response
- Confirm current page is a Google Scholar profile page (URL contains `scholar.google.com/citations`)
- Refresh the page and retry
- Check browser console for error messages (press F12)

### Issue 2: Extracted abstracts are empty
- Some papers may not provide abstracts
- Verify that the abstract is visible on the Google Scholar detail page
- Check network connection stability

### Issue 3: CSV file displays garbled text
- When opening with Excel, select "UTF-8" encoding
- Or use Google Sheets (automatically recognizes encoding)
- WPS Office typically displays correctly

## 🛠️ Technical Details

- **Manifest Version**: 3
- **Permissions**: activeTab, scripting
- **Supported Sites**: scholar.google.com
- **Encoding**: UTF-8 with BOM

## 👨‍💻 Developer Information

Main files for modification or extension:

- `manifest.json` - Extension configuration file
- `popup.html` - Popup window interface
- `popup.js` - Main logic (scraping and CSV generation)
- `content.js` - Content script (backup)

## License

This project is for educational and personal use only. Please comply with Google Scholar's Terms of Service.

## 📜 Changelog

### v1.0.0 (2026-03-27)
- ✨ Initial release
- ✅ Support for scraping titles, links, abstracts, dates
- ✅ Automatic CSV export
- ✅ Multilingual interface

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Important**: This extension is for educational and personal use only. Please comply with Google Scholar's Terms of Service.

## ⚠️ Disclaimer

This tool is provided as-is for educational purposes. The authors are not responsible for any misuse or violations of Google Scholar's policies. Users should:
- Respect Google Scholar's rate limits
- Use responsibly and ethically
- Not use for commercial scraping without permission
- Comply with all applicable terms of service

## 🙏 Acknowledgments

- Built for researchers and academics who need to manage their publication data
- Inspired by the need for efficient bibliography management

## 📧 Contact

If you have questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ for the academic community
