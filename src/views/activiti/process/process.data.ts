import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'processDefinitionId',
    label: '流程ID',
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
    title: '流程ID',
    dataIndex: 'processDefinitionId',
    sortField: 'arp.id_',
    width: 180,
    sorter: true,
  },
  {
    title: '名称',
    dataIndex: 'name',
    sortField: 'arp.name_',
    width: 180,
    sorter: true,
  },
  {
    title: '标识',
    dataIndex: 'key',
    sortField: 'arp.key_',
    width: 180,
    sorter: true,
  },
  {
    title: '版本号',
    dataIndex: 'version',
    sortField: 'arp.version_',
    sorter: true,
    width: 100,
  },
  {
    title: '部署时间',
    dataIndex: 'deployTime',
    sortField: 'ard.deploy_time_',
    format: 'date|YYYY-MM-DD HH:mm',
    width: 170,
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'suspensionState',
    sortField: 'arp.suspension_state_',
    sorter: true,
    width: 100,
    format: 'dict|suspensionState',
    filters: 'dict|suspensionState',
  },
];
