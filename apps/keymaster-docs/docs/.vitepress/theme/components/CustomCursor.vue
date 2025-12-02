<template>
  <div class="custom-cursor">
    <div ref="cursorDot" class="cursor-dot" :class="{ 'cursor-keyboard': showKeyboardIcon }">
      <svg
        v-if="showKeyboardIcon"
        class="keyboard-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h0M10 10h0M14 10h0M18 10h0" />
      </svg>
    </div>
    <div ref="cursorOutline" class="cursor-outline"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const cursorDot = ref<HTMLDivElement | null>(null);
const cursorOutline = ref<HTMLDivElement | null>(null);
const showKeyboardIcon = ref(false);

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;
let animationId: number | null = null;

function handleMouseMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursorDot.value) {
    cursorDot.value.style.left = `${mouseX}px`;
    cursorDot.value.style.top = `${mouseY}px`;
  }
}

function animate() {
  // 平滑跟随效果
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;

  if (cursorOutline.value) {
    cursorOutline.value.style.left = `${outlineX}px`;
    cursorOutline.value.style.top = `${outlineY}px`;
  }

  animationId = requestAnimationFrame(animate);
}

function handleMouseEnter(e: MouseEvent) {
  const target = e.target as HTMLElement;

  // 检查是否是链接、按钮或可交互元素
  const isInteractive =
    target.tagName === 'A' ||
    target.tagName === 'BUTTON' ||
    target.closest('a') ||
    target.closest('button') ||
    target.closest('.km-button-primary') ||
    target.closest('.km-button-secondary') ||
    target.closest('kbd') ||
    target.closest('code');

  // 检查是否是代码块或键盘相关元素
  const isKeyboardRelated =
    target.closest('kbd') ||
    target.closest('code') ||
    target.closest('.shortcut-demo') ||
    target.closest('.scoped-demo') ||
    target.closest('.editor-mode-demo');

  if (isInteractive) {
    cursorDot.value?.classList.add('cursor-hover');
    cursorOutline.value?.classList.add('cursor-hover');
  } else {
    cursorDot.value?.classList.remove('cursor-hover');
    cursorOutline.value?.classList.remove('cursor-hover');
  }

  // 在键盘相关元素上显示键盘图标
  showKeyboardIcon.value = !!isKeyboardRelated;
}

onMounted(() => {
  // 隐藏默认光标
  document.body.style.cursor = 'none';

  // 添加鼠标事件监听
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseenter', handleMouseEnter, true);
  document.addEventListener('mouseleave', handleMouseEnter, true);

  // 启动动画
  animate();

  // 初始化位置
  if (cursorDot.value && cursorOutline.value) {
    cursorDot.value.style.left = `${mouseX}px`;
    cursorDot.value.style.top = `${mouseY}px`;
    cursorOutline.value.style.left = `${mouseX}px`;
    cursorOutline.value.style.top = `${mouseY}px`;
  }
});

onBeforeUnmount(() => {
  // 恢复默认光标
  document.body.style.cursor = '';

  // 移除事件监听
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseenter', handleMouseEnter, true);
  document.removeEventListener('mouseleave', handleMouseEnter, true);

  // 停止动画
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}

.cursor-dot,
.cursor-outline {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.cursor-dot.cursor-keyboard {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #6366f1, #ec4899, #f97316);
  border-radius: 6px;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.7);
}

.keyboard-icon {
  width: 14px;
  height: 14px;
  color: white;
  display: block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.cursor-outline {
  width: 40px;
  height: 40px;
  border: 2px solid;
  border-image: linear-gradient(135deg, #6366f1, #ec4899, #f97316) 1;
  background: transparent;
  z-index: 9999;
  opacity: 0.6;
}

.cursor-dot.cursor-hover {
  transform: translate(-50%, -50%) scale(1.5);
  background: linear-gradient(135deg, #f97316, #ec4899);
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.6);
}

.cursor-outline.cursor-hover {
  transform: translate(-50%, -50%) scale(1.5);
}

.cursor-outline.cursor-hover {
  border-image: linear-gradient(135deg, #f97316, #ec4899, #6366f1) 1;
  opacity: 0.8;
}

/* 移动端和触摸设备隐藏自定义光标 */
@media (max-width: 768px), (pointer: coarse) {
  .custom-cursor {
    display: none;
  }

  body {
    cursor: auto !important;
  }
}

/* 深色模式适配 */
:deep(.dark) .custom-cursor {
  mix-blend-mode: normal;
}

:deep(.dark) .cursor-dot {
  background: linear-gradient(135deg, #818cf8, #f472b6);
  box-shadow: 0 0 15px rgba(129, 140, 248, 0.6);
}

:deep(.dark) .cursor-outline {
  border-image: linear-gradient(135deg, #818cf8, #f472b6, #fb923c) 1;
  opacity: 0.7;
}
</style>
