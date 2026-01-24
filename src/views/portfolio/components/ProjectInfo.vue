<script setup lang="ts">
import type { Portfolio } from "@/types/portfolio";

defineOptions({
  name: "ProjectInfo"
});

defineProps<{
  portfolio: Portfolio;
}>();
</script>

<template>
  <div class="details-column">
      <div class="detail-block">
          <h3 class="block-title">About the Project</h3>
          <p class="block-text">{{ portfolio.description }}</p>
          <p class="block-text">
              This project represents a detailed exploration into modern web technologies, 
              focusing on performance, accessibility, and user experience. 
              It involves complex state management and responsive design patterns.
          </p>
      </div>

      <div class="detail-block">
          <h3 class="block-title">Technologies</h3>
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

      <div class="detail-block stats-block">
            <div class="stat-item">
                <span class="stat-value">24</span>
                <span class="stat-label">Commits</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">100%</span>
                <span class="stat-label">Test Coverage</span>
            </div>
             <div class="stat-item">
                <span class="stat-value">A+</span>
                <span class="stat-label">Performance</span>
            </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
/* Details Column */
.details-column {
    padding-top: 40px;
    
    @media (max-width: 1024px) {
        padding-top: 0;
    }
}

.detail-block {
    margin-bottom: 40px;
}

.block-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
    color: var(--anzhiyu-fontcolor);
    
    &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 50%;
        height: 3px;
        background: var(--anzhiyu-theme);
        border-radius: 3px;
    }
}

.block-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--anzhiyu-fontcolor);
    margin-bottom: 1rem;
    opacity: 0.9;
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.tech-tag {
    padding: 8px 16px;
    background: var(--anzhiyu-card-bg);
    border: 1px solid var(--anzhiyu-border-color, #eee);
    border-radius: 12px;
    font-weight: 500;
    color: var(--anzhiyu-fontcolor);
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    transition: all 0.3s;
    
    &:hover {
        background: var(--anzhiyu-theme);
        color: white;
        transform: translateY(-3px);
    }
}

.stats-block {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding-top: 20px;
    border-top: 1px dashed var(--anzhiyu-border-color, #eee);
}

.stat-item {
    text-align: center;
    
    .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: 800;
        color: var(--anzhiyu-theme);
        margin-bottom: 5px;
    }
    
    .stat-label {
        font-size: 0.9rem;
        color: var(--anzhiyu-secondtext);
    }
}
</style>
