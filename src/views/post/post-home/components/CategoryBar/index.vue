<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watchEffect,
  computed
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useArticleStore } from "@/store/modules/articleStore";
import type { PostCategory } from "@/api/post/type";

defineOptions({
  name: "CategoryBar"
});

const router = useRouter();
const route = useRoute();

const articleStore = useArticleStore();
const { categories } = storeToRefs(articleStore);
const { fetchCategories } = articleStore;

const selectedId = ref<string | null>(null);
const catalogBarRef = ref<HTMLElement | null>(null);
const isScrolledToEnd = ref(false);
const showScrollButton = ref(false);
const isAnimating = ref(false);

// 丝滑滚动到分类栏
const scrollToCategoryBar = () => {
  if (!catalogBarRef.value) return;

  const categoryBarElement = catalogBarRef.value.closest('.category-bar-container');
  if (!categoryBarElement) return;

  // 获取分类栏容器的位置
  const elementRect = categoryBarElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const targetY = scrollTop + elementRect.top - 20; // 留出 20px 缓冲

  // 使用平滑滚动
  window.scrollTo({
    top: targetY,
    behavior: 'smooth'
  });

  // 等待滚动完成后高亮选中的分类项
  setTimeout(() => {
    highlightSelectedItem();
  }, 500);
};

// 高亮选中的分类项（添加动画效果）
const highlightSelectedItem = () => {
  if (!catalogBarRef.value) return;

  const selectedItem = catalogBarRef.value.querySelector('.catalog-list-item.select') as HTMLElement;
  if (!selectedItem) return;

  // 滚动选中的项到可见区域
  selectedItem.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });

  // 添加脉冲动画
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 600);
};

const handleSelect = (category: PostCategory | null) => {
  // 先滚动到分类栏
  scrollToCategoryBar();

  // 然后跳转路由
  if (category) {
    router.push(`/categories/${category.name}/`);
  } else {
    router.push("/");
  }
};

watchEffect(async () => {
  if (categories.value.length > 0) {
    const currentCategoryName = route.params.name as string;
    if (currentCategoryName) {
      const selectedCategory = categories.value.find(
        c => c.name === currentCategoryName
      );
      selectedId.value = selectedCategory ? selectedCategory.id : null;
    } else {
      selectedId.value = null;
    }
  }

  await nextTick();
  updateScrollVisibility();
});

const checkScrollPosition = () => {
  const el = catalogBarRef.value;
  if (!el) return;
  isScrolledToEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
};

const updateScrollVisibility = () => {
  const el = catalogBarRef.value;
  if (!el) return;
  showScrollButton.value = el.scrollWidth > el.clientWidth;
  checkScrollPosition();
};

const handleScrollNext = () => {
  const el = catalogBarRef.value;
  if (!el) return;
  if (isScrolledToEnd.value) {
    el.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  }
};

