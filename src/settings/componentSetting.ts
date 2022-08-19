// 用于配置某些组件的常规配置，而无需修改组件

import type { SorterResult } from '../components/Table';
import { isArray } from '/@/utils/is';

export default {
  // 表格配置
  table: {
    // 表格接口请求通用配置，可在组件prop覆盖
    // 支持 xxx.xxx.xxx格式
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'current',
      // 传给后台的每页显示多少条的字段
      sizeField: 'pageSize',
      // 接口返回表格数据的字段
      listField: 'records',
      // 接口返回表格总数的字段
      totalField: 'total',
    },
    // 可选的分页选项
    pageSizeOptions: ['10', '20', '30', '40', '50', '80', '100'],
    //默认每页显示多少条
    defaultPageSize: 10,
    // 默认尺寸
    defaultSize: 'middle',
    // 默认排序方法
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field, order, column } = sortInfo;
      if (field && order) {
        return {
          // 排序字段
          // @ts-ignore
          sortField: column.sortField || field,
          // 排序方式 asc/desc
          sortOrder: order,
        };
      } else {
        return {};
      }
    },
    // 自定义过滤方法
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      // ! 这里强制将数组使用,拼接
      if (data) {
        for (const key in data) {
          if (isArray(data[key])) {
            // @ts-ignore
            data[key] = data[key].join(',');
          }
        }
      }
      return data;
    },
  },
  // 滚动组件配置
  scrollbar: {
    // 是否使用原生滚动样式
    // 开启后，菜单，对话框，抽屉会使用原生滚动条组件
    native: false,
  },
};
