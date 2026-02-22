<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useSiteConfigStore } from "@/store/modules/siteConfig";
import { ElMessage } from "element-plus";
import type { BackendAboutPageConfig } from "@/types/about";

// 组件导入
import AuthorBox from "./components/AuthorBox.vue";
import AuthorPageContent from "./components/AuthorPageContent.vue";
import SkillsCard from "./components/SkillsCard.vue";
import CareersCard from "./components/CareersCard.vue";
import StatisticCard from "./components/StatisticCard.vue";
import MapAndInfoCard from "./components/MapAndInfoCard.vue";
import PersonalityCard from "./components/PersonalityCard.vue";
import PhotoCard from "./components/PhotoCard.vue";
import MaximCard from "./components/MaximCard.vue";
import BuffCard from "./components/BuffCard.vue";
import GameCard from "./components/GameCard.vue";
import ComicCard from "./components/ComicCard.vue";
import LikeTechCard from "./components/LikeTechCard.vue";
import MusicCard from "./components/MusicCard.vue";
import PostComment from "@/views/post/components/PostComment/index.vue";

defineOptions({
  name: "PostAbout"
});

const siteConfigStore = useSiteConfigStore();
const aboutConfig = ref<BackendAboutPageConfig | null>(null);
const isLoading = ref(true);
const customCodeHtml = ref<string>("");

// 获取板块开关配置（存储在 enable 子对象中）
const enableConfig = computed(() => {
  const config = siteConfigStore.getSiteConfig?.about?.page?.enable;
  return {
    author_box: config?.author_box !== false,
    page_content: config?.page_content !== false,
    skills: config?.skills !== false,
    careers: config?.careers !== false,
    statistic: config?.statistic !== false,
    map_and_info: config?.map_and_info !== false,
    personality: config?.personality !== false,
    photo: config?.photo !== false,
    maxim: config?.maxim !== false,
    buff: config?.buff !== false,
    game: config?.game !== false,
    comic: config?.comic !== false,
    like_tech: config?.like_tech !== false,
    music: config?.music !== false,
    custom_code: config?.custom_code !== false,
    comment: config?.comment !== false
  };
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const config = siteConfigStore.getSiteConfig?.about?.page;

    if (config) {
      aboutConfig.value = config;

      // 加载自定义 HTML 内容块
      if (config.custom_code_html) {
        customCodeHtml.value = config.custom_code_html;
      }
    } else {
      ElMessage.error("获取关于页面配置失败，请检查后端配置或联系管理员");
    }
  } catch (error) {
    console.error("Failed to load about config:", error);
    ElMessage.error("加载关于页面配置时发生错误，请稍后重试");
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="about-page-wrapper">
    <!-- Butterflies Effect -->
    <div class="butterflies-container">
      <div class="butterfly-wrap b-wrap-1">
        <div class="butterfly"><div class="wing wing-left"></div><div class="wing wing-right"></div></div>
      </div>
      <div class="butterfly-wrap b-wrap-2">
        <div class="butterfly"><div class="wing wing-left"></div><div class="wing wing-right"></div></div>
      </div>
      <div class="butterfly-wrap b-wrap-3">
        <div class="butterfly"><div class="wing wing-left"></div><div class="wing wing-right"></div></div>
      </div>
      <div class="butterfly-wrap b-wrap-4">
        <div class="butterfly"><div class="wing wing-left"></div><div class="wing wing-right"></div></div>
      </div>
      <div class="butterfly-wrap b-wrap-5">
        <div class="butterfly"><div class="wing wing-left"></div><div class="wing wing-right"></div></div>
      </div>
    </div>

    <div v-if="aboutConfig" class="about-container">
      <!-- 作者头像框 -->
    <AuthorBox
      v-if="enableConfig.author_box"
      :avatar-img="aboutConfig.avatar_img"
      :avatar-skills="{
        left: aboutConfig.avatar_skills_left,
        right: aboutConfig.avatar_skills_right
      }"
    />

    <div class="author-title">关于本站</div>

    <!-- 基础介绍内容 -->
    <AuthorPageContent
      v-if="enableConfig.page_content"
      :name="aboutConfig.name"
      :description="aboutConfig.description"
      :about-site-tips="aboutConfig.about_site_tips"
    />

    <!-- 技能和职业经历 -->
    <div
      v-if="enableConfig.skills || enableConfig.careers"
      class="author-content"
    >
      <SkillsCard
        v-if="enableConfig.skills"
        :skills-tips="aboutConfig.skills_tips"
      />
      <CareersCard v-if="enableConfig.careers" :careers="aboutConfig.careers" />
    </div>

    <!-- 访问统计和地图信息 -->
    <div
      v-if="enableConfig.statistic || enableConfig.map_and_info"
      class="author-content"
    >
      <StatisticCard
        v-if="enableConfig.statistic"
        :cover="aboutConfig.statistics_background"
      />
      <MapAndInfoCard
        v-if="enableConfig.map_and_info"
        :map="aboutConfig.map"
        :self-info="aboutConfig.self_info"
      />
    </div>

    <!-- 性格和照片 -->
    <div
      v-if="enableConfig.personality || enableConfig.photo"
      class="author-content"
    >
      <PersonalityCard
        v-if="enableConfig.personality"
        :personalities="aboutConfig.personalities"
      />
      <PhotoCard
        v-if="enableConfig.photo"
        :photo-url="aboutConfig.personalities.photoUrl"
      />
    </div>

    <!-- 格言和特长 -->
    <div v-if="enableConfig.maxim || enableConfig.buff" class="author-content">
      <MaximCard v-if="enableConfig.maxim" :maxim="aboutConfig.maxim" />
      <BuffCard v-if="enableConfig.buff" :buff="aboutConfig.buff" />
    </div>

    <!-- 游戏和漫画 -->
    <div v-if="enableConfig.game || enableConfig.comic" class="author-content">
      <GameCard v-if="enableConfig.game" :game="aboutConfig.game" />
      <ComicCard v-if="enableConfig.comic" :comic="aboutConfig.comic" />
    </div>

    <!-- 技术和音乐 -->
    <div
      v-if="enableConfig.like_tech || enableConfig.music"
      class="author-content"
    >
      <LikeTechCard v-if="enableConfig.like_tech" :like="aboutConfig.like" />
      <MusicCard
        v-if="enableConfig.music"
        :music="aboutConfig.music"
        :author-name="aboutConfig.name"
      />
    </div>

    <!-- 自定义内容块 -->
    <div
      v-if="customCodeHtml && enableConfig.custom_code"
      class="custom-content-block"
      v-html="customCodeHtml"
    />

    <!-- 评论板块 -->
    <div v-if="enableConfig.comment" class="author-content">
      <div class="author-content-item single comment-section">
        <PostComment target-path="/about" />
      </div>
    </div>
  </div>

    <div v-else class="loading-container">
      <div class="loading">加载中...</div>
    </div>
  </div>
</template>

<style lang="scss">
.about-page-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 1;
  overflow: hidden;
}

