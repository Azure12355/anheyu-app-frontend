<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft, Check, Upload } from "@element-plus/icons-vue";
import { getPortfolioById, createPortfolio, updatePortfolio } from "@/api/portfolio";
import type { Portfolio } from "@/types/portfolio";
import { ProjectType, ProjectStatus, ProjectTypeLabels, ProjectStatusLabels } from "@/types/portfolio";

defineOptions({
  name: "PortfolioEdit"
});

const router = useRouter();
const route = useRoute();
const id = computed(() => route.params.id as string);
const isNew = computed(() => id.value === "new");

const loading = ref(false);
const saving = ref(false);
const portfolioData = ref<Portfolio | null>(null);

// 表单数据
const formData = reactive({
  title: "",
  description: "",
  cover_url: "",
  project_type: ProjectType.FRONTEND,
  status: ProjectStatus.COMPLETED,
  technologies: [] as string[],
  demo_url: "",
  github_url: "",
  featured: false,
  sort_order: 0,
  mode: "light" as "light" | "dark" | ""
});

// 技术栈输入
const techInputVisible = ref(false);
const techInputValue = ref("");

// 表单验证规则
const rules = {
  title: [{ required: true, message: "请输入作品标题", trigger: "blur" }],
  description: [{ required: true, message: "请输入作品描述", trigger: "blur" }],
  cover_url: [{ required: true, message: "请输入封面图URL", trigger: "blur" }],
  project_type: [{ required: true, message: "请选择项目分类", trigger: "change" }]
};

const formRef = ref();

// 项目类型选项
const typeOptions = Object.entries(ProjectTypeLabels).map(([value, label]) => ({
  value,
  label
}));

// 项目状态选项
const statusOptions = Object.entries(ProjectStatusLabels).map(([value, label]) => ({
  value,
  label
}));

// 获取作品详情
const fetchPortfolio = async () => {
  if (isNew.value) return;

  loading.value = true;
  try {
    const { data } = await getPortfolioById(id.value);
    portfolioData.value = data;
    // 填充表单
    Object.assign(formData, {
      title: data.title || "",
      description: data.description || "",
      cover_url: data.cover_url || "",
      project_type: data.project_type || ProjectType.FRONTEND,
      status: data.status || ProjectStatus.COMPLETED,
      technologies: data.technologies ? [...data.technologies] : [],
      demo_url: data.demo_url || "",
      github_url: data.github_url || "",
      featured: data.featured || false,
      sort_order: data.sort_order || 0,
      mode: data.mode || "light"
    });
  } catch (error) {
    ElMessage.error("获取作品详情失败");
  } finally {
    loading.value = false;
  }
};

// 保存作品
const handleSave = async () => {
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }

  saving.value = true;
  try {
    const data = { ...formData };

    if (isNew.value) {
      await createPortfolio(data);
      ElMessage.success("创建成功");
    } else {
      await updatePortfolio(id.value, data);
      ElMessage.success("保存成功");
    }

    router.push({ name: "PortfolioManagement" });
  } catch (error) {
    ElMessage.error(isNew.value ? "创建失败" : "保存失败");
  } finally {
    saving.value = false;
  }
};

// 取消编辑
const handleCancel = () => {
  ElMessageBox.confirm("确定要取消编辑吗？未保存的更改将丢失。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "继续编辑",
    type: "warning"
  })
    .then(() => {
      router.push({ name: "PortfolioManagement" });
    })
    .catch(() => {});
};

// 添加技术栈标签
const handleTechInputConfirm = () => {
  const value = techInputValue.value.trim();
  if (value) {
    if (!formData.technologies.includes(value)) {
      formData.technologies.push(value);
    }
  }
  techInputVisible.value = false;
  techInputValue.value = "";
};

const showTechInput = () => {
  techInputVisible.value = true;
};

// 删除技术栈标签
const handleTechClose = (tech: string) => {
  const index = formData.technologies.indexOf(tech);
  if (index > -1) {
    formData.technologies.splice(index, 1);
  }
};

// 返回列表
const goBack = () => {
  router.push({ name: "PortfolioManagement" });
};

onMounted(() => {
  fetchPortfolio();
});
</script>

