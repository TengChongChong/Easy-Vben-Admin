import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
  },
  {
    field: 'slug',
    label: '别名',
    component: 'Input',
  },
  {
    field: 'template',
    label: '模板',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '标题',
    dataIndex: 'title',
    sorter: true,
    width: 400,
  },
  {
    title: '别名',
    dataIndex: 'slug',
    sorter: true,
    width: 160,
  },
  {
    title: '模板',
    dataIndex: 'template',
    sorter: true,
    width: 200,
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