.about-container {
  animation: slide-in 0.6s 0.2s backwards;
  max-width: 1400px;
  padding: 0.5rem;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.author-title {
  padding-left: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--anzhiyu-fontcolor);
}

.author-content {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  @media screen and (width <= 768px) {
    flex-direction: column;
  }
}

.custom-content-block {
  padding: 1rem;
  margin-top: 0.5rem;
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 12px;

  // 继承 markdown 样式
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: var(--anzhiyu-fontcolor);
  }

  :deep(p) {
    margin-bottom: 1em;
    line-height: 1.7;
    color: var(--anzhiyu-secondtext);
  }

  :deep(a) {
    color: var(--anzhiyu-theme);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }

  :deep(li) {
    margin-bottom: 0.5em;
    color: var(--anzhiyu-secondtext);
  }

  :deep(code) {
    padding: 0.2em 0.4em;
    font-family:
      SFMono-Regular,
      Consolas,
      Liberation Mono,
      Menlo,
      monospace;
    font-size: 0.9em;
    background: var(--anzhiyu-card-bg-grey);
    border-radius: 4px;
  }

  :deep(pre) {
    padding: 1em;
    margin-bottom: 1em;
    overflow-x: auto;
    background: var(--anzhiyu-card-bg-grey);
    border-radius: 8px;

    code {
      padding: 0;
      background: transparent;
    }
  }

  :deep(blockquote) {
    padding: 0.5em 1em;
    margin: 1em 0;
    color: var(--anzhiyu-secondtext);
    border-left: 4px solid var(--anzhiyu-theme);
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  :deep(hr) {
    margin: 1.5em 0;
    border: none;
    border-top: 1px solid var(--anzhiyu-card-border);
  }

  :deep(table) {
    width: 100%;
    margin-bottom: 1em;
    border-collapse: collapse;

    th,
    td {
      padding: 0.5em;
      border: 1px solid var(--anzhiyu-card-border);
    }

    th {
      font-weight: 600;
      background: var(--anzhiyu-card-bg-grey);
    }
  }

  // 支持折叠块样式
  :deep(.folding-tag) {
    margin: 1em 0;
    border: var(--style-border);
    border-radius: 8px;

    summary {
      padding: 0.75em 1em;
      font-weight: 500;
      cursor: pointer;
      background: var(--anzhiyu-card-bg-grey);
      border-radius: 8px 8px 0 0;

      &:hover {
        background: var(--anzhiyu-main-op-light);
      }
    }

    &[open] summary {
      border-bottom: var(--style-border);
      border-radius: 8px 8px 0 0;
    }

    .content {
      padding: 1em;
    }
  }
}

.comment-section {
  width: 100%;

  :deep(#post-comment) {
    margin-bottom: 0;
  }
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;

  .loading {
    font-size: 1.2rem;
    color: var(--anzhiyu-secondtext);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Blue/Purple Butterflies Effect --- */
.butterflies-container {
    position: fixed;
    inset: 0;
    z-index: 0; /* Behind content */
    pointer-events: none;
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

</style>
