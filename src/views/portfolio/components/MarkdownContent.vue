<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useLazyLoading } from "@/composables/useLazyLoading";
import "katex/dist/katex.min.css";

defineOptions({
  name: "MarkdownContent"
});

// Mermaid 缩放功能的清理函数
let mermaidCleanup: (() => void) | null = null;

// Mermaid 虚拟渲染（进入视口再注入 SVG）
let mermaidVirtualObserver: IntersectionObserver | null = null;

/**
 * 初始化 Mermaid 图表的缩放功能
 * 模拟 md-editor-v3 的行为，动态添加 action 按钮
 */
const initMermaidZoom = (container: HTMLElement) => {
  const mermaidContainers = container.matches(".md-editor-mermaid")
    ? [container]
    : Array.from(container.querySelectorAll(".md-editor-mermaid"));
  if (mermaidContainers.length === 0) return null;

  const removeEventsMap = new Map<
    Element,
    { removeEvent?: () => void; removeClick?: () => void }
  >();

  // Pin 图标 SVG
  const pinOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-off"><path d="M12 17v5"></path><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"></path><path d="m2 2 20 20"></path><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"></path></svg>`;
  const pinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin"><path d="M12 17v5"></path><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path></svg>`;

  // 添加缩放/平移事件
  const addZoomEvent = (mm: Element) => {
    const el = mm as HTMLElement;
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const updateTransform = () => {
      const svg = el.querySelector("svg");
      if (svg) {
        (svg as unknown as HTMLElement).style.transform =
          `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        (svg as unknown as HTMLElement).style.transformOrigin = "center center";
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      scale = Math.max(0.5, Math.min(3, scale + delta));
      updateTransform();
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      el.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    };

    const onMouseUp = () => {
      isDragging = false;
      el.style.cursor = "grab";
    };

    const onMouseLeave = () => {
      isDragging = false;
      el.style.cursor = "grab";
    };

    // 触摸事件支持
    let lastTouchDistance = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      } else if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = (distance - lastTouchDistance) * 0.01;
        scale = Math.max(0.5, Math.min(3, scale + delta));
        lastTouchDistance = distance;
        updateTransform();
      } else if (isDragging && e.touches.length === 1) {
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateTransform();
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      lastTouchDistance = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    el.style.cursor = "grab";
    el.style.overflow = "hidden";

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);

      // 重置变换
      const svg = el.querySelector("svg");
      if (svg) {
        (svg as unknown as HTMLElement).style.transform = "";
      }
      el.style.cursor = "";
      el.removeAttribute("data-grab");
    };
  };

  mermaidContainers.forEach(mm => {
    // 检查是否已有 action div
    let actionDiv = mm.querySelector(".md-editor-mermaid-action");
    if (
      !actionDiv &&
      mm.nextElementSibling?.classList.contains("md-editor-mermaid-action")
    ) {
      actionDiv = mm.nextElementSibling;
      mm.appendChild(actionDiv);
    }
    if (!actionDiv) {
      const div = document.createElement("div");
      div.className = "md-editor-mermaid-action";
      div.innerHTML = pinOffIcon;
      mm.appendChild(div);
      actionDiv = div;
    }

    const onClick = () => {
      const current = removeEventsMap.get(mm);
      if (current?.removeEvent) {
        current.removeEvent();
        mm.removeAttribute("data-grab");
        removeEventsMap.set(mm, { removeClick: current.removeClick });
        actionDiv!.innerHTML = pinOffIcon;
      } else {
        const removeEvent = addZoomEvent(mm);
        mm.setAttribute("data-grab", "");
        removeEventsMap.set(mm, {
          removeEvent,
          removeClick: current?.removeClick
        });
        actionDiv!.innerHTML = pinIcon;
      }
    };

    (actionDiv as HTMLElement).addEventListener("click", onClick);
    removeEventsMap.set(mm, {
      removeClick: () =>
        (actionDiv as HTMLElement).removeEventListener("click", onClick)
    });
  });

  // 返回清理函数
  return () => {
    removeEventsMap.forEach(({ removeEvent, removeClick }) => {
      removeEvent?.();
      removeClick?.();
    });
    removeEventsMap.clear();
  };
};

const props = defineProps({
  content: {
    type: String,
    default: ""
  },
  // Mermaid 虚拟渲染：原始 HTML（包含 SVG），用于按需 slice 注入
  rawContent: {
    type: String,
    default: ""
  },
  // Mermaid 虚拟渲染：id -> slice 索引
  mermaidBlocks: {
    type: Object as () => Record<string, { start: number; end: number }>,
    default: () => ({})
  }
});

// Fancybox 懒加载，避免影响首屏性能
let Fancybox: any = null;

const setupVirtualMermaid = (container: HTMLElement) => {
  // 清理旧 observer
  if (mermaidVirtualObserver) {
    mermaidVirtualObserver.disconnect();
    mermaidVirtualObserver = null;
  }

  if (!props.rawContent || !props.mermaidBlocks) return;
  const blockIds = Object.keys(props.mermaidBlocks);
  if (blockIds.length === 0) return;

  // 找到所有占位符
  const placeholders = container.querySelectorAll<HTMLElement>(
    '.md-editor-mermaid[data-mermaid-virtual="1"][data-mermaid-vid]'
  );
  if (placeholders.length === 0) return;

  mermaidVirtualObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const id = el.getAttribute("data-mermaid-vid") || "";
        const meta = props.mermaidBlocks?.[id];
        if (!meta) {
          mermaidVirtualObserver?.unobserve(el);
          return;
        }

        // 注入原始 mermaid 块 HTML（包含 SVG）
        const blockHtml = props.rawContent.slice(meta.start, meta.end);
        try {
          const range = document.createRange();
          range.selectNode(el);
          const frag = range.createContextualFragment(blockHtml);
          const newNode = frag.firstElementChild as HTMLElement | null;
          if (newNode) {
            el.replaceWith(newNode);
            // 为新注入的 mermaid 块补齐缩放 action
            const cleanupFn = initMermaidZoom(newNode);
            if (cleanupFn) {
              const prevCleanup = mermaidCleanup;
              mermaidCleanup = () => {
                prevCleanup?.();
                cleanupFn();
              };
            }
          } else {
            el.innerHTML = "";
          }
        } catch (e) {
          console.error("[MermaidVirtual] 注入失败:", e);
        } finally {
          mermaidVirtualObserver?.unobserve(el);
        }
      });
    },
    { rootMargin: "800px 0px", threshold: 0.01 }
  );

  placeholders.forEach(el => mermaidVirtualObserver?.observe(el));
};

// ========== Tip插件hover事件委托处理 ==========
let tipCleanupFns: (() => void)[] = [];

const initTipHoverEvents = (container: HTMLElement) => {
  // 清理之前的事件监听
  tipCleanupFns.forEach(fn => fn());
  tipCleanupFns = [];

  // 查找所有tip wrapper元素
  const tipWrappers = container.querySelectorAll(".anzhiyu-tip-wrapper");

  tipWrappers.forEach(wrapper => {
    const wrapperEl = wrapper as HTMLElement;
    const tipElement = wrapperEl.querySelector(".anzhiyu-tip") as HTMLElement;
    if (!tipElement) return;

    // 检查触发方式，只为hover触发的tip添加事件
    const trigger = tipElement.getAttribute("data-trigger");
    if (trigger === "click") return;

    // 获取延迟时间（毫秒），默认无延迟
    const delay = parseInt(tipElement.getAttribute("data-delay") || "0", 10);

    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const showTip = () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      showTimer = setTimeout(() => {
        tipElement.style.visibility = "visible";
        tipElement.style.opacity = "1";
        tipElement.dataset.visible = "true";
      }, delay);
    };

    const hideTip = () => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      hideTimer = setTimeout(() => {
        tipElement.style.visibility = "hidden";
        tipElement.style.opacity = "0";
        tipElement.dataset.visible = "false";
      }, 100);
    };

    wrapperEl.addEventListener("mouseenter", showTip);
    wrapperEl.addEventListener("mouseleave", hideTip);

    tipCleanupFns.push(() => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
      wrapperEl.removeEventListener("mouseenter", showTip);
      wrapperEl.removeEventListener("mouseleave", hideTip);
    });
  });
};

const cleanupTipHoverEvents = () => {
  tipCleanupFns.forEach(fn => fn());
  tipCleanupFns = [];
};

// 初始化懒加载
const { initLazyLoading, reinitialize, cleanup } = useLazyLoading({
  rootMargin: "100px",
  threshold: 0.1,
  showLoading: true
});

const contentRef = ref<HTMLElement | null>(null);

// 内容点击事件处理 - Tip插件
const handleContentClick = (event: Event) => {
  const target = event.target as HTMLElement;

  const tipWrapper = target.closest(".anzhiyu-tip-wrapper") as HTMLElement;
  if (tipWrapper) {
    const tipElement = tipWrapper.querySelector(".anzhiyu-tip") as HTMLElement;
    if (
      (tipElement && tipWrapper.classList.contains("tip-click")) ||
      tipElement?.getAttribute("data-trigger") === "click"
    ) {
      event.preventDefault();
      event.stopPropagation();
      if (tipElement.style.visibility === "visible") {
        tipElement.style.visibility = "hidden";
        tipElement.style.opacity = "0";
      } else {
        tipElement.style.visibility = "visible";
        tipElement.style.opacity = "1";
      }
    }
    return;
  }
};

onMounted(async () => {
  if (contentRef.value) {
    contentRef.value.addEventListener("click", handleContentClick);

    // 初始化懒加载
    initLazyLoading(contentRef.value);

    // 初始化 Mermaid 缩放功能
    mermaidCleanup = initMermaidZoom(contentRef.value);

    // 初始化 Mermaid 虚拟渲染
    setupVirtualMermaid(contentRef.value);

    // 懒加载 Fancybox
    if (!Fancybox) {
      const fancyboxModule = await import("@fancyapps/ui");
      await import("@fancyapps/ui/dist/fancybox/fancybox.css");
      Fancybox = fancyboxModule.Fancybox;
    }

    Fancybox.bind(contentRef.value, "img:not(a img)", {
      groupAll: true
    });
  }

  // 初始化Tip插件的hover事件委托
  await nextTick();
  if (contentRef.value) {
    initTipHoverEvents(contentRef.value);
  }
});

onUnmounted(() => {
  if (contentRef.value) {
    contentRef.value.removeEventListener("click", handleContentClick);
    if (Fancybox) {
      Fancybox.unbind(contentRef.value);
      Fancybox.close(true);
    }
  }
  // 清理 Mermaid 缩放功能
  if (mermaidCleanup) {
    mermaidCleanup();
    mermaidCleanup = null;
  }
  // 清理 Mermaid 虚拟渲染 observer
  if (mermaidVirtualObserver) {
    mermaidVirtualObserver.disconnect();
    mermaidVirtualObserver = null;
  }
  // 清理懒加载资源
  cleanup();
  // 清理Tip插件hover事件
  cleanupTipHoverEvents();
});

// 监听内容变化，重新初始化
watch(
  () => props.content,
  async () => {
    if (contentRef.value) {
      setTimeout(async () => {
        if (contentRef.value) {
          reinitialize(contentRef.value);
          // 重新初始化 Mermaid 缩放功能
          if (mermaidCleanup) {
            mermaidCleanup();
          }
          mermaidCleanup = initMermaidZoom(contentRef.value);
          // 重新初始化 Mermaid 虚拟渲染
          await nextTick();
          setupVirtualMermaid(contentRef.value);
          // 重新绑定 Fancybox
          if (Fancybox) {
            Fancybox.unbind(contentRef.value);
            Fancybox.bind(contentRef.value, "img:not(a img)", {
              groupAll: true
            });
          }
          // 重新初始化Tip插件hover事件
          initTipHoverEvents(contentRef.value);
        }
      }, 100);
    }
  }
);
</script>

<template>
  <div
    ref="contentRef"
    class="post-content"
    v-html="content"
  />
</template>

<style lang="scss">
// 使用公共的文章内容样式
@use "@/style/post-content.scss";

// 代码高亮样式（One Dark 主题）- 与 PostContent 保持一致
.md-editor-code {
  pre code.hljs {
    display: block;
    padding: 1em;
    overflow-x: auto;
  }

  code.hljs {
    padding: 3px 5px;
  }

  .hljs {
    color: #abb2bf;
    background: #282c34;
  }

  .hljs-comment,
  .hljs-quote {
    font-style: italic;
    color: #5c6370;
  }

  .hljs-doctag,
  .hljs-formula,
  .hljs-keyword {
    color: #c678dd;
  }

  .hljs-deletion,
  .hljs-name,
  .hljs-section,
  .hljs-selector-tag,
  .hljs-subst {
    color: #e06c75;
  }

  .hljs-literal {
    color: #56b6c2;
  }

  .hljs-addition,
  .hljs-attribute,
  .hljs-meta .hljs-string,
  .hljs-regexp,
  .hljs-string {
    color: #98c379;
  }

  .hljs-attr,
  .hljs-number,
  .hljs-selector-attr,
  .hljs-selector-class,
  .hljs-selector-pseudo,
  .hljs-template-variable,
  .hljs-type,
  .hljs-variable {
    color: #d19a66;
  }

  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-symbol,
  .hljs-title {
    color: #61aeee;
  }

  .hljs-built_in,
  .hljs-class .hljs-title,
  .hljs-title.class_ {
    color: #e6c07b;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: 700;
  }

  .hljs-link {
    text-decoration: underline;
  }
}
</style>
