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
import { ProjectType, ProjectTypeLabels } from "@/types/portfolio";
import type { Portfolio, ProjectStatus } from "@/types/portfolio";
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
const selectedMode = ref<"light" | "dark" | "all">("all");
const selectedLanguage = ref("all");
const searchKeyword = ref("");

// Filter Options
const languageOptions = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Java",
  "Dart",
  "Kotlin",
  "Swift"
];



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
const fetchPortfolios = async (isLoadMore = false) => {
  isLoading.value = true;
  try {
    // 强制使用 Mock 数据以展示效果
    // const params = {
    //   page: pagination.page,
    //   pageSize: pagination.pageSize,
    //   keyword: searchKeyword.value || undefined,
    //   type: selectedType.value === "all" ? undefined : selectedType.value,
    //   status: selectedStatus.value === "all" ? undefined : selectedStatus.value
    // };
    // const { data } = await getPortfolios(params);

    // 直接调用 Mock 数据
    const mockData = await mockGetPortfolios({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
      type: selectedType.value === "all" ? undefined : selectedType.value,
      status: selectedStatus.value === "all" ? undefined : selectedStatus.value,
      mode: selectedMode.value === "all" ? undefined : selectedMode.value,
      language: selectedLanguage.value === "all" ? undefined : selectedLanguage.value
    });
    
    const data = mockData.data;

    if (isLoadMore) {
        portfolios.value = [...portfolios.value, ...data.list];
    } else {
        portfolios.value = data.list;
    }
    
    pagination.total = data.total;

    nextTick(() => {
      initPortfolioLazyLoad();
    });
  } catch (error) {
    console.warn("获取数据失败", error);
    // 错误处理...
  } finally {
    isLoading.value = false;
  }
};

// 处理类型筛选
const handleTypeFilter = (type: ProjectType | "all") => {
  selectedType.value = type;
  pagination.page = 1;
  // Reset list
  portfolios.value = [];
  fetchPortfolios(false);
};

// 处理模式筛选
const handleModeFilter = (mode: "light" | "dark" | "all") => {
  selectedMode.value = mode;
  pagination.page = 1;
  portfolios.value = [];
  pagination.page = 1;
  portfolios.value = [];
  fetchPortfolios(false);
};

// Handle Language Filter
const handleLanguageFilter = (lang: string) => {
  selectedLanguage.value = lang;
  pagination.page = 1;
  portfolios.value = [];
  fetchPortfolios(false);
};



// 处理加载更多
const handleLoadMore = () => {
    pagination.page++;
    fetchPortfolios(true);
};

// 搜索处理
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword;
  pagination.page = 1;
  portfolios.value = [];
  fetchPortfolios(false);
};

// 是否还有更多数据
const hasMore = computed(() => {
    return portfolios.value.length < pagination.total;
});

onMounted(() => {
  fetchPortfolios();
});
</script>

