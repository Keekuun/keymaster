## keymaster monorepo 项目说明

本项目目标是基于原始 `keymaster` 键盘快捷键库，构建一个现代化的 **pnpm monorepo**，包含：

- `keymaster-core`：核心模块，提供 React 和 Vue 版本共享的类型定义、解析器和工具函数
- `keymaster-react`：基于 Vite 的 React 版本键盘快捷键库（支持 TypeScript，lib 模式构建）
- `keymaster-vue`：基于 Vite 的 Vue 版本键盘快捷键库（支持 TypeScript，lib 模式构建）
- `keymaster-docs`：基于 VitePress 的文档与示例站点，支持部署到 Vercel

后续所有功能设计与实现，都需要遵循 `cursor_project_rules/README.md` 中的约束。

### 当前状态

- 已完成：阅读项目规则与目标，创建项目根文档
- 待完成：搭建 pnpm workspace 与子包目录结构，初始化各子项目配置与构建脚本

### 使用方式（规划中）

在完成基础实现后，将提供：

- `@keekuun/keymaster-core`：核心模块（通常作为依赖自动安装，也可单独使用）
- `@keekuun/keymaster-react`：在 React 应用中通过 Hook 使用键盘快捷键
- `@keekuun/keymaster-vue`：在 Vue 应用中通过组合式 API 使用键盘快捷键
- `keymaster-docs`：在线浏览 API 文档与交互式示例

## 包依赖关系

```
@keekuun/keymaster-core (核心模块)
    ├── @keekuun/keymaster-react (依赖 core)
    └── @keekuun/keymaster-vue (依赖 core)
```

**重要说明**：

- `keymaster-core` 是 `keymaster-react` 和 `keymaster-vue` 的**运行时依赖**
- 当你安装 `@keekuun/keymaster-react` 或 `@keekuun/keymaster-vue` 时，`keymaster-core` 会**自动安装**
- 你**不需要**手动安装 `keymaster-core`，除非你想在其他项目中使用核心功能

详细使用说明会在功能实现后补充到本文件。
