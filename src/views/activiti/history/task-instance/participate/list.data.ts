import { BasicColumn } from '/@/components/Table';

/**
 * 任务状态
 */
export enum TaskStatus {
  /**
   * 办理中
   */
  IN_PROCESS = '1',
  /**
   * 已撤销
   */
  RESCINDED = '-1',
  /**
   * 已办结
   */
  COMPLETED = '2',
}

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
    title: '办理时间',
    dataIndex: 'claimTime',
    sortField: 't.claim_time_',
    format: 'date|YYYY-MM-DD HH:mm',
    width: 170,
    sorter: true,
  },
  {
    title: '发起人',
    dataIndex: 'applyUser',
    sortField: 't.nickname',
    width: 100,
    sorter: true,
  },
];
