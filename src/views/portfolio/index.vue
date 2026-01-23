<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  onActivated,
  nextTick
} from "vue";
import { useRoute } from "vue-router";
import PortfolioHero from "./components/PortfolioHero.vue";
import PortfolioCard from "./components/PortfolioCard.vue";
import PortfolioSkeleton from "./components/PortfolioSkeleton.vue";
import type { Portfolio, ProjectType, ProjectStatus } from "@/types/portfolio";
import { getPortfolios } from "@/api/portfolio";
import { useSiteConfigStore } from "@/store/modules/siteConfig";
import { resetThemeToDefault } from "@/utils/themeManager";
import { initLazyLoad, destroyLazyLoad } from "@/utils/lazyload";
import { mockGetPortfolios } from "./mock-data";

defineOptions({
  name: "Portfolio"
});

const route = useRoute();
const siteConfigStore = useSiteConfigStore();
const postConfig = computed(() => siteConfigStore.getSiteConfig?.post?.default);

const isDoubleColumn = computed(() => postConfig.value?.double_column ?? true);

// 作品列表
const portfolios = ref<Portfolio[]>([]);
const isLoading = ref(false);

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 12,
  total: 0
});

// 筛选条件
const selectedType = ref<ProjectType | "all">("all");
const selectedStatus = ref<ProjectStatus | "all">("all");
const searchKeyword = ref("");

// 懒加载 Observer
let lazyLoadObserver: IntersectionObserver | null = null;

// 初始化懒加载
const initPortfolioLazyLoad = () => {
  if (lazyLoadObserver) {
    lazyLoadObserver.disconnect();
  }
  lazyLoadObserver = initLazyLoad(document, {
    selector: "img[data-src]",
    threshold: 0.1,
    rootMargin: "100px",
    loadedClass: "lazy-loaded",
    loadingClass: "lazy-loading"
  });
};

// 获取作品列表
const fetchPortfolios = async () => {
  isLoading.value = true;
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value || undefined,
      type: selectedType.value === "all" ? undefined : selectedType.value,
      status: selectedStatus.value === "all" ? undefined : selectedStatus.value
    };

    const { data } = await getPortfolios(params);
    portfolios.value = data.list;
    pagination.total = data.total;

    nextTick(() => {
      initPortfolioLazyLoad();
    });
  } catch (error) {
    console.log("API 调用失败，使用 mock 数据:", error);
    // 使用 mock 数据
    const mockData = await mockGetPortfolios({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
      type: selectedType.value === "all" ? undefined : selectedType.value,
      status: selectedStatus.value === "all" ? undefined : selectedStatus.value
    });
    portfolios.value = mockData.data.list;
    pagination.total = mockData.data.total;

    nextTick(() => {
      initPortfolioLazyLoad();
    });
  } finally {
    isLoading.value = false;
  }
};

// 处理类型筛选
const handleTypeFilter = (type: ProjectType | "all") => {
  selectedType.value = type;
  pagination.page = 1;
  portfolios.value = [];
  fetchPortfolios();
};

// 处理状态筛选
const handleStatusFilter = (status: ProjectStatus | "all") => {
  selectedStatus.value = status;
  pagination.page = 1;
  portfolios.value = [];
  fetchPortfolios();
};

// 处理搜索
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword;
  pagination.page = 1;
  portfolios.value = [];
  fetchPortfolios();
};

// 处理分页变化
const handlePageChange = (newPage: number) => {
  pagination.page = newPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
  fetchPortfolios();
};

// 是否显示分页
const showPagination = computed(() => pagination.total > pagination.pageSize);

// 监听路由查询参数
watch(
  () => route.query,
  query => {
    if (query.type) {
      selectedType.value = query.type as ProjectType;
    }
    if (query.status) {
      selectedStatus.value = query.status as ProjectStatus;
    }
    pagination.page = 1;
    portfolios.value = [];
    fetchPortfolios();
  },
  { immediate: true }
);

// keep-alive 激活时
onActivated(() => {
  if (portfolios.value.length > 0) {
    nextTick(() => {
      initPortfolioLazyLoad();
    });
  }
});

onMounted(() => {
  resetThemeToDefault();
});

onUnmounted(() => {
  destroyLazyLoad(lazyLoadObserver);
});
</script>

<template>
  <div class="portfolio-page">
    <!-- Hero 栏 (全宽) -->
    <div v-if="pagination.page === 1" class="portfolio-hero-wrapper">
      <PortfolioHero :keyword="searchKeyword" @search="handleSearch" />
    </div>

    <div class="portfolio-container">
      <!-- 作品列表 -->
      <div class="portfolio-list" :class="{ 'three-column': isDoubleColumn }">
        <!-- 骨架屏 -->
        <template v-if="isLoading && portfolios.length === 0">
          <PortfolioSkeleton
            v-for="i in 9"
            :key="'skeleton-' + i"
            :is-double-column="isDoubleColumn"
          />
        </template>

        <!-- 作品卡片 -->
        <template v-else-if="portfolios.length > 0">
          <PortfolioCard
            v-for="(portfolio, index) in portfolios"
            :key="portfolio.id"
            :portfolio="portfolio"
            :is-double-column="isDoubleColumn"
            :animation-order="index"
          />
        </template>

        <!-- 空状态 -->
        <el-empty
          v-if="!isLoading && portfolios.length === 0"
          description="暂无作品"
        />
      </div>

      <!-- 分页 -->
      <div
        v-if="showPagination && portfolios.length > 0"
        class="pagination-container"
      >
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-page {
  width: 100%;
  min-height: 100vh;
}

.portfolio-hero-wrapper {
  width: 100%;
  position: relative;
  /* 移除 margin 确保紧贴 */
  margin-bottom: 2rem;
}

.portfolio-container {
  width: 100%;
  max-width: 1400px;
  padding: 0 1.5rem;
  margin: 0 auto;
}

.portfolio-list {
  position: relative;
  width: 100%;
  min-height: 400px;

  &.three-column {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    justify-content: flex-start;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

:deep(.el-empty) {
  padding: 3rem 0;
}

:deep(.el-pagination) {
  .btn-prev,
  .btn-next,
  .el-pager li {
    background: var(--anzhiyu-card-bg);
    border: var(--style-border);

    &:hover {
      color: var(--anzhiyu-main);
    }
  }

  .el-pager li.active {
    background: var(--anzhiyu-main);
    color: var(--anzhiyu-white);
  }
}

@media (max-width: 768px) {
  .portfolio-container {
    padding: 0 1rem;
  }

  .portfolio-list.three-column {
    gap: 1rem;
  }
}
</style>
