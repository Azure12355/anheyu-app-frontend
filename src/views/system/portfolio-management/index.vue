<script setup lang="ts">
import { reactive, onMounted, toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElTooltip } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  EditPen,
  Delete,
  Star,
  StarFilled
} from "@element-plus/icons-vue";
import {
  getPortfolios,
  deletePortfolio,
  batchDeletePortfolios,
  togglePortfolioFeatured
} from "@/api/portfolio";
import type { Portfolio } from "@/types/portfolio";
import { ProjectType, ProjectStatus, ProjectTypeLabels, ProjectStatusLabels, ProjectStatusColors } from "@/types/portfolio";

defineOptions({
  name: "PortfolioManagement"
});

const router = useRouter();

const state = reactive({
  loading: false,
  tableData: [] as Portfolio[],
  pagination: {
    currentPage: 1,
    pageSize: 12,
    total: 0
  },
  searchParams: {
    keyword: "",
    type: "",
    status: ""
  }
});

const { loading, tableData, pagination, searchParams } = toRefs(state);

// 批量操作相关
const selectedPortfolios = ref<string[]>([]);
const selectionMode = ref(false);
const batchDeleting = ref(false);

// 项目类型选项
const typeOptions = [
  { value: "", label: "全部分类" },
  { value: ProjectType.FRONTEND, label: ProjectTypeLabels[ProjectType.FRONTEND] },
  { value: ProjectType.VIBE_CODING, label: ProjectTypeLabels[ProjectType.VIBE_CODING] },
  { value: ProjectType.FULL_STACK, label: ProjectTypeLabels[ProjectType.FULL_STACK] },
  { value: ProjectType.MINIPROGRAM, label: ProjectTypeLabels[ProjectType.MINIPROGRAM] },
  { value: ProjectType.APP, label: ProjectTypeLabels[ProjectType.APP] },
  { value: ProjectType.OTHER, label: ProjectTypeLabels[ProjectType.OTHER] }
];

// 项目状态选项
const statusOptions = [
  { value: "", label: "全部状态" },
  { value: ProjectStatus.DEVELOPING, label: ProjectStatusLabels[ProjectStatus.DEVELOPING], color: ProjectStatusColors[ProjectStatus.DEVELOPING] },
  { value: ProjectStatus.COMPLETED, label: ProjectStatusLabels[ProjectStatus.COMPLETED], color: ProjectStatusColors[ProjectStatus.COMPLETED] },
  { value: ProjectStatus.ARCHIVED, label: ProjectStatusLabels[ProjectStatus.ARCHIVED], color: ProjectStatusColors[ProjectStatus.ARCHIVED] }
];

/**
 * 格式化 ISO 日期字符串
 */
const formatDate = (isoString: string) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  const pad = (num: number) => num.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
};

const fetchData = async () => {
  state.loading = true;
  try {
    const params = {
      page: state.pagination.currentPage,
      pageSize: state.pagination.pageSize,
      keyword: state.searchParams.keyword || undefined,
      type: state.searchParams.type || undefined,
      status: state.searchParams.status || undefined
    };
    const { data } = await getPortfolios(params);
    state.tableData = data.list;
    state.pagination.total = data.total;
  } catch (error) {
    ElMessage.error("获取作品列表失败");
  } finally {
    state.loading = false;
  }
};

const handleSearch = () => {
  state.pagination.currentPage = 1;
  fetchData();
};

const handleReset = () => {
  state.searchParams.keyword = "";
  state.searchParams.type = "";
  state.searchParams.status = "";
  handleSearch();
};

const handleNew = () => {
  router.push({ name: "PortfolioEdit", params: { id: "new" } });
};

const handleEdit = (row: Portfolio) => {
  router.push({ name: "PortfolioEdit", params: { id: row.id } });
};

