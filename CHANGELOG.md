# 变更日志

## [1.4.4](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.4.3...v1.4.4) (2025-03-24)

## [1.4.3](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.4.0...v1.4.3) (2025-03-23)

### 🔄 持续集成

* **release:** 优化版本更新流程 ([1b41904](https://github.com/ClarityJS/karin-plugin-meme/commit/1b41904a77a49453f2b47cdfd77d4a09ebe6b51a))
* 更新 Release 工作流触发条件 ([d6d1fa1](https://github.com/ClarityJS/karin-plugin-meme/commit/d6d1fa1898bdbcf14d77eadf3957faf884c221c1))
* 简化版本发布流程 ([c922340](https://github.com/ClarityJS/karin-plugin-meme/commit/c922340c91cfd25ce0ac48d12fa124cd25c6e92a))

## [1.4.2](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.4.0...v1.4.2) (2025-03-23)

### 🔄 持续集成

* **release:** 优化版本更新流程 ([1b41904](https://github.com/ClarityJS/karin-plugin-meme/commit/1b41904a77a49453f2b47cdfd77d4a09ebe6b51a))
* 简化版本发布流程 ([c922340](https://github.com/ClarityJS/karin-plugin-meme/commit/c922340c91cfd25ce0ac48d12fa124cd25c6e92a))

## [1.4.1](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.4.0...v1.4.1) (2025-03-23)

### 🔄 持续集成

* 简化版本发布流程 ([c922340](https://github.com/ClarityJS/karin-plugin-meme/commit/c922340c91cfd25ce0ac48d12fa124cd25c6e92a))

## [1.4.0](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.3.0...v1.4.0) (2025-03-23)

### ✨ 新功能

* **meme:** 优化表情包命令和更新机制 ([5ee9f01](https://github.com/ClarityJS/karin-plugin-meme/commit/5ee9f019eff30f743f2e753fdfd61aa5ae73b284))
* **meme:** 添加预设参数功能并优化表情包生成逻辑 ([28d71a9](https://github.com/ClarityJS/karin-plugin-meme/commit/28d71a938b890f3c9af0d8462f6dc899785d8239))

### 🐛 修复

* OneBot适配器下引用消息图片获取异常 ([#26](https://github.com/ClarityJS/karin-plugin-meme/issues/26)) ([4dd6e9e](https://github.com/ClarityJS/karin-plugin-meme/commit/4dd6e9eff69046781fa12e2fae43ba57a260e363))
* **random:** 修复随机表情命令的默认文本逻辑 ([9a4aed3](https://github.com/ClarityJS/karin-plugin-meme/commit/9a4aed3ef0f918d770e08511f53ddf4a8ba50ed7))
* **search:** 修复函数调用错误 ([f679ec8](https://github.com/ClarityJS/karin-plugin-meme/commit/f679ec86bf25d7bfda35c3ed16807660fb3be9f8))

### ♻️ 重构

* **gif:** 优化 GIF 分解功能 ([6356f8e](https://github.com/ClarityJS/karin-plugin-meme/commit/6356f8ee5b72ed879b066abd847924daa2b582d1))
* **index.ts:** 优化初始化信息 ([cf227ee](https://github.com/ClarityJS/karin-plugin-meme/commit/cf227ee5213ad879f7d3dcfdccf87565178908a9))
* **meme:** 优化代码结构和类型定义 ([e602715](https://github.com/ClarityJS/karin-plugin-meme/commit/e6027152377c01e8649faaa530df85b87fa79377))
* **Meme:** 优化获取回复消息中用户信息的逻辑 ([b8072f5](https://github.com/ClarityJS/karin-plugin-meme/commit/b8072f52de4c326025adf7409917abe1761ae78a))

### ⚡ 性能优化

* **update:** 添加表情包资源自动更新功能 ([8fee7b3](https://github.com/ClarityJS/karin-plugin-meme/commit/8fee7b354402df39449a193c91a068248709d805))

### 🔄 持续集成

* 仅在合并 release/v 分支时推送标签 ([00203fc](https://github.com/ClarityJS/karin-plugin-meme/commit/00203fca58cde459c7020c05c4b2de6440d949bf))

## [1.3.0](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.2.3...v1.3.0) (2025-03-03)

### ✨ 新功能

* **gif:** 添加 GIF 变速功能并优化 GIF 处理 ([322aa67](https://github.com/ClarityJS/karin-plugin-meme/commit/322aa67f198db9793b74b24090b26a98d0e54e01))
* **gif:** 添加 GIF 图片分解功能 ([5fbebe2](https://github.com/ClarityJS/karin-plugin-meme/commit/5fbebe2752fb4000da7bd442327e7bec633611d7))

### 🐛 修复

* **gif:** 修复 gif 分解命令未找到图片时的错误处理 ([0f09348](https://github.com/ClarityJS/karin-plugin-meme/commit/0f0934824c45292f162c8b76f443cae1016938f3))

### ♻️ 重构

* **gif:** 优化 GIF 图像检测逻辑 ([5265ed9](https://github.com/ClarityJS/karin-plugin-meme/commit/5265ed94076052d4d3a170ca068e8fe7703a5da9))
* **gif:** 重构 GIF 解析和处理逻辑 ([bdb4c7b](https://github.com/ClarityJS/karin-plugin-meme/commit/bdb4c7bf581fc14f501d90d8379f62bf51017b01))

### ⚡ 性能优化

* **gif:** 优化 GIF 解析逻辑 ([20cf6d0](https://github.com/ClarityJS/karin-plugin-meme/commit/20cf6d075ab676e5c51ac7a18011693d321e68a6))

## [1.2.3](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.2.2...v1.2.3) (2025-02-27)

### 📚 文档更新

* 更新 README 中的待办列表 ([1ed27ce](https://github.com/ClarityJS/karin-plugin-meme/commit/1ed27ce3bdd50b360a8db42e8eb59722ea4ce0f5))

### ♻️ 重构

* **models:** 移除数据库初始化中的冗余操作 ([79f6d78](https://github.com/ClarityJS/karin-plugin-meme/commit/79f6d78a08d594de821928fe004703c0302ae4aa))

### ⚡ 性能优化

* **access:** 添加表情包黑白名单功能 ([9627b2c](https://github.com/ClarityJS/karin-plugin-meme/commit/9627b2ce73c42ccb7c7d1c8bea7a7d86fe60615c))

## [1.2.2](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.2.1...v1.2.2) (2025-02-26)

### 📚 文档更新

* 更新 README.md，完成更新计划中的多个功能项 ([6f705dc](https://github.com/ClarityJS/karin-plugin-meme/commit/6f705dc69d330da5f2148f18040b680ec0fcf7d4))

### ♻️ 重构

* **meme:** 重构表情包功能模块 ([ad895a7](https://github.com/ClarityJS/karin-plugin-meme/commit/ad895a7937932d7d35d04161c690990b45565450))

## [1.2.1](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.2.0...v1.2.1) (2025-02-25)

### 🐛 修复

* **meme:** 优化防误触发处理逻辑 ([249e67f](https://github.com/ClarityJS/karin-plugin-meme/commit/249e67f94f30ed81ba165b1480f775692b79a275))
* **meme:** 修复文字表情处理逻辑 ([cdee54d](https://github.com/ClarityJS/karin-plugin-meme/commit/cdee54d8db5ba80da12cc73361730ffbe72bfabf))
* **meme:** 增强用户文本验证逻辑，支持更多格式 ([f2d5b15](https://github.com/ClarityJS/karin-plugin-meme/commit/f2d5b153c0d28fcf098eb018a98b704f8092463d))
* **meme:** 添加用户名配置项 ([b4b801e](https://github.com/ClarityJS/karin-plugin-meme/commit/b4b801ef47680d57611c6d3a45c8ae244d88e668))
* **release:** 动态获取分支引用以生成 Beta 版本号 ([e4387f8](https://github.com/ClarityJS/karin-plugin-meme/commit/e4387f8e2408acdd8335e6df1db1256c95c60575))
* **utils:** 优化昵称获取逻辑，使用逻辑或替代空值合并 ([d63b31e](https://github.com/ClarityJS/karin-plugin-meme/commit/d63b31edccf3ad3d0b4b4714b31bc76c171c8719))

### 📚 文档更新

* **README:** 更新 npm 版本徽章标签以提高可读性 ([e40ed29](https://github.com/ClarityJS/karin-plugin-meme/commit/e40ed2982fcfba9b61ad88ced658131af78e471f))
* **README:** 更新项目徽章和版本信息 ([77ec690](https://github.com/ClarityJS/karin-plugin-meme/commit/77ec6900baaa7b234c7bdaeb0b56e6b21365569e))

### ♻️ 重构

* **meme:** 移除未使用的类型定义以简化代码 ([f45c8c7](https://github.com/ClarityJS/karin-plugin-meme/commit/f45c8c734d7aabd785c23f015cd24cdb6af7d56f))
* **resources:** 优化资源文件并替换图片格式 ([512f15b](https://github.com/ClarityJS/karin-plugin-meme/commit/512f15bf15c2567da3d1c3bbd14d523f2788a069))
* **search:** 添加表情搜索功能 ([c051c57](https://github.com/ClarityJS/karin-plugin-meme/commit/c051c572e3a98924798540fff03f6fdb45264e70))
* 更新导入路径以使用绝对路径，简化模块引用 ([1221b8a](https://github.com/ClarityJS/karin-plugin-meme/commit/1221b8a22f88328b6a455bfa45d18dd8c71180d7))

### ⚡ 性能优化

* **meme:** 支持快捷指令功能 ([60abc7d](https://github.com/ClarityJS/karin-plugin-meme/commit/60abc7d3d84c4b5bd639cfa07a6f4cb15c7229f1))
* **Meme:** 添加参数表情处理功能 ([7eb0e6c](https://github.com/ClarityJS/karin-plugin-meme/commit/7eb0e6ceacc7a0bd980793ed1f763302009d7e54))
* **metrics:** 添加插件访问次数统计功能 ([91bfe9d](https://github.com/ClarityJS/karin-plugin-meme/commit/91bfe9d84ff0a959cab882d191a53561556c518b))

### 🔄 持续集成

* **workflow:** 添加 pnpm 环境配置 ([fa56e1c](https://github.com/ClarityJS/karin-plugin-meme/commit/fa56e1c98d93b7bda70e887664d2406940f6a13e))

## [1.2.0](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.1.2...v1.2.0) (2025-02-19)

### ✨ 新功能

* **info:** 重构并增强表情包详情功能 ([7d840e8](https://github.com/ClarityJS/karin-plugin-meme/commit/7d840e86b0d3fb757a6ca25e75805c9bb25907c0))
* **meme:** 添加表情包详情功能并优化相关逻辑 ([ef7116d](https://github.com/ClarityJS/karin-plugin-meme/commit/ef7116d33302b06f1441f3eabf55ffb0a5568256))
* **models:** 重构表情包数据处理逻辑 ([37776a9](https://github.com/ClarityJS/karin-plugin-meme/commit/37776a9907af5818ff70ccda78579bc1c9533567))

### 🐛 修复

* **update:** 优化插件更新逻辑 ([694070a](https://github.com/ClarityJS/karin-plugin-meme/commit/694070a6e8869b99f0ec5d601abf82c1e27dcbd7))
* **update:** 修复update.js的问题，需等待karin更新修复 ([bcf3cfe](https://github.com/ClarityJS/karin-plugin-meme/commit/bcf3cfe45d05b98ad8be31912fca79944ee96db5))
* **权限控制:** 将表情相关命令权限提升到仅master可用 ([3553b32](https://github.com/ClarityJS/karin-plugin-meme/commit/3553b32ba14ff2abbd249e4d5d80d997875fb74f))

### 📚 文档更新

* **README:** 更新项目信息 ([323c397](https://github.com/ClarityJS/karin-plugin-meme/commit/323c3974c4c2ba6547c346d28f2b069f13fcd5fb))

### ♻️ 重构

* **eslint:** 将 ESLint 配置文件从 CJS 迁移到 ES Module 格式 ([f0b3f5d](https://github.com/ClarityJS/karin-plugin-meme/commit/f0b3f5d72ecc7801303faf8cd86618aafd8a6c6c))
* **Meme:** 优化图片处理和依赖管理 ([45c4381](https://github.com/ClarityJS/karin-plugin-meme/commit/45c43813d945c47ee0318676a052c8c7d4ab9aa0))
* **models:** 重构 Tools 类并优化表情包相关功能 ([6ad2234](https://github.com/ClarityJS/karin-plugin-meme/commit/6ad2234a2d9e6e8b5ed360bbe2a034dfdf6ad579))
* **web.config.ts:** 修改Accordion标题名称 ([85af3c5](https://github.com/ClarityJS/karin-plugin-meme/commit/85af3c5f4514b5fa9c792b232779f55bc93eb8e5))

### 🔄 持续集成

* **release:** 在生成 Beta 版本号前更新代码 ([106dbad](https://github.com/ClarityJS/karin-plugin-meme/commit/106dbadab66d6d51c2def59638b60b6fdbe3a94e))
* **workflow:** 优化预览版构建流程 ([8e2b78e](https://github.com/ClarityJS/karin-plugin-meme/commit/8e2b78e0bf76e38c7f1c82f1e12cb45edfa28bcf))
* **workflow:** 更新 release 相关的 GitHub Actions ([a381921](https://github.com/ClarityJS/karin-plugin-meme/commit/a381921fc93951cdc9553e05cf34ae35a1b6ec32))
* 优化构建时间获取流程 ([0fa1916](https://github.com/ClarityJS/karin-plugin-meme/commit/0fa19161d86ccecb73c8cbe50f5af88790147eb8))
* 更新 beta 版本构建消息中的分支名称 ([d50907d](https://github.com/ClarityJS/karin-plugin-meme/commit/d50907d102c68728c59ee2c973eeff852d60b26e))
* 更新 GitHub Actions 工作流 ([37d6921](https://github.com/ClarityJS/karin-plugin-meme/commit/37d6921562170711a8c4444225031a9ebfb980a6))
* 更新构建时间戳为北京时间 ([27d8d35](https://github.com/ClarityJS/karin-plugin-meme/commit/27d8d35872097377996640df89afdae74166fe02))
* 更新预览版发布流程 ([69cfa4f](https://github.com/ClarityJS/karin-plugin-meme/commit/69cfa4f044cbc65b7fcb563818bc05cdef560f6b))
* 调整 Beta 版本号生成流程 ([e512a0f](https://github.com/ClarityJS/karin-plugin-meme/commit/e512a0f9d260f6c6eddf1cc9bfca8cf1a95e5b33))

### 🏗️ 构建系统

* **eslint:** 更新 ESLint 配置和依赖 ([cf6c9ef](https://github.com/ClarityJS/karin-plugin-meme/commit/cf6c9ef1077b1d74e1e15d0f3844b50aed784864))

## [1.1.2](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.1.1...v1.1.2) (2025-01-31)

### 🐛 修复

* **meme:** 修改配置项名称，将'enabled'更改为'enable' ([3ce3eae](https://github.com/ClarityJS/karin-plugin-meme/commit/3ce3eae87987195d9536515b105b32f00493fa16))

## [1.1.1](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.1.0...v1.1.1) (2025-01-31)

### 🐛 修复

* **admin:** 修改权限设置为'master'并删除测试文件，优化配置初始化逻辑 ([0db8246](https://github.com/ClarityJS/karin-plugin-meme/commit/0db82468284631334c719aac4d9caf017b9ebbd8))

### ♻️ 重构

* **meme:** 重构表情配置及功能 ([9d78d38](https://github.com/ClarityJS/karin-plugin-meme/commit/9d78d38ef062adb4d627f016c0e5bc90309551fb))

## [1.1.0](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.0.1-beta.5...v1.1.0) (2025-01-31)

### ✨ 新功能

* **meme:** 添加表情包功能并优化相关配置 ([57f5ab5](https://github.com/ClarityJS/karin-plugin-meme/commit/57f5ab5344a4fee729b49ad478945a68d790122d))

### 🐛 修复

* **update:** 修复更新插件时的数据显示问题 ([5502f6e](https://github.com/ClarityJS/karin-plugin-meme/commit/5502f6e883ad11f6a1e661d6c01c5d2af52a134d))

### 🔧 其他更新

* **config:** 重构配置文件管理并添加管理员设置功能 ([131c87c](https://github.com/ClarityJS/karin-plugin-meme/commit/131c87ca1cea3899c21b543d7e6c22597f9d0019))
* **config:** 重构配置文件管理并添加管理员设置功能 ([62610a7](https://github.com/ClarityJS/karin-plugin-meme/commit/62610a71e2539f45d8485510123bbc045cb8786b))

### ♻️ 重构

* **models:** 重构帮助模型类型导入方式 ([304b6b5](https://github.com/ClarityJS/karin-plugin-meme/commit/304b6b59c00aca08b67a4744f005daefe42cee9c))

## [1.0.1-beta.5](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.0.1-beta.4...v1.0.1-beta.5) (2025-01-27)

### 🔄 持续集成

* **workflow:** 更新发布工作流权限以支持包和 ID 令牌访问 ([fced32f](https://github.com/ClarityJS/karin-plugin-meme/commit/fced32f37262249aa95ddbdecabc7f26500d1c73))

## [1.0.1-beta.4](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.0.1-beta.3...v1.0.1-beta.4) (2025-01-27)

### 🏗️ 构建系统

* **release:** 更新发布流程并修改包名称 ([c44edd1](https://github.com/ClarityJS/karin-plugin-meme/commit/c44edd1abe73583b7c06ccfe37cee62f84cf8245))

## [1.0.1-beta.3](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.0.1-beta.2...v1.0.1-beta.3) (2025-01-27)

### 🔄 持续集成

* **workflow:** 更新发布工作流权限以支持 ID 令牌写入 ([a635e31](https://github.com/ClarityJS/karin-plugin-meme/commit/a635e31453b8bda0eff3380657d1f5723517862e))

## [1.0.1-beta.2](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.0.1-beta.1...v1.0.1-beta.2) (2025-01-27)

### 🔄 持续集成

* **workflow:** 更新发布工作流权限以支持包写入 ([5bf737f](https://github.com/ClarityJS/karin-plugin-meme/commit/5bf737f630a7a64ee6347b2fb1477d3c3750f919))

## [1.0.1-beta.1](https://github.com/ClarityJS/karin-plugin-meme/compare/v1.0.1-beta.0...v1.0.1-beta.1) (2025-01-27)

### 🔄 持续集成

* **workflow:** 更新 GitHub Actions 工作流和包发布配置 ([ca273ef](https://github.com/ClarityJS/karin-plugin-meme/commit/ca273ef361d119426770105f6e712c2e46b19569))
* 优化 GitHub Actions 构建流程 ([88d80f3](https://github.com/ClarityJS/karin-plugin-meme/commit/88d80f30484d78bc6fadfc216842cd5c852d18f6))

## 1.0.1-beta.0 (2025-01-26)

### 🔄 持续集成

* 初始化项目配置和工作流 ([044973f](https://github.com/ClarityJS/karin-plugin-meme/commit/044973f0a4d1c287bc1fbc8cf81db3c50927966c))
