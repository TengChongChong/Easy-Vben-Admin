import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
  },
  {
    field: 'deptName',
    label: '部门',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: 'Token',
    dataIndex: 'sessionId',
    sorter: true,
    fixed: 'left',
    width: 320,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 100,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    sorter: true,
    width: 150,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    sorter: true,
    width: 150,
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    sorter: true,
    width: 150,
  },
  {
    title: '登录时间',
    dataIndex: 'startTimestamp',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
