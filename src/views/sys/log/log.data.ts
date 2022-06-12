import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'modular',
    label: '模块',
    component: 'Input',
  },
  {
    field: 'method',
    label: '方法',
    component: 'Input',
  },
  {
    field: 'ip',
    label: 'ip',
    component: 'Input',
  },
  {
    field: 'uri',
    label: 'Uri',
    component: 'Input',
  },
  {
    field: 'clazz',
    label: '类',
    component: 'Input',
  },
  {
    field: 'params',
    label: '参数',
    component: 'Input',
  },
  {
    field: 'operationUser',
    label: '操作人',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '模块',
    dataIndex: 'modular',
    sorter: true,
    fixed: 'left',
    width: 120,
  },
  {
    title: '方法',
    dataIndex: 'method',
    sorter: true,
    width: 120,
  },
  {
    title: 'ip',
    dataIndex: 'ip',
    sorter: true,
    width: 120,
  },
  {
    title: 'Uri',
    dataIndex: 'uri',
    sorter: true,
    width: 160,
  },
  {
    title: '类',
    dataIndex: 'clazz',
    sorter: true,
    width: 240,
    ellipsis: true,
    customRender: ({ record }) => `${record.clazz}.${record.methodName}()`,
  },
  {
    title: '操作人',
    dataIndex: 'operationUser',
    sorter: true,
    width: 120,
  },
  {
    title: '操作时间',
    dataIndex: 'operationDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
