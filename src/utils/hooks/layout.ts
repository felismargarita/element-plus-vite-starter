import { watch, ref, unref } from 'vue';
import { useBreakpoints, breakpointsSematic, createInjectionState } from '@vueuse/core';

const [useLayoutProvider, useLayoutConsumer] = createInjectionState(() => {
  const breakpoints = useBreakpoints(breakpointsSematic);

  const isSmallerThanTablet = breakpoints.smaller('tablet');

  /**
   * sider 收缩/展开 （仅在tablet以上显示器使用)
   */
  const collapse = ref<boolean>(unref(isSmallerThanTablet));

  /**
   * drawer 收缩/展开 (仅在tablet以下显示器使用)
   */
  const visible = ref<boolean>(false);

  watch(
    () => unref(isSmallerThanTablet),
    (curr, prev) => {
      if (curr === true && prev === false) {
        // 从大屏变成小屏
        visible.value = true;
      } else if (curr === false && prev === true) {
        // 从小屏变成大屏
        collapse.value = false;
      }
    },
  );

  const toggle = () => {
    if (unref(isSmallerThanTablet)) {
      visible.value = !visible.value;
    } else {
      collapse.value = !collapse.value;
    }
  };

  return {
    breakpoints,
    isSmallerThanTablet,
    collapse,
    visible,
    toggle,
  };
});

export { useLayoutProvider };
export { useLayoutConsumer };
