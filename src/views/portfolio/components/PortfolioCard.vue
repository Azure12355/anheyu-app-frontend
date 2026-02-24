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

// 动态提取颜色 (默认红黄蓝)
const defaultThemeColors = ['#ef4444', '#f59e0b', '#3b82f6'];
const mockColors = ref<string[]>([...defaultThemeColors]);

// 当图片加载时尝试提取主要颜色
const onImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement;
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    // 将图片绘制到微缩的 10x10 canvas 上，通过缩放平滑像素点来实现简单的颜色采样
    canvas.width = 10;
    canvas.height = 10;
    ctx.drawImage(img, 0, 0, 10, 10);
    
    const extractHex = (x: number, y: number) => {
        const data = ctx.getImageData(x, y, 1, 1).data;
        return '#' + [data[0], data[1], data[2]].map(v => v.toString(16).padStart(2, '0')).join('');
    };

    // 从图像的不同区域采样三个颜色
    mockColors.value = [
      extractHex(2, 2), // 左上方块
      extractHex(5, 5), // 中心方块
      extractHex(8, 8)  // 右下方块
    ];
  } catch (error) {
    // 如果因跨域限制(Tainted Canvas)导致报错，则静默失败并使用默认的红黄蓝配色
    console.warn("Color extraction failed or tainted canvas, using default primary colors.");
  } finally {
    isImageLoaded.value = true;
  }
};

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

/* --- 3D Tilt Interaction --- */
import { ref } from "vue";

const cardRef = ref<HTMLElement | null>(null);
const tiltStyle = ref({});
const cursorStyle = ref({ opacity: 0, left: '0px', top: '0px' });
const isHovering = ref(false);
const isImageLoaded = ref(false);

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;
  const rect = cardRef.value.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Calculate percentage from center (-0.5 to 0.5)
  const xPct = (mouseX / width) - 0.5;
  const yPct = (mouseY / height) - 0.5;
  
  // Magic numbers for rotation intensity
  const rotateY = xPct * 12; // Max 12 deg tilt
  const rotateX = yPct * -12; 
  
  tiltStyle.value = {
    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    transition: 'none',
  };
  
  cursorStyle.value = {
      opacity: 1,
      left: `${mouseX}px`,
      top: `${mouseY}px`
  };
};

const handleMouseEnter = () => {
    isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
  tiltStyle.value = {
    transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
  };
  cursorStyle.value = {
      opacity: 0,
      left: cursorStyle.value.left,
      top: cursorStyle.value.top
  };
};
</script>

<template>
  <div
    class="portfolio-card-wrapper"
    :style="{ '--animation-order': animationOrder }"
  >
    <div
      ref="cardRef"
      class="portfolio-card"
      :class="{
        'is-hovering': isHovering,
        'tier-featured': portfolio.tier === 'featured',
        'tier-recommended': portfolio.tier === 'recommended'
      }"
      :style="tiltStyle"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Custom Magic Cursor -->
      <div class="custom-card-cursor" :style="cursorStyle">
         <IconifyIconOnline icon="ri:magic-line" />
      </div>

      <!-- Tier Badges -->
      <div v-if="portfolio.tier === 'featured'" class="tier-badge featured-badge">
        <IconifyIconOnline icon="ri:vip-diamond-fill" class="tier-icon" />
        <span class="badge-text">精选项目</span>
        <div class="badge-shimmer"></div>
      </div>
      <div v-else-if="portfolio.tier === 'recommended'" class="tier-badge recommended-badge">
        <IconifyIconOnline icon="ri:medal-2-fill" class="tier-icon" />
        <span class="badge-text">推荐项目</span>
        <div class="badge-shimmer"></div>
      </div>

      <!-- 图片区域 -->
    <div class="card-cover-wrapper">
      <div class="card-cover">
         <img
            class="cover-image lazy-loading"
            :class="{ 'is-loaded': isImageLoaded }"
            :data-src="coverUrl"
            :alt="portfolio.title"
            crossorigin="anonymous"
            @load="onImageLoad"
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

      <!-- 尊贵的水印衬底背景 -->
      <IconifyIconOnline v-if="portfolio.tier === 'featured'" icon="ri:vip-diamond-line" class="luxury-watermark featured-watermark" />
      <IconifyIconOnline v-else-if="portfolio.tier === 'recommended'" icon="ri:medal-2-line" class="luxury-watermark recommended-watermark" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

.portfolio-card-wrapper {
  position: relative;
  width: 100%;
  perspective: 1200px;
  
  /* Initial State for Animation */
  opacity: 0;
  animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);
}

.portfolio-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: var(--anzhiyu-card-bg);
  border: 1px solid rgba(128, 128, 128, 0.08);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  cursor: none; /* Hide default cursor */
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s;

  &.is-hovering {
    box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.12);
    border-color: rgba(var(--anzhiyu-theme-rgb), 0.2);
    z-index: 10;
    
    .cover-image {
        transform: scale(1.1) translateZ(20px);
    }

    .card-title {
        color: var(--anzhiyu-theme);
        transform: translateZ(30px);
    }

    .card-description {
        transform: translateZ(20px);
    }

    .card-overlay {
        opacity: 1;
        backdrop-filter: blur(2px);
    }

    .overlay-btn {
        transform: translateY(0) translateZ(40px);
        opacity: 1;
        cursor: pointer; /* Ensure pointer shows inside the customized cursor space for buttons */
    }
    
    .category-tag {
        transform: translateZ(25px);
    }
  }
}

