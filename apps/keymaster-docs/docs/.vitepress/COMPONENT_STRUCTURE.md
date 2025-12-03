# 组件结构说明

本文档说明 keymaster 文档站点的组件组织结构。

## 📁 组件目录结构

### Demo 组件（`docs/.vitepress/components/`）

用于在文档中展示功能示例的交互式组件，放在 `apps/keymaster-docs/docs/.vitepress/components/` 目录下。

**当前 Demo 组件列表：**

- ✅ `VueShortcutDemo.vue` - Vue 基础示例
- ✅ `ReactShortcutDemo.vue` - React 基础示例
- ✅ `ScopedShortcutDemo.vue` - 作用域绑定示例
- ✅ `EditorModeDemo.vue` - 编辑器模式示例
- ✅ `MultipleShortcutsDemo.vue` - 多快捷键示例
- ✅ `KeyBindingManagerDemo.vue` - 快捷键管理器示例
- ✅ `ElectronModeDemo.vue` - Electron 模式示例

**导入方式：**

在 `theme/index.ts` 中使用相对路径导入（VitePress 中别名导入可能不稳定）：

```typescript
import VueShortcutDemo from '../components/VueShortcutDemo.vue';
```

**使用方式：**

在 Markdown 文档中直接使用组件标签：

```markdown
<VueShortcutDemo />
```

---

### 主题组件（`theme/components/`）

用于增强文档站点整体体验的全局组件，放在 `apps/keymaster-docs/docs/.vitepress/theme/components/` 目录下。

**当前主题组件列表：**

- ✅ `BackToTop.vue` - 回到顶部按钮
- ✅ `CustomCursor.vue` - 自定义鼠标光标
- ✅ `VisualEffects.vue` - 背景视觉效果
- ✅ `VersionSelector.vue` - 版本选择器
- ✅ `VersionBanner.vue` - 版本横幅
- ✅ `VersionText.vue` - 版本文本
- ✅ `AllVersions.vue` - 所有版本列表
- ✅ `VersionList.vue` - 版本列表

**导入方式：**

```typescript
import BackToTop from './components/BackToTop.vue';
```

**使用方式：**

- 在 `Layout()` 中渲染（如 `BackToTop`、`CustomCursor`、`VisualEffects`）
- 在 `enhanceApp` 中注册为全局组件（如 `VersionBanner`、`VersionText`）

---

## ✅ 实现验证清单

### Demo 组件验证

- [x] 所有 Demo 组件已移动到 `docs/.vitepress/components/` 目录
- [x] `theme/index.ts` 中使用相对路径 `../components/` 导入 Demo 组件（VitePress 中别名导入可能不稳定）
- [x] 所有 Demo 组件已在 `enhanceApp` 中注册
- [x] 文档中已正确使用 Demo 组件（如 `<ReactShortcutDemo />`）

### 主题组件验证

- [x] 所有主题组件保留在 `theme/components/` 目录
- [x] `theme/index.ts` 中使用相对路径 `./components/` 导入主题组件
- [x] 全局主题组件（`BackToTop`、`CustomCursor`、`VisualEffects`）已在 `Layout()` 中渲染
- [x] 版本相关组件已在 `enhanceApp` 中注册

### 配置验证

- [x] `theme/index.ts` 中使用相对路径导入组件（不使用别名，因为 VitePress 中别名导入可能不稳定）
- [x] 文档站点可以正常构建（`pnpm docs:build` 成功）

---

## 📝 添加新组件的规则

### 添加新 Demo 组件

1. 在 `docs/.vitepress/components/` 创建 Vue 组件文件
2. 在 `docs/.vitepress/theme/index.ts` 中：
   - 使用相对路径 `../components/` 导入组件（VitePress 中别名导入可能不稳定）

   ```typescript
   import NewDemo from '../components/NewDemo.vue';
   ```

   - 在 `enhanceApp` 中注册组件

3. 在文档中使用 `<ComponentName />` 引用

### 添加新主题组件

1. 在 `docs/.vitepress/theme/components/` 创建 Vue 组件文件
2. 在 `docs/.vitepress/theme/index.ts` 中：
   - 使用相对路径 `./components/` 导入组件
   - 如需全局使用，在 `Layout()` 中渲染或在 `enhanceApp` 中注册
3. 如需在文档中使用，通过 `<ComponentName />` 引用

---

## 🎯 组件分类原则

### Demo 组件特征

- 用于在文档中展示功能示例
- 包含交互式演示逻辑
- 通常只在特定文档页面中使用
- 名称通常以 `Demo` 结尾

### 主题组件特征

- 用于增强文档站点整体体验
- 通常是全局功能（如回到顶部、自定义光标）
- 或者用于文档站点基础设施（如版本管理）
- 名称通常描述功能而非示例

---

**最后更新**: 2024-12（项目 v0.4.1 阶段）
