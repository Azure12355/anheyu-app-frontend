<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  onUnmounted,
  onActivated,
  nextTick
} from "vue";
import { useRoute } from "vue-router";
import HomeTop from "./components/HomeTop/index.vue";
import CategoryBar from "./components/CategoryBar/index.vue";
import TagBar from "./components/TagBar/index.vue";
import ArticleCard from "./components/ArticleCard/index.vue";
import ArticleCardSkeleton from "./components/ArticleCardSkeleton/index.vue";
import Archives from "./components/Archives/index.vue";
import Pagination from "./components/Pagination/index.vue";
import Sidebar from "../components/Sidebar/index.vue";
import { getPublicArticles } from "@/api/post";
import type { Article, GetArticleListParams } from "@/api/post/type";
import { useSiteConfigStore } from "@/store/modules/siteConfig";
import { resetThemeToDefault } from "@/utils/themeManager";
import { initLazyLoad, destroyLazyLoad } from "@/utils/lazyload";

defineOptions({
  name: "PostHome"
});

const route = useRoute();
const siteConfigStore = useSiteConfigStore();
const postConfig = computed(() => siteConfigStore.getSiteConfig?.post?.default);

// 记录上次加载的路由路径，避免重复加载
let lastLoadedPath = "";

type PageType = "home" | "tag" | "category" | "archive";

const pageType = computed<PageType>(() => {
  const { path } = route;
  if (path.startsWith("/tags/")) return "tag";
  if (path.startsWith("/categories/")) return "category";
  if (path.startsWith("/archives")) return "archive";
  return "home";
});

const isHomePage = computed(() => pageType.value === "home");
const isFirstPage = computed(() => pagination.page === 1);
const showHomeTop = computed(() => isHomePage.value && isFirstPage.value);
const isDoubleColumn = computed(() => postConfig.value?.double_column ?? true);

const articles = ref<Article[]>([]);
const isLoading = ref(false);
const isRefreshing = ref(false); // 用于区分首次加载和刷新
const pagination = reactive({
  page: 1,
  pageSize: postConfig.value?.page_size || 12,
  total: 0
});

// 用于计算卡片动画延迟
const cardAnimationDelay = (index: number) => {
  return (index % 10) * 50; // 每批10个，每个延迟50ms
};

// 统一管理懒加载 Observer（避免每个 ArticleCard 重复创建）
let lazyLoadObserver: IntersectionObserver | null = null;

// 初始化懒加载
const initArticleLazyLoad = () => {
  // 先销毁旧的 observer
  if (lazyLoadObserver) {
    lazyLoadObserver.disconnect();
  }
  // 创建新的 observer
  lazyLoadObserver = initLazyLoad(document, {
    selector: "img[data-src]",
    threshold: 0.1,
    rootMargin: "100px",
    loadedClass: "lazy-loaded",
    loadingClass: "lazy-loading"
  });
};

// 计算最新文章的ID（只在首页第一页时有效）
const newestArticleId = computed(() => {
  if (!showHomeTop.value || articles.value.length === 0) return null;
  return articles.value.reduce((latest, current) =>
    new Date(current.created_at) > new Date(latest.created_at)
      ? current
      : latest
  ).id;
});

// 是否显示分页
const showPagination = computed(() => pagination.total > pagination.pageSize);

