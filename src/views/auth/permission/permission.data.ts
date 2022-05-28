import { BasicColumn, FormSchema } from '/@/components/Table';
import { createVNode } from 'vue';
import Icon from '/@/components/Icon/src/Icon.vue';

/**
 * 查询条件
 */
export function searchFormSchema(): FormSchema[] {
  return [
    {
      field: 'title',
      label: '名称',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'code',
      label: '权限标识',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'path',
      label: '路径',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
}

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'title',
    fixed: 'left',
    align: 'left',
    width: 200,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 80,
    format: (_, record) => {
      if (record.icon) {
        return createVNode(Icon, { icon: record.icon });
      } else {
        return '';
      }
    },
  },
  {
    title: '权限标识',
    dataIndex: 'code',
    width: 200,
  },
  {
    title: 'path',
    dataIndex: 'path',
    width: 240,
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    width: 80,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 100,
    format: 'dict|permissionType',
    filters: 'dict|permissionType',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    format: 'dict|commonStatus',
    filters: 'dict|commonStatus',
  },
  {
    title: '显示',
    dataIndex: 'display',
    width: 100,
    format: 'dict|whether',
    filters: 'dict|whether',
  },
];
