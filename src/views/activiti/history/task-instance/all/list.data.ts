import { BasicColumn } from '/@/components/Table';

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '流水号',
    dataIndex: 'processInstanceId',
    sortField: 't.process_instance_id',
    width: 100,
    sorter: true,
  },
  {
    title: '业务',
    dataIndex: 'businessTitle',
    sortField: 't.business_title',
    width: 260,
    sorter: true,
  },
  {
    title: '所属流程',
    dataIndex: 'processDefinitionName',
    sortField: 't.process_definition_name',
    width: 100,
    sorter: true,
  },
  {
    title: '当前步骤',
    dataIndex: 'name',
    sortField: 't.name',
    sorter: true,
    width: 120,
  },
  {
    title: '任务状态',
    dataIndex: 'taskStatus',
    format: 'dict|taskStatus',
    width: 100,
  },
  {
    title: '撤销原因',
    dataIndex: 'deleteReason',
    sortField: 't.delete_reason_',
    width: 200,
    sorter: true,
  },
  {
    title: '流程状态',
    dataIndex: 'processSuspensionState',
    sortField: 't.process_suspension_state',
    format: 'dict|suspensionState',
    sorter: true,
    width: 100,
  },
  {
    title: '发起时间',
    dataIndex: 'startTime',
    sortField: 't.start_time_',
    format: 'date|YYYY-MM-DD HH:mm',
    width: 170,
    sorter: true,
  },
];
