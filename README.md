# npmLens

[![Version](https://img.shields.io/visual-studio-marketplace/v/Pilaton.vscode-npm-lens?color=blue&label=VS%20Code)](https://marketplace.visualstudio.com/items?itemName=Pilaton.vscode-npm-lens)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/Pilaton.vscode-npm-lens?color=blue)](https://marketplace.visualstudio.com/items?itemName=Pilaton.vscode-npm-lens)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/Pilaton.vscode-npm-lens?color=blue)](https://marketplace.visualstudio.com/items?itemName=Pilaton.vscode-npm-lens)
[![Open VSX](https://img.shields.io/open-vsx/v/Pilaton/vscode-npm-lens?color=blue&label=Open%20VSX)](https://open-vsx.org/extension/Pilaton/vscode-npm-lens)
![Open VSX Downloads](https://img.shields.io/open-vsx/dt/Pilaton/vscode-npm-lens?color=blue&link=https%3A%2F%2Fopen-vsx.org%2Fextension%2FPilaton%2Fvscode-npm-lens)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)](LICENSE)

**Dependency update checker for npm, yarn, pnpm.** Find outdated packages, update versions easily — all from a convenient sidebar panel.

![npmLens Screenshot](https://raw.githubusercontent.com/Pilaton/vscode-npm-lens/main/public/demo.gif)

## ✨ Features

- **Dependency overview** — See all your dependencies and devDependencies at a glance
- **Version checking** — Instantly check for new versions (supports `^`, `~`, and exact versions)
- **One-click updates** — Click on any version to update the package
- **Prefix preservation** — Updates keep your original prefix (`^1.0.0` → `^1.2.0`, not `^` → nothing)
- **Multi-package queue** — Queue multiple package updates simultaneously
- **Deprecated warnings** — Get notified when using deprecated packages
- **Package info** — View description, license, last updated date
- **Size analysis** — See unpacked size of each package
- **Download statistics** — View weekly download counts
- **Package manager detection** — Automatically detects npm, yarn, pnpm, or bun
- **Theme aware** — Adapts seamlessly to your VS Code theme

## 📥 Installation

### From VS Code Marketplace

1. Open **Extensions** sidebar in VS Code (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for **npmLens**
3. Click **Install**

### From VSIX

1. Download the `.vsix` file from [Releases](https://github.com/Pilaton/vscode-npm-lens/releases)
2. Run `code --install-extension vscode-npm-lens-x.x.x.vsix`

## 🚀 Usage

1. Open a project with a `package.json` file
2. Click the **npmLens** icon in the Activity Bar (sidebar)
3. Explore your dependencies!

**Updating packages:**

- Click on any colored version number to update that package
- Green = patch, Yellow = minor, Red = major update
- The package manager (npm/yarn/pnpm/bun) is detected automatically

## 🔧 Requirements

- VS Code `>=1.93.0`
- A `package.json` file in your workspace

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

---

[VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=Pilaton.vscode-npm-lens) · [Open VSX](https://open-vsx.org/extension/Pilaton/vscode-npm-lens) · [GitHub](https://github.com/Pilaton/vscode-npm-lens) · [Issues](https://github.com/Pilaton/vscode-npm-lens/issues) · [Contributing](CONTRIBUTING.md) · [MIT License](LICENSE)