<template>
  <div class="portfolio-page">
    <!-- Hero 栏 (全宽) -->
    <div class="portfolio-hero-wrapper">
      <PortfolioHero :keyword="searchKeyword" @search="handleSearch" />
    </div>

    <!-- Gallery Section -->
    <div class="portfolio-container">
        <!-- Header -->
        <div class="gallery-header">
            <h2 class="gallery-title">
                <span class="count">{{ pagination.total }}</span> Website Demos Gallery
            </h2>
            <p class="gallery-desc">
                Browse real-world website demos built with UI UX Pro Max. Click to view live details.
            </p>
        </div>

        <!-- Filter Bar -->
        <div class="filter-section">
            <div class="filter-row">
                <div class="filter-label">Category</div>
                <div class="filter-pills">
                    <button 
                        class="filter-pill" 
                        :class="{ active: selectedType === 'all' }"
                        @click="handleTypeFilter('all')"
                    >
                        All
                    </button>
                    <button 
                        v-for="(label, type) in ProjectTypeLabels" 
                        :key="type"
                        class="filter-pill"
                        :class="{ active: selectedType === type }"
                        @click="handleTypeFilter(type as ProjectType)"
                    >
                        {{ label }}
                    </button>
                </div>
            </div>



            <!-- Language Filter -->
            <div class="filter-row">
                <div class="filter-label">Language</div>
                <div class="filter-pills">
                    <button 
                        class="filter-pill" 
                        :class="{ active: selectedLanguage === 'all' }"
                        @click="handleLanguageFilter('all')"
                    >
                        All
                    </button>
                    <button 
                        v-for="lang in languageOptions" 
                        :key="lang"
                        class="filter-pill"
                        :class="{ active: selectedLanguage === lang }"
                        @click="handleLanguageFilter(lang)"
                    >
                        {{ lang }}
                    </button>
                </div>
            </div>

            <!-- Mode Filter -->
            <div class="filter-row">
                <div class="filter-label">Mode</div>
                <div class="filter-pills">
                    <button 
                        class="filter-pill" 
                        :class="{ active: selectedMode === 'all' }"
                        @click="handleModeFilter('all')"
                    >
                        All
                    </button>
                    <button 
                        class="filter-pill" 
                        :class="{ active: selectedMode === 'light' }"
                        @click="handleModeFilter('light')"
                    >
                        Light
                    </button>
                    <button 
                        class="filter-pill" 
                        :class="{ active: selectedMode === 'dark' }"
                        @click="handleModeFilter('dark')"
                    >
                        Dark
                    </button>
                </div>
            </div>
        </div>

      <!-- 作品列表 -->
      <div class="portfolio-list">
        <!-- 骨架屏 (首次加载) -->
        <template v-if="isLoading && portfolios.length === 0">
          <PortfolioSkeleton
            v-for="i in 6"
            :key="'skeleton-' + i"
            :is-double-column="true"
          />
        </template>

        <!-- 作品卡片 -->
        <template v-else-if="portfolios.length > 0">
          <div class="card-grid">
            <PortfolioCard
                v-for="(portfolio, index) in portfolios"
                :key="portfolio.id"
                :portfolio="portfolio"
                :animation-order="index % 12" 
            />
          </div>
        </template>

        <!-- 空状态 -->
        <el-empty
          v-if="!isLoading && portfolios.length === 0"
          description="暂无作品"
        />
      </div>

      <!-- Load More / Footer Area -->
      <div v-if="portfolios.length > 0" class="load-more-container">
          <!-- Load More Button -->
          <button 
            v-if="hasMore" 
            class="btn-load-more" 
            :disabled="isLoading"
            @click="handleLoadMore"
          >
            {{ isLoading ? 'Loading...' : 'Load More' }}
            <i v-if="!isLoading" class="anzhiyufont anzhiyu-icon-angle-down"></i>
          </button>
          
          <!-- Showing Count Text -->
          <div class="showing-text">
              Showing {{ portfolios.length }} of {{ pagination.total }} demos
          </div>
          
          <!-- Decorative Stats (Static for visuals as per image) -->
          <div class="footer-stats">
              {{ pagination.total }} demos available • 
              <span class="stat-highlight">20 categories</span> • 
              <span class="stat-highlight-orange">26 light</span> • 
              <span class="stat-highlight-green">13 dark</span>
          </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ... (Existing styles unchanged) ... */
.portfolio-page {
  width: 100%;
  min-height: 100vh;
}

.portfolio-hero-wrapper {
  width: 100%;
  position: relative;
  margin-bottom: 0; 
}

.portfolio-container {
  width: 100%;
  max-width: 1400px;
  padding: 4rem 1.5rem;
  margin: 0 auto;
}

/* Gallery Header */
.gallery-header {
    text-align: center;
    margin-bottom: 3rem;
    
    .gallery-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--anzhiyu-fontcolor);
        margin-bottom: 1rem;
        
        .count {
            color: var(--anzhiyu-theme);
        }
    }
    
    .gallery-desc {
        font-size: 1.1rem;
        color: var(--anzhiyu-secondtext);
        max-width: 600px;
        margin: 0 auto;
    }
}

/* Filter Section */
.filter-section {
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: var(--anzhiyu-card-bg);
    padding: 1.5rem;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
}

.filter-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
}

.filter-label {
    min-width: 100px;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--anzhiyu-fontcolor);
    margin-bottom: 0;
    opacity: 0.8;
}

.filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-pill {
    padding: 8px 16px;
    border-radius: 999px; /* Pill shape */
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    background: var(--anzhiyu-secondbg); /* Gray-ish for inactive */
    color: var(--anzhiyu-fontcolor);
    transition: all 0.3s;
    
    &:hover {
        background: var(--anzhiyu-theme-op);
        color: var(--anzhiyu-theme);
    }
    
    &.active {
        background: var(--anzhiyu-theme);
        color: white;
        box-shadow: 0 4px 10px rgba(var(--anzhiyu-theme-rgb), 0.3);
    }
}



/* Card Grid Layout - 3 Columns Fixed */
.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Force 3 columns */
    gap: 2rem; /* Spacing between cards */
}

/* Load More Section */
.load-more-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 0 2rem;
    gap: 1.5rem;
}

.btn-load-more {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 32px;
    background: var(--anzhiyu-theme);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(var(--anzhiyu-theme-rgb), 0.3);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(var(--anzhiyu-theme-rgb), 0.4);
    }
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .anzhiyufont {
        font-size: 0.9rem;
    }
}

.showing-text {
    font-size: 0.95rem;
    color: var(--anzhiyu-secondtext);
}

.footer-stats {
    font-size: 0.9rem;
    color: var(--anzhiyu-secondtext);
    opacity: 0.8;
    margin-top: 1rem;
    
    .stat-highlight { color: var(--anzhiyu-theme); }
    .stat-highlight-orange { color: #f97316; }
    .stat-highlight-green { color: #10b981; }
}

:deep(.el-empty) {
  padding: 3rem 0;
}

@media (max-width: 1024px) {
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
  .portfolio-container {
    padding: 2rem 1rem;
  }
  
  .gallery-title { font-size: 1.8rem; }

  .card-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
