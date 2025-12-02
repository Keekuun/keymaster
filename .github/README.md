# GitHub 仓库配置说明

## 更新仓库 About 部分

要让 GitHub 仓库显示 npm 包信息，需要在仓库设置中手动配置：

### 步骤 1：进入仓库设置

1. 访问仓库：https://github.com/Keekuun/keymaster
2. 点击仓库页面右上角的 **⚙️ Settings**（设置）
3. 在左侧菜单中找到 **General** → **Features** 部分

### 步骤 2：配置 About 部分

在仓库主页的 **About** 部分，可以添加：

- **Description（描述）**：`基于 keymaster 的 React/Vue 键盘快捷键库 monorepo`
- **Website（网站）**：`https://keymaster-docs.vercel.app/`
- **Topics（标签）**：添加以下标签
  - `keymaster`
  - `keyboard-shortcuts`
  - `react`
  - `vue`
  - `typescript`
  - `monorepo`
  - `npm-package`
  - `keyboard`
  - `hotkeys`

### 步骤 3：添加 npm 包链接（可选）

虽然 GitHub 的 "Packages" 部分不会自动显示 npmjs.com 的包，但可以在 README.md 中添加 npm 包链接，这些链接已经在 README.md 中配置好了：

- `@keekuun/keymaster-core`: https://www.npmjs.com/package/@keekuun/keymaster-core
- `@keekuun/keymaster-react`: https://www.npmjs.com/package/@keekuun/keymaster-react
- `@keekuun/keymaster-vue`: https://www.npmjs.com/package/@keekuun/keymaster-vue

## 关于 GitHub Packages

**重要说明**：GitHub 的 "Packages" 功能默认只显示发布到 **GitHub Packages**（`npm.pkg.github.com`）的包，不会显示发布到公共 npm registry（`npmjs.com`）的包。

如果你想要在 GitHub Packages 中显示包，需要：

1. 配置 `.npmrc` 文件指向 GitHub Packages
2. 使用 GitHub Actions 自动发布到 GitHub Packages

但通常不需要这样做，因为：

- 公共 npm registry（npmjs.com）是标准的包发布平台
- README.md 中已经包含了 npm 包链接
- 用户可以通过 npm 直接安装包

## 当前配置状态

✅ **已配置**：

- README.md 中包含 npm 包链接和徽章
- 各包的 `package.json` 中包含 `homepage` 字段指向文档站点
- 文档站点已部署到 Vercel

📝 **需要手动配置**：

- GitHub 仓库的 About 部分（通过 GitHub Web UI）
- Topics 标签（通过 GitHub Web UI）
