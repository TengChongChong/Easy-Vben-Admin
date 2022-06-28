import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

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
  {
    field: '[startOperationDate, endOperationDate]',
    label: '操作时间',
    component: 'RangePicker',
    componentProps: {
      allowEmpty: [true, true],
      showTime: true,
      ranges: {
        今天: [dayjs().startOf('day'), dayjs().endOf('day')],
        本周: [dayjs().startOf('week'), dayjs().endOf('week')],
        本月: [dayjs().startOf('month'), dayjs().endOf('month')],
      },
    },
    colProps: { xxl: 12, xl: 16, md: 24 },
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
    title: 'Http Method',
    dataIndex: 'httpMethod',
    sorter: true,
    width: 160,
    format: 'dict|httpMethod',
    filters: 'dict|httpMethod',
  },
  {
    title: 'Uri',
    dataIndex: 'uri',
    sorter: true,
    width: 280,
  },
  {
    title: '类',
    dataIndex: 'clazz',
    sorter: true,
    width: 460,
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
