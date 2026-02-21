<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { gsap } from "gsap";
import { debounce } from "lodash-es";
import { useMouseInElement } from "@vueuse/core";
import { useDark } from "@pureadmin/utils";
import { ProjectType, ProjectTypeLabels } from "@/types/portfolio";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";

defineOptions({
  name: "PortfolioHero"
});

const props = defineProps<{
  keyword?: string;
}>();

const emit = defineEmits<{
  (e: "search", keyword: string): void;
}>();

const router = useRouter();
const route = useRoute();
const heroRef = ref<HTMLElement | null>(null);
const { isDark } = useDark();

// 搜索关键词
const searchKeyword = ref(props.keyword || "");
const isSearching = ref(false);

// 技术栈标签
const techStacks = [
  { name: "Claude Code", icon: "ri:openai-fill" },
  { name: "Cursor", icon: "ri:cursor-fill" },
  { name: "Windsurf", icon: "ri:windy-fill" },
  { name: "Antigravity", icon: "ri:space-ship-fill" },
  { name: "GitHub Copilot", icon: "ri:github-fill" },
];

// 统计数据
const stats = [
  { count: 57, label: "UI Styles", icon: "ri:pantone-line" },
  { count: 95, label: "Color Palettes", icon: "ri:palette-line" },
  { count: 56, label: "Font Pairings", icon: "ri:font-size" },
  { count: 8, label: "Tech Stacks", icon: "ri:stack-line" },
  { count: 24, label: "Chart Types", icon: "ri:bar-chart-line" },
  { count: 29, label: "Landing Patterns", icon: "ri:layout-grid-line" },
];

// GSAP Context
let ctx: gsap.Context | null = null;

// Parallax handling
const { elementX, elementY, elementWidth, elementHeight } = useMouseInElement(heroRef);

watch([elementX, elementY], () => {
    if (!heroRef.value) return;
    
    const width = elementWidth.value || 1;
    const height = elementHeight.value || 1;
    
    const x = (elementX.value / width) - 0.5;
    const y = (elementY.value / height) - 0.5;
    
    // 背景光晕移动
    gsap.to(".bg-glow", {
        x: -x * 30,
        y: -y * 30,
        duration: 2.5,
        ease: "power2.out"
    });
});

// 防抖搜索
const debouncedSearch = debounce((keyword: string) => {
  emit("search", keyword);
  isSearching.value = false;
}, 300);

// 监听搜索输入变化
const handleSearchInput = () => {
  isSearching.value = true;
  debouncedSearch(searchKeyword.value);
};

// 查看全部/滚动到长廊
const scrollToGallery = () => {
    const galleryElement = document.querySelector('.portfolio-container');
    if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth' });
    } else {
        router.push({ path: "/portfolio" });
    }
};

