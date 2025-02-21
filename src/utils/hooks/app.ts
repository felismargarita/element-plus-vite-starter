import type { VNode } from 'vue';
import { ref, onMounted } from 'vue';
import { createInjectionState } from '@vueuse/core';
import request from '../http';
import type { StandardMenuItem } from '../helpers/menu';
import { MenuUtils } from '../helpers/menu';
import * as services from '~/services/app';

const [useAppProvider, useAppConsumer] = createInjectionState(() => {
  const menuDom = ref<Array<VNode | null>>();
  const plainMenus = ref<StandardMenuItem[]>();

  const logout = () => {
    const parmas = window.location.href;
    const loginPath = `${import.meta.env.VITE_API_URL || ''}/logout?redirect_uri=${encodeURIComponent(parmas)}`;
    window.location.href = loginPath;
  };

  onMounted(async () => {
    const meResponse = await request(services.getMe);

    if (meResponse.success) {
      await Promise.all([
        request(services.getEnum, {
          onSuccess: false,
        }),
        request(services.getMenu, {
          onSuccess: (res) => {
            const menuUtils = new MenuUtils(
              res.obj?.menus || [],
              {
                path: 'url',
                title: 'menuName',
              },
              true,
            );
            const dom = menuUtils.getDom();
            const rawPlainMenus = menuUtils.getPlainMenus();
            menuDom.value = dom;
            plainMenus.value = rawPlainMenus;
          },
        }),
      ]);
    }
  });

  return {
    menuDom,
    plainMenus,
    logout,
  };
});

export { useAppProvider };
export { useAppConsumer };
