import { defineStore } from 'pinia';
import { store } from '/@/store';

import { SysDict, SysDictTree } from '/@/api/sys/model/sysDictModel';
import { selectAll } from '/@/api/sys/sysDict';
import { Nullable } from '/@/utils/types';
import { listToTree } from '/@/utils/helper/treeHelper';
import { isBlank } from '/@/utils/is';
import { TableFilterModel, TempSelectModel, TreeSelectModel } from '/@/api/model/selectModel';

interface DictState {
  isLoading: boolean;
  dict: {
    [key: string]: SysDict[];
  };
}

export const useDictStore = defineStore({
  id: 'sys-dict',
  state: (): DictState => ({
    isLoading: false,
    dict: {},
  }),
  getters: {
    /**
     * 根据字典类型获取字典数组
     */
    selectDictArray() {
      return (dictType: string): SysDict[] => {
        if (isBlank(dictType)) {
          return [];
        }
        return this.dict[dictType] || [];
      };
    },
    /**
     * 根据字典类型获取字典数组
     */
    selectDictFilters() {
      return (dictType: string): TableFilterModel[] => {
        if (isBlank(dictType)) {
          return [];
        }
        const dictArray = this.dict[dictType] || [];
        const dictFilters: TableFilterModel[] = [] as TableFilterModel[];
        dictArray.map((item) => {
          dictFilters.push({
            text: item.name,
            value: item.code,
          });
        });
        return dictFilters || [];
      };
    },
    /**
     * 根据字典类型获取字典树，用于级联
     */
    selectDictTree() {
      return (dictType: string): SysDictTree[] => {
        if (isBlank(dictType)) {
          return [] as SysDictTree[];
        }

        const dict = this.selectDictArray(dictType);
        return listToTree(dict, {
          id: 'code',
          children: 'children',
          pid: 'parentCode',
        }) as SysDictTree[];
      };
    },
    /**
     * 根据字典类型获取级联需要的数据
     */
    selectTree() {
      return (dictType: string): TreeSelectModel[] => {
        if (isBlank(dictType)) {
          return [] as TreeSelectModel[];
        }

        const selectArray: TempSelectModel[] = [] as TempSelectModel[];

        this.selectDictArray(dictType).map((item) => {
          const { code, parentCode, name } = item;
          selectArray.push({
            value: code,
            label: name,
            // @ts-ignore
            parentId: parentCode,
          });
        });

        return listToTree(selectArray, {
          id: 'value',
          pid: 'parentId',
          children: 'children',
        }) as TreeSelectModel[];
      };
    },

    getPath() {
      return (dictType: string, code: string): string[] => {
        const getParentPath = (array, path, code): string[] => {
          for (let i = 0; i < array.length; i++) {
            if (array[i].code === code) {
              if (array[i].parentCode) {
                path.push(array[i].parentCode);
                return getParentPath(array, path, array[i].parentCode);
              } else {
                return path;
              }
            }
          }
          return path;
        };

        if (isBlank(dictType) || isBlank(code)) {
          return [];
        }
        const dictArray = this.selectDictArray(dictType);

        return getParentPath(dictArray, [code], code).reverse();
      };
    },

    /**
     * 根据字典类型&和编码获取字典对象
     */
    getDict() {
      return (dictType: string, code: string): Nullable<SysDict> => {
        if (isBlank(dictType) || isBlank(code)) {
          return null;
        }
        const dictArray = this.selectDictArray(dictType);
        for (let i = 0; i < dictArray.length; i++) {
          if (dictArray[i].code === code) {
            return dictArray[i];
          }
        }
        return null;
      };
    },
  },
  actions: {
    setDict(dict: SysDict[]) {
      // 清空
      this.dict = {};
      dict.map((item) => {
        if (this.dict[item.dictType]) {
          this.dict[item.dictType].push(item);
        } else {
          this.dict[item.dictType] = [item];
        }
      });
    },

    /**
     * 初始化字典缓存
     *
     * @param force 是否强制更新
     * @param callback 回调
     */
    initDict(force = false, callback = () => {}) {
      if (!force && (this.isLoading || this.dict.length)) {
        // 已加载或加载中
        return;
      }
      this.isLoading = true;
      // 初始化字典数据
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
