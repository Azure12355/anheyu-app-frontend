<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import type { Portfolio } from "@/types/portfolio";
import { ProjectTypeLabels } from "@/types/portfolio";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";
import dayjs from "dayjs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

defineOptions({
  name: "ProjectHero"
});

const props = defineProps<{
  portfolio: Portfolio;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
}>();

let ctx: gsap.Context;

const formattedDate = computed(() => {
  return dayjs(props.portfolio.created_at).format("MMMM D, YYYY");
});

const typeLabel = computed(() => {
  return ProjectTypeLabels[props.portfolio.project_type];
});

const openLink = (url?: string) => {
  if (url) window.open(url, "_blank");
};

onMounted(() => {
  ctx = gsap.context(() => {
    ScrollTrigger.matchMedia({
      // Desktop
      "(min-width: 769px)": function () {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        tl.to(".hero-text", {
          scale: 0.8,
          y: 0,
          opacity: 0.8,
          ease: "none"
        }).to(
          ".post-top-cover",
          {
            scale: 0.5,
            rotation: 0, 
            ease: "none"
          },
          "<"
        );
      },
       // Mobile
      "(max-width: 768px)": function () {
          // No complex GSAP for mobile to keep it performant
      }
    });
  });
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div class="hero-section">
    <!-- Floating Background Image -->
    <div class="post-top-cover">
         <img :src="portfolio.cover_url" class="post-top-bg" :alt="portfolio.title" />
    </div>
    
    <!-- Gradient Overlay -->
    <div class="hero-overlay"></div>

    <!-- Wrapper for fixed elements relative to hero section -->
    <div class="hero-container">
        <!-- Back Button (Absolute Top Left) -->
        <div class="back-btn-wrapper">
             <button class="back-btn" @click="emit('back')">
                <IconifyIconOnline icon="ri:arrow-left-line" class="icon" /> 
                <span class="text">返回</span>
            </button>
        </div>

        <!-- Centered Content -->
        <div class="hero-content">
            <div class="hero-text" v-motion-slide-visible-bottom>
                <div class="project-meta">
                    <span class="meta-badge category">{{ typeLabel }}</span>
                    <span class="meta-badge date">
                        <IconifyIconOnline icon="ri:calendar-line" />
                        {{ formattedDate }}
                    </span>
                </div>
                
                <h1 class="project-title">{{ portfolio.title }}</h1>
                
                <div class="action-buttons">
                    <button 
                        v-if="portfolio.demo_url"
                        class="action-btn primary"
                        @click="openLink(portfolio.demo_url)"
                    >
                        <IconifyIconOnline icon="ri:global-line" class="btn-icon" /> 
                        <span>访问项目</span>
                    </button>
                    <button 
                            v-if="portfolio.github_url"
                        class="action-btn secondary"
                        @click="openLink(portfolio.github_url)"
                    >
                        <IconifyIconOnline icon="ri:github-fill" class="btn-icon" /> 
                        <span>Github</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Waves Effect -->
    <section class="main-hero-waves-area waves-area">
      <svg
        class="waves-svg"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352Z"
          />
        </defs>
        <g class="parallax">
          <use href="#gentle-wave" x="48" y="0" />
          <use href="#gentle-wave" x="48" y="3" />
          <use href="#gentle-wave" x="48" y="5" />
          <use href="#gentle-wave" x="48" y="7" />
        </g>
      </svg>
    </section>
  </div>
</template>

<style lang="scss" scoped>
/* Hero Section */
.hero-section {
    position: relative;
    height: 25rem; /* Reduced height from 35rem */
    min-height: 400px;
    width: 100%;
    margin-bottom: -50px; /* Slight overlap with content */
    background: var(--anzhiyu-card-bg); /* Fallback */
    overflow: hidden;
}

/* Floating Cover Effect */
.post-top-cover {
    position: absolute;
    width: 70%;
    height: 100%;
    right: 0;
    top: 0;
    margin-right: -15%; /* Push right */
    overflow: hidden;
    opacity: 0.5; /* Slightly reduced opacity for text contrast */
    transform: rotate(10deg) translateY(0) scale(1.5) translateZ(0);
    transform-origin: center center;
    filter: blur(10px);
    z-index: 0;
    pointer-events: none;
    transition: all 0.5s ease;
}

.post-top-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Inner shadow overlay */
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
}

.hero-overlay {
    position: absolute;
    inset: 0;
    /* Gradient from Theme Color or Dark to Transparent */
    background: linear-gradient(to right, 
        rgba(var(--anzhiyu-theme-rgb, 66, 90, 239), 0.95) 0%, 
        rgba(var(--anzhiyu-theme-rgb, 66, 90, 239), 0.85) 40%, 
        rgba(var(--anzhiyu-theme-rgb, 66, 90, 239), 0.6) 100%);
    z-index: 1;
    pointer-events: none;
}

[data-theme="dark"] .hero-overlay {
    background: linear-gradient(to right, 
        rgba(24, 23, 29, 0.98) 0%, 
        rgba(24, 23, 29, 0.9) 50%, 
        rgba(24, 23, 29, 0.7) 100%);
}

/* Artistic Geometrics */
.hero-container::before,
.hero-container::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    z-index: -1;
    pointer-events: none;
}

.hero-container::before {
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    top: -50px;
    left: 20%;
    animation: floating 8s infinite ease-in-out;
}

.hero-container::after {
    width: 200px;
    height: 200px;
    background: var(--anzhiyu-theme);
    opacity: 0.2;
    bottom: 20%;
    right: 30%;
    animation: floating 12s infinite ease-in-out reverse;
}

