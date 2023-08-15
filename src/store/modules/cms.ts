import { defineStore } from 'pinia';
import { store } from '/@/store';

import { Nullable } from '/@/utils/types';
import { CmsSite } from '/@/api/cms/model/cmsSiteModel';
import { message } from 'ant-design-vue';
import { setUserActiveSite } from '/@/api/cms/cmsSite';

interface CmsState {
  currentSite: Nullable<CmsSite>;
}

export const useCmsStore = defineStore({
  id: 'cms',
  state: (): CmsState => ({
    currentSite: null,
  }),
  getters: {
    /**
     * 根据字典类型获取字典数组
     */
    getCurrentSite(): Nullable<CmsSite> {
      return this.currentSite;
    },
  },
  actions: {
    /**
     * 设置当前选中站点
     */
    setCurrentSite(site: CmsSite) {
      if (site.id !== this.currentSite?.id) {
        setUserActiveSite(site).then(() => {
          this.currentSite = site;
          message.success(`当前编辑站点已切换至：${site.name}`);
        });
      }
    },
    clearCurrentSite() {
      this.currentSite = null;
    },
  },
});

// Need to be used outside the setup
export function useCmsStoreWithOut() {
  return useCmsStore(store);
}
