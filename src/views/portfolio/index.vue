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
      
      <!-- Sticky Sidebar -->
      <aside class="portfolio-sidebar">
        <!-- Header -->
        <div class="gallery-header">
            <h2 class="gallery-title">
                <!-- Starlink Meteor Effect -->
                <div class="starlink-wrapper">
                    <div class="orbit-ring ring-1">
                        <div class="meteor-base" style="--rotation: 0deg"><div class="meteor m-1"></div></div>
                        <div class="meteor-base" style="--rotation: -12deg"><div class="meteor m-2"></div></div>
                        <div class="meteor-base" style="--rotation: -24deg"><div class="meteor m-3"></div></div>
                    </div>
                    <div class="orbit-ring ring-2">
                        <div class="meteor-base" style="--rotation: 120deg"><div class="meteor reverse-tail meteor-purple m-1"></div></div>
                        <div class="meteor-base" style="--rotation: 105deg"><div class="meteor reverse-tail meteor-purple m-2"></div></div>
                    </div>
                    <div class="orbit-ring ring-3">
                        <div class="meteor-base" style="--rotation: 210deg"><div class="meteor m-1"></div></div>
                    </div>
                </div>

                <span class="title-text-content">Creative <br> Archive</span>
                <span class="count">{{ pagination.total }}</span>
            </h2>
            <p class="gallery-desc">
                An evolving repository of apps, experimental sites, and digital crafts.
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
                <div class="filter-label">Layout Mode</div>
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
      </aside>

      <!-- Main Content Area -->
      <main class="portfolio-main">
        <!-- 作品列表 -->
        <div class="portfolio-list">
          <!-- 骨架屏 (首次加载) -->
          <template v-if="isLoading && portfolios.length === 0">
            <div class="card-grid">
              <PortfolioSkeleton
                v-for="i in 6"
                :key="'skeleton-' + i"
                :is-double-column="true"
              />
            </div>
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
            
            <div class="footer-stats">
                <span class="stat-highlight">20 categories</span> • 
                <span class="stat-highlight-orange">26 light</span> • 
                <span class="stat-highlight-green">13 dark</span>
            </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

/* ... (Existing styles unchanged) ... */
.portfolio-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 1;

  /* Global elegant halo gradient */
  &::before,
  &::after {
    content: "";
    position: fixed;
    width: 60vw;
    height: 60vh;
    min-width: 600px;
    min-height: 600px;
    border-radius: 50%;
    filter: blur(160px); /* Increased blur for more haziness */
    z-index: -1;
    pointer-events: none;
    opacity: 0.08; /* Extremely light opacity */
    animation: breathingHalo 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;
  }

  &::before {
    top: -15vh;
    left: -15vw;
    background: var(--anzhiyu-theme);
    animation-delay: 0s;
  }

  &::after {
    bottom: -15vh;
    right: -15vw;
    background: #4facfe; /* Elegant blue to complement */
    animation-delay: -10s;
    animation-direction: alternate-reverse;
  }
}

@keyframes breathingHalo {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.05;
  }
  33% {
    transform: translate(5vw, 5vh) scale(1.1);
    opacity: 0.08;
  }
  66% {
    transform: translate(-5vw, 2vh) scale(0.95);
    opacity: 0.06;
  }
  100% {
    transform: translate(2vw, -5vh) scale(1.05);
    opacity: 0.05;
  }
}

.portfolio-hero-wrapper {
  width: 100%;
  position: relative;
  margin-bottom: 0; 
}

/* --- Modern Sidebar Layout --- */
.portfolio-container {
    display: flex;
    align-items: flex-start;
    gap: 4rem;
    width: 100%;
    max-width: 1440px;
    padding: 6rem 2rem;
    margin: 0 auto;
}

.portfolio-sidebar {
    position: sticky;
    top: 100px;
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    z-index: 10;
}

.portfolio-main {
    flex: 1;
    min-width: 0;
}

/* Gallery Header */
.gallery-header {
    text-align: left;
    margin-bottom: 0;
    padding-top: 0;
    
    .gallery-title {
        position: relative;
        display: inline-block;
        z-index: 1;
        font-family: 'Playfair Display', serif;
        font-size: 3.5rem;
        font-weight: 700;
        letter-spacing: -1px;
        color: var(--anzhiyu-fontcolor);
        margin-bottom: 1rem;
        line-height: 1.1;
        
        .title-text-content {
            position: relative;
            z-index: 2;
        }

        .count {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 1.2rem;
            vertical-align: super;
            opacity: 0.5;
            margin-left: 0.2rem;
            color: var(--anzhiyu-theme);
            font-style: normal;
        }
    }
    
    .gallery-desc {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 1.05rem;
        font-weight: 400;
        color: var(--anzhiyu-secondtext);
        line-height: 1.7;
        opacity: 0.8;
    }
}

/* --- Starlink Meteor Effect --- */
.starlink-wrapper {
    position: absolute;
    top: 50%;
    left: 45%; 
    width: 280px;
    height: 280px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: -1;
}

.orbit-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(128, 128, 128, 0.1); 
    transform-style: preserve-3d;
}

.ring-1 {
    transform: rotateX(65deg) rotateY(-20deg);
    animation: spin1 12s linear infinite;
    border-color: rgba(64, 158, 255, 0.15); /* Theme fallback blue */
}

