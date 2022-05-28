import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export function searchFormSchema(): FormSchema[] {
  return [
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'code',
      label: '标识',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
}

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
    title: '标识',
    dataIndex: 'code',
    sorter: true,
    width: 150,
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    sorter: true,
    width: 80,
  },
  {
    title: '系统',
    dataIndex: 'sys',
    sorter: true,
    width: 100,
    format: 'dict|whether',
    filters: 'dict|whether',
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 80,
    format: 'dict|commonStatus',
    filters: 'dict|commonStatus',
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