@keyframes floating {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
}

.hero-container {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: center; /* Center content horizontally */
    align-items: center; /* Center content vertically */
}

/* Back Button */
.back-btn-wrapper {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 20;
}

.back-btn {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.25);
    color: white;
    height: 40px;
    padding: 0 16px;
    border-radius: 99px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    .icon {
        font-size: 1.1rem;
        transition: transform 0.3s ease;
    }

    &:hover {
        background: white;
        color: var(--anzhiyu-theme);
        border-color: white;
        transform: translateX(2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        
        .icon {
            transform: translateX(-2px);
        }
    }
}

/* Main Content */
.hero-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.hero-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    width: 100%;
}

.project-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
}

.meta-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    backdrop-filter: blur(8px);
    letter-spacing: 0.5px;
    border: 1px solid rgba(255,255,255,0.1);
    
    &.category {
        background: rgba(var(--anzhiyu-theme-rgb), 0.8);
        color: white;
        box-shadow: 0 4px 10px rgba(var(--anzhiyu-theme-rgb), 0.2);
        font-weight: 700;
    }
    
    &.date {
        background: rgba(0, 0, 0, 0.2);
        color: rgba(255,255,255,0.9);
    }
}

/* --- Typography: Artistic Title --- */
.project-title {
    font-family: 'Playfair Display', serif;
    font-size: 4.5rem; /* Larger for impact */
    font-weight: 800;
    color: white;
    margin: 0 0 36px 0;
    line-height: 1.1;
    text-shadow: 0 20px 40px rgba(0,0,0,0.4); /* Deeper shadow */
    letter-spacing: -1px;
    position: relative;
    z-index: 2;
    
    /* Subtle gradient to the text */
    background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (min-width: 1200px) {
        font-size: 5rem;
    }
    
    @media (max-width: 768px) {
        font-size: 2.5rem;
        margin-bottom: 24px;
        letter-spacing: -0.5px;
    }
}

/* --- Action Buttons: Elevated Design --- */
.action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
}

.action-btn {
    height: 50px; /* Slightly taller */
    padding: 0 32px;
    border-radius: 14px; /* Move from pill to rounded rectangle for modern edge */
    border: 1px solid transparent;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    
    .btn-icon {
        font-size: 1.25rem;
        transition: transform 0.4s ease;
    }
    
    /* Glossy sweep effect on hover */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transform: skewX(-15deg);
        transition: left 0.6s ease;
    }

    &:hover::after {
        left: 100%;
    }
    
    &.primary {
        background: white;
        color: var(--anzhiyu-theme);
        box-shadow: 
            0 10px 30px rgba(0,0,0,0.2),
            inset 0 -3px 0 rgba(0,0,0,0.1); /* Subtle 3D lift */
        
        &:hover {
            transform: translateY(-4px);
            box-shadow: 
                0 20px 40px rgba(0,0,0,0.3),
                inset 0 -3px 0 rgba(0,0,0,0.1);
                
            .btn-icon {
                transform: rotate(-10deg) scale(1.1); /* Playful icon interaction */
            }
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    }
    
    &.secondary {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
        
        &:hover {
            background: rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.4);
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }

        &:active {
             transform: translateY(0);
        }
    }
}

/* Waves Animation */
.main-hero-waves-area {
  position: absolute;
  bottom: -1px; /* Fix gap */
  left: 0;
  z-index: 5;
  width: 100%;
  pointer-events: none;
}

.waves-svg {
  width: 100%;
  height: 60px; /* Adjust height */
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
  will-change: transform;
}

.parallax > use:nth-child(1) {
  fill: rgba(255, 255, 255, 0.7); /* Light theme fallback */
  animation-duration: 7s;
  animation-delay: -2s;
}
.parallax > use:nth-child(2) {
  fill: rgba(255, 255, 255, 0.5);
  animation-duration: 10s;
  animation-delay: -3s;
}
.parallax > use:nth-child(3) {
  fill: rgba(255, 255, 255, 0.3);
  animation-duration: 13s;
  animation-delay: -4s;
}
.parallax > use:nth-child(4) {
  fill: var(--anzhiyu-background); /* Blend to page bg */
  animation-duration: 20s;
  animation-delay: -5s;
}

[data-theme="dark"] .parallax > use:nth-child(1) { fill: rgba(24, 23, 29, 0.7); }
[data-theme="dark"] .parallax > use:nth-child(2) { fill: rgba(24, 23, 29, 0.5); }
[data-theme="dark"] .parallax > use:nth-child(3) { fill: rgba(24, 23, 29, 0.3); }
[data-theme="dark"] .parallax > use:nth-child(4) { fill: var(--anzhiyu-background); }

@keyframes move-forever {
  0% { transform: translate3d(-90px, 0, 0); }
  100% { transform: translate3d(85px, 0, 0); }
}

@media (max-width: 768px) {
    .hero-section {
        min-height: 400px;
    }

    .post-top-cover {
        width: 100%;
        margin-right: 0;
        opacity: 0.4;
        transform: none;
        filter: blur(5px);
    }
    
    .hero-overlay {
        background: rgba(0,0,0,0.7);
    }
    
    .back-btn-wrapper {
        top: 20px;
        left: 20px;
    }

    .back-btn {
        padding: 0 12px;
        
        .text {
            display: none; /* Icon only on mobile */
        }
    }
    
    .project-title {
        font-size: 2rem;
    }
}
</style>
