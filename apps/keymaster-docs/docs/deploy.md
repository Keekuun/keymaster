# 部署到 Vercel

本章节介绍如何将 `keymaster` 文档站点一键部署到 Vercel。

## 1. 准备工作

- 一个 GitHub 仓库（例如 `https://github.com/Keekuun/keymaster`，仓库中已包含 `apps/keymaster-docs`）
- 一个 Vercel 账号（使用 GitHub 登录即可）

## 2. 连接 GitHub 仓库

1. 登录 Vercel 控制台，点击 **Add New... → Project**。
2. 选择 **Import Git Repository**，在列表中选中你的 `keymaster` 仓库。

## 3. 基础配置

导入仓库后，在 Project 配置中做以下设置：

- **Framework Preset**：选择 `Other`（因为我们使用的是 pnpm + VitePress，自带 vercel.json）
- **Root Directory**：选择 `apps/keymaster-docs`

> 如果 Vercel 已自动识别到 `apps/keymaster-docs/vercel.json`，可以直接使用该配置，无需额外改动。

## 4. 使用项目内的 Vercel 配置

`apps/keymaster-docs/vercel.json` 已预先配置好构建命令与输出目录：

- **buildCommand**：`pnpm --filter keymaster-docs run docs:build`
- **outputDirectory**：`docs/.vitepress/dist`

部署时 Vercel 会：

1. 在项目根执行 `pnpm install` 安装依赖。
2. 进入 `apps/keymaster-docs` 目录，根据 `vercel.json` 触发构建命令。
3. 将 `docs/.vitepress/dist` 内容作为静态站点对外提供访问。

## 5. 环境变量（可选）

当前文档站不依赖额外环境变量，如果后续你增加了需要读取的环境配置，可以在 Vercel 项目设置中的 **Environment Variables** 中补充。

## 6. 验证部署

部署完成后，Vercel 会提供一个访问地址（如 `https://keymaster-docs.vercel.app`）：

- 在浏览器打开该地址。
- 确认首页样式、React/Vue 快速开始页以及交互 Demo（快捷键 `Ctrl+S` / `Ctrl+Z`）都能正常工作。
