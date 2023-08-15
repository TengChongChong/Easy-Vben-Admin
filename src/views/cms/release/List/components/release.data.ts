import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: '[startReleaseDate, endReleaseDate]',
    label: '发布时间',
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
    title: '发布内容',
    dataIndex: 'releaseContent',
    sorter: false,
    width: 260,
  },
  {
    title: '总任务',
    dataIndex: 'total',
    sorter: true,
    width: 120,
  },
  {
    title: '发布完成',
    dataIndex: 'done',
    sorter: true,
    width: 120,
  },
  {
    title: '发布失败',
    dataIndex: 'fail',
    sorter: true,
    width: 120,
  },
  {
    title: '发布时间',
    dataIndex: 'releaseDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    sorter: true,
    width: 160,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 150,
    format: 'dict|cmsReleaseStatus',
    filters: 'dict|cmsReleaseStatus',
  },
];
