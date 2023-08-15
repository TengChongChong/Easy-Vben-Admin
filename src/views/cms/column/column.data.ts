import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
  },
  {
    field: 'slug',
    label: '别名',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '别名',
    dataIndex: 'slug',
    width: 200,
  },
  {
    title: '可发布文章',
    dataIndex: 'isRelease',
    width: 150,
    format: 'dict|whether',
    filters: 'dict|whether',
  },
  // {
  //   title: '封面比例',
  //   dataIndex: 'coverProportion',
  //   width: 160,
  // },
  {
    title: '状态',
    dataIndex: 'status',
    width: 150,
    format: 'dict|commonStatus',
    filters: 'dict|commonStatus',
  },
  {
    title: '更新人',
    dataIndex: 'editUser',
    width: 160,
  },
  {
    title: '更新时间',
    dataIndex: 'editDate',
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
