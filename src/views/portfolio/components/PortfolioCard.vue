<script setup lang="ts">
import { computed } from "vue";
import type { Portfolio } from "@/types/portfolio";
import {
  ProjectTypeLabels,
  ProjectStatusLabels,
  ProjectStatusColors
} from "@/types/portfolio";

defineOptions({
  name: "PortfolioCard"
});

const props = defineProps<{
  portfolio: Portfolio;
  isDoubleColumn?: boolean;
  animationOrder?: number;
}>();

// 默认封面图
const defaultCover =
  "https://gw.alipayobjects.com/zos/bmw-prod/b2821ef4-cb52-4275-a356-1b90219cd6c2.svg";

const coverUrl = computed(() => {
  return props.portfolio.cover_url || defaultCover;
});

// 状态标签颜色和文字
const statusConfig = computed(() => {
  const status = props.portfolio.status;
  return {
    color: ProjectStatusColors[status],
    label: ProjectStatusLabels[status]
  };
});

// 项目类型标签
const typeLabel = computed(() => {
  return ProjectTypeLabels[props.portfolio.project_type];
});

// 格式化时间
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  if (days < 365) return `${Math.floor(days / 30)} 个月前`;
  return `${Math.floor(days / 365)} 年前`;
};
</script>

<template>
  <div
    class="portfolio-card"
    :class="{ 'three-column': isDoubleColumn }"
    :style="{ '--animation-order': animationOrder }"
  >
    <div class="card-cover">
      <img
        class="cover-image lazy-loading"
        :data-src="coverUrl"
        :alt="portfolio.title"
      />
      <!-- 状态徽章 -->
      <div
        class="status-badge"
        :style="{ backgroundColor: statusConfig.color }"
      >
        {{ statusConfig.label }}
      </div>
      <!-- 外部链接按钮 -->
      <div class="card-actions">
        <a
          v-if="portfolio.demo_url"
          class="action-btn"
          title="查看演示"
          :href="portfolio.demo_url"
          target="_blank"
          @click.stop
        >
          <i class="anzhiyufont anzhiyu-icon-eye-outline" />
        </a>
        <a
          v-if="portfolio.github_url"
          class="action-btn"
          title="查看代码"
          :href="portfolio.github_url"
          target="_blank"
          @click.stop
        >
          <i class="anzhiyufont anzhiyu-icon-github" />
        </a>
      </div>
    </div>

    <div class="card-content">
      <!-- 标签区域 -->
      <div class="card-tags">
        <span class="type-tag">{{ typeLabel }}</span>
        <span v-if="portfolio.featured" class="featured-tag">
          <i class="anzhiyufont anzhiyu-icon-fire" />
          精选
        </span>
      </div>

      <!-- 标题 -->
      <h3 class="card-title" :title="portfolio.title">
        {{ portfolio.title }}
      </h3>

      <!-- 描述 -->
      <p class="card-description" :title="portfolio.description">
        {{ portfolio.description }}
      </p>

      <!-- 技术栈 -->
      <div class="card-technologies">
        <span
          v-for="tech in portfolio.technologies.slice(0, 5)"
          :key="tech"
          class="tech-tag"
        >
          {{ tech }}
        </span>
        <span v-if="portfolio.technologies.length > 5" class="tech-more">
          +{{ portfolio.technologies.length - 5 }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="card-footer">
        <span class="update-time">
          <i class="anzhiyufont anzhiyu-icon-clock" />
          {{ formatDate(portfolio.updated_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-card {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin: 1rem 0;
  overflow: hidden;
  cursor: pointer;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;
  transition: all 0.3s ease-in-out;

  // 入场动画
  opacity: 0;
  animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);

  // 硬件加速
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;

  &.three-column {
    flex-direction: column;
    width: calc(33.333% - 0.416rem);
    height: auto;

    .card-cover {
      width: 100%;
      height: 200px;
      border-radius: 8px 8px 0 0;
    }

    .card-content {
      width: 100%;
      padding: 16px 20px;
    }
  }

  &:active {
    transform: scale(0.97);
  }

  &:hover {
    border: var(--style-border-hover);
    box-shadow: var(--anzhiyu-shadow-main);

    .cover-image {
      transform: scale(1.05);
    }

    .card-title {
      color: var(--anzhiyu-main);
    }

    .action-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .card-cover {
    position: relative;
    flex-shrink: 0;
    width: 45%;
    min-height: 180px;
    overflow: hidden;

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition:
        transform 0.6s ease,
        filter 0.6s ease;
      opacity: 0;

      &.lazy-loading {
        background: var(--anzhiyu-secondbg);
        opacity: 0;
      }

      &.lazy-loaded {
        opacity: 1;
      }
    }

    .status-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 12px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #fff;
      background: var(--anzhiyu-main);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .card-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 8px;

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        color: #fff;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        border-radius: 50%;
        backdrop-filter: blur(10px);
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1) !important;
        }

        .anzhiyufont {
          font-size: 16px;
        }
      }
    }
  }

  .card-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 55%;
    min-width: 0;
    padding: 2rem;
  }

  .card-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 0.75rem;
  }

  .type-tag {
    padding: 4px 12px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--anzhiyu-main);
    background: var(--anzhiyu-theme-op);
    border-radius: 20px;
  }

  .featured-tag {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 4px 12px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 20px;

    .anzhiyufont {
      font-size: 0.7rem;
    }
  }

  .card-title {
    display: -webkit-box;
    margin-bottom: 0.75rem;
    overflow: hidden;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--anzhiyu-fontcolor);
    text-decoration: none;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    transition: color 0.3s;
  }

  .card-description {
    display: -webkit-box;
    flex-grow: 1;
    margin-bottom: 1rem;
    overflow: hidden;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--anzhiyu-secondtext);
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .card-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 1rem;
  }

  .tech-tag {
    padding: 4px 10px;
    font-size: 0.75rem;
    color: var(--anzhiyu-fontcolor);
    background: var(--anzhiyu-secondbg);
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      color: var(--anzhiyu-main);
      background: var(--anzhiyu-theme-op);
    }
  }

  .tech-more {
    padding: 4px 10px;
    font-size: 0.75rem;
    color: var(--anzhiyu-secondtext);
    background: transparent;
    border: 1px dashed var(--anzhiyu-secondborder);
    border-radius: 6px;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 0.75rem;
    border-top: 1px solid var(--style-border-always);
  }

  .update-time {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 0.85rem;
    color: var(--anzhiyu-secondtext);

    .anzhiyufont {
      font-size: 0.9rem;
    }
  }
}

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

@media (width <= 768px) {
  .portfolio-card,
  .portfolio-card.three-column {
    flex-direction: column;
    width: 100%;

    .card-cover {
      width: 100%;
      height: 200px;
    }

    .card-content {
      width: 100%;
      padding: 1rem;
    }

    .card-title {
      font-size: 1.2rem;
    }

    .card-description {
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }
}
</style>
