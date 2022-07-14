/**
 * Activiti 任务实例
 */
export interface ActivitiHistoryTaskInstance {
  // 主键
  id: string;
  // 流程定义ID
  processDefinitionId: string;
  // 流程名称
  processDefinitionName: string;
  // 流程版本
  processVersion: number;
  // key
  taskDefinitionKey: string;
  // 执行实例ID
  executionId: string;
  // 流程实例ID
  processInstanceId: string;
  // 节点名称
  name: string;
  // 父任务id
  parentTaskId?: string;
  // 节点说明
  description?: string;
  // 实际签收人 任务的拥有者：签收人（默认为空，只有在委托时才有值）
  owner?: string;
  // 签收人或委托人
  assignee: string;
  // 开始时间
  startTime: Date;
  // 签收时间
  claimTime?: Date;
  // 办结时间
  endTime?: Date;
  // 耗时
  duration?: string;
  // 删除原因
  deleteReason?: string;
  // 优先级别，默认为：50
  priority: number;
  // 应完成时间：过期时间，表明任务应在多长时间内完成
  dueDate?: Date;
  // 外置表单key
  formKey?: string;
  // 分类
  category?: string;
  // 租户id
  tenantId?: string;
  // 业务数据ID
  businessKey: string;
  // 业务标题
  businessTitle: string;
  // 业务数据详情url
  businessDetailsPath: string;
  // 发起人
  applyUser: string;
  // 流程状态
  processSuspensionState: number;
  // 任务状态
  taskStatus: number;
}
