<h1 align="center">
  🦉 TimeOwl
</h1>

<p align="center">
  <strong>Wise Insights into Your Time. Privacy-First.</strong>
</p>

<p align="center">
  <a href="./README_zh-CN.md">简体中文</a> | <a href="./README.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-purple?logo=vite" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Chrome-Manifest_V3-green?logo=google-chrome" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</p>

<br />

**TimeOwl** is a smart, privacy-first browser extension designed to help knowledge workers understand their digital habits. It automatically tracks your web activity, categorizes sites, and uses local AI to provide personalized productivity insights—all without your data ever leaving your machine unless you choose to.

## ✨ Key Features

- **🛡️ Privacy-First**: All tracking data is stored locally in your browser (`chrome.storage.local`). No remote servers, no tracking pixels.
- **⏱️ Automatic Time Tracking**: Precisely measures active time on websites, intelligently handling idle periods.
- **🏷️ Smart Categorization**: Automatically categorizes websites (Work, Learning, Entertainment, Social, etc.) using local rules.
- **🧠 AI Productivity Insights**:
  - Daily analysis of your browsing habits.
  - Personalized productivity tips and scoring.
  - **Bring Your Own Key (BYOK)**: Support for OpenAI, DeepSeek, Moonshot (Kimi), Zhipu (GLM-4), Qwen, and more.
- **📊 Visual Dashboard**:
  - Interactive charts (Pie & Bar) powered by Recharts.
  - Detailed "Top Sites" list with granular time breakdown.
  - Productivity Score calculation.
- **🌍 Internationalization**: Full support for English and Chinese (Simplified).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **State/Storage**: Chrome Extension Storage API
- **AI Client**: Custom fetch wrapper for OpenAI-compatible endpoints

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Terry-Qin/timeowl.git
   cd timeowl
   ```
2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

### Development

Run the dev server for UI components (Popup, Dashboard) development with Hot Module Replacement (HMR):

```bash
npm run dev
```

> Note: To test extension-specific APIs (like `chrome.tabs`, `chrome.storage`), you need to load the built extension into Chrome.

### Build

Build the extension for production:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled extension.

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `dist` folder generated in the previous step.

## ⚙️ Configuration

1. Click the TimeOwl extension icon (🦉) in your browser toolbar.
2. Click the **Settings (⚙️)** icon in the popup.
3. **Language**: Switch between English and Chinese.
4. **AI Configuration**:
   - Select your preferred API Provider (OpenAI, DeepSeek, Moonshot, etc.).
   - Enter your API Key.
   - (Optional) Customize the Base URL and Model Name.

## 📂 Project Structure

```
src/
├── background/      # Service worker for tracking & idle detection
├── content/         # Content scripts (page interaction)
├── popup/           # Extension popup UI (Quick stats)
├── dashboard/       # Full dashboard page (Analytics, Charts)
├── lib/             # Shared utilities (Storage, AI, Categorizer)
├── i18n/            # Localization files (en/zh)
└── manifest.json    # Extension configuration
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
