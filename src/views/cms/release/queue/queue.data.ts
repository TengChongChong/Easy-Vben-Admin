import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'type',
    label: '类型',
    component: 'Input',
  },
  {
    field: 'title',
    label: '标题',
    component: 'Input',
  },
  {
    field: 'receipt',
    label: '发布回执',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 160,
    format: 'dict|cmsReleaseType',
    filters: 'dict|cmsReleaseType',
  },
  {
    title: '标题',
    dataIndex: 'title',
    sorter: true,
    width: 400,
  },
  {
    title: '耗时（毫秒）',
    dataIndex: 'duration',
    sorter: true,
    width: 160,
  },
  {
    title: '发布状态',
    dataIndex: 'status',
    sorter: true,
    width: 150,
    format: 'dict|cmsReleaseStatus',
    filters: 'dict|cmsReleaseStatus',
  },
  {
    title: '发布回执',
    dataIndex: 'receipt',
    sorter: false,
    width: 400,
  },
];
