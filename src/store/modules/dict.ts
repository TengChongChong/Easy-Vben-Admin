import { defineStore } from 'pinia';
import { store } from '/@/store';

// import { SYS_DICT_KEY } from '/@/enums/cacheEnum';
// import { createLocalStorage } from '/@/utils/cache';
import { SysDict } from '/@/api/sys/model/sysDictModel';
import { selectAll } from '/@/api/sys/sysDict';
import { Nullable } from '/@/utils/types';

// const ls = createLocalStorage();

interface DictState {
  isLoading: boolean;
  dictArray: SysDict[];
}

export const useDictStore = defineStore({
  id: 'sys-dict',
  state: (): DictState => ({
    isLoading: false,
    dictArray: [],
  }),
  getters: {
    selectDictArray() {
      return (dictType: string) => {
        return this.dictArray.filter((item) => {
          return item.dictType === dictType;
        }) as SysDict[];
      };
    },
    getDict() {
      return (dictType: string, value: string): Nullable<SysDict> => {
        for (let i = 0; i < this.dictArray.length; i++) {
          if (this.dictArray[i].dictType === dictType && this.dictArray[i].code === value) {
            return this.dictArray[i];
          }
        }
        return null;
      };
    },
  },
  actions: {
    setDict(dictArray: SysDict[]) {
      this.dictArray = dictArray;
      // ls.set(SYS_DICT_KEY, this.dictArray);
    },

    /**
     * 初始化字典缓存
     *
     * @param force 是否强制更新
     * @param callback 回调
     */
    initDict(force = false, callback = () => {}) {
      if (!force && (this.isLoading || this.dictArray.length)) {
        // 已加载或加载中
        return;
      }
      this.isLoading = true;
      // 初始化字典数据
      console.log('初始化字典数据');
      selectAll().then((data) => {
        this.setDict(data);
        callback();
      });
    },
  },
});

// Need to be used outside the setup
export function useDictStoreWithOut() {
  return useDictStore(store);
}
