# 主题色配置功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在管理端「外观配置」中新增「主题配置」页面，支持用户配置亮色和暗色模式下的主题色，并提供即时预览效果。

**Architecture:**
- 前端：在 settings.descriptor.ts 中添加新的配置键和菜单项，创建 ThemeSettingsForm 组件
- 主题应用：通过 JS 动态设置 CSS 变量到 :root 和 [data-theme="dark"]
- 数据存储：复用现有的 settings API (getSettingsApi/updateSettingsApi)

**Tech Stack:** Vue 3 + Element Plus (el-color-picker) + Pinia + TypeScript

---

## Task 1: 添加主题色配置键常量

**Files:**
- Modify: `src/constant/index.ts`

**Step 1: 添加两个新的配置键常量**

在 `KeyDefaultThemeMode` (第49行) 附近添加：

```typescript
const KeyThemeColorLight: SettingKey = "THEME_COLOR_LIGHT";
const KeyThemeColorDark: SettingKey = "THEME_COLOR_DARK";
```

**Step 2: 导出常量**

确保在文件底部的 `export` 部分添加：

```typescript
export const KeyThemeColorLight = KeyThemeColorLight;
export const KeyThemeColorDark = KeyThemeColorDark;
```

**Step 3: 验证语法**

```bash
pnpm typecheck
```

**Step 4: Commit**

```bash
git add src/constant/index.ts
git commit -m "feat(constant): add theme color config keys"
```

---

## Task 2: 在设置描述符中添加主题色配置项

**Files:**
- Modify: `src/views/system/settings-management/settings.descriptor.ts`

**Step 1: 导入新的常量**

在文件顶部的 import 部分添加：

```typescript
import { KeyThemeColorLight, KeyThemeColorDark } from "@/constant";
```

**Step 2: 添加主题色描述符**

在适当位置（如 `siteDescriptors` 后）添加 `themeColorDescriptors`：

```typescript
const themeColorDescriptors: SettingDescriptor[] = [
  {
    frontendPath: "theme.themeColorLight",
    backendKey: KeyThemeColorLight,
    defaultValue: "#163bf2",
    type: "string",
    label: "亮色主题色",
    searchKeywords: ["主题", "颜色", "亮色", "theme", "color", "light"]
  },
  {
    frontendPath: "theme.themeColorDark",
    backendKey: KeyThemeColorDark,
    defaultValue: "#dfa621",
    type: "string",
    label: "暗色主题色",
    searchKeywords: ["主题", "颜色", "暗色", "theme", "color", "dark"]
  }
];
```

**Step 3: 在外观配置菜单中添加「主题配置」子菜单**

在 `settingsMenuConfig` 的 `appearance` 项的 `children` 中添加（约第77-96行）：

```typescript
{
  key: "appearance-theme",
  label: "主题配置",
  component: "ThemeSettingsForm",
  keywords: ["主题", "颜色", "亮色", "暗色", "theme", "color"]
}
```

**Step 4: 导出新的描述符**

确保 `themeColorDescriptors` 在 `allSettingDescriptors` 中导出。

**Step 5: 验证语法**

```bash
pnpm typecheck
```

**Step 6: Commit**

```bash
git add src/views/system/settings-management/settings.descriptor.ts
git commit -m "feat(settings): add theme color descriptors and menu item"
```

---

## Task 3: 创建主题配置表单组件

**Files:**
- Create: `src/views/system/settings-management/components/frontDesk/ThemeSettingsForm/index.vue`

**Step 1: 创建组件文件**

```bash
mkdir -p /Users/lytton/code/blog/anheyu/anheyu-app-frontend/src/views/system/settings-management/components/frontDesk/ThemeSettingsForm
```

**Step 2: 编写组件代码**

创建 `ThemeSettingsForm/index.vue`：

