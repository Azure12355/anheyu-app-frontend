<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mockGetPortfolioById } from "./mock-data";
import type { Portfolio } from "@/types/portfolio";
import ProjectHero from "./components/ProjectHero.vue";
import ProjectInfo from "./components/ProjectInfo.vue";

defineOptions({
  name: "PortfolioDetail"
});

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const portfolio = ref<Portfolio | null>(null);

// Get ID from route
const id = route.params.id as string;

// Fetch data
const fetchData = async () => {
  isLoading.value = true;
  try {
    const res = await mockGetPortfolioById(id);
    if (res.code === 200 && res.data) {
      portfolio.value = res.data;
    } else {
      // Handle 404
      console.error("Project not found");
    }
  } catch (err) {
    console.error(err);
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
</script>

<template>
  <div class="project-detail-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loader">Loading...</div>
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
              <div class="showcase-column" v-motion-slide-visible-left>
                  <div class="main-image-wrapper">
                      <img :src="portfolio.cover_url" :alt="portfolio.title" class="main-image" />
                      <div class="image-reflection"></div>
                  </div>
              </div>

              <!-- Right: Details Component -->
              <div class="info-wrapper" v-motion-slide-visible-right>
                <ProjectInfo :portfolio="portfolio" />
              </div>
          </div>
      </div>
    </template>
    
    <div v-else class="not-found">
        <h2>Project not found</h2>
        <button @click="goBack">Go Back</button>
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 80px;
    z-index: 5;
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 40px;
    }
}

/* Showcase Image */
.main-image-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
    border: 8px solid rgba(255,255,255,0.5); /* Glass border */
    background: rgba(255,255,255,0.1);
    
    .main-image {
        width: 100%;
        display: block;
        transition: transform 0.5s;
        
        &:hover {
            transform: scale(1.02);
        }
    }
}

/* Motion Mock Helper */
[v-motion-slide-visible-left] {
    animation: slideRightFade 0.8s ease-out forwards;
}

[v-motion-slide-visible-right] {
    animation: slideLeftFade 0.8s ease-out forwards;
}

@keyframes slideRightFade {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes slideLeftFade {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
}
</style>
