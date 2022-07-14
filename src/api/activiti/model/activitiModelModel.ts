/**
 * Activiti 流程模型
 */
export interface ActivitiModel {
  // 主键
  id?: string;
  // 名称
  name?: string;
  // key
  key?: string;
  // 分类
  category?: string;
  // 描述
  description?: string;
  // 模型路径
  path?: string;
  // 创建时间
  createTime?: Date;
  // 上次更新时间
  lastUpdateTime?: Date;
  // 版本
  version?: number;
  // meta info
  metaInfo?: string;
  // 部署id
  deploymentId?: string;
  // 资源id
  editorSourceValueId?: string;
  // 资源拓展id
  editorSourceExtraValueId?: string;
  // 租户id
  tenantId?: string;
}
