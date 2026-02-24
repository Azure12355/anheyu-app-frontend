<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPortfolioById } from "@/api/portfolio";
import type { Portfolio } from "@/types/portfolio";
import ProjectHero from "./components/ProjectHero.vue";
import ProjectInfo from "./components/ProjectInfo.vue";

defineOptions({
  name: "PortfolioDetail"
});

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const isImageLoaded = ref(false);
const portfolio = ref<Portfolio | null>(null);

// Fetch data
const fetchData = async () => {
  const id = route.params.id as string;
  if (!id) return;

  isLoading.value = true;
  portfolio.value = null;
  try {
    const res = await getPortfolioById(id);
    if (res.code === 200 && res.data) {
      portfolio.value = res.data;
    } else {
      // Handle 404
      console.error("Project not found");
    }
  } catch (err) {
    console.error("Failed to fetch portfolio:", err);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push({ name: "Portfolio" });
};

onMounted(() => {
  fetchData();
  window.scrollTo(0, 0);
});

// Watch for route changes (when navigating between portfolio details)
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      window.scrollTo(0, 0);
      fetchData();
    }
  }
);
</script>

<template>
  <div class="project-detail-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loader">加载中...</div>
    </div>

    <template v-else-if="portfolio">
      <!-- Hero Section Component -->
      <ProjectHero 
        :portfolio="portfolio"
        @back="goBack"
      />

      <!-- Main Content -->
      <div class="main-content">
          <div class="content-grid">
              <!-- Left: Image Showcase -->
              <div class="showcase-column">
                  <div class="main-image-wrapper">
                      <img 
                        :src="portfolio.cover_url" 
                        :alt="portfolio.title" 
                        class="main-image" 
                        :class="{'is-loaded': isImageLoaded}"
                        @load="isImageLoaded = true"
                      />
                      <div class="image-reflection"></div>
                  </div>
                  
                  <!-- Left Meta Card -->
                  <div class="left-meta-card" v-if="portfolio.role || portfolio.duration || portfolio.client">
                      <div class="meta-item" v-if="portfolio.role">
                          <span class="meta-label">担任角色</span>
                          <span class="meta-value">{{ portfolio.role }}</span>
                      </div>
                      <div class="meta-item" v-if="portfolio.duration">
                          <span class="meta-label">项目周期</span>
                          <span class="meta-value">{{ portfolio.duration }}</span>
                      </div>
                      <div class="meta-item" v-if="portfolio.client">
                          <span class="meta-label">所属客户</span>
                          <span class="meta-value">{{ portfolio.client }}</span>
                      </div>
                  </div>
              </div>

              <!-- Right: Details Component -->
              <div class="info-wrapper">
                <ProjectInfo :portfolio="portfolio" />
              </div>
          </div>
      </div>
    </template>
    
    <div v-else class="not-found">
        <h2>未找到该作品</h2>
        <button @click="goBack">返回上一页</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-detail-page {
  width: 100%;
  min-height: 100vh;
  background: var(--anzhiyu-background);
  color: var(--anzhiyu-fontcolor);
}

.loading-container, .not-found {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--anzhiyu-secondtext);
    gap: 20px;
    
    button {
        padding: 10px 20px;
        background: var(--anzhiyu-theme);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }
}

/* Main Content */
.main-content {
    position: relative;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 40px 120px;
    z-index: 5;
    
    @media (max-width: 768px) {
        padding: 0 20px 80px;
    }
}

.content-grid {
    display: grid;
    grid-template-columns: 4fr 7fr;
    gap: 80px;
    align-items: start;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 60px;
    }
}

/* Showcase Image Column */
.showcase-column {
    position: sticky;
    top: 100px;
    
    @media (max-width: 1024px) {
        position: relative;
        top: 0;
    }
}

.main-image-wrapper {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.15);
    border: 1px solid rgba(128,128,128,0.2); 
    background: var(--anzhiyu-card-bg);
    margin-bottom: 2rem;
    
    .main-image {
        width: 100%;
        display: block;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        
        &.is-loaded {
            opacity: 1;
            transform: scale(1);
        }

        &:hover {
            transform: scale(1.03);
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
    }
}

/* Left Meta Card */
.left-meta-card {
    display: flex;
    flex-direction: column; /* Stack vertically for a sleeker look */
    gap: 2rem;
    padding: 2.5rem;
    
    @media (max-width: 768px) {
        flex-direction: row; /* Horizontal on mobile for compactness */
        flex-wrap: wrap;
        padding: 1.5rem;
        gap: 1.5rem;
    }
    
    /* Extreme Glassmorphism */
    background: linear-gradient(
        135deg, 
        rgba(255, 255, 255, 0.05) 0%, 
        rgba(255, 255, 255, 0.01) 100%
    );
    border-radius: 20px;
    border: 1px solid rgba(128,128,128,0.1);
    box-shadow: 
        0 15px 35px rgba(0,0,0,0.05),
        inset 0 1px 0 rgba(255,255,255,0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    
    /* Reveal Animation setup */
    position: relative;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;

    /* Animated light sweep effect */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        transform: skewX(-20deg);
        transition: 0.7s;
        z-index: 1;
        pointer-events: none;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 
            0 25px 45px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.2);
        border-color: rgba(var(--anzhiyu-theme-rgb), 0.3);
        
        &::after {
            left: 200%;
        }
    }
}

[data-theme="dark"] .left-meta-card {
    background: linear-gradient(
        135deg, 
        rgba(255, 255, 255, 0.03) 0%, 
        rgba(255, 255, 255, 0.005) 100%
    );
    box-shadow: 
        0 15px 35px rgba(0,0,0,0.2),
        inset 0 1px 0 rgba(255,255,255,0.05);
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
    z-index: 2;
    padding-left: 1rem;
    border-left: 2px solid transparent;
    transition: border-color 0.3s ease;
    
    &:hover {
        border-left-color: var(--anzhiyu-theme);
    }
}

.meta-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--anzhiyu-secondtext);
    font-weight: 700;
    opacity: 0.7;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.meta-value {
    font-family: 'Playfair Display', serif; /* Use serif for elegant contrast */
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--anzhiyu-fontcolor);
    line-height: 1.3;
}
</style>
