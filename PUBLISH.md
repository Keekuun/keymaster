# 发布到 npm 指南

> 📖 **文档站点版本**：更详细的发布说明请查看 [文档站点发布指南](https://keymaster-docs.vercel.app/publish)

本文档说明如何将 keymaster monorepo 中的包发布到 npm。

## 包发布顺序

由于包之间存在依赖关系，发布顺序必须遵循：

1. **@keekuun/keymaster-core**（必须先发布）
2. **@keekuun/keymaster-react**（依赖 core）
3. **@keekuun/keymaster-vue**（依赖 core）

## 发布流程

### 1. 更新版本号

使用 `standard-version` 自动更新所有包的版本号：

```bash
# 补丁版本（0.1.0 -> 0.1.1）
pnpm run release

# 小版本（0.1.0 -> 0.2.0）
pnpm run release:minor

# 大版本（0.1.0 -> 1.0.0）
pnpm run release:major
```

这会自动：

- 更新根目录 `package.json` 版本
- 更新 `packages/keymaster-core/package.json` 版本
- 更新 `packages/keymaster-react/package.json` 版本
- 更新 `packages/keymaster-vue/package.json` 版本
- 生成/更新 `CHANGELOG.md`
- 创建 git tag 并推送到远程

### 2. 构建所有包

```bash
pnpm install
pnpm build
```

### 3. 发布到 npm

#### 方式一：按顺序手动发布（推荐）

```bash
# 1. 先发布 core 包
pnpm run publish:core

# 2. 再发布 react 包
pnpm run publish:react

# 3. 最后发布 vue 包
pnpm run publish:vue
```

#### 方式二：一键发布所有包

```bash
pnpm run publish:all
```

这会按正确顺序自动发布所有包。

### 4. 验证发布

发布后，访问以下链接验证：

- Core: https://www.npmjs.com/package/@keekuun/keymaster-core
- React: https://www.npmjs.com/package/@keekuun/keymaster-react
- Vue: https://www.npmjs.com/package/@keekuun/keymaster-vue

## 依赖关系说明

### workspace 协议转换

在 monorepo 中，React 和 Vue 包使用 `workspace:*` 引用 core 包：

```json
{
  "dependencies": {
    "@keekuun/keymaster-core": "workspace:*"
  }
}
```

**pnpm 在发布时会自动处理**：

- 将 `workspace:*` 转换为已发布的 core 包的实际版本号
- 例如：如果 core 包版本是 `0.1.0`，发布后会自动变为 `^0.1.0`

### 用户安装体验

当用户安装 `@keekuun/keymaster-react` 时：

```bash
npm install @keekuun/keymaster-react
```

npm 会自动：

1. 安装 `@keekuun/keymaster-react`
2. 读取其 `dependencies`，发现需要 `@keekuun/keymaster-core`
3. 自动安装 `@keekuun/keymaster-core`（指定版本，如 `^0.1.0`）
4. 用户无需手动安装 core 包

## 单独发布某个包

如果需要只发布某个包（例如只修复了 React 包的 bug）：

```bash
# 只更新 React 包版本
pnpm run release:react:only

# 构建
pnpm build

# 发布（注意：需要先确保 core 包已发布）
pnpm run publish:react
```

**注意**：即使只发布 React 包，也必须确保 core 包已经在 npm 上存在，否则会发布失败。

## 故障排查

### 问题：发布 React/Vue 包时提示找不到 core 包

**原因**：core 包还没有发布到 npm。

**解决**：

1. 先发布 core 包：`pnpm run publish:core`
2. 等待几分钟让 npm 同步
3. 再发布 React/Vue 包

### 问题：版本号不一致

**原因**：某个包的版本号没有正确更新。

**解决**：

1. 检查 `.versionrc.json` 是否包含所有包
2. 重新运行 `pnpm run release`
3. 手动检查各包的 `package.json` 版本号

## 发布检查清单

发布前请确认：

- [ ] 所有代码已提交到 git
- [ ] 已运行 `pnpm build` 且构建成功
- [ ] 已运行 `pnpm run release` 更新版本号
- [ ] 已检查 `CHANGELOG.md` 内容正确
- [ ] 已确认发布顺序（core -> react -> vue）
- [ ] npm 账号已登录（`npm whoami`）
- [ ] 有发布权限（对 `@keekuun` scope）
