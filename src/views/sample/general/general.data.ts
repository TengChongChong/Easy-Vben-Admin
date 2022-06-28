import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
  },
  {
    field: 'address',
    label: '地址',
    component: 'Input',
  },
  {
    field: 'editUser',
    label: '编辑人',
    component: 'Input',
  },
  {
    field: '[startEditDate, endEditDate]',
    label: '编辑时间',
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
    title: '姓名',
    dataIndex: 'name',
    sorter: true,
    width: 160,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    sorter: true,
    width: 150,
    format: 'dict|sex',
    filters: 'dict|sex',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    sorter: true,
    width: 160,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    sorter: true,
    width: 160,
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
    title: '编辑人',
    dataIndex: 'editUser',
    sorter: true,
    width: 160,
  },
  {
    title: '编辑时间',
    dataIndex: 'editDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
