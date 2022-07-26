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
    field: 'url',
    label: 'Url',
    component: 'Input',
  },
  {
    field: 'username',
    label: '账号',
    component: 'Input',
  },
  {
    field: 'password',
    label: '密码',
    component: 'Input',
  },
  {
    field: 'remarks',
    label: '备注',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    fixed: 'left',
    width: 150,
  },
  {
    title: 'Url',
    dataIndex: 'url',
    sorter: true,
    width: 520,
  },
  {
    title: '账号',
    dataIndex: 'username',
    sorter: true,
    width: 160,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    format: 'dict|commonStatus',
    filters: 'dict|commonStatus',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    sorter: true,
    width: 260,
  },
  {
    title: '编辑人',
    dataIndex: 'editUser',
    sorter: true,
    width: 120,
  },
  {
    title: '编辑时间',
    dataIndex: 'editDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