.ring-2 {
    transform: rotateX(75deg) rotateY(25deg);
    animation: spin2 18s linear infinite reverse;
    border-color: rgba(168, 85, 247, 0.15); /* Purple #a855f7 */
}

.ring-3 {
    transform: rotateX(55deg) rotateY(45deg) scale(0.8);
    animation: spin3 22s linear infinite;
    border-style: dashed;
    border-color: rgba(128, 128, 128, 0.15);
}

@keyframes spin1 {
    0% { transform: rotateX(65deg) rotateY(-20deg) rotateZ(0deg); }
    100% { transform: rotateX(65deg) rotateY(-20deg) rotateZ(360deg); }
}

@keyframes spin2 {
    0% { transform: rotateX(75deg) rotateY(25deg) rotateZ(0deg); }
    100% { transform: rotateX(75deg) rotateY(25deg) rotateZ(360deg); }
}

@keyframes spin3 {
    0% { transform: rotateX(55deg) rotateY(45deg) rotateZ(0deg); }
    100% { transform: rotateX(55deg) rotateY(45deg) rotateZ(360deg); }
}

.meteor-base {
    position: absolute;
    inset: -1px; /* compensate for border width */
    border-radius: 50%;
    transform: rotateZ(var(--rotation));
}

.meteor {
    position: absolute;
    top: -2px; /* Center on border */
    left: calc(50% - 2px);
    width: 4px;
    height: 4px;
    background: var(--anzhiyu-theme);
    border-radius: 50%;
    box-shadow: 0 0 10px 2px rgba(64, 158, 255, 0.6),
                0 0 20px 4px rgba(64, 158, 255, 0.4);
}

.meteor.m-1 { transform: scale(1); opacity: 1; }
.meteor.m-2 { transform: scale(0.7); opacity: 0.7; }
.meteor.m-3 { transform: scale(0.4); opacity: 0.4; }

.meteor::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 50%; /* tail runs to the left */
    width: 60px;
    height: 2px;
    background: linear-gradient(to right, transparent 0%, rgba(64, 158, 255, 0.1) 40%, var(--anzhiyu-theme) 100%);
    transform: translateY(-50%);
    border-radius: 100%;
    filter: drop-shadow(0 0 4px var(--anzhiyu-theme));
}

.meteor-purple {
    background: #a855f7;
    box-shadow: 0 0 10px 2px rgba(168, 85, 247, 0.6),
                0 0 20px 4px rgba(168, 85, 247, 0.4);
}

.meteor-purple::after {
    background: linear-gradient(to right, transparent 0%, rgba(168, 85, 247, 0.1) 40%, #a855f7 100%);
    filter: drop-shadow(0 0 4px #a855f7);
}

.reverse-tail.meteor::after {
    right: auto;
    left: 50%;
    background: linear-gradient(to left, transparent 0%, rgba(168, 85, 247, 0.1) 40%, #a855f7 100%);
}

/* Filter Section */
.filter-section {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    padding: 0;
    border: none;
    background: transparent;
}

.filter-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
}

.filter-label {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-style: italic;
    color: var(--anzhiyu-fontcolor);
    margin-bottom: 0;
    opacity: 0.9;
    border-bottom: 1px solid rgba(128, 128, 128, 0.15);
    padding-bottom: 0.5rem;
    width: 100%;
}

.filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

.filter-pill {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 8px 18px;
    border-radius: 100px;
    border: 1px solid rgba(128, 128, 128, 0.2);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    color: var(--anzhiyu-secondtext);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    
    &::after { display: none; }
    
    &:hover {
        background: rgba(var(--anzhiyu-theme-rgb), 0.05);
        color: var(--anzhiyu-theme);
        border-color: var(--anzhiyu-theme);
        transform: translateY(-2px);
    }
    
    &.active {
        background: var(--anzhiyu-theme);
        color: white;
        border-color: var(--anzhiyu-theme);
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(var(--anzhiyu-theme-rgb), 0.3);
    }
}



/* --- Flexible Grid --- */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}

/* Load More Section */
.load-more-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 0 3rem;
    gap: 1.5rem;
}

.btn-load-more {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 36px;
    background: transparent;
    color: var(--anzhiyu-fontcolor);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 100px;
    border: 1px solid rgba(128, 128, 128, 0.2);
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    
    &:hover:not(:disabled) {
        background: var(--anzhiyu-theme);
        color: white;
        border-color: var(--anzhiyu-theme);
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(var(--anzhiyu-theme-rgb), 0.3);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.footer-stats {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.85rem;
    color: var(--anzhiyu-secondtext);
    opacity: 0.7;
    margin-top: 1rem;
    
    .stat-highlight { color: var(--anzhiyu-theme); }
    .stat-highlight-orange { color: #f97316; }
    .stat-highlight-green { color: #10b981; }
}

:deep(.el-empty) {
  padding: 5rem 0;
}

/* Responsive Overrides */
@media (max-width: 1024px) {
    .portfolio-container {
        flex-direction: column;
        gap: 3rem;
    }
    
    .portfolio-sidebar {
        width: 100%;
        position: relative;
        top: 0;
    }

    .filter-pills {
        gap: 0.5rem;
    }
}

@media (max-width: 768px) {
  .portfolio-container {
    padding: 3rem 1.5rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .gallery-header {
      text-align: center;
      
      .gallery-title {
          font-size: 2.8rem;
          margin-bottom: 1.5rem;
      }
      
      .starlink-wrapper {
          left: 50%;
      }
  }
}
</style>