// 灵感探索 (随机一个关键词并自动搜索)
const generateInspiration = () => {
    const keywords = ['Dashboard', 'E-commerce', 'Crypto', 'AI', 'Analytics', 'Social', 'Healthcare', 'Fintech', 'SaaS'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    // 模拟一种被打字机打出来的效果
    searchKeyword.value = '';
    let i = 0;
    const typeWriter = setInterval(() => {
        searchKeyword.value += randomKeyword.charAt(i);
        i++;
        if (i === randomKeyword.length) {
            clearInterval(typeWriter);
            handleSearchInput();
        }
    }, 80);
};

// 动画初始化
const initAnimations = () => {
    if (!heroRef.value) return;

    ctx = gsap.context(() => {
        const tl = gsap.timeline({ 
            defaults: { ease: "power3.out" },
            onComplete: () => {
                // 动画完成后清除 GSAP 内联样式，确保 CSS Hover 生效
                gsap.set(".tech-chip, .btn-primary, .btn-secondary, .stat-card", { clearProps: "all" });
            }
        });

        // 初始状态设置 (防止 FOUC)
        gsap.set(".tech-chip", { y: -20, opacity: 0, scale: 0.9 });
        gsap.set(".hero-title-main", { y: 30, opacity: 0 });
        gsap.set(".hero-description", { y: 20, opacity: 0 });
        gsap.set(".command-bar-wrapper", { scale: 0.95, opacity: 0 });
        gsap.set(".hero-actions", { y: 20, opacity: 0 });
        gsap.set(".stat-card", { y: 40, opacity: 0 });

        // 1. Tech Chips (Top) - 优先展示
        tl.to(".tech-chip", {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.05
        });

        // 2. Title
        tl.to(".hero-title-main", {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out"
        }, "-=0.4");

        // 3. Subtitle
        tl.to(".hero-description", {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, "-=0.6");

        // 4. Command Bar
        tl.to(".command-bar-wrapper", {
            scale: 1,
            opacity: 1,
            duration: 0.8
        }, "-=0.4");

        // 5. Actions
        tl.to(".hero-actions", {
            y: 0,
            opacity: 1,
            duration: 0.6
        }, "-=0.4");

        // 6. Stats Cards
        tl.to(".stat-card", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05
        }, "-=0.4");

    }, heroRef.value);
};

onMounted(() => {
    // 稍微延迟确保渲染
    setTimeout(() => {
        initAnimations();
    }, 50);
});

onUnmounted(() => {
    ctx?.revert();
});
</script>

<template>
  <div ref="heroRef" class="portfolio-hero" :class="{ 'dark-mode': isDark }">
    <!-- Dynamic Background -->
    <div class="hero-bg">
        <div class="bg-glow glow-primary"></div>
        <div class="bg-glow glow-secondary"></div>
        <div class="bg-overlay"></div>
    </div>

    <!-- Butterflies Effect -->
    <div class="butterflies-container">
      <div class="butterfly-wrap b-wrap-1">
        <div class="butterfly">
          <div class="wing wing-left"></div>
          <div class="wing wing-right"></div>
        </div>
      </div>
      <div class="butterfly-wrap b-wrap-2">
        <div class="butterfly">
          <div class="wing wing-left"></div>
          <div class="wing wing-right"></div>
        </div>
      </div>
      <div class="butterfly-wrap b-wrap-3">
        <div class="butterfly">
          <div class="wing wing-left"></div>
          <div class="wing wing-right"></div>
        </div>
      </div>
      <div class="butterfly-wrap b-wrap-4">
        <div class="butterfly">
          <div class="wing wing-left"></div>
          <div class="wing wing-right"></div>
        </div>
      </div>
      <div class="butterfly-wrap b-wrap-5">
        <div class="butterfly">
          <div class="wing wing-left"></div>
          <div class="wing wing-right"></div>
        </div>
      </div>
    </div>

    <div class="hero-container">
      <!-- 1. Tech Stack Chips (Redesigned) -->
      <div class="tech-stacks">
        <div 
            v-for="item in techStacks" 
            :key="item.name" 
            class="tech-chip"
        >
            <div class="chip-glow"></div>
            <IconifyIconOnline :icon="item.icon" class="chip-icon" />
            <span class="chip-text">{{ item.name }}</span>
        </div>
      </div>

      <!-- 2. Main Title -->
      <div class="hero-title-main">
        <h1 class="title-line">
            <span class="gradient-text-theme">奇思妙想</span>
        </h1>
        <h1 class="title-line secondary">
            Design Intelligence
        </h1>
      </div>

      <!-- 3. Subtitle Description -->
      <p class="hero-description">
        A curated collection of my creative explorations, side projects, and digital experiments. 
        Where whimsical ideas meet deliberate design and code. Feel free to explore the gallery below.
      </p>

      <!-- 4. Command Line Search -->
      <div class="command-bar-wrapper">
        <div class="command-bar" :class="{ 'searching': isSearching }">
            <span class="cmd-prompt">$</span>
            <span class="cmd-command">portfolio search</span>
            <span class="cmd-arg">--keyword</span>
            <input 
                v-model="searchKeyword"
                @input="handleSearchInput"
                type="text" 
                class="cmd-input"
                placeholder="type something..."
                spellcheck="false"
            />
            <span class="cmd-cursor"></span>
        </div>
      </div>

      <!-- 5. Action Buttons -->
      <div class="hero-actions">
        <button class="btn-primary" @click="generateInspiration">
           <IconifyIconOnline icon="ri:magic-line" class="btn-icon" /> 灵感探索
        </button>
        <button class="btn-secondary" @click="scrollToGallery">
           探索作品集长廊 <IconifyIconOnline icon="ri:arrow-right-line" class="btn-icon" />
        </button>
      </div>

      <!-- 6. Bottom Stats -->
      <div class="stats-container">
        <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="stat-card"
        >
            <div class="stat-icon-wrapper">
                <IconifyIconOnline :icon="stat.icon" class="stat-icon" />
            </div>
            <div class="stat-number">{{ stat.count }}</div>
            <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0rem 1rem 4rem;
  background-color: var(--anzhiyu-background);
  transition: background-color 0.5s ease;
}

