# Contributing to npmLens

Thank you for your interest in contributing to npmLens! This document provides guidelines and instructions for contributing.

## 🛠️ Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [pnpm](https://pnpm.io/) (recommended) or npm
- [VS Code](https://code.visualstudio.com/)

### Getting Started

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/vscode-npm-lens.git
   cd vscode-npm-lens
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development mode**

   ```bash
   pnpm run dev
   ```

4. **Launch the extension in VS Code**

   - Press `F5` or go to **Run and Debug** → **Run Extension (Watch)**
   - This opens a new VS Code window (Extension Development Host) with `test/demo-app` project
   - The extension will be loaded and ready to test

### Testing the Extension

1. **Extension Development Host** opens with `test/demo-app` — a sample project with various dependencies for testing
2. **Webview changes** (React components) apply immediately via Hot Module Replacement
3. **Extension changes** (TypeScript) require reload:
   - Press `Cmd+Shift+P` → "Developer: Reload Window"
   - Or restart the debug session with `Ctrl+Shift+F5`
4. **View Debug Console** in the main VS Code window to see extension logs

### Available Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `pnpm run dev`       | Start development mode with hot reload |
| `pnpm run build`     | Build the extension for production     |
| `pnpm run typecheck` | Run TypeScript type checking           |
| `pnpm run lint`      | Run Biome linter                       |
| `pnpm run lint:fix`  | Run Biome and fix issues               |
| `pnpm run format`    | Format code with Biome                 |
| `pnpm run knip`      | Check for unused dependencies          |
| `pnpm run package`   | Create a `.vsix` package               |

## 📝 Code Style

We use [Biome](https://biomejs.dev/) for linting and formatting. Please ensure your code passes all checks before submitting a PR:

```bash
pnpm run lint
pnpm run typecheck
```

### Key Style Guidelines

- Use **kebab-case** for file names
- Keep line width under **100 characters**

## 🔀 Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit with clear messages

3. **Test your changes** by running the extension locally

4. **Push and create a PR** against the `main` branch

5. **Wait for review** — maintainers will review your PR and provide feedback

### PR Checklist

- [ ] Code compiles without errors (`pnpm run typecheck`)
- [ ] Linter passes (`pnpm run lint`)
- [ ] Extension builds successfully (`pnpm run build`)
- [ ] Changes are tested manually in VS Code

## 🐛 Reporting Bugs

Please use the [GitHub Issues](https://github.com/Pilaton/vscode-npm-lens/issues) to report bugs. Include:

- VS Code version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 💡 Feature Requests

Feature requests are welcome! Please open an issue with:

- A clear description of the feature
- Why it would be useful
- Any implementation ideas you have

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
