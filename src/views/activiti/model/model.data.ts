import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'key',
    label: '标识',
    component: 'Input',
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    sortField: 'arm.name_',
    width: 200,
    sorter: true,
  },
  {
    title: '标识',
    dataIndex: 'key',
    sortField: 'arm.key_',
    width: 200,
    sorter: true,
  },
  {
    title: '版本号',
    dataIndex: 'version',
    sortField: 'arm.version_',
    sorter: true,
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sortField: 'arm.create_time_',
    sorter: true,
    width: 170,
    format: 'date|YYYY-MM-DD HH:mm',
  },
  {
    title: '最后更新时间',
    dataIndex: 'lastUpdateTime',
    sortField: 'arm.last_update_time_',
    sorter: true,
    width: 170,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
