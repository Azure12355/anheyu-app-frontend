<script setup lang="ts">
import { ref, watch } from "vue";
import { debounce } from "lodash-es";

defineOptions({
  name: "PortfolioSearch"
});

const props = defineProps<{
  keyword?: string;
}>();

const emit = defineEmits<{
  (e: "search", keyword: string): void;
}>();

const searchKeyword = ref(props.keyword || "");

// 防抖搜索
const debouncedSearch = debounce((keyword: string) => {
  emit("search", keyword);
}, 300);

// 监听输入变化
watch(searchKeyword, newKeyword => {
  debouncedSearch(newKeyword);
});

// 监听外部 keyword 变化
watch(
  () => props.keyword,
  newKeyword => {
    if (newKeyword !== searchKeyword.value) {
      searchKeyword.value = newKeyword;
    }
  }
);

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = "";
};
</script>

<template>
  <div class="portfolio-search">
    <div class="search-container">
      <i class="anzhiyufont anzhiyu-icon-magnifying-glass search-icon" />
      <input
        v-model="searchKeyword"
        type="text"
        class="search-input"
        placeholder="搜索作品标题、描述或技术栈..."
        autocomplete="off"
      />
      <button v-if="searchKeyword" class="clear-btn" @click="clearSearch">
        <i class="anzhiyufont anzhiyu-icon-xmark" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-search {
  margin-bottom: 1.5rem;
  animation: slide-in 0.6s 0.3s backwards;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.1rem;
  color: var(--anzhiyu-secondtext);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem;
  font-size: 1rem;
  color: var(--anzhiyu-fontcolor);
  background: var(--anzhiyu-card-bg);
  border: var(--style-border);
  border-radius: 25px;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--anzhiyu-secondtext);
  }

  &:focus {
    border-color: var(--anzhiyu-main);
    box-shadow: 0 0 0 3px var(--anzhiyu-theme-op);
  }
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--anzhiyu-secondtext);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: var(--anzhiyu-fontcolor);
    background: var(--anzhiyu-secondbg);
  }

  .anzhiyufont {
    font-size: 0.9rem;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
