/**
 * Activiti 流程
 */
export interface ActivitiProcess {
  // 流程定义ID
  processDefinitionId?: string;
  // 命名空间
  category?: string;
  // 名称
  name?: string;
  // 标识
  key?: string;
  // 版本号
  version?: number;
  // 部署编号
  deploymentId?: string;
  // 资源文件名称
  resourceName?: string;
  // 图片资源文件名称
  dgrmResourceName?: string;
  // 描述
  description?: string;
  // 启动节点有无外置表单
  hasStartFormKey?: string;
  hasGraphicalNotation?: string;
  // 挂起状态
  suspensionState?: number;
  // 租户id
  tenantId?: string;
  // 部署时间
  deployTime?: Date;
}