```vue
<template>
  <div class="theme-settings-form">
    <!-- 亮色主题配置 -->
    <div class="theme-setting-item">
      <div class="setting-header">
        <div class="setting-info">
          <h4>亮色主题色</h4>
          <p class="setting-desc">亮色模式下使用的主色调</p>
        </div>
        <div class="color-preview" :style="{ backgroundColor: lightPreviewColor }">
          <span class="color-value">{{ formData.themeColorLight }}</span>
        </div>
      </div>
      <el-form-item label="选择颜色">
        <el-color-picker
          v-model="formData.themeColorLight"
          :predefine="predefineColors"
          show-alpha
          size="large"
          @change="handleLightColorChange"
        />
        <span class="form-item-help">
          选择亮色模式下的主题颜色，默认为蓝色 #163bf2
        </span>
      </el-form-item>
    </div>

    <!-- 暗色主题配置 -->
    <div class="theme-setting-item">
      <div class="setting-header">
        <div class="setting-info">
          <h4>暗色主题色</h4>
          <p class="setting-desc">暗色模式下使用的主色调</p>
        </div>
        <div class="color-preview" :style="{ backgroundColor: darkPreviewColor }">
          <span class="color-value">{{ formData.themeColorDark }}</span>
        </div>
      </div>
      <el-form-item label="选择颜色">
        <el-color-picker
          v-model="formData.themeColorDark"
          :predefine="predefineColors"
          show-alpha
          size="large"
          @change="handleDarkColorChange"
        />
        <span class="form-item-help">
          选择暗色模式下的主题颜色，默认为橙色 #dfa621
        </span>
      </el-form-item>
    </div>

    <!-- 实时预览说明 -->
    <el-alert
      type="info"
      :closable="false"
      show-icon
    >
      <template #title>
        颜色选择后会即时预览效果，点击「保存更改」后持久化到数据库
      </template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useSiteConfigStore } from "@/store/modules/siteConfig";

defineOptions({
  name: "ThemeSettingsForm"
});

interface ThemeSettings {
  themeColorLight: string;
  themeColorDark: string;
}

// 表单数据
const formData = ref<ThemeSettings>({
  themeColorLight: "#163bf2",
  themeColorDark: "#dfa621"
});

// 预设颜色
const defineColors = ref([
  "#163bf2", // 默认蓝
  "#dfa621", // 暗色默认橙
  "#ff6b6b", // 红色
  "#4ecdc4", // 青色
  "#a29bfe", // 紫色
  "#fd79a8", // 粉色
  "#00b894", // 绿色
  "#6c5ce7", // 深紫
  "#0984e3", // 深蓝
  "#e17055"  // 橙红
]);

// 计算预览颜色（考虑透明度）
const lightPreviewColor = computed(() => formData.value.themeColorLight);
const darkPreviewColor = computed(() => formData.value.themeColorDark);

// 处理亮色主题色变化
const handleLightColorChange = (color: string) => {
  if (color) {
    applyThemeColor(color, "light");
  }
};

// 处理暗色主题色变化
const handleDarkColorChange = (color: string) => {
  if (color) {
    applyThemeColor(color, "dark");
  }
};

// 应用主题色到 CSS 变量
const applyThemeColor = (color: string, mode: "light" | "dark") => {
  const root = document.documentElement;

  if (mode === "light") {
    // 亮色模式：设置 :root 的主题色
    root.style.setProperty("--anzhiyu-theme", color);
    root.style.setProperty("--anzhiyu-theme-op", `${color}23`);
    root.style.setProperty("--anzhiyu-theme-op-deep", `${color}dd`);
    root.style.setProperty("--anzhiyu-theme-op-light", `${color}0d`);
  } else {
    // 暗色模式：设置 [data-theme="dark"] 的主题色
    root.style.setProperty("--anzhiyu-theme", color);
    root.style.setProperty("--anzhiyu-theme-op", `${color}23`);
    root.style.setProperty("--anzhiyu-theme-op-deep", `${color}dd`);
    root.style.setProperty("--anzhiyu-theme-op-light", `${color}0d`);
  }
};

// 从 store 加载配置
const loadSettings = () => {
  const siteConfigStore = useSiteConfigStore();
  const config = siteConfigStore.getSiteConfig;

  if (config) {
    formData.value.themeColorLight = config.THEME_COLOR_LIGHT || "#163bf2";
    formData.value.themeColorDark = config.THEME_COLOR_DARK || "#dfa621";

    // 应用已保存的主题色
    applyThemeColor(formData.value.themeColorLight, "light");
    applyThemeColor(formData.value.themeColorDark, "dark");
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style lang="scss" scoped>
.theme-settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.theme-setting-item {
  padding: 1.5rem;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--style-border);
}

.setting-info {
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--anzhiyu-fontcolor);
  }

  .setting-desc {
    margin: 0;
    font-size: 0.875rem;
    color: var(--anzhiyu-secondtext);
  }
}

.color-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  min-width: 120px;
  transition: all 0.3s ease;

  .color-value {
    font-family: monospace;
    font-size: 0.875rem;
    color: #fff;
    text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
  }
}

.form-item-help {
  margin-left: 1rem;
  font-size: 0.875rem;
  color: var(--anzhiyu-secondtext);
}

:deep(.el-color-picker) {
  .el-color-picker__trigger {
    width: 60px;
    height: 40px;
    border-radius: 8px;
    border: var(--style-border);
  }
}
</style>
```

