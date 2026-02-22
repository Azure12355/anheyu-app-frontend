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
    <div class="project-gallery" v-if="portfolio.gallery_images && portfolio.gallery_images.length > 0">
        <h2 class="section-heading">视觉画廊</h2>
        <div class="gallery-grid">
            <div 
                v-for="(img, idx) in portfolio.gallery_images" 
                :key="idx" 
                class="gallery-item"
                :class="{'large-item': idx === 0 || idx === 3}"
            >
                <img :src="img" :alt="`${portfolio.title} Image ${idx+1}`" loading="lazy" />
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

/* --- Image Gallery (Bento Box style) --- */
.project-gallery {
    margin-top: 2rem;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 300px;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-auto-rows: 250px;
    }
}

.gallery-item {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    position: relative;
    
    &.large-item {
        grid-column: span 2;
        grid-row: span 2;
        
        @media (max-width: 768px) {
            grid-column: span 1;
            grid-row: span 1;
        }
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        
        &:hover {
            transform: scale(1.05);
        }
    }
    
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 20px;
        pointer-events: none;
    }
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