/* --- Dynamic Background --- */
.hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
}

.bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.4;
    transition: all 1s ease;
}

.glow-primary {
    top: -10%;
    left: 10%;
    width: 35vw;
    height: 35vw;
    background: var(--anzhiyu-theme);
    opacity: 0.3;
    filter: blur(80px);
    
    .dark-mode & {
         opacity: 0.2;
    }
}

.glow-secondary {
    bottom: -10%;
    right: 5%;
    width: 30vw;
    height: 30vw;
    background: #8b5cf6; /* Purple for contrast */
    opacity: 0.25;
    mix-blend-mode: normal;
    filter: blur(80px);

    .dark-mode & {
        background: #a78bfa;
        opacity: 0.2;
    }
}

.bg-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 0%, var(--anzhiyu-background) 100%);
    backdrop-filter: blur(40px); 
}

/* --- Blue/Purple Butterflies Effect --- */
.butterflies-container {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    overflow: hidden;
    perspective: 1000px;
}

.butterfly-wrap {
    position: absolute;
    width: 60px;
    height: 60px;
    transform-style: preserve-3d;
    filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.5));
}

.butterfly {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(55deg) rotateY(15deg) rotateZ(10deg);
}

.wing {
    position: absolute;
    top: 5px;
    width: 28px;
    height: 38px;
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.85) 0%, rgba(56, 189, 248, 0.85) 100%);
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.6);
    border-radius: 50% 50% 20% 80% / 80% 80% 20% 20%;
    opacity: 0.9;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}

.wing::after {
    content: '';
    position: absolute;
    bottom: -16px;
    width: 16px;
    height: 24px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.75) 0%, rgba(14, 165, 233, 0.75) 100%);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.5);
}

.wing-left {
    left: 2px;
    transform-origin: right center;
    animation: flap-l 0.15s ease-in-out infinite alternate;
}
.wing-left::after {
    right: 0;
    transform-origin: top right;
    transform: rotate(15deg);
}

.wing-right {
    left: 30px;
    border-radius: 50% 50% 80% 20% / 80% 80% 20% 20%;
    transform-origin: left center;
    animation: flap-r 0.15s ease-in-out infinite alternate;
}
.wing-right::after {
    left: 0;
    transform-origin: top left;
    transform: rotate(-15deg);
}

@keyframes flap-l {
    0% { transform: rotateY(0deg) rotateX(0deg); }
    100% { transform: rotateY(65deg) rotateX(5deg); }
}
@keyframes flap-r {
    0% { transform: rotateY(0deg) rotateX(0deg); }
    100% { transform: rotateY(-65deg) rotateX(5deg); }
}

/* Flight Paths */
.b-wrap-1 {
    bottom: 20%;
    left: 10%;
    animation: flight1 22s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}
.b-wrap-2 {
    top: 40%;
    right: 15%;
    animation: flight2 28s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    animation-delay: -7s;
}
.b-wrap-3 {
    top: 15%;
    left: 30%;
    animation: flight3 24s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    animation-delay: -14s;
}
.b-wrap-4 {
    top: 60%;
    left: 20%;
    animation: flight4 26s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    animation-delay: -3s;
}
.b-wrap-5 {
    bottom: 30%;
    right: 25%;
    animation: flight5 20s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    animation-delay: -11s;
}

@keyframes flight1 {
    0% { transform: translate(0, 0) scale(0.65) rotate(0deg); }
    25% { transform: translate(30vw, -45vh) scale(0.85) rotate(55deg); }
    50% { transform: translate(65vw, -10vh) scale(0.55) rotate(110deg); }
    75% { transform: translate(35vw, 15vh) scale(0.75) rotate(-35deg); }
    100% { transform: translate(0, 0) scale(0.65) rotate(0deg); }
}

