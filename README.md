## keymaster monorepo 项目说明

本项目目标是基于原始 `keymaster` 键盘快捷键库，构建一个现代化的 **pnpm monorepo**，包含：

- `keymaster-react`：基于 Vite 的 React 版本键盘快捷键库（支持 TypeScript，lib 模式构建）
- `keymaster-vue`：基于 Vite 的 Vue 版本键盘快捷键库（支持 TypeScript，lib 模式构建）
- `keymaster-docs`：基于 VitePress 的文档与示例站点，支持部署到 Vercel

后续所有功能设计与实现，都需要遵循 `cursor_project_rules/README.md` 中的约束。

### 当前状态

- 已完成：阅读项目规则与目标，创建项目根文档
- 待完成：搭建 pnpm workspace 与子包目录结构，初始化各子项目配置与构建脚本

### 使用方式（规划中）

在完成基础实现后，将提供：

- `@keekuun/keymaster-react`：在 React 应用中通过组件 / Hook 使用键盘快捷键
- `@keekuun/keymaster-vue`：在 Vue 应用中通过指令 / 组合式 API 使用键盘快捷键
- `keymaster-docs`：在线浏览 API 文档与交互式示例

详细使用说明会在功能实现后补充到本文件。