const fetchData = async () => {
  // 如果不是首次加载，标记为刷新状态
  if (articles.value.length > 0) {
    isRefreshing.value = true;
  }
  isLoading.value = true;
  try {
    const params: GetArticleListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize
    };

    const { name, year, month } = route.params;
    const type = pageType.value;

    if (type === "category" && name) {
      params.category = name as string;
    } else if (type === "tag" && name) {
      params.tag = name as string;
    } else if (type === "archive") {
      if (year) params.year = Number(year);
      if (month) params.month = Number(month);
    }

    const { data } = await getPublicArticles(params);
    articles.value = data.list;
    pagination.total = data.total;

    // 数据加载完成后，在下一个渲染周期初始化懒加载
    nextTick(() => {
      initArticleLazyLoad();
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    articles.value = [];
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

const handlePageChange = (newPage: number) => {
  pagination.page = newPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 监听路由变化，只在路由真正变化时重新加载
watch(
  () => route.fullPath,
  newPath => {
    // 如果路由没有变化，不重新加载（避免 keep-alive 激活时重复加载）
    if (lastLoadedPath === newPath) {
      return;
    }
    lastLoadedPath = newPath;

    // 只有在路由参数变化时才清空列表（如切换分类/标签/分页）
    articles.value = [];
    // 安全地转换 page 参数，确保是有效数字
    const pageParam = route.params.id ? Number(route.params.id) : 1;
    pagination.page = isNaN(pageParam) ? 1 : pageParam;
    fetchData();
  },
  { immediate: true }
);

// keep-alive 激活时，只初始化懒加载（不重新获取数据）
onActivated(() => {
  // 如果已有数据，只需要重新初始化懒加载
  if (articles.value.length > 0) {
    nextTick(() => {
      initArticleLazyLoad();
    });
  }
});

onMounted(() => {
  resetThemeToDefault();
});

onUnmounted(() => {
  destroyLazyLoad(lazyLoadObserver);
  // 清理路由记录，确保下次进入时重新加载
  lastLoadedPath = "";
});
</script>

<template>
  <div class="post-home-container">
    <!-- 首页顶部区域 -->
    <div v-if="showHomeTop" class="post-home-top-container">
      <HomeTop />
    </div>

    <div id="content-inner" class="layout">
      <main class="main-content">
        <!-- 分类/标签导航栏 -->
        <CategoryBar v-if="isHomePage || pageType === 'category'" />
        <TagBar v-else-if="pageType === 'tag'" />

        <!-- 文章列表区域 -->
        <div
          id="recent-posts"
          class="recent-posts"
          :class="{
            'double-column-container': isDoubleColumn,
            '!justify-center': !isLoading && articles.length === 0
          }"
        >
          <!-- 骨架屏加载状态 -->
          <template v-if="isLoading && articles.length === 0">
            <ArticleCardSkeleton
              v-for="i in 6"
              :key="'skeleton-' + i"
              :is-double-column="isDoubleColumn"
            />
          </template>

          <!-- 文章内容 -->
          <template v-else-if="articles.length > 0">
            <!-- 归档视图 -->
            <Archives
              v-if="pageType === 'archive'"
              :articles="articles"
              :total="pagination.total"
            />
            <!-- 卡片视图 -->
            <template v-else>
              <TransitionGroup
                name="card-list"
                tag="div"
                class="card-list-container"
              >
                <ArticleCard
                  v-for="(article, index) in articles"
                  :key="article.id + (isRefreshing ? '-refresh' : '')"
                  :article="article"
                  :is-double-column="isDoubleColumn"
                  :is-newest="article.id === newestArticleId"
                  :style="{ '--card-delay': `${cardAnimationDelay(index)}ms` }"
                />
              </TransitionGroup>
            </template>
          </template>

          <!-- 空状态 -->
          <el-empty
            v-if="!isLoading && articles.length === 0"
            description="暂无文章"
          />
        </div>

        <!-- 分页 -->
        <Pagination
          v-if="showPagination"
          :page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="handlePageChange"
        />
      </main>

      <Sidebar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-home-top-container {
  width: 100%;
  max-width: 1400px;
  padding: 0 1.5rem;
  margin: 0 auto;
  overflow: hidden;
  user-select: none;
  animation: slide-in 0.6s 0.1s backwards;
}

.layout {
  display: flex;
  gap: 0.625rem;
  max-width: 1400px;
  padding: 0.5rem 1.5rem 1rem;
  margin: 0 auto;
  min-height: 600px;
  contain: layout style;
}

.main-content {
  flex: 1;
  min-width: 0;
  contain: layout;
}

.recent-posts {
  position: relative;
  width: 100%;
  min-height: 400px;
  will-change: auto;
  animation: slide-in 0.6s 0.1s backwards;

  &.double-column-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    justify-content: space-between;
  }
}

// 卡片列表容器
.card-list-container {
  display: contents;
}

// 卡片过渡动画
.card-list-enter-active {
  animation: card-fade-in 0.5s ease-out backwards;
  animation-delay: var(--card-delay, 0ms);
}

.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

// 卡片进入动画
@keyframes card-fade-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media screen and (width > 760px) and (width <= 992px) {
  .recent-post-item {
    flex-direction: row !important;
    width: 100% !important;
    height: 200px !important;
  }

  .recent-posts.double-column-container {
    min-height: auto;
  }
}

@media (width <= 768px) {
  .post-home-top-container {
    padding: 0 1rem;
  }
}
</style>
