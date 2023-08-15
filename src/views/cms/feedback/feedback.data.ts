import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
  },
  {
    field: 'phoneNumber',
    label: '手机号',
    component: 'Input',
  },
  {
    field: 'content',
    label: '内容',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '昵称',
    dataIndex: 'nickname',
    sorter: true,
    width: 160,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    sorter: true,
    width: 160,
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    sorter: true,
    width: 160,
  },
  {
    title: '反馈内容',
    dataIndex: 'content',
    sorter: true,
    width: 320,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 150,
    format: 'dict|commonStatus',
    filters: 'dict|commonStatus',
  },
  {
    title: '反馈时间',
    dataIndex: 'createDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
