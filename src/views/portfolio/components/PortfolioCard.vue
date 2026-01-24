<script setup lang="ts">
import { computed } from "vue";
import type { Portfolio } from "@/types/portfolio";
import { ProjectTypeLabels } from "@/types/portfolio";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";

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

// 项目类型标签
const typeLabel = computed(() => {
  return ProjectTypeLabels[props.portfolio.project_type];
});

// 模拟颜色圆点 (基于ID生成固定颜色)
const mockColors = computed(() => {
    const colors = [
        ['#3b82f6', '#8b5cf6', '#10b981'],
        ['#f59e0b', '#ef4444', '#3b82f6'],
        ['#10b981', '#3b82f6', '#6366f1'],
        ['#ec4899', '#8b5cf6', '#f59e0b'],
    ];
    // Simple hash from string id
    const index = props.portfolio.id.charCodeAt(0) % colors.length;
    return colors[index];
});

// 处理打开链接
const openLink = (url?: string) => {
  if (url) {
    window.open(url, "_blank");
  }
};

import { useRouter } from "vue-router";

const router = useRouter();

// 处理查看详情
const viewDetails = () => {
  router.push({
    name: "PortfolioDetail",
    params: { id: props.portfolio.id }
  });
};
</script>

<template>
  <div
    class="portfolio-card"
    :style="{ '--animation-order': animationOrder }"
  >
    <!-- 图片区域 -->
    <div class="card-cover-wrapper">
      <div class="card-cover">
         <img
            class="cover-image lazy-loading"
            :data-src="coverUrl"
            :alt="portfolio.title"
        />
        <!-- 模拟 Light 标签 (视觉装饰) -->
        <!-- Mode Badge -->
        <span class="mode-badge" v-if="portfolio.mode">
            <i class="anzhiyufont" :class="portfolio.mode === 'light' ? 'anzhiyu-icon-sun' : 'anzhiyu-icon-moon'"></i> 
            {{ portfolio.mode === 'light' ? 'Light' : 'Dark' }}
        </span>

        <!-- 悬浮遮罩与按钮 -->
        <div class="card-overlay">
            <button 
                class="overlay-btn primary" 
                @click.stop="openLink(portfolio.demo_url)"
                :disabled="!portfolio.demo_url"
                title="访问项目"
            >
                <IconifyIconOnline icon="ri:external-link-line" class="btn-icon" /> 访问项目
            </button>
            <button 
                class="overlay-btn secondary" 
                @click.stop="viewDetails"
                title="查看详情"
            >
                <IconifyIconOnline icon="ri:arrow-right-circle-line" class="btn-icon" /> 查看详情
            </button>
        </div>
      </div>
    </div>

    <div class="card-content">
      <!-- 标签 -->
      <div class="tag-row">
        <span class="category-tag">{{ typeLabel }}</span>
      </div>

      <!-- 标题 -->
      <h3 class="card-title" :title="portfolio.title">
        {{ portfolio.title }}
      </h3>

      <!-- 描述 -->
      <p class="card-description" :title="portfolio.description">
        {{ portfolio.description }}
      </p>

      <!-- 底部 Colors 展示 -->
      <div class="card-footer">
        <span class="footer-label">Colors:</span>
        <div class="color-dots">
            <span 
                v-for="color in mockColors" 
                :key="color" 
                class="color-dot"
                :style="{ backgroundColor: color }"
            ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 24px;
  background: var(--anzhiyu-card-bg);
  border: 1px solid var(--anzhiyu-border-color, #eee); /* Delicate border */
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  /* Initial State for Animation */
  opacity: 0;
  animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -5px rgba(0,0,0,0.1);
    border-color: transparent;
    
    .cover-image {
        transform: scale(1.05);
    }
    
    .card-title {
        color: var(--anzhiyu-theme);
    }

    .card-overlay {
        opacity: 1;
        backdrop-filter: blur(2px);
    }

    .overlay-btn {
        transform: translateY(0);
        opacity: 1;
    }
  }
}

/* Image Section */
.card-cover-wrapper {
    padding: 12px 12px 0 12px; /* Pad image like a frame */
}

.card-cover {
    position: relative;
    width: 100%;
    aspect-ratio: 16/10;
    border-radius: 16px;
    overflow: hidden;
    background: var(--anzhiyu-secondbg);
}

.cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
    
    &.lazy-loading {
        opacity: 0;
    }
}

.mode-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    
    
    .anzhiyufont { font-size: 14px; color: #f59e0b; }
}

/* Card Overlay */
.card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 2;
}

.overlay-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 99px;
    border: none;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .btn-icon { 
        font-size: 18px;
        transition: transform 0.3s ease; 
    }

    &:active { transform: scale(0.95); }

    &.primary {
        background: var(--anzhiyu-theme);
        color: white;
        transition-delay: 0.05s;

        &:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 20px rgba(var(--anzhiyu-theme-rgb), 0.5);
            
            .btn-icon {
                transform: translateX(3px) translateY(-3px); /* Flight effect */
            }
        }
        
        &:disabled {
            background: #ccc;
            cursor: not-allowed;
            box-shadow: none;
        }
    }

    &.secondary {
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        backdrop-filter: blur(4px);
        transition-delay: 0.1s;

        &:hover {
            background: white;
            color: var(--anzhiyu-theme);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

            .btn-icon {
                transform: translateX(4px); /* Arrow move effect */
            }
        }
    }
}

/* Content Section */
.card-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.tag-row {
    margin-bottom: 12px;
}

.category-tag {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 8px;
    background: var(--anzhiyu-theme-op); 
    color: var(--anzhiyu-theme);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    
    &:hover {
        background: var(--anzhiyu-theme);
        color: white;
    }
}

.card-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--anzhiyu-fontcolor);
    margin-bottom: 8px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.3s ease;
}

.card-description {
    font-size: 0.95rem;
    color: var(--anzhiyu-secondtext);
    line-height: 1.6;
    margin-bottom: 24px;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Footer Colors */
.card-footer {
    display: flex;
    align-items: center;
    gap: 12px;
}

.footer-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--anzhiyu-secondtext);
}

.color-dots {
    display: flex;
    gap: 6px;
}

.color-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    /* border: 1px solid rgba(0,0,0,0.05); */
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.lazy-loaded { opacity: 1; }
</style>
