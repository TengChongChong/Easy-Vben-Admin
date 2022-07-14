import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'reason',
    label: '原因',
    component: 'Input',
  },
  {
    field: '[startDate, endDate]',
    label: '请假时间',
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
    title: '流水号',
    dataIndex: 'processInstanceId',
    sorter: true,
    width: 120,
  },
  {
    title: '请假类型',
    dataIndex: 'leaveType',
    sorter: true,
    width: 150,
    format: 'dict|leaveType',
    filters: 'dict|leaveType',
  },
  {
    title: '原因',
    dataIndex: 'reason',
    sorter: true,
    width: 260,
  },
  {
    title: '请假时间',
    dataIndex: 'startDate',
    sorter: true,
    width: 240,
  },
  {
    title: '状态',
    dataIndex: 'workFlowStatus',
    sorter: true,
    width: 150,
  },
];
