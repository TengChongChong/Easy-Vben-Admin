import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '模板名称',
    component: 'Input',
  },
  {
    field: 'importCode',
    label: '模板代码',
    component: 'Input',
  },
  {
    field: 'permissionCode',
    label: '权限代码',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '模板名称',
    dataIndex: 'name',
    sorter: true,
    width: 200,
  },
  {
    title: '表',
    dataIndex: 'importTable',
    sorter: true,
    width: 200,
  },
  {
    title: '起始行',
    dataIndex: 'startRow',
    sorter: true,
    width: 100,
  },
  {
    title: '模板代码',
    dataIndex: 'importCode',
    sorter: true,
    width: 200,
  },
  {
    title: '权限代码',
    dataIndex: 'permissionCode',
    sorter: true,
    width: 200,
  },
];
