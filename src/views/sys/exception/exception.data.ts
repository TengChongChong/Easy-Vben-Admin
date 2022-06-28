import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'type',
    label: '异常类型',
    component: 'Input',
  },
  {
    field: 'message',
    label: '错误信息',
    component: 'Input',
  },
  {
    field: 'nickname',
    label: '触发用户',
    component: 'Input',
  },
  {
    field: 'url',
    label: 'Url',
    component: 'Input',
  },
  {
    field: 'code',
    label: '错误码',
    component: 'Input',
  },
  {
    field: '[startTriggerTime, endTriggerTime]',
    label: '触发时间',
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
    title: '异常类型',
    dataIndex: 'type',
    sorter: true,
    fixed: 'left',
    width: 360,
  },
  {
    title: '错误码',
    dataIndex: 'code',
    sorter: true,
    width: 100,
  },
  {
    title: '错误信息',
    dataIndex: 'message',
    sorter: true,
    width: 520,
  },
  {
    title: 'Url',
    dataIndex: 'url',
    sorter: true,
    width: 320,
  },
  {
    title: '触发用户',
    dataIndex: 'nickname',
    sorter: true,
    width: 120,
  },
  {
    title: '触发时间',
    dataIndex: 'triggerTime',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