@keyframes flight2 {
    0% { transform: translate(0, 0) scale(0.55) rotate(0deg); }
    33% { transform: translate(-35vw, -35vh) scale(0.75) rotate(-55deg); }
    66% { transform: translate(-55vw, 25vh) scale(0.45) rotate(65deg); }
    100% { transform: translate(0, 0) scale(0.55) rotate(0deg); }
}

@keyframes flight3 {
    0% { transform: translate(0, 0) scale(0.45) rotate(20deg); }
    33% { transform: translate(25vw, 35vh) scale(0.65) rotate(75deg); }
    66% { transform: translate(-25vw, 25vh) scale(0.5) rotate(135deg); }
    100% { transform: translate(0, 0) scale(0.45) rotate(380deg); }
}

@keyframes flight4 {
    0% { transform: translate(0, 0) scale(0.6) rotate(-10deg); }
    33% { transform: translate(45vw, -20vh) scale(0.8) rotate(45deg); }
    66% { transform: translate(15vw, -45vh) scale(0.5) rotate(-25deg); }
    100% { transform: translate(0, 0) scale(0.6) rotate(-10deg); }
}

@keyframes flight5 {
    0% { transform: translate(0, 0) scale(0.7) rotate(15deg); }
    33% { transform: translate(-25vw, -40vh) scale(0.9) rotate(-75deg); }
    66% { transform: translate(-45vw, 15vh) scale(0.6) rotate(35deg); }
    100% { transform: translate(0, 0) scale(0.7) rotate(15deg); }
}

/* --- Content Container --- */
.hero-container {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1100px;
    text-align: center;
    transform: scale(0.9); /* Global scale down to fit viewport */
    transform-origin: center center;
}

/* --- Tech Stacks (Redesigned) --- */
.tech-stacks {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 2rem; /* Reduced margin */
    width: 100%;
}

.tech-chip {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    /* Glassmorphism */
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    border-radius: 999px; /* Full Rounded (Pill) */
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--anzhiyu-fontcolor);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    /* Exclude transform from CSS transition to avoid conflict with GSAP */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: default;
    overflow: hidden;

    .dark-mode & {
         background: rgba(30, 41, 59, 0.4);
         border: 1px solid rgba(255, 255, 255, 0.08);
    }

    &:hover {
        transform: translateY(-4px) scale(1.05);
        background: rgba(255, 255, 255, 0.65);
        border-color: var(--anzhiyu-theme);
        color: var(--anzhiyu-theme);
        
        .dark-mode & {
             background: rgba(30, 41, 59, 0.7);
        }

        .chip-icon {
             color: var(--anzhiyu-theme);
             transform: scale(1.1) rotate(5deg);
        }
    }
}

.chip-icon {
    font-size: 1.25em;
    color: var(--anzhiyu-secondtext);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chip-text {
    position: relative;
    z-index: 1;
}

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800&family=Playfair+Display:ital,wght@1,700&display=swap');

/* --- Main Title --- */
.hero-title-main {
    margin-bottom: 1rem; /* Reduced margin */
}

.title-line {
    font-family: 'Outfit', sans-serif; /* Modern geometric sans */
    font-size: 5rem;
    font-weight: 800;
    line-height: 1.1;
    margin: 0;
    letter-spacing: -0.04em;
    color: var(--anzhiyu-fontcolor);
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

    &.secondary {
        font-family: 'Playfair Display', serif; /* Elegant serif for contrast */
        font-size: 4rem;
        font-style: italic;
        font-weight: 700;
        color: var(--anzhiyu-fontcolor);
        opacity: 0.9;
        letter-spacing: -0.02em;
    }
}

/* Gradients Text - Redesigned for Elegance */
.gradient-text-theme {
    background: linear-gradient(
        to right,
        var(--anzhiyu-theme) 0%,
        #a78bfa 30%, 
        var(--anzhiyu-main) 60%,
        var(--anzhiyu-theme) 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: text-flow 6s linear infinite;
}

@keyframes text-flow {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}

/* --- Description --- */
.hero-description {
    font-size: 1.15rem; /* Slightly smaller */
    color: var(--anzhiyu-secondtext);
    max-width: 680px;
    line-height: 1.6;
    margin-bottom: 2.5rem; /* Reduced margin */
}

/* --- Command Bar --- */
.command-bar-wrapper {
    position: relative;
    margin-bottom: 2.5rem; /* Reduced margin */
    width: 100%;
    max-width: 580px;
}

.command-bar {
    display: flex;
    align-items: center;
    background: var(--anzhiyu-card-bg);
    border-radius: 16px;
    padding: 18px 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    transition: all 0.3s ease;
    
    &.searching {
        border-color: var(--anzhiyu-theme);
        box-shadow: 0 10px 30px -5px rgba(var(--anzhiyu-theme-rgb, 64, 158, 255), 0.2);
    }
}

.cmd-prompt { color: var(--anzhiyu-theme); margin-right: 12px; font-weight: bold; }
.cmd-command { color: var(--anzhiyu-fontcolor); margin-right: 8px; font-weight: 600; }
.cmd-arg { color: var(--anzhiyu-secondtext); margin-right: 12px; }

.cmd-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--anzhiyu-fontcolor);
    font-family: inherit;
    font-size: inherit;
    outline: none;
    min-width: 100px;
    
    &::placeholder {
        color: var(--anzhiyu-secondtext);
        opacity: 0.5;
    }
}

