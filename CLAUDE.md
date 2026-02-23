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

---

# 代码规范与开发指南

## 代码风格规范

### EditorConfig 配置

项目根目录的 `.editorconfig` 定义了基础编码规范：

```ini
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```

**重要**：
- 缩进：2 空格
- 换行符：LF
- 文件末尾：插入空行（Markdown 除外）

### ESLint 规则

配置文件：`eslint.config.js`

**核心规则**：
- 禁用 `no-debugger`
- 未使用变量忽略下划线前缀：`^_`
- Vue 组件允许多单词命名
- HTML 标签自闭合：`vue/html-self-closing: always`

```bash
# 运行 ESLint
pnpm lint:eslint

# 自动修复
pnpm lint:eslint --fix
```

### Prettier 规则

配置文件：`.prettierrc.js`

```javascript
{
  bracketSpacing: true,
  singleQuote: false,    // 使用双引号
  arrowParens: "avoid",  // 单参数箭头函数省略括号
  trailingComma: "none"  // 不使用尾随逗号
```

```bash
# 运行 Prettier
pnpm lint:prettier
```

### Stylelint 规则

配置文件：`stylelint.config.js`

- 支持 Tailwind、SCSS 语法
- 支持 `deep`、`global` 伪类
- CSS 属性按特定顺序排列

```bash
# 运行 Stylelint
pnpm lint:stylelint
```

### 运行所有检查

```bash
pnpm lint  # 依次运行 ESLint、Prettier、Stylelint
```

## TypeScript 规范

### 类型定义规范

```typescript
// 接口定义 - 使用 interface
interface UserInfo {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

// 类型别名 - 用于联合类型
type Status = 'active' | 'inactive' | 'pending';

// 泛型接口
export type ApiResponse<T = any> = {
  code: number;
  message: string;
  data: T;
};

// 必需属性和可选属性
interface Article {
  id: string;
  title: string;
  content: string;
  author?: UserInfo;  // 可选属性用 ?
  readonly created_at: string;  // 只读属性用 readonly
}
```

### 类型导入规范

```typescript
// 类型导入
import type { UserInfo, Article } from '@/types/user';
import type { Ref } from 'vue';

// 值导入
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
```

## Vue 组件规范

### 组件结构模板

```vue
<script setup lang="ts">
// 1. 导入语句
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 2. 组件选项（name 必须定义，用于 keep-alive）
defineOptions({
  name: 'ComponentName'
});

// 3. Props 定义
interface Props {
  title?: string;
  visible: boolean;
  data?: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  visible: false
});

// 4. Emits 定义
interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', data: SubmitData): void;
}
const emit = defineEmits<Emits>();

// 5. 响应式数据
const count = ref(0);
const doubled = computed(() => count.value * 2);

// 6. 方法
const handleClick = () => {
  emit('update:visible', false);
};

// 7. 生命周期
onMounted(() => {
  // 初始化逻辑
});
</script>

<template>
  <div class="component-wrapper">
    <h1>{{ props.title }}</h1>
    <button @click="handleClick">点击</button>
  </div>
</template>

<style lang="scss" scoped>
.component-wrapper {
  // 样式定义
}
</style>
```

### 命名规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| 组件名 | PascalCase | `defineOptions({ name: 'UserSettings' })` |
| 文件名 | kebab-case | `user-settings/index.vue` |
| 变量/函数 | camelCase | `userName`、`handleSubmit` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 接口/类型 | PascalCase | `interface UserInfo {}` |
| 私有变量 | 下划线前缀 | `const _privateData = ref('')` |

### Props/Emits 定义

```typescript
// Props - 使用泛型语法
interface Props {
  title: string;        // 必需
  count?: number;       // 可选
  items?: string[];      // 可选数组
}
const props = defineProps<Props>();

// Emits - 使用泛型语法
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string, oldValue: string];
}>();
```

### 组件通信规范

1. **父子通信**：Props 向下，Emits 向上
2. **v-model**：`update:modelValue` 事件
3. **跨组件通信**：优先使用 Pinia Store
4. **依赖注入**：provide/inject（谨慎使用）

## Pinia Store 规范