const handleDelete = (row: Portfolio) => {
  ElMessageBox.confirm(`确定要删除作品《${row.title}》吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await deletePortfolio(row.id);
      ElMessage.success("删除成功");
      if (state.tableData.length === 1 && state.pagination.currentPage > 1) {
        state.pagination.currentPage--;
      }
      fetchData();
    })
    .catch(() => {});
};

const handleSizeChange = (val: number) => {
  state.pagination.pageSize = val;
  fetchData();
};

const handleCurrentChange = (val: number) => {
  state.pagination.currentPage = val;
  fetchData();
};

// 切换精选状态
const handleToggleFeatured = async (portfolio: Portfolio) => {
  try {
    const newFeatured = !portfolio.featured;
    await togglePortfolioFeatured(portfolio.id, newFeatured);
    portfolio.featured = newFeatured;
    ElMessage.success(newFeatured ? "已设为精选" : "已取消精选");
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 批量操作
const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value;
  if (!selectionMode.value) {
    selectedPortfolios.value = [];
  }
};

const togglePortfolioSelection = (id: string) => {
  const index = selectedPortfolios.value.indexOf(id);
  if (index > -1) {
    selectedPortfolios.value.splice(index, 1);
  } else {
    selectedPortfolios.value.push(id);
  }
};

const isPortfolioSelected = (id: string) => {
  return selectedPortfolios.value.includes(id);
};

const selectAllPortfolios = () => {
  selectedPortfolios.value = state.tableData.map(p => p.id);
};

const clearSelection = () => {
  selectedPortfolios.value = [];
};

const handleBatchDelete = async () => {
  if (selectedPortfolios.value.length === 0) {
    ElMessage.warning("请先选择要删除的作品");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedPortfolios.value.length} 个作品吗？此操作不可恢复。`,
      "批量删除确认",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    batchDeleting.value = true;
    const { data } = await batchDeletePortfolios(selectedPortfolios.value);

    if (data.failed_count > 0) {
      ElMessage.warning(
        `删除完成：成功 ${data.success_count} 个，失败 ${data.failed_count} 个`
      );
    } else {
      ElMessage.success(`成功删除 ${data.success_count} 个作品`);
    }

    selectedPortfolios.value = [];
    selectionMode.value = false;
    fetchData();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  } finally {
    batchDeleting.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="portfolio-management-container">
    <!-- 顶部搜索和操作栏 -->
    <div class="control-panel">
      <div class="search-area">
        <div class="search-input-wrapper">
          <IconifyIconOnline
            icon="ep:search"
            class="search-icon"
            width="20"
            height="20"
          />
          <el-input
            v-model="searchParams.keyword"
            placeholder="搜索作品标题、描述..."
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          />
        </div>
        <el-select
          v-model="searchParams.type"
          placeholder="项目分类"
          class="filter-select"
          clearable
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="searchParams.status"
          placeholder="项目状态"
          class="filter-select"
          clearable
        >
          <el-option
            v-for="item in statusOptions.filter(s => s.value)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span class="status-option">
              <span
                class="status-dot"
                :style="{ backgroundColor: item.color }"
              />
              <span>{{ item.label }}</span>
            </span>
          </el-option>
        </el-select>
        <el-button
          type="primary"
          class="search-btn"
          :icon="Search"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button class="reset-btn" :icon="Refresh" @click="handleReset">
          重置
        </el-button>
      </div>
      <div class="action-area">
        <el-button
          v-if="!selectionMode"
          class="action-btn"
          @click="toggleSelectionMode"
        >
          批量操作
        </el-button>
        <template v-else>
          <el-button
            v-if="selectedPortfolios.length > 0"
            class="action-btn"
            type="danger"
            :icon="Delete"
            :loading="batchDeleting"
            @click="handleBatchDelete"
          >
            删除 ({{ selectedPortfolios.length }})
          </el-button>
          <el-button
            v-if="selectedPortfolios.length < tableData.length"
            class="action-btn"
            @click="selectAllPortfolios"
          >
            全选
          </el-button>
          <el-button
            v-if="selectedPortfolios.length > 0"
            class="action-btn"
            @click="clearSelection"
          >
            清空
          </el-button>
          <el-button class="action-btn" @click="toggleSelectionMode">
            取消
          </el-button>
        </template>
        <el-button
          v-if="!selectionMode"
          v-ripple
          type="primary"
          class="new-btn"
          :icon="Plus"
          @click="handleNew"
        >
          新增作品
        </el-button>
      </div>
    </div>

    <div
      v-loading="loading"
      element-loading-text="正在加载作品列表..."
      class="content-area"
    >
      <div v-if="tableData.length > 0" class="portfolio-list">
        <div
          v-for="portfolio in tableData"
          :key="portfolio.id"
          class="portfolio-item"
          :class="{ 'is-selected': isPortfolioSelected(portfolio.id) }"
        >
          <!-- 选择框 -->
          <div
            v-if="selectionMode"
            class="item-checkbox"
            @click="togglePortfolioSelection(portfolio.id)"
          >
            <el-checkbox :model-value="isPortfolioSelected(portfolio.id)" />
          </div>

          <!-- 封面缩略图 -->
          <a :href="`/portfolio/${portfolio.id}`" target="_blank" class="item-cover">
            <el-image
              :src="portfolio.cover_url"
              fit="cover"
              class="cover-image"
              lazy
            >
              <template #error>
                <div class="image-slot">
                  <IconifyIconOnline icon="ep:picture-filled" width="32" />
                </div>
              </template>
            </el-image>
            <!-- 状态标签 -->
            <div
              class="status-badge"
              :style="{ backgroundColor: ProjectStatusColors[portfolio.status] }"
            >
              {{ ProjectStatusLabels[portfolio.status] }}
            </div>
            <!-- 精选标记 -->
            <div v-if="portfolio.featured" class="featured-badge">
              <IconifyIconOnline icon="ep:star-filled" width="12" />
            </div>
          </a>

          <!-- 主要内容区 -->
          <div class="item-content">
            <div class="content-header">
              <a
                :href="`/portfolio/${portfolio.id}`"
                target="_blank"
                class="item-title"
              >
                {{ portfolio.title }}
              </a>
            </div>

            <div class="content-desc">
              {{ portfolio.description }}
            </div>

            <div class="content-meta">
              <!-- 分类和技术栈 -->
              <div class="meta-tags">
                <el-tag type="info" size="small" effect="plain">
                  {{ ProjectTypeLabels[portfolio.project_type] }}
                </el-tag>
                <el-tag
                  v-for="tech in portfolio.technologies?.slice(0, 3)"
                  :key="tech"
                  size="small"
                  effect="plain"
                >
                  {{ tech }}
                </el-tag>
              </div>
            </div>

            <div class="content-info">
              <!-- 链接信息 -->
              <div class="info-links">
                <span v-if="portfolio.demo_url" class="link-item">
                  <IconifyIconOnline icon="ep:link" width="12" />
                  演示地址
                </span>
                <span v-if="portfolio.github_url" class="link-item">
                  <IconifyIconOnline icon="ri:github-fill" width="12" />
                  源码
                </span>
                <span v-if="portfolio.mode" class="link-item">
                  <IconifyIconOnline
                    :icon="portfolio.mode === 'light' ? 'ep:sunny' : 'ep:moon'"
                    width="12"
                  />
                  {{ portfolio.mode === 'light' ? 'Light' : 'Dark' }}
                </span>
              </div>

              <!-- 时间信息 -->
              <div class="info-time">
                <span class="time-item">
                  <IconifyIconOnline icon="ep:calendar" width="12" />
                  {{ formatDate(portfolio.created_at) }}
                </span>
                <span class="time-item">
                  <IconifyIconOnline icon="ep:edit-pen" width="12" />
                  {{ formatDate(portfolio.updated_at) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 操作按钮区 -->
          <div class="item-actions">
            <el-tooltip :content="portfolio.featured ? '取消精选' : '设为精选'" placement="top">
              <el-button
                text
                class="action-btn-icon"
                @click="handleToggleFeatured(portfolio)"
              >
                <IconifyIconOnline
                  :icon="portfolio.featured ? 'ep:star-filled' : 'ep:star'"
                  width="18"
                  :class="{ 'is-featured': portfolio.featured }"
                />
              </el-button>
            </el-tooltip>
            <el-button
              type="primary"
              text
              bg
              class="action-btn"
              :icon="EditPen"
              @click="handleEdit(portfolio)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              text
              bg
              class="action-btn"
              :icon="Delete"
              @click="handleDelete(portfolio)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <el-empty
        v-if="!loading && tableData.length === 0"
        description="暂无作品"
      >
        <el-button type="primary" :icon="Plus" @click="handleNew"
          >立即新增</el-button
        >
      </el-empty>

      <el-pagination
        v-if="!loading && pagination.total > 0"
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[12, 24, 48, 96]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-management-container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 100%;
  min-height: 0;
}

// 控制面板
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;
  box-shadow: var(--anzhiyu-shadow-border);
  flex-shrink: 0;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

// 搜索区域
.search-area {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  flex: 1;

  .search-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 400px;

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--anzhiyu-secondtext);
      z-index: 1;
      pointer-events: none;
    }

    :deep(.search-input) {
      .el-input__wrapper {
        padding-left: 42px;
        border-radius: 12px;
        background: var(--anzhiyu-secondbg);
        border: var(--style-border);
        box-shadow: none;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--anzhiyu-main);
        }

        &.is-focus {
          border-color: var(--anzhiyu-main);
          background: var(--anzhiyu-card-bg);
          box-shadow: 0 0 0 3px var(--anzhiyu-main-op-light);
        }
      }
    }
  }

  .filter-select {
    width: 140px;

    :deep(.el-input__wrapper) {
      border-radius: 12px;
      border: var(--style-border);
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--anzhiyu-main);
      }

      &.is-focus {
        border-color: var(--anzhiyu-main);
        box-shadow: 0 0 0 3px var(--anzhiyu-main-op-light);
      }
    }
  }

  .search-btn,
  .reset-btn {
    border-radius: 10px;
    padding: 10px 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--anzhiyu-shadow-main);
    }
  }

  .reset-btn {
    background: var(--anzhiyu-secondbg);
    border-color: var(--anzhiyu-card-border);
  }
}