<template>
  <div class="portfolio-edit-container">
    <!-- 顶部导航栏 -->
    <div class="header-bar">
      <div class="header-left">
        <el-button class="back-btn" :icon="ArrowLeft" @click="goBack">
          返回列表
        </el-button>
        <h1 class="page-title">
          {{ isNew ? "新增作品" : "编辑作品" }}
        </h1>
      </div>
      <div class="header-actions">
        <el-button class="action-btn" @click="handleCancel">
          取消
        </el-button>
        <el-button
          v-ripple
          type="primary"
          class="action-btn"
          :icon="Check"
          :loading="saving"
          @click="handleSave"
        >
          {{ isNew ? "创建" : "保存" }}
        </el-button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div
      v-loading="loading"
      element-loading-text="正在加载..."
      class="form-content"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="portfolio-form"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>

          <el-form-item label="作品标题" prop="title">
            <el-input
              v-model="formData.title"
              placeholder="请输入作品标题"
              maxlength="100"
              show-word-limit
              clearable
            />
          </el-form-item>

          <el-form-item label="作品描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="请输入作品描述，详细介绍作品的功能和特点"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="封面图URL" prop="cover_url">
            <el-input
              v-model="formData.cover_url"
              placeholder="请输入封面图URL"
              clearable
            >
              <template #append>
                <el-button :icon="Upload">上传</el-button>
              </template>
            </el-input>
            <div v-if="formData.cover_url" class="cover-preview">
              <el-image
                :src="formData.cover_url"
                fit="cover"
                class="preview-image"
              >
                <template #error>
                  <div class="image-error">图片加载失败</div>
                </template>
              </el-image>
            </div>
          </el-form-item>

          <el-form-item label="项目分类" prop="project_type">
            <el-select
              v-model="formData.project_type"
              placeholder="请选择项目分类"
              class="full-width"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="项目状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="item in statusOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="显示模式">
            <el-radio-group v-model="formData.mode">
              <el-radio value="light">Light</el-radio>
              <el-radio value="dark">Dark</el-radio>
              <el-radio value="">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 技术栈 -->
        <div class="form-section">
          <h3 class="section-title">技术栈</h3>

          <el-form-item label="技术标签">
            <div class="tech-tags-container">
              <el-tag
                v-for="tech in formData.technologies"
                :key="tech"
                closable
                @close="handleTechClose(tech)"
              >
                {{ tech }}
              </el-tag>
              <el-input
                v-if="techInputVisible"
                ref="techInputRef"
                v-model="techInputValue"
                size="small"
                class="tech-input"
                @keyup.enter="handleTechInputConfirm"
                @blur="handleTechInputConfirm"
              />
              <el-button
                v-else
                size="small"
                @click="showTechInput"
              >
                + 添加技术标签
              </el-button>
            </div>
          </el-form-item>
        </div>

        <!-- 链接信息 -->
        <div class="form-section">
          <h3 class="section-title">链接信息</h3>

          <el-form-item label="演示地址">
            <el-input
              v-model="formData.demo_url"
              placeholder="请输入演示地址（可选）"
              clearable
            >
              <template #prepend>https://</template>
            </el-input>
          </el-form-item>

          <el-form-item label="GitHub 地址">
            <el-input
              v-model="formData.github_url"
              placeholder="请输入 GitHub 地址（可选）"
              clearable
            >
              <template #prepend>https://</template>
            </el-input>
          </el-form-item>
        </div>

        <!-- 其他设置 -->
        <div class="form-section">
          <h3 class="section-title">其他设置</h3>

          <el-form-item label="排序顺序">
            <el-input-number
              v-model="formData.sort_order"
              :min="0"
              :max="9999"
              controls-position="right"
            />
            <span class="form-tip">数值越小越靠前</span>
          </el-form-item>

          <el-form-item label="设为精选">
            <el-switch v-model="formData.featured" />
            <span class="form-tip">精选作品会在首页优先展示</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-edit-container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 100%;
  overflow: hidden;
}

// 顶部导航栏
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 16px;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;
  box-shadow: var(--anzhiyu-shadow-border);
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--anzhiyu-main-op-light);
    color: var(--anzhiyu-main);
  }
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--anzhiyu-fontcolor);
}

.header-actions {
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    justify-content: flex-end;
  }
}

.action-btn {
  border-radius: 8px;
  padding: 8px 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--anzhiyu-shadow-main);
  }
}

// 表单内容
.form-content {
  flex: 1;
  overflow-y: auto;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;
  box-shadow: var(--anzhiyu-shadow-border);
  padding: 24px;

  :deep(.el-loading-mask) {
    border-radius: 12px;
  }
}

.portfolio-form {
  max-width: 800px;
  margin: 0 auto;
}

// 表单分区
.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px dashed var(--anzhiyu-border-color);

  &:last-of-type {
    border-bottom: none;
  }
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--anzhiyu-fontcolor);
  display: flex;
  align-items: center;

  &::before {
    content: "";
    width: 4px;
    height: 16px;
    background: var(--anzhiyu-main);
    border-radius: 2px;
    margin-right: 10px;
  }
}

// 表单项样式
:deep(.el-form-item) {
  margin-bottom: 20px;

  .el-form-item__label {
    font-weight: 500;
    color: var(--anzhiyu-fontcolor);
  }
}

.full-width {
  width: 100%;
}

// 封面预览
.cover-preview {
  margin-top: 12px;
  width: 100%;
  max-width: 400px;
}

.preview-image {
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 8px;
  overflow: hidden;
  border: var(--style-border);

  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--anzhiyu-secondbg);
  color: var(--anzhiyu-secondtext);
  font-size: 14px;
}

// 技术标签
.tech-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  .tech-input {
    width: 100px;
  }
}

// 表单提示
.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: var(--anzhiyu-secondtext);
}

// 单选框组
:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .el-radio {
    margin-right: 0;
  }
}

// 输入框
:deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--anzhiyu-main);
  }

  &.is-focus {
    border-color: var(--anzhiyu-main);
    box-shadow: 0 0 0 3px var(--anzhiyu-main-op-light);
  }
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--anzhiyu-main);
  }

  &:focus {
    border-color: var(--anzhiyu-main);
    box-shadow: 0 0 0 3px var(--anzhiyu-main-op-light);
  }
}

// 数字输入框
:deep(.el-input-number) {
  .el-input__wrapper {
    border-radius: 8px;
  }
}

// 开关
:deep(.el-switch) {
  --el-switch-on-color: var(--anzhiyu-main);
}

@media (max-width: 768px) {
  .portfolio-edit-container {
    padding: 10px;
  }

  .header-bar {
    padding: 12px 16px;
  }

  .form-content {
    padding: 16px;
  }

  .portfolio-form {
    max-width: 100%;
  }

  :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    margin-bottom: 8px;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}
</style>
