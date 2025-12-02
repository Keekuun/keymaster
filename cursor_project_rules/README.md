# 提示词
"我需要创建一个基于keymaster键盘快捷键库的现代化monorepo项目。请提供详细的实现步骤和技术方案，包括以下具体要求：

原项目：https://github.com/madrobby/keymaster 是一个纯JavaScript库，用于处理键盘事件。我们希望将其重构为包含React和Vue版本的库，并配套一个文档站点。

1. 项目结构：
    - 使用pnpm workspace创建monorepo
    - 包含三个子项目：
        * keymaster-react：基于Vite的React库（lib模式）
        * keymaster-vue：基于Vite的Vue库（lib模式）
        * keymaster-docs：基于Vitepress的文档站点

2. 技术细节：
    - 两个库项目(keymaster-react/keymaster-vue)需要：
        * 支持TypeScript
        * 配置完整的构建工具链
        * 使用bumpp或standard-version进行版本管理和CHANGELOG生成
        * 发布到npm，包名为@keekuun/keymaster-react和@keekuun/keymaster-vue
    - 文档项目(keymaster-docs)需要：
        * 配置Vercel部署
        * 包含API文档和示例
        * 自动同步最新发布的库版本

3. 开发工作流：
    - 共享的ESLint/Prettier配置
    - 统一的Husky git hooks
    - 跨包依赖管理
    - 清晰的monorepo脚本命令

4. 发布流程：
    - 自动化版本管理和发布
    - 生成详细的变更日志
    - 文档站点自动更新

请提供：
1. 完整的项目结构建议
2. 关键配置文件(pnpm-workspace.yaml, vite.config.ts等)的示例代码
3. 发布流程的详细步骤
4. 文档站点与库项目的集成方案
5. Vercel部署配置建议"


重点：
每次更新任何新功能，尽量完善相关文档。