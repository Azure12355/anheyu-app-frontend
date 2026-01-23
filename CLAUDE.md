# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 项目概述

**安知鱼应用前端** (Anheyu App Frontend) 是一个基于 Vue 3 的内容管理平台前端，作为博客/CMS 系统构建，具有文章、媒体、用户管理和站点定制等丰富功能。基于 pure-admin-thin 架构。

## 技术栈

- **框架**: Vue 3 (Composition API) + TypeScript
- **构建工具**: Vite 7
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: TailwindCSS + SCSS
- **包管理器**: pnpm（强制使用 - 使用 npm/yarn 会报错）
- **Node 版本**: ^18.18.0 || ^20.9.0 || >=22.0.0

## 核心依赖

- **Markdown**: md-editor-v3（支持 LaTeX、Mermaid、语法高亮）
- **媒体**: Cropper.js（图片编辑）、xgplayer（视频播放）、Lottie（动画）
- **图表**: ECharts
- **工具库**: Axios、Day.js、Lodash-es、VueUse、localForage

## 常用命令

```bash
# 开发（运行在 8848 端口）
pnpm dev          # 启动开发服务器
pnpm serve        # dev 的别名

# 构建
pnpm build        # 生产环境构建
pnpm build:staging # 预发布环境构建
pnpm preview      # 预览构建后的应用

# 代码质量
pnpm lint         # 运行所有 linter（ESLint、Prettier、Stylelint）
pnpm lint:eslint  # 仅 ESLint
pnpm lint:prettier # Prettier 格式化
pnpm lint:stylelint # 仅 Stylelint
pnpm typecheck    # TypeScript 类型检查

# 维护
pnpm svgo         # 优化 SVG 文件
pnpm clean:cache  # 清理所有缓存并重新安装依赖
```

## 架构设计

### 项目结构

```
src/
├── components/       # 可复用的 Vue 组件
├── views/           # 页面级组件（路由）
├── layouts/         # 布局组件（frontend/、system/）
├── router/          # 路由配置
│   └── modules/     # 自动导入的路由模块
├── store/           # Pinia 状态管理
│   └── modules/     # 按领域划分的状态管理
├── composables/     # Composition API 工具函数
├── utils/           # 辅助函数
├── styles/          # 全局样式
├── api/             # API 服务层
└── config/          # 配置文件
```

### 双布局系统

应用有两个独立的布局系统：

1. **前台布局** (`src/layout/frontend/`) - 面向公众的博客/CMS 界面
   - 一图流横幅支持（图片/视频背景）
   - 音乐播放器集成
   - 移动端菜单
   - 搜索模态框
   - 右键菜单
   - 键盘快捷键

2. **后台布局** (`src/layout/index.vue`) - 管理后台
   - 多标签页导航
   - 侧边栏菜单
   - 面包屑导航

### 路由架构

- **自动导入**: 路由从 `src/router/modules/**/*.ts` 自动导入
- **路由扁平化**: 三级及以上路由被扁平化为两级以用于导航
- **基于权限**: 通过 `meta.roles` 根据用户角色控制路由访问
- **动态路由**: 登录后通过 `initRouter()` 从后端初始化路由
- **路由白名单**: 无需认证即可访问的公开路由

关键路由模式：
- 静态路由定义在 `src/router/modules/`
- 动态路由从后端加载并存储在 permission store 中
- `remainingRouter` 包含不参与菜单渲染的路由

### 状态管理 (Pinia)

`src/store/modules/` 中的核心状态管理：
- **user.ts** - 认证和用户数据
- **permission.ts** - 动态路由和菜单访问权限
- **multiTags.ts** - 多标签页导航（后台区域）
- **app.ts** - 全局应用状态
- **siteConfig.ts** - 站点配置（从后端获取）
- **uiStore.ts** - UI 状态（模态框、面板）
- **loadingStore.ts** - 全局加载状态
- **articleStore.ts** - 文章/帖子管理
- **commentStore.ts** - 评论管理
- **fileStore.ts** - 文件/媒体管理
- **link.ts** - 友情链接管理
- **album.ts** - 相册/图库管理

### API 层

位于 `src/api/`：
- 按领域组织的 API 模块（user、post、comment 等）
- 基于 Axios 的 HTTP 客户端
- 用于认证和错误处理的请求/响应拦截器

### Composables 模式

`src/composables/` 中的可复用组合函数：
- `useKeyboardShortcuts` - 键盘快捷键处理
- `useCopyProtection` - 内容复制保护
- 音/视频处理 composables
- 统计追踪 composables
- 文件上传 composables
- 主题管理 composables

## 开发代理配置

开发期间，API 请求被代理到 `http://localhost:8091`：

```
/api/*          - 后端 API 接口
/f/*            - 静态文件上传
/needcache/*    - 缓存资源
/sitemap.xml    - SEO 站点地图
/robots.txt     - SEO robots 文件
/rss.xml, /feed.xml, /atom.xml - RSS 订阅源
```

## 构建配置

- **Chunk 大小警告**: 4000KB 限制（已从默认值增加）
- **CSS 代码分割**: 已启用
- **构建目标**: ES2015
- **Source Maps**: 生产环境已禁用
- **压缩**: Gzip/Brotli（通过 vite-plugin-compression）
- **CDN 支持**: 通过 vite-plugin-cdn-import 引入外部依赖

## 重要模式

### 组件注册

- 全局组件：Iconify 图标（通过 `@iconify/vue`）、Auth、Perms
- Element Plus 通过 `unplugin-element-plus` 自动导入
- 组件使用 `defineOptions` 定义名称（keep-alive 需要）

### Keep-Alive 模式

需要缓存的组件必须：
1. 使用 `defineOptions({ name: 'ComponentName' })`
2. 在路由配置中设置 `meta.keepAlive = true`
3. 组件名称必须与 keep-alive include 中使用的值匹配

### 主题管理

- 主题更改通过 `useDataThemeChange` composable 处理
- 站点配置驱动主题设置
- 支持动态主题颜色（如文章特定主题）

### 权限系统

- 通过路由上的 `meta.roles` 实现基于角色的访问控制
- `v-auth` 指令用于组件级权限
- `v-perms` 指令用于细粒度权限控制

## 环境变量

- `VITE_PORT=8848` - 开发服务器端口
- `VITE_PUBLIC_PATH` - 公共资源路径
- `VITE_ROUTER_HISTORY=h5` - HTML5 history 模式
- `VITE_HIDE_HOME=true` - 隐藏仪表盘首页
- `VITE_CDN` - 为外部依赖启用 CDN
- `VITE_COMPRESSION` - 启用构建压缩

## Git 钩子

使用 Husky 进行 pre-commit 钩子，配合 lint-staged。提交前会运行所有 linter。

## 特色功能

### 一图流横幅
可按页面配置的 Hero 区域：
- 静态或视频背景
- 移动端专用背景
- 副标题打字机效果
- 一言 API 集成（随机语录）
- 浏览器策略处理的视频自动播放（包括微信）

### SEO 支持
- 动态 meta 标签管理（特别是文章）
- Sitemap/robots.txt 生成
- RSS 订阅源支持
- 文章专属的 Open Graph 标签

### 性能优化
- Vite 预热关键文件
- 非关键组件懒加载
- 图片优化和懒加载
- localForage 缓存策略
- FPS 监控（仅开发模式）
