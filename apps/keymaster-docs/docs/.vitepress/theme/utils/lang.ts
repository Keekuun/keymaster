import { computed } from 'vue';
import { useRoute } from 'vitepress';

/**
 * 检测当前是否为中文路径
 */
export function useIsZh() {
  const route = useRoute();
  return computed(() => route.path.startsWith('/zh/'));
}