onMounted(() => {
  fetchCategories();
  window.addEventListener("resize", updateScrollVisibility);

  // 监听路由变化，如果是分类页面，滚动到分类栏
  watchEffect(() => {
    if (route.path.startsWith('/categories/') || route.path === '/') {
      // 延迟执行，确保 DOM 已渲染
      setTimeout(() => {
        scrollToCategoryBar();
      }, 100);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScrollVisibility);
});
</script>

<template>
  <div class="category-bar-container" ref="categoryBarRef">
    <div class="category-bar" :class="{ 'is-animating': isAnimating }">
      <div
        ref="catalogBarRef"
        class="catalog-bar"
        @scroll.passive="checkScrollPosition"
      >
        <div class="catalog-list">
          <div
            class="catalog-list-item"
            :class="{ select: selectedId === null }"
            @click="handleSelect(null)"
          >
            <a>
              <span class="category-text">首页</span>
            </a>
          </div>
          <div
            v-for="category in categories"
            :key="category.id"
            class="catalog-list-item"
            :class="{ select: selectedId === category.id }"
            @click="handleSelect(category)"
          >
            <a>
              <span class="category-text">{{ category.name }}</span>
              <span v-if="category.count > 0" class="category-count">{{ category.count }}</span>
            </a>
          </div>
        </div>
      </div>
      <div
        v-if="showScrollButton"
        class="category-bar-next"
        @click="handleScrollNext"
      >
        <i
          class="anzhiyufont anzhiyu-icon-angle-double-right"
          :class="{ 'is-rotated': isScrolledToEnd }"
        />
      </div>
      <router-link class="catalog-more" to="/categories">
        <span class="more-text">更多</span>
        <i class="anzhiyufont anzhiyu-icon-arrow-right more-icon" />
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped">
.category-bar-container {
  display: flex;
  width: 100%;
  margin-bottom: 0.5rem;
  scroll-margin-top: 80px; /* 滚动定位时的顶部偏移 */
}

.category-bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0.5rem 10px;
  overflow: hidden;
  white-space: nowrap;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;
  transition: all 0.3s ease 0s;
  opacity: 1;
  animation: slide-in 0.6s 0.1s backwards;
  box-shadow: 0 2px 12px rgb(0 0 0 / 4%);

  // 选中时的脉冲动画
  &.is-animating {
    animation: pulse-border 0.6s ease-out;
  }
}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--anzhiyu-main-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--anzhiyu-main-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--anzhiyu-main-rgb), 0);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.catalog-bar {
  display: flex;
  flex-grow: 1;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
  transform: translateX(-1px);
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
}

.catalog-list {
  display: flex;
  gap: 8px;
}

.catalog-list-item {
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--anzhiyu-main);
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &.select::after {
    width: 100%;
  }

  a {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
  }

  &:hover a {
    background: var(--anzhiyu-secondbg);
    transform: translateY(-1px);
  }

  &.select a {
    color: var(--anzhiyu-white);
    background: var(--anzhiyu-main);
    box-shadow: 0 4px 12px rgba(var(--anzhiyu-main-rgb), 0.3);
    transform: translateY(-2px);
  }
}

.category-text {
  font-size: 14px;
}

.category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--anzhiyu-main);
  background: var(--anzhiyu-main-op-light);
  border-radius: 10px;
}

.category-bar-next {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 10px;
  cursor: pointer;
  background: var(--anzhiyu-card-bg);
  border: 1px solid var(--style-border);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  i {
    transition: transform 0.3s ease-in-out;
  }

  i.is-rotated {
    transform: rotate(180deg);
  }

  &:hover {
    color: var(--anzhiyu-white);
    background: var(--anzhiyu-main);
    border-color: var(--anzhiyu-main);
    transform: scale(1.05);
  }
}

.catalog-more {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  margin-left: 1rem;
  font-weight: 600;
  font-size: 14px;
  color: var(--anzhiyu-fontcolor);
  text-decoration: none;
  white-space: nowrap;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  .more-text {
    transition: all 0.3s ease;
  }

  .more-icon {
    font-size: 12px;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--anzhiyu-main);
    background: var(--anzhiyu-secondbg);

    .more-icon {
      transform: translateX(3px);
    }
  }
}

@media (width <= 768px) {
  .category-bar-container {
    scroll-margin-top: 60px;
  }

  .catalog-more {
    display: none;
  }

  .category-bar {
    padding: 0 2px;
    background: transparent;
    border: none;
    box-shadow: none;

    .catalog-bar {
      height: 100%;

      .catalog-list {
        height: 100%;
        gap: 6px;
      }

      .catalog-list-item {
        display: flex;
        align-items: center;
        justify-content: center;

        &.select a {
          background: var(--anzhiyu-main);
        }

        a {
          display: flex;
          align-items: center;
          height: 80%;
          padding: 0 19px;
          font-size: 14px;
          background: var(--anzhiyu-card-bg);
          border: var(--style-border-always);
          border-radius: 30px;

          &:hover {
            background: var(--anzhiyu-main);
            color: var(--anzhiyu-white);
          }
        }
      }
    }
  }
}
</style>
