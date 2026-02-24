<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import type { Portfolio } from "@/types/portfolio";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";
import MarkdownContent from "./MarkdownContent.vue";

defineOptions({
  name: "ProjectInfo"
});

const props = defineProps<{
  portfolio: Portfolio;
}>();

// Fancybox 懒加载
let Fancybox: any = null;
const galleryContainerRef = ref<HTMLElement | null>(null);

// 简单检查是否有丰富信息
const hasRichInfo = computed(() => {
    return props.portfolio.overview || props.portfolio.challenge || props.portfolio.gallery_images?.length;
});

// 图片加载状态管理
const imageStates = ref<Record<number, { loaded: boolean; aspectRatio: number }>>({});

// 处理图片加载完成
const handleImageLoad = (index: number, event: Event) => {
  const img = event.target as HTMLImageElement;
  imageStates.value[index] = {
    loaded: true,
    aspectRatio: img.naturalWidth / img.naturalHeight
  };
};

// 初始化 Fancybox 图片预览
const initFancybox = async () => {
  if (!galleryContainerRef.value) return;

  // 懒加载 Fancybox
  if (!Fancybox) {
    const fancyboxModule = await import("@fancyapps/ui");
    await import("@fancyapps/ui/dist/fancybox/fancybox.css");
    Fancybox = fancyboxModule.Fancybox;
  }

  // 绑定图库中的所有图片
  Fancybox.bind(galleryContainerRef.value, ".waterfall-item img", {
    groupAll: true,
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: [],
        right: ["slideshow", "thumbs", "close"]
      }
    },
    caption: function (this: any, instance: any, slide: any) {
      const caption = slide.caption || "";
      return `${caption} <span class="fancybox-counter">${slide.index + 1} / ${instance.slides.length}</span>`;
    }
  });
};

// 清理 Fancybox
const cleanupFancybox = () => {
  if (galleryContainerRef.value && Fancybox) {
    Fancybox.unbind(galleryContainerRef.value);
    Fancybox.close(true);
  }
};

onMounted(async () => {
  await nextTick();
  initFancybox();
});

onUnmounted(() => {
  cleanupFancybox();
});

// 监听 portfolio 变化，重新初始化 Fancybox（用于路由切换）
watch(
  () => props.portfolio.id,
  async () => {
    cleanupFancybox();
    await nextTick();
    initFancybox();
  }
);
</script>

<template>
  <div class="project-info-container">
    <!-- Editorial Layout for Story -->
    <div class="editorial-grid">
        <!-- Overview -->
        <div class="editorial-block full-width" v-if="portfolio.overview || portfolio.overview_html">
            <h2 class="section-heading">概述</h2>
            <MarkdownContent
                v-if="portfolio.overview_html"
                :content="portfolio.overview_html"
            />
            <p v-else class="drop-cap-text">{{ portfolio.overview }}</p>
        </div>

        <div class="editorial-block full-width" v-if="!portfolio.overview && !portfolio.overview_html && portfolio.description">
            <h2 class="section-heading">描述</h2>
            <p class="drop-cap-text">{{ portfolio.description }}</p>
        </div>

        <!-- Two Column Challenge / Solution -->
        <div class="editorial-block two-col" v-if="portfolio.challenge || portfolio.challenge_html || portfolio.solution || portfolio.solution_html">
            <div class="col" v-if="portfolio.challenge || portfolio.challenge_html">
                <h3 class="subsection-heading"><IconifyIconOnline icon="ri:focus-3-line" class="heading-icon"/> 所遇挑战</h3>
                <MarkdownContent
                    v-if="portfolio.challenge_html"
                    :content="portfolio.challenge_html"
                />
                <p v-else class="body-text">{{ portfolio.challenge }}</p>
            </div>
            <div class="col" v-if="portfolio.solution || portfolio.solution_html">
                <h3 class="subsection-heading"><IconifyIconOnline icon="ri:lightbulb-flash-line" class="heading-icon"/> 解决方案</h3>
                <MarkdownContent
                    v-if="portfolio.solution_html"
                    :content="portfolio.solution_html"
                />
                <p v-else class="body-text">{{ portfolio.solution }}</p>
            </div>
        </div>

        <!-- Technologies -->
        <div class="editorial-block tech-stack-block full-width">
            <h3 class="subsection-heading">技术栈</h3>
            <div class="tech-tags">
                <span 
                    v-for="tech in portfolio.technologies" 
                    :key="tech"
                    class="tech-tag"
                >
                    {{ tech }}
                </span>
            </div>
        </div>
    </div>

    <!-- Image Gallery - Waterfall Layout -->
    <div
      v-if="portfolio.gallery_images && portfolio.gallery_images.length > 0"
      class="project-gallery"
    >
      <h2 class="section-heading">视觉画廊</h2>

      <!-- 瀑布流容器 -->
      <div ref="galleryContainerRef" class="waterfall-gallery">
        <!-- 左列 -->
        <div class="waterfall-column">
          <div
            v-for="(img, idx) in portfolio.gallery_images"
            v-show="idx % 2 === 0"
            :key="idx"
            class="waterfall-item"
            :class="{ 'is-loaded': imageStates[idx]?.loaded }"
          >
            <div class="image-wrapper">
              <img
                :src="img"
                :alt="`${portfolio.title} Image ${idx + 1}`"
                loading="lazy"
                @load="handleImageLoad(idx, $event)"
              />
              <div class="image-overlay">
                <div class="overlay-content">
                  <span class="image-number">{{ idx + 1 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右列 -->
        <div class="waterfall-column">
          <div
            v-for="(img, idx) in portfolio.gallery_images"
            v-show="idx % 2 === 1"
            :key="idx"
            class="waterfall-item"
            :class="{ 'is-loaded': imageStates[idx]?.loaded }"
          >
            <div class="image-wrapper">
              <img
                :src="img"
                :alt="`${portfolio.title} Image ${idx + 1}`"
                loading="lazy"
                @load="handleImageLoad(idx, $event)"
              />
              <div class="image-overlay">
                <div class="overlay-content">
                  <span class="image-number">{{ idx + 1 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback Stats if no rich data (Original functionality preserved) -->
    <div class="stats-block" v-if="!hasRichInfo">
          <div class="stat-item">
              <span class="stat-value">24</span>
              <span class="stat-label">提交次数</span>
          </div>
          <div class="stat-item">
              <span class="stat-value">100%</span>
              <span class="stat-label">代码覆盖率</span>
          </div>
            <div class="stat-item">
              <span class="stat-value">A+</span>
              <span class="stat-label">性能评级</span>
          </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-info-container {
    width: 100%;
    margin: 0 auto;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--anzhiyu-fontcolor);
}

/* --- Editorial Grid --- */
.editorial-grid {
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
    margin-bottom: 5rem;
}

.editorial-block {
    &.two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        
    @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 2.5rem;
        }
    }
}

.section-heading {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    letter-spacing: -0.5px;
    color: var(--anzhiyu-fontcolor);
}

.subsection-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    color: var(--anzhiyu-theme);
    
    .heading-icon {
        font-size: 1.5rem;
    }
}

