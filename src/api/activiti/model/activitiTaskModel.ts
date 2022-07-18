/**
 * Activiti 待办任务
 */
export interface ActivitiTask {
  // 主键
  id?: string;
  // 实际签收人 任务的拥有者：签收人（默认为空，只有在委托时才有值）
  owner?: string;
  // 签收人或委托人
  assignee?: string;
  // 父任务id
  parentTaskId?: string;
  // 节点名称
  name?: string;
  // 自定义名称
  localizedName?: string;
  // 节点说明
  description?: string;
  // 自定义任务说明
  localizedDescription?: string;
  // 创建时间
  createTime?: Date;
  // 优先级别，默认为：50
  priority?: number;
  // 执行实例ID
  executionId?: string;
  // 流程实例ID
  processInstanceId?: string;
  // 流程定义ID
  processDefinitionId?: string;
  // 流程名称
  processDefinitionName?: string;
  // 流程版本
  processVersion?: number;
  // 任务唯一id
  taskDefinitionKey?: string;
  // 外置表单key
  formKey?: string;
  // 是否删除
  isDeleted?: boolean;
  // 事件名称
  eventName?: string;
  // 状态
  status?: string;
  // 业务数据ID
  businessKey?: string;
  // 业务标题
  businessTitle?: string;
  // 业务数据详情url
  businessDetailsPath?: string;
  // 发起人
  applyUser?: string;
  // 发起人用户id
  applyUserId?: string;
  // 申请人头像
  avatar?: string;
}