.custom-card-cursor {
    position: absolute;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    background: rgba(var(--anzhiyu-theme-rgb), 0.9);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    pointer-events: none;
    z-index: 999;
    transform: translate(-50%, -50%) translateZ(50px);
    backdrop-filter: blur(4px);
    box-shadow: 0 8px 25px rgba(var(--anzhiyu-theme-rgb), 0.4);
    transition: opacity 0.3s ease;
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
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    transform-style: preserve-3d;
    
    &.is-loaded {
        opacity: 1;
        transform: scale(1);
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
    border-radius: 100px;
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
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
    padding: 4px 14px;
    border-radius: 100px;
    background: transparent;
    border: 1px solid var(--anzhiyu-theme); 
    color: var(--anzhiyu-theme);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.4s ease;
    
    &:hover {
        background: var(--anzhiyu-theme);
        color: white;
    }
}

.card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--anzhiyu-fontcolor);
    margin-bottom: 12px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.4s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    transform-style: preserve-3d;
}

.card-description {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--anzhiyu-secondtext);
    line-height: 1.7;
    margin-bottom: 24px;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    opacity: 0.85;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    transform-style: preserve-3d;
}

/* Footer Colors */
.card-footer {
    display: flex;
    align-items: center;
    gap: 12px;
}

.footer-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    font-style: italic;
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

/* --- Luxury Tier Enhancements --- */

/* 1. Global Box Styling */
.portfolio-card.tier-featured {
    border: 1px solid rgba(218, 165, 32, 0.4);
    box-shadow: 0 8px 30px rgba(218, 165, 32, 0.08);
    background: radial-gradient(circle at top right, rgba(218, 165, 32, 0.05), var(--anzhiyu-card-bg) 60%);
    
    &.is-hovering {
        border-color: rgba(218, 165, 32, 1);
        box-shadow: 0 20px 50px rgba(218, 165, 32, 0.2);
    }
}

.portfolio-card.tier-recommended {
    border: 1px solid rgba(169, 169, 169, 0.4);
    box-shadow: 0 8px 30px rgba(169, 169, 169, 0.08);
    background: radial-gradient(circle at top right, rgba(169, 169, 169, 0.05), var(--anzhiyu-card-bg) 60%);
    
    &.is-hovering {
        border-color: rgba(169, 169, 169, 1);
        box-shadow: 0 20px 50px rgba(169, 169, 169, 0.2);
    }
}

/* 2. Floating Pill Badges */
.tier-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 20;
    padding: 6px 14px;
    border-radius: 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    overflow: hidden;
    transform: translateZ(30px);
    
    .tier-icon {
        font-size: 1rem;
    }
    
    .badge-text {
        position: relative;
        z-index: 2;
    }
}

.featured-badge {
    background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.4);
    text-shadow: 0 1px 3px rgba(184, 134, 11, 0.6);
}

.recommended-badge {
    background: linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.5);
    text-shadow: 0 1px 3px rgba(100, 100, 100, 0.6);
}

/* 3. Shimmer Line Animation inside Badge */
.badge-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    transform: skewX(-20deg);
    animation: badgeShine 3s infinite;
    z-index: 1;
}

.recommended-badge .badge-shimmer {
    animation-duration: 4s;
    animation-delay: 1s;
}

@keyframes badgeShine {
    0% { left: -100%; }
    20% { left: 200%; }
    100% { left: 200%; }
}

/* 4. Luxury Watermark Pattern */
.luxury-watermark {
    position: absolute;
    right: -10px;
    bottom: -15px;
    font-size: 14rem;
    line-height: 1;
    pointer-events: none;
    z-index: 0;
    transform: rotate(-15deg) translateZ(0); 
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s;
}

.featured-watermark {
    color: rgba(218, 165, 32, 1);
    opacity: 0.05;
}

.recommended-watermark {
    color: rgba(169, 169, 169, 1);
    opacity: 0.05;
}

.portfolio-card.is-hovering {
    .featured-watermark { opacity: 0.12; transform: rotate(0deg) scale(1.1) translateZ(10px); }
    .recommended-watermark { opacity: 0.12; transform: rotate(0deg) scale(1.1) translateZ(10px); }
}

[data-theme='dark'] {
    .featured-watermark { opacity: 0.1; }
    .recommended-watermark { opacity: 0.1; }
    
    .portfolio-card.is-hovering {
        .featured-watermark { opacity: 0.2; }
        .recommended-watermark { opacity: 0.2; }
    }
    
    .portfolio-card.tier-featured { background: radial-gradient(circle at top right, rgba(218, 165, 32, 0.1), var(--anzhiyu-card-bg) 60%); }
    .portfolio-card.tier-recommended { background: radial-gradient(circle at top right, rgba(169, 169, 169, 0.1), var(--anzhiyu-card-bg) 60%); }
}

/* Relative positioning context for content elements to stay above watermark */
.tag-row, .card-title, .card-description, .card-footer {
    position: relative;
    z-index: 2;
}
</style>