// 操作区域
.action-area {
  .new-btn {
    border-radius: 10px;
    padding: 10px 24px;
    font-weight: 500;
    box-shadow: var(--anzhiyu-shadow-blue);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--anzhiyu-shadow-main);
    }
  }
}

// 状态选项样式
.status-option {
  display: flex;
  align-items: center;
  gap: 8px;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}

// 内容区域
.content-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 300px;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;
  box-shadow: var(--anzhiyu-shadow-border);
  overflow: hidden;

  :deep(.el-loading-mask) {
    background-color: var(--anzhiyu-card-bg);
    opacity: 0.9;
    border-radius: 12px;
  }

  :deep(.el-loading-spinner) {
    .path {
      stroke: var(--anzhiyu-main);
    }

    .el-loading-text {
      color: var(--anzhiyu-fontcolor);
      margin-top: 10px;
    }
  }
}

// 作品列表
.portfolio-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  flex: 1;
  height: 0;
  min-height: 300px;
  overflow-y: auto;
}

// 作品列表项
.portfolio-item {
  display: flex;
  align-items: stretch;
  gap: 14px;
  padding: 14px;
  background: var(--anzhiyu-secondbg);
  border: var(--style-border);
  border-radius: 10px;
  transition: all 0.2s ease;

  &.is-selected {
    border-color: var(--anzhiyu-main);
    background: var(--anzhiyu-main-op-light);
  }

  &:hover {
    border-color: var(--anzhiyu-main-op);

    .item-cover .cover-image {
      transform: scale(1.05);
    }

    .item-title {
      color: var(--anzhiyu-main);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }
}

// 选择框
.item-checkbox {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  cursor: pointer;
  user-select: none;

  :deep(.el-checkbox) {
    .el-checkbox__inner {
      width: 20px;
      height: 20px;
    }
  }
}

// 封面缩略图
.item-cover {
  position: relative;
  flex-shrink: 0;
  width: 140px;
  height: 105px;
  overflow: hidden;
  background: var(--anzhiyu-secondbg);
  border-radius: 8px;
  text-decoration: none;

  .cover-image {
    width: 100%;
    height: 100%;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--anzhiyu-secondtext);
    background: var(--anzhiyu-secondbg);
  }

  // 状态标签
  .status-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  // 精选标记
  .featured-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    border-radius: 6px;
    color: white;
    z-index: 1;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 160px;
  }
}

