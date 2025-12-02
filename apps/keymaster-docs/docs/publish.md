# 发布到 npm

本文档说明如何将 keymaster monorepo 中的包发布到 npm。

## 📦 包发布顺序

由于包之间存在依赖关系，发布顺序**必须**遵循：

1. **@keekuun/keymaster-core**（必须先发布）
2. **@keekuun/keymaster-react**（依赖 core）
3. **@keekuun/keymaster-vue**（依赖 core）

> ⚠️ **重要**：如果先发布 React 或 Vue 包，会因为找不到 core 包而发布失败。

## 🚀 完整发布流程

### 步骤 1：准备工作

#### 1.1 确认 npm 账号

```bash
# 检查是否已登录
npm whoami

# 如果未登录，执行登录
npm login
```

#### 1.2 确认发布权限

确保你的 npm 账号对 `@keekuun` scope 有发布权限。

#### 1.3 提交所有代码

```bash
git add .
git commit -m "feat: 准备发布新版本"
git push
```

### 步骤 2：更新版本号

使用 `standard-version` 自动更新所有包的版本号：

```bash
# 补丁版本（0.1.0 -> 0.1.1）- 修复 bug
pnpm run release

# 小版本（0.1.0 -> 0.2.0）- 新功能
pnpm run release:minor

# 大版本（0.1.0 -> 1.0.0）- 破坏性变更
pnpm run release:major
```

**执行后会自动：**

- ✅ 更新根目录 `package.json` 版本
- ✅ 更新 `packages/keymaster-core/package.json` 版本
- ✅ 更新 `packages/keymaster-react/package.json` 版本
- ✅ 更新 `packages/keymaster-vue/package.json` 版本
- ✅ 生成/更新 `CHANGELOG.md`
- ✅ 创建 git tag 并推送到远程

### 步骤 3：构建所有包

```bash
# 安装依赖（确保 workspace 依赖正确链接）
pnpm install

# 构建所有包
pnpm build
```

**验证构建结果：**

- 检查 `packages/keymaster-core/dist` 目录是否存在
- 检查 `packages/keymaster-react/dist` 目录是否存在
- 检查 `packages/keymaster-vue/dist` 目录是否存在

### 步骤 4：发布到 npm

#### 方式一：一键发布所有包（推荐）

```bash
pnpm run publish:all
```

这会按正确顺序自动发布：

1. `@keekuun/keymaster-core`
2. `@keekuun/keymaster-react`
3. `@keekuun/keymaster-vue`

#### 方式二：手动按顺序发布

如果一键发布失败，可以手动按顺序发布：

```bash
# 1. 先发布 core 包
pnpm run publish:core

# 等待几秒，确保 npm 同步

# 2. 再发布 react 包
pnpm run publish:react

# 等待几秒，确保 npm 同步

# 3. 最后发布 vue 包
pnpm run publish:vue
```

### 步骤 5：验证发布

发布后，访问以下链接验证：

- **Core**: https://www.npmjs.com/package/@keekuun/keymaster-core
- **React**: https://www.npmjs.com/package/@keekuun/keymaster-react
- **Vue**: https://www.npmjs.com/package/@keekuun/keymaster-vue

**检查项：**

- [ ] 版本号正确
- [ ] README 内容显示正常
- [ ] 依赖关系正确（React/Vue 包显示依赖 core 包）
- [ ] 可以正常安装：`npm install @keekuun/keymaster-react`

## 📋 依赖关系说明

### workspace 协议自动转换

在 monorepo 开发时，React 和 Vue 包使用 `workspace:*` 引用 core 包：

```json
{
  "dependencies": {
    "@keekuun/keymaster-core": "workspace:*"
  }
}
```

**pnpm 在发布时会自动处理：**

- 将 `workspace:*` 转换为已发布的 core 包的实际版本号
- 例如：如果 core 包版本是 `0.1.0`，发布后会自动变为 `^0.1.0`

### 用户安装体验

当用户安装 `@keekuun/keymaster-react` 时：

```bash
npm install @keekuun/keymaster-react
```

npm 会自动：

1. ✅ 安装 `@keekuun/keymaster-react`
2. ✅ 读取其 `dependencies`，发现需要 `@keekuun/keymaster-core`
3. ✅ 自动安装 `@keekuun/keymaster-core`（指定版本，如 `^0.1.0`）
4. ✅ **用户无需手动安装 core 包**

## 🔧 单独发布某个包

如果需要只发布某个包（例如只修复了 React 包的 bug）：

```bash
# 1. 只更新 React 包版本（不更新其他包）
pnpm run release:react:only

# 2. 构建
pnpm build

# 3. 发布（注意：需要先确保 core 包已发布）
pnpm run publish:react
```

**⚠️ 注意**：即使只发布 React 包，也必须确保 core 包已经在 npm 上存在，否则会发布失败。

## ❌ 故障排查

### 问题 1：发布 React/Vue 包时提示找不到 core 包

**错误信息：**

```
npm ERR! 404 '@keekuun/keymaster-core@^0.1.0' is not in the npm registry.
```

**原因：** core 包还没有发布到 npm。

**解决方案：**

1. 先发布 core 包：`pnpm run publish:core`
2. 等待 1-2 分钟让 npm 同步
3. 再发布 React/Vue 包

### 问题 2：版本号不一致

**原因：** 某个包的版本号没有正确更新。

**解决方案：**

1. 检查 `.versionrc.json` 是否包含所有包
2. 重新运行 `pnpm run release`
3. 手动检查各包的 `package.json` 版本号是否一致

### 问题 3：构建失败

**原因：** 依赖未正确安装或构建配置有问题。

**解决方案：**

```bash
# 清理并重新安装
rm -rf node_modules packages/*/node_modules
pnpm install

# 重新构建
pnpm build
```

### 问题 4：npm 登录失败

**原因：** npm 账号未登录或 token 过期。

**解决方案：**

```bash
# 重新登录
npm login

# 如果使用 2FA，确保 token 有效
npm whoami
```

## ✅ 发布检查清单

发布前请确认：

- [ ] 所有代码已提交到 git
- [ ] 已运行 `pnpm build` 且构建成功
- [ ] 已运行 `pnpm run release` 更新版本号
- [ ] 已检查 `CHANGELOG.md` 内容正确
- [ ] 已确认发布顺序（core -> react -> vue）
- [ ] npm 账号已登录（`npm whoami`）
- [ ] 有发布权限（对 `@keekuun` scope）
- [ ] 已测试本地构建产物可以正常工作

## 📚 相关文档

- [部署文档站点](./deploy.md) - 如何部署文档到 Vercel
- [GitHub 仓库](https://github.com/Keekuun/keymaster) - 查看源码和提交历史