### Store 定义模板

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 命名规范：use[模块名]Store
// Store ID：anheyu-[模块名]
export const useUserStore = defineStore('anheyu-user', () => {
  // State - 使用 ref
  const token = ref<string>('');
  const userInfo = ref<UserInfo | null>(null);

  // Getters - 使用 computed
  const isAuthenticated = computed(() => !!token.value);

  // Actions - 普通函数
  async function login(data: LoginData) {
    const res = await loginApi(data);
    token.value = res.data.token;
    userInfo.value = res.data.user;
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
  }

  // 返回所有需要暴露的状态和方法
  return {
    token,
    userInfo,
    isAuthenticated,
    login,
    logout
  };
});
```

### Store 组织规范

- 文件位置：`src/store/modules/[模块名].ts`
- Store 命名：`use[模块名]Store`
- Store ID：`anheyu-[模块名]`

## API 调用规范

### API 函数定义

```typescript
// src/api/user.ts
import { http } from '@/utils/http';
import type { UserInfo, LoginData, LoginResultData } from './types';

/**
 * 获取用户信息
 * @returns Promise<UserInfo>
 */
export function getUserInfoApi(): Promise<UserInfo> {
  return http.get<UserInfo>('/user/info');
}

/**
 * 用户登录
 * @param data 登录数据
 * @returns Promise<LoginResultData>
 */
export function loginApi(data: LoginData): Promise<LoginResultData> {
  return http.post<LoginResultData>('/auth/login', data);
}
```

### HTTP 类型定义

```typescript
// src/api/types.d.ts 或相关的类型文件
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  username: string;
  password: string;
  captcha_id?: string;
  captcha_value?: string;
}

export interface LoginResultData {
  token: string;
  user: UserInfo;
}
```

### 错误处理

```typescript
import { http } from '@/utils/http';

try {
  const result = await http.post('/api/endpoint', data);
  // 处理成功响应
} catch (error) {
  // 错误已在拦截器中统一处理
  // 业务层可针对特定错误做特殊处理
  console.error('请求失败:', error);
}
```

## 样式规范

### TailwindCSS 使用

```vue
<template>
  <!-- 工具类使用：直接写 class -->
  <div class="flex items-center justify-between p-4 bg-white">
    <span class="text-lg font-bold">标题</span>
  </div>
</template>
```

### SCSS 变量

```scss
// 定义变量
:root {
  --anzhiyu-theme: #163bf2;
  --anzhiyu-card-bg: #ffffff;
}

// 使用变量
.my-component {
  background-color: var(--anzhiyu-theme);
}
```

### 样式组织

1. **全局样式**：`src/style/index.scss`
2. **组件样式**：使用 `<style lang="scss" scoped>`
3. **响应式**：使用 `@media` 查询

## 路由规范

### 路由定义模板

```typescript
// src/router/modules/user.ts
import Layout from '@/layout/index.vue';

export default [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: {
      icon: 'ep:user',
      title: '用户管理',
      roles: ['1']  // 角色权限
    },
    children: [
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/user/list/index.vue'),
        meta: {
          title: '用户列表',
          icon: 'ep:user',
          roles: ['1'],
          keepAlive: true  // 启用缓存
        }
      }
    ]
  }
];
```

### 路由元数据

| 字段 | 说明 | 示例 |
|-----|------|------|
| title | 标题 | `'用户管理'` |
| icon | 图标 | `'ep:user'` |
| roles | 权限角色 | `['1']` |
| keepAlive | 缓存组件 | `true` |
| hidden | 隐藏菜单 | `true` |

## Git 规范

### Commit Message 规范

使用 Husky + Commitlint：

```
<类型>(作用域): <描述>

# 类型
feat:     新功能
fix:      修复问题
docs:     文档更新
style:    样式修改
refactor: 代码重构
perf:     性能优化
test:     测试相关
chore:    构建/工具链
```

示例：
```
feat(user): 添加用户详情页面
fix(upload): 修复图片上传失败问题
docs: 更新 API 文档
style: 调整按钮样式
```

### Pre-commit 钩子

提交前自动执行：
- ESLint 检查
- Prettier 格式化
- Stylelint 检查

```bash
# 跳过钩子（谨慎使用）
git commit --no-verify
```

## 开发注意事项

### 必须定义组件名

```vue
<script setup lang="ts">
defineOptions({
  name: 'ComponentName'  // 必须！用于 keep-alive
});
</script>
```

### 路径别名

```typescript
// @/* 映射到 src/*
import { http } from '@/utils/http';
import { useUserStore } from '@/store/modules/user';
```

### 全局类型

```typescript
// 在 src/types/global.d.ts 中定义全局类型
// 声明后可直接使用，无需 import
```

### 禁止使用的模式

```typescript
// ❌ 避免使用 any
const data: any = {};

// ✅ 使用具体类型或 unknown
const data: unknown = {};

// ❌ 避免使用 v-html（安全风险）
// ✅ 如必须使用，确保内容可信

// ❌ 避免直接操作 DOM
document.getElementById('xxx')

// ✅ 使用 ref 模板引用
const elRef = ref<HTMLElement>();
```