// 主要内容区
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-title {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--anzhiyu-fontcolor);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;

  &:hover {
    color: var(--anzhiyu-main);
  }
}

.content-desc {
  font-size: 13px;
  color: var(--anzhiyu-secondtext);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 元数据
.content-meta {
  .meta-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }
}

// 信息栏
.content-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: auto;
  font-size: 12px;
  color: var(--anzhiyu-secondtext);
}

.info-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  .link-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.info-time {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  .time-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
  }
}

// 操作按钮区
.item-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .action-btn-icon {
    padding: 8px;
    color: var(--anzhiyu-secondtext);

    &:hover {
      color: #f59e0b;
    }

    .is-featured {
      color: #f59e0b;
    }
  }

  .action-btn {
    min-width: 70px;
    border-radius: 6px;
    font-size: 13px;
    padding: 8px 16px;
    transition: all 0.3s ease;
    margin-left: 0;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;

    .action-btn {
      flex: 1;
    }
  }
}

// 分页
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  border-top: var(--style-border);
  background: var(--anzhiyu-card-bg);
  flex-shrink: 0;

  :deep(.el-pagination) {
    .btn-prev,
    .btn-next,
    .el-pager li {
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--anzhiyu-main-op-light);
        color: var(--anzhiyu-main);
      }

      &.is-active {
        background: var(--anzhiyu-main);
        color: white;
      }
    }
  }
}

.el-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .portfolio-management-container {
    padding: 10px;
  }

  .control-panel {
    padding: 12px;
  }

  .search-area {
    .search-input-wrapper {
      max-width: 100%;
    }
  }

  .portfolio-list {
    gap: 8px;
    padding: 10px;
  }

  .portfolio-item {
    padding: 10px;
  }
}
</style>
