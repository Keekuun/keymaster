<template>
  <div class="visual-effects">
    <!-- 粒子背景 -->
    <canvas ref="particlesCanvas" class="particles-canvas"></canvas>

    <!-- 渐变装饰 -->
    <div class="gradient-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const particlesCanvas = ref<HTMLCanvasElement | null>(null);
let animationId: number | null = null;
let particles: Array<{
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}> = [];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 100, g: 108, b: 255 }; // 默认品牌色
}

function initParticles() {
  if (!particlesCanvas.value) return;

  const canvas = particlesCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 创建粒子
  const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.4, // 提高透明度：0.4-0.8
    });
  }

  function animate() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制粒子
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // 使用渐变色数组（彩虹渐变）
      const colors = [
        { r: 99, g: 102, b: 241 }, // 蓝色
        { r: 236, g: 72, b: 153 }, // 粉色
        { r: 249, g: 115, b: 22 }, // 橙色
        { r: 34, g: 197, b: 94 }, // 绿色
        { r: 168, g: 85, b: 247 }, // 紫色
        { r: 59, g: 130, b: 246 }, // 亮蓝色
      ];

      // 根据粒子位置选择颜色（创建渐变效果）
      const colorIndex = Math.floor((particle.x / canvas.width) * colors.length) % colors.length;
      const color = colors[colorIndex];

      // 绘制粒子（使用渐变色，提高透明度）
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 2,
      );
      gradient.addColorStop(
        0,
        `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity * 0.8})`,
      );
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 绘制连线（使用渐变色，提高透明度）
      particles.forEach((other) => {
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const otherColorIndex =
            Math.floor((other.x / canvas.width) * colors.length) % colors.length;
          const otherColor = colors[otherColorIndex];

          // 创建渐变连线
          const lineGradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
          const opacity = 0.3 * (1 - distance / 150);
          lineGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
          lineGradient.addColorStop(
            1,
            `rgba(${otherColor.r}, ${otherColor.g}, ${otherColor.b}, ${opacity})`,
          );

          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = lineGradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();

  return () => {
    window.removeEventListener('resize', resizeCanvas);
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  };
}

let cleanup: (() => void) | undefined;

onMounted(() => {
  cleanup = initParticles();
});

onBeforeUnmount(() => {
  if (cleanup) cleanup();
});
</script>

<style scoped>
.visual-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.gradient-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.4) 0%,
    rgba(236, 72, 153, 0.3) 50%,
    transparent 100%
  );
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(249, 115, 22, 0.4) 0%,
    rgba(168, 85, 247, 0.3) 50%,
    transparent 100%
  );
  bottom: -150px;
  right: -150px;
  animation-delay: -7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(
    circle,
    rgba(34, 197, 94, 0.35) 0%,
    rgba(59, 130, 246, 0.3) 50%,
    transparent 100%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* 深色模式适配 */
:deep(.dark) .gradient-orb {
  opacity: 0.5;
}

:deep(.dark) .particles-canvas {
  opacity: 0.7;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .orb-1,
  .orb-2,
  .orb-3 {
    width: 200px;
    height: 200px;
  }

  .orb-1 {
    top: -100px;
    left: -100px;
  }

  .orb-2 {
    bottom: -100px;
    right: -100px;
  }
}
</style>
