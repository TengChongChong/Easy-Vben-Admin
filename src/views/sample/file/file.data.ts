import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'displayName',
    label: '文件名',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '文件名',
    dataIndex: 'displayName',
    sorter: true,
    width: 400,
  },
  {
    title: '更新人',
    dataIndex: 'editUser',
    sorter: true,
    width: 160,
  },
  {
    title: '更新时间',
    dataIndex: 'editDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
