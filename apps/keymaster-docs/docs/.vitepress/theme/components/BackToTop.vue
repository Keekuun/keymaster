<template>
  <Transition name="back-to-top">
    <button v-if="visible" class="back-to-top" @click="scrollToTop" aria-label="Back to top">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const visible = ref(false);
let scrollHandler: (() => void) | null = null;

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function handleScroll() {
  visible.value = window.scrollY > 300;
}

onMounted(() => {
  scrollHandler = handleScroll;
  window.addEventListener('scroll', scrollHandler, { passive: true });
  handleScroll(); // 初始检查
});

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
  }
});
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 100;
  padding: 0;
}

.back-to-top:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.back-to-top:active {
  transform: translateY(0);
}

.back-to-top svg {
  width: 24px;
  height: 24px;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 44px;
    height: 44px;
  }

  .back-to-top svg {
    width: 20px;
    height: 20px;
  }
}
</style>
