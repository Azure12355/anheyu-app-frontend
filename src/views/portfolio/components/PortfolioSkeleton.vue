<script setup lang="ts">
import { computed } from "vue";
import { useSiteConfigStore } from "@/store/modules/siteConfig";

defineOptions({
  name: "PortfolioSkeleton"
});

const props = defineProps<{
  isDoubleColumn?: boolean;
  animationOrder?: number;
}>();

const siteConfigStore = useSiteConfigStore();
// Note: We ignore isDoubleColumn here visually because index.vue uses CSS grid (.card-grid).
</script>

<template>
  <div
    class="portfolio-skeleton-wrapper"
    :style="{ '--animation-order': animationOrder || 0 }"
  >
    <div class="portfolio-skeleton">
      <!-- Image Area -->
      <div class="skeleton-cover-wrapper">
        <div class="skeleton-cover">
          <div class="skeleton-shimmer" />
        </div>
      </div>

      <!-- Content Area -->
      <div class="skeleton-content">
        <!-- Tags -->
        <div class="skeleton-tag-row">
          <div class="skeleton-tag" />
        </div>

        <!-- Title -->
        <div class="skeleton-title" />

        <!-- Description -->
        <div class="skeleton-description">
          <div class="skeleton-line" />
          <div class="skeleton-line short" />
        </div>

        <!-- Footer -->
        <div class="skeleton-footer">
          <div class="skeleton-footer-label" />
          <div class="skeleton-color-dots">
            <div class="skeleton-dot" />
            <div class="skeleton-dot" />
            <div class="skeleton-dot" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmerEffect {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.portfolio-skeleton-wrapper {
  position: relative;
  width: 100%;
  opacity: 0;
  animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);
}

.portfolio-skeleton {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--anzhiyu-card-bg);
  border: 1px solid rgb(128 128 128 / 8%);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgb(0 0 0 / 2%);
}

/* Generalized Shimmer for elements */
.skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 2000px 100%;
  animation: shimmerEffect 2.5s infinite linear;
}

/* Image Section */
.skeleton-cover-wrapper {
  padding: 12px 12px 0;
}

.skeleton-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--anzhiyu-secondbg);
  border-radius: 16px;
}

/* Content Section */
.skeleton-content {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 24px;
}

.skeleton-tag-row {
  margin-bottom: 12px;
}

.skeleton-tag {
  display: inline-block;
  width: 80px;
  height: 24px;
  background: var(--anzhiyu-secondbg);
  border-radius: 100px;
  animation: pulse 2s infinite ease-in-out;
}

.skeleton-title {
  width: 70%;
  height: 28px;
  margin-bottom: 12px;
  background: var(--anzhiyu-secondbg);
  border-radius: 8px;
  animation: pulse 2s infinite ease-in-out;
  animation-delay: 0.1s;
}

.skeleton-description {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  .skeleton-line {
    width: 100%;
    height: 18px;
    background: var(--anzhiyu-secondbg);
    border-radius: 4px;
    animation: pulse 2s infinite ease-in-out;
    animation-delay: 0.2s;

    &.short {
      width: 60%;
    }
  }
}

.skeleton-footer {
  display: flex;
  gap: 12px;
  align-items: center;
}

.skeleton-footer-label {
  width: 50px;
  height: 16px;
  background: var(--anzhiyu-secondbg);
  border-radius: 4px;
  animation: pulse 2s infinite ease-in-out;
  animation-delay: 0.3s;
}

.skeleton-color-dots {
  display: flex;
  gap: 6px;
}

.skeleton-dot {
  width: 20px;
  height: 20px;
  background: var(--anzhiyu-secondbg);
  border-radius: 50%;
  animation: pulse 2s infinite ease-in-out;
  animation-delay: 0.4s;
}

[data-theme='dark'] {
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.02) 20%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.02) 80%,
      rgba(255, 255, 255, 0) 100%
    );
  }
}
</style>
