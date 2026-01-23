<script setup lang="ts">
import { computed } from "vue";
import { useSiteConfigStore } from "@/store/modules/siteConfig";

defineOptions({
  name: "PortfolioSkeleton"
});

const props = defineProps<{
  isDoubleColumn?: boolean;
}>();

const siteConfigStore = useSiteConfigStore();
const isDoubleColumn = computed(
  () =>
    props.isDoubleColumn ??
    siteConfigStore.getSiteConfig?.post?.default?.double_column ??
    true
);
</script>

<template>
  <div class="portfolio-skeleton" :class="{ 'three-column': isDoubleColumn }">
    <div class="skeleton-cover">
      <div class="skeleton-shine" />
    </div>
    <div class="skeleton-content">
      <div class="skeleton-tags">
        <div class="skeleton-tag" />
        <div class="skeleton-tag short" />
      </div>
      <div class="skeleton-title" />
      <div class="skeleton-description" />
      <div class="skeleton-description short" />
      <div class="skeleton-meta">
        <div class="skeleton-tech" />
        <div class="skeleton-tech" />
        <div class="skeleton-tech short" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-skeleton {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin: 1rem 0;
  overflow: hidden;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;

  &.three-column {
    flex-direction: column;
    width: calc(33.333% - 0.416rem);
    height: auto;

    .skeleton-cover {
      width: 100%;
      height: 200px;
      border-radius: 8px 8px 0 0;
    }

    .skeleton-content {
      width: 100%;
      padding: 16px 20px;
    }
  }

  .skeleton-cover {
    position: relative;
    flex-shrink: 0;
    width: 45%;
    min-height: 180px;
    overflow: hidden;
    background: var(--anzhiyu-secondbg);

    .skeleton-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      animation: shine 1.5s infinite;
    }
  }

  .skeleton-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 55%;
    padding: 2rem;
  }

  .skeleton-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 0.5rem;
  }

  .skeleton-tag {
    height: 24px;
    width: 60px;
    background: var(--anzhiyu-secondbg);
    border-radius: 20px;
    animation: pulse 1.5s ease-in-out infinite;

    &.short {
      width: 45px;
    }
  }

  .skeleton-title {
    height: 28px;
    width: 70%;
    margin-bottom: 1rem;
    background: var(--anzhiyu-secondbg);
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite;
    animation-delay: 0.1s;
  }

  .skeleton-description {
    height: 16px;
    width: 100%;
    margin-bottom: 0.5rem;
    background: var(--anzhiyu-secondbg);
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite;
    animation-delay: 0.2s;

    &.short {
      width: 60%;
    }
  }

  .skeleton-meta {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }

  .skeleton-tech {
    height: 24px;
    width: 50px;
    background: var(--anzhiyu-secondbg);
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite;
    animation-delay: 0.3s;

    &.short {
      width: 35px;
    }
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@media (width <= 768px) {
  .portfolio-skeleton,
  .portfolio-skeleton.three-column {
    flex-direction: column;
    width: 100%;

    .skeleton-cover {
      width: 100%;
      height: 200px;
    }

    .skeleton-content {
      width: 100%;
      padding: 1rem;
    }

    .skeleton-title {
      height: 24px;
      width: 80%;
    }
  }
}
</style>