**Step 3: 验证语法**

```bash
pnpm typecheck
```

**Step 4: Commit**

```bash
git add src/views/system/settings-management/components/frontDesk/ThemeSettingsForm/
git commit -m "feat(settings): add theme settings form component"
```

---

## Task 4: 更新类型定义

**Files:**
- Modify: `src/views/system/settings-management/type.ts`

**Step 1: 在 ThemeSettingsInfo 类型中添加主题色字段**

找到 `ThemeSettingsInfo` 接口，添加：

```typescript
themeColorLight?: string;
themeColorDark?: string;
```

**Step 2: 验证语法**

```bash
pnpm typecheck
```

**Step 3: Commit**

```bash
git add src/views/system/settings-management/type.ts
git commit -m "feat(types): add theme color fields to settings type"
```

---

## Task 5: 在 siteConfigStore 中添加主题色处理逻辑

**Files:**
- Modify: `src/store/modules/siteConfig.ts`

**Step 1: 添加应用主题色的方法**

在 siteConfigStore 的 actions 中添加：

```typescript
// 应用用户配置的主题色
const applyUserThemeColors = () => {
  const config = state.siteConfig;

  // 获取当前主题模式
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  // 亮色主题色
  if (config.THEME_COLOR_LIGHT) {
    document.documentElement.style.setProperty("--anzhiyu-theme", config.THEME_COLOR_LIGHT);
    document.documentElement.style.setProperty("--anzhiyu-theme-op", `${config.THEME_COLOR_LIGHT}23`);
    document.documentElement.style.setProperty("--anzhiyu-theme-op-deep", `${config.THEME_COLOR_LIGHT}dd`);
    document.documentElement.style.setProperty("--anzhiyu-theme-op-light", `${config.THEME_COLOR_LIGHT}0d`);
  }

  // 暗色主题色（如果当前是暗色模式）
  if (isDark && config.THEME_COLOR_DARK) {
    document.documentElement.style.setProperty("--anzhiyu-theme", config.THEME_COLOR_DARK);
    document.documentElement.style.setProperty("--anzhiyu-theme-op", `${config.THEME_COLOR_DARK}23`);
    document.documentElement.style.setProperty("--anzhiyu-theme-op-deep", `${config.THEME_COLOR_DARK}dd`);
    document.documentElement.style.setProperty("--anzhiyu-theme-op-light", `${config.THEME_COLOR_DARK}0d`);
  }
};
```