.cmd-cursor {
    width: 8px;
    height: 18px;
    background: var(--anzhiyu-theme);
    animation: blink 1s step-end infinite;
}

@keyframes blink { 50% { opacity: 0; } }

/* --- Action Buttons --- */
.hero-actions {
    display: flex;
    gap: 1.25rem;
    margin-bottom: 3.5rem; /* Reduced margin */
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: var(--anzhiyu-theme);
    color: white;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(var(--anzhiyu-theme-rgb), 0.3);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    .btn-icon {
        font-size: 1.2rem;
        transition: transform 0.4s ease;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(var(--anzhiyu-theme-rgb), 0.45);
        
        .btn-icon {
            transform: scale(1.1) rotate(10deg);
        }
    }
}

.btn-secondary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: transparent;
    color: var(--anzhiyu-fontcolor);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 999px;
    border: 1px solid rgba(128, 128, 128, 0.2);
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    
    .btn-icon {
        font-size: 1.2rem;
        transition: transform 0.4s ease;
    }
    
    &:hover {
        background: rgba(var(--anzhiyu-theme-rgb), 0.05);
        border-color: var(--anzhiyu-theme);
        color: var(--anzhiyu-theme);
        transform: translateY(-4px);
        
        .btn-icon {
            transform: translateX(4px);
        }
    }
}

/* --- Stats Cards --- */
.stats-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    width: 100%;
}

.stat-card {
    background: var(--anzhiyu-card-bg);
    padding: 1.5rem;
    border-radius: 16px;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
    border: 1px solid transparent;
    transition: all 0.3s;
    
    &:hover {
        transform: translateY(-5px);
        border-color: var(--anzhiyu-theme);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        
        .stat-icon { color: var(--anzhiyu-theme); }
        .stat-number { color: var(--anzhiyu-theme); }
    }
}

.stat-icon-wrapper {
    margin-bottom: 1rem;
}

.stat-icon {
    font-size: 1.75rem;
    color: var(--anzhiyu-secondtext);
    transition: color 0.3s;
}

.stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: var(--anzhiyu-fontcolor);
    line-height: 1;
    margin-bottom: 0.5rem;
    transition: color 0.3s;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--anzhiyu-secondtext);
    font-weight: 500;
}

@media (max-width: 768px) {
    .portfolio-hero { padding: 6rem 1rem 3rem; }
    .title-line { font-size: 3rem; }
    .title-line.secondary { font-size: 2.5rem; }
    .tech-stacks { gap: 8px; }
    .tech-chip { padding: 6px 12px; font-size: 0.8rem; }
    .hero-actions { flex-direction: column; gap: 1rem; width: 100%; max-width: 320px; }
    .btn-primary, .btn-secondary { width: 100%; }
    .command-bar { padding: 14px 16px; flex-wrap: wrap; }
    .stat-card { flex: 1 1 40%; min-width: 120px; }
}
</style>
