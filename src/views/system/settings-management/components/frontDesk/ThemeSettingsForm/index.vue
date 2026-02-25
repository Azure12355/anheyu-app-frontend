<template>
  <div class="theme-settings-form">
    <!-- 亮色主题配置 -->
    <div class="theme-setting-item">
      <div class="setting-header">
        <div class="setting-info">
          <h4>亮色主题色</h4>
          <p class="setting-desc">亮色模式下使用的主色调</p>
        </div>
        <div class="color-preview" :style="{ backgroundColor: model.themeColorLight }">
          <span class="color-value">{{ model.themeColorLight }}</span>
        </div>
      </div>
      <el-form-item label="选择颜色">
        <el-color-picker
          v-model="model.themeColorLight"
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
        <div class="color-preview" :style="{ backgroundColor: model.themeColorDark }">
          <span class="color-value">{{ model.themeColorDark }}</span>
        </div>
      </div>
      <el-form-item label="选择颜色">
        <el-color-picker
          v-model="model.themeColorDark"
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
import { ref, watch } from "vue";

defineOptions({
  name: "ThemeSettingsForm"
});

interface ThemeSettings {
  themeColorLight: string;
  themeColorDark: string;
}

const model = defineModel<ThemeSettings>({ required: true });

// 预设颜色
const predefineColors = ref([
  "#163bf2", // 默认蓝
  "#dfa621", // 暗色默认橙
  "#ff6b6b", // 红色
  "#4ecdc4", // 青色
  "#a29bfe", // 紫色
  "#fd79a8", // 粉色
  "#00b894", // 绿色
  "#6c5ce7", // 深紫
  "#0984e3", // 深蓝
  "#e17055" // 橙红
]);

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
  const currentTheme = root.getAttribute("data-theme");
  const isDark = currentTheme === "dark";

  if (mode === "light" && !isDark) {
    // 当前是亮色模式，立即应用亮色主题色
    root.style.setProperty("--anzhiyu-theme", color);
    root.style.setProperty("--anzhiyu-theme-op", `${color}23`);
    root.style.setProperty("--anzhiyu-theme-op-deep", `${color}dd`);
    root.style.setProperty("--anzhiyu-theme-op-light", `${color}0d`);
  } else if (mode === "dark" && isDark) {
    // 当前是暗色模式，立即应用暗色主题色
    root.style.setProperty("--anzhiyu-theme", color);
    root.style.setProperty("--anzhiyu-theme-op", `${color}23`);
    root.style.setProperty("--anzhiyu-theme-op-deep", `${color}dd`);
    root.style.setProperty("--anzhiyu-theme-op-light", `${color}0d`);
  }
};

// 监听颜色变化，在组件挂载时应用初始颜色
watch(
  () => model.value,
  (newVal) => {
    if (newVal) {
      const root = document.documentElement;
      const currentTheme = root.getAttribute("data-theme");
      const isDark = currentTheme === "dark";

      // 根据当前主题模式应用对应的颜色
      if (isDark) {
        applyThemeColor(newVal.themeColorDark, "dark");
      } else {
        applyThemeColor(newVal.themeColorLight, "light");
      }
    }
  },
  { immediate: true }
);
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
