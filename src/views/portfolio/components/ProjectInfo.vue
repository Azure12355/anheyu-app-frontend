<script setup lang="ts">
import { computed } from "vue";
import type { Portfolio } from "@/types/portfolio";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";

defineOptions({
  name: "ProjectInfo"
});

const props = defineProps<{
  portfolio: Portfolio;
}>();

// Simple check if rich info is present
const hasRichInfo = computed(() => {
    return props.portfolio.overview || props.portfolio.challenge || props.portfolio.gallery_images?.length;
});

// Handle image load for animation
const handleImageLoad = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.classList.add('loaded');
};
</script>

<template>
  <div class="project-info-container">
    <!-- Editorial Layout for Story -->
    <div class="editorial-grid">
        <!-- Overview -->
        <div class="editorial-block full-width" v-if="portfolio.overview">
            <h2 class="section-heading">概述</h2>
            <p class="drop-cap-text">{{ portfolio.overview }}</p>
            <!-- Fallback if overview doesn't exist but description does -->
            <p class="body-text" v-if="!portfolio.overview">{{ portfolio.description }}</p>
        </div>
        
        <div class="editorial-block full-width" v-if="!portfolio.overview">
            <h2 class="section-heading">描述</h2>
            <p class="drop-cap-text">{{ portfolio.description }}</p>
        </div>

        <!-- Two Column Challenge / Solution -->
        <div class="editorial-block two-col" v-if="portfolio.challenge || portfolio.solution">
            <div class="col" v-if="portfolio.challenge">
                <h3 class="subsection-heading"><IconifyIconOnline icon="ri:focus-3-line" class="heading-icon"/> 所遇挑战</h3>
                <p class="body-text">{{ portfolio.challenge }}</p>
            </div>
            <div class="col" v-if="portfolio.solution">
                <h3 class="subsection-heading"><IconifyIconOnline icon="ri:lightbulb-flash-line" class="heading-icon"/> 解决方案</h3>
                <p class="body-text">{{ portfolio.solution }}</p>
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

    <!-- Image Gallery -->
    <div
      v-if="portfolio.gallery_images && portfolio.gallery_images.length > 0"
      class="project-gallery"
    >
      <h2 class="section-heading">视觉画廊</h2>
      <div class="gallery-masonry">
        <div
          v-for="(img, idx) in portfolio.gallery_images"
          :key="idx"
          class="gallery-frame"
          :data-index="idx"
        >
          <div class="frame-inner">
            <img
              :src="img"
              :alt="`${portfolio.title} Image ${idx + 1}`"
              loading="lazy"
              @load="handleImageLoad"
            />
            <div class="frame-overlay">
              <span class="image-number">{{ String(idx + 1).padStart(2, '0') }}</span>
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

/* --- Image Gallery (Artistic Masonry style) --- */
.project-gallery {
  margin-top: 3rem;
}

.gallery-masonry {
  --gap-size: 1.5rem;
  --frame-radius: 16px;

  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-size);
  align-items: flex-start;

  @media (width <= 768px) {
    --gap-size: 1rem;
  }
}

.gallery-frame {
  --frame-width: calc((100% - var(--gap-size)) / 2);

  width: var(--frame-width);
  break-inside: avoid;
  page-break-inside: avoid;

  @media (width <= 768px) {
    --frame-width: 100%;
  }

  // Create varied heights for artistic look
  &:nth-child(3n+1) .frame-inner {
    padding-top: 100%; // Square
  }

  &:nth-child(3n+2) .frame-inner {
    padding-top: 75%; // 4:3 landscape
  }

  &:nth-child(3n+3) .frame-inner {
    padding-top: 133.33%; // 3:4 portrait
  }

  &:first-child .frame-inner {
    padding-top: 56.25%; // 16:9 - hero image
  }

  @media (width <= 768px) {
    &:nth-child(3n+1) .frame-inner,
    &:nth-child(3n+2) .frame-inner,
    &:nth-child(3n+3) .frame-inner {
      padding-top: 75%; // Uniform 4:3 on mobile
    }
  }
}

.frame-inner {
  position: relative;
  width: 100%;
  background: var(--anzhiyu-card-bg);
  border-radius: var(--frame-radius);
  overflow: hidden;
  box-shadow:
    0 4px 20px rgb(0 0 0 / 8%),
    0 0 0 1px rgb(255 255 255 / 5%) inset;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    box-shadow:
      0 8px 30px rgb(0 0 0 / 12%),
      0 0 0 1px var(--anzhiyu-theme) inset;
    transform: translateY(-4px);
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    padding: 0.75rem;
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

    &.loaded {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.frame-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  font-family: "Playfair Display", serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--anzhiyu-card-bg);
  background: var(--anzhiyu-theme);
  border-radius: 99px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2;

  .frame-inner:hover & {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-number {
  letter-spacing: 1px;
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