.drop-cap-text {
    font-size: 1.25rem;
    line-height: 1.8;
    color: var(--anzhiyu-fontcolor);
    opacity: 0.9;
    
    /* Beautiful Drop Cap */
    &::first-letter {
        float: left;
        font-family: 'Playfair Display', serif;
        font-size: 4.5rem;
        line-height: 0.8;
        font-weight: 800;
        color: var(--anzhiyu-theme);
        padding-right: 0.5rem;
        padding-top: 0.2rem;
        margin-bottom: -0.2rem;
    }
}

.body-text {
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--anzhiyu-secondtext);
}

/* --- Tech Tags --- */
.tech-stack-block {
    padding-top: 2rem;
    border-top: 1px solid rgba(128,128,128,0.1);
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.tech-tag {
    padding: 8px 18px;
    background: transparent;
    border: 1px solid rgba(128,128,128,0.25);
    border-radius: 99px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--anzhiyu-fontcolor);
    transition: all 0.3s ease;
    
    &:hover {
        border-color: var(--anzhiyu-theme);
        background: rgba(var(--anzhiyu-theme-rgb), 0.05);
        color: var(--anzhiyu-theme);
        transform: translateY(-2px);
    }
}

/* --- Image Gallery (Waterfall Layout like Xiaohongshu) --- */
.project-gallery {
  margin-top: 3rem;
}

.waterfall-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (width <= 768px) {
    gap: 1rem;
  }
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (width <= 768px) {
    gap: 1rem;
  }
}

.waterfall-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: var(--anzhiyu-card-bg);
  box-shadow:
    0 4px 20px rgb(0 0 0 / 8%),
    0 1px 3px rgb(0 0 0 / 5%);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    box-shadow:
      0 8px 30px rgb(0 0 0 / 12%),
      0 2px 6px rgb(0 0 0 / 8%);
    transform: translateY(-4px);

    .image-overlay {
      opacity: 1;
    }

    img {
      transform: scale(1.05);
    }
  }
}

.image-wrapper img {
  display: block;
  width: 100%;
  height: auto;
  /* 不设置固定高度，让图片按原始比例显示 */
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 16px;
}

/* 图片遮罩层 */
.image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  /* 渐变遮罩 */
  background: linear-gradient(
    to top,
    rgb(0 0 0 / 30%) 0%,
    transparent 50%
  );
  border-radius: 16px;
}

.overlay-content {
  .image-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    background: rgb(0 0 0 / 50%);
    backdrop-filter: blur(10px);
    border-radius: 50%;
  }
}

/* 骨架屏加载效果 */
.waterfall-item:not(.is-loaded) .image-wrapper {
  &::before {
    position: absolute;
    inset: 0;
    content: "";
    background: linear-gradient(
      90deg,
      var(--anzhiyu-card-bg) 25%,
      rgb(128 128 128 / 5%) 50%,
      var(--anzhiyu-card-bg) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 16px;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Fancybox 图片计数器样式 */
:deep(.fancybox-counter) {
  margin-left: 10px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(255 255 255 / 80%);
  background: rgb(0 0 0 / 30%);
  border-radius: 20px;
}

/* --- Legacy Stats --- */
.stats-block {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 30px;
    background: rgba(128,128,128,0.02);
    border-radius: 20px;
    margin-top: 2rem;
}

.stat-item {
    text-align: center;
    
    .stat-value {
        display: block;
        font-size: 2.5rem;
        font-weight: 800;
        font-family: 'Playfair Display', serif;
        color: var(--anzhiyu-theme);
    }
    
    .stat-label {
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--anzhiyu-secondtext);
    }
}
</style>
