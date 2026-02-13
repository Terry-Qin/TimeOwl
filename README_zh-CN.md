<h1 align="center">
  🦉 TimeOwl (时间猫头鹰)
</h1>

<p align="center">
  <strong>洞察时间的智慧。隐私优先。</strong>
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

**TimeOwl** 是一款智能、隐私优先的浏览器扩展，专为知识工作者设计，帮助你了解自己的数字习惯。它能自动追踪你的网页活动，对网站进行分类，并利用本地配置的 AI 提供个性化的生产力洞察——除非你使用 AI 功能，否则所有数据都不会离开你的设备。

## ✨ 核心特性

- **🛡️ 隐私优先**: 所有追踪数据都存储在浏览器本地 (`chrome.storage.local`)。没有远程服务器，没有追踪像素。
- **⏱️ 自动时间追踪**: 精确记录网站的活跃时间，智能处理挂机/空闲状态。
- **🏷️ 智能分类**: 根据本地规则自动将网站分类（工作、学习、娱乐、社交等）。
- **🧠AI 生产力洞察**:
  - 每日浏览习惯深度分析。
  - 个性化生产力评分与建议。
  - **支持多种模型 (BYOK)**: 支持 OpenAI, DeepSeek (深度求索), Moonshot (Kimi), Zhipu (智谱清言), Qwen (通义千问) 等。
- **📊 可视化仪表盘**:
  - 基于 Recharts 的交互式图表（饼图、柱状图）。
  - 详细的“热门网站”列表与时间细分。
  - 生产力评分计算。
- **🌍 国际化支持**: 完整支持简体中文和英文。

## 🛠️ 技术栈

- **前端框架**: React 19, TypeScript
- **构建工具**: Vite 7
- **样式方案**: Tailwind CSS v4
- **图表库**: Recharts
- **状态/存储**: Chrome Extension Storage API
- **AI 客户端**: 自定义 OpenAI 兼容接口封装

## 🚀 快速开始

### 前置要求

- Node.js (v18 或更高版本)
- npm 或 pnpm

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/Terry-Qin/timeowl.git
   cd timeowl
   ```
2. **安装依赖**

   ```bash
   npm install
   # 或者
   pnpm install
   ```

### 开发模式

运行开发服务器，用于 UI 组件（Popup, Dashboard）的快速开发与热更新（HMR）：

```bash
npm run dev
```

> 注意：要测试扩展专属 API（如 `chrome.tabs`, `chrome.storage`），需要将构建后的扩展加载到 Chrome 中。

### 构建发布

构建生产环境扩展：

```bash
npm run build
```

构建完成后会生成一个 `dist` 文件夹，其中包含编译好的扩展程序。

### 加载到 Chrome

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`。
2. 开启右上角的 **开发者模式 (Developer mode)**。
3. 点击 **加载已解压的扩展程序 (Load unpacked)**。
4. 选择上一步生成的 `dist` 文件夹。

## ⚙️ 配置说明

1. 点击浏览器工具栏中的 TimeOwl 图标 (🦉)。
2. 点击弹出窗口中的 **设置 (⚙️)** 图标。
3. **语言 (Language)**: 切换中文或英文。
4. **AI 配置**:
   - 选择你偏好的 API 提供商 (OpenAI, DeepSeek, Moonshot 等)。
   - 输入你的 API Key。
   - (可选) 自定义 Base URL 和模型名称。

## 📂 项目结构

```
src/
├── background/      # Service worker (负责追踪 & 挂机检测)
├── content/         # Content scripts (页面交互)
├── popup/           # 扩展弹出页 (快速统计)
├── dashboard/       # 完整仪表盘页 (分析报表, 图表)
├── lib/             # 共享工具库 (存储, AI, 分类器)
├── i18n/            # 国际化文件 (en/zh)
└── manifest.json    # 扩展配置清单
```

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