**Step 2: 在 fetchSiteConfig 成功后调用应用主题色**

在 `fetchSiteConfig` action 的成功回调中添加 `applyUserThemeColors()` 调用。

**Step 3: 监听主题模式切换，应用对应的主题色**

添加 watch 监听主题模式变化：

```typescript
watch(
  () => state.siteConfig.THEME_COLOR_LIGHT,
  (newColor) => {
    if (newColor) {
      applyUserThemeColors();
    }
  }
);

watch(
  () => state.siteConfig.THEME_COLOR_DARK,
  (newColor) => {
    if (newColor) {
      applyUserThemeColors();
    }
  }
);
```

**Step 4: 导出新的 action**

确保 `applyUserThemeColors` 在 return 中导出。

**Step 5: 验证语法**

```bash
pnpm typecheck
```

**Step 6: Commit**

```bash
git add src/store/modules/siteConfig.ts
git commit -m "feat(store): add user theme color application logic"
```

---

## Task 6: 更新主题切换逻辑

**Files:**
- Modify: 需要找到主题切换的文件（通常是 `useDataThemeChange` composable 或类似文件）

**Step 1: 查找主题切换逻辑**

```bash
find /Users/lytton/code/blog/anheyu/anheyu-app-frontend/src -name "*.vue" -o -name "*.ts" | xargs grep -l "data-theme.*dark\|toggleTheme"
```

**Step 2: 在主题切换时应用对应的主题色**

在切换主题的逻辑中添加：

```typescript
// 切换到暗色时
if (isDark) {
  applyThemeColor(siteConfig.THEME_COLOR_DARK || "#dfa621", "dark");
} else {
  applyThemeColor(siteConfig.THEME_COLOR_LIGHT || "#163bf2", "light");
}
```

**Step 3: 验证语法**

```bash
pnpm typecheck
```

**Step 4: Commit**

```bash
git add [相关文件]
git commit -m "feat(theme): apply configured theme colors when switching themes"
```

---

## Task 7: 测试功能

**Step 1: 启动开发服务器**

```bash
pnpm dev
```

**Step 2: 手动测试步骤**

1. 打开管理端，进入「系统设置 → 外观配置 → 主题配置」
2. 修改亮色主题色，检查即时预览是否生效
3. 切换到暗色模式，检查暗色主题色是否正确应用
4. 点击「保存更改」，检查配置是否持久化
5. 刷新页面，检查主题色是否保持

**Step 3: 自动化测试（如果有）**

```bash
# 如有测试文件，运行测试
pnpm test
```

---

## Task 8: 构建前端并部署到后端

**Files:**
- Build: 前端构建产物
- Deploy: 复制到后端 assets 目录

**Step 1: 构建前端**

```bash
pnpm build
```

**Step 2: 复制到后端**

```bash
cd /Users/lytton/code/blog/anheyu/anheyu-app
mv assets/dist assets/dist.old
cp -r /Users/lytton/code/blog/anheyu/anheyu-app-frontend/dist assets/dist
```

**Step 3: 提交后端更改**

```bash
cd /Users/lytton/code/blog/anheyu/anheyu-app
git add assets/dist
git commit -m "chore: update frontend assets with theme color config"
```

**Step 4: 构建并测试后端**

```bash
make build
./anheyu-app
```

**Step 5: 验证完整功能**

1. 访问前台，检查默认主题色
2. 进入管理端配置主题色
3. 切换亮/暗模式验证效果

---

## 测试验收标准

- [ ] 管理端「外观配置」中显示「主题配置」菜单项
- [ ] 主题配置页面显示两个颜色选择器（亮色/暗色）
- [ ] 颜色选择器旁边显示预览色块
- [ ] 选择颜色后即时应用到整个管理端界面
- [ ] 切换亮/暗模式时应用对应的主题色
- [ ] 保存配置后刷新页面，主题色保持不变
- [ ] 前端构建产物正确部署到后端
