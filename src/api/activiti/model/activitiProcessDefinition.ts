/**
 * 流程发起
 */
export interface ActivitiProcessDefinition {
  // 流程ID
  processDefinitionId: string;
  // 业务数据ID
  businessKey: string;
  // 业务标题
  businessTitle: string;
  // 业务数据详情url
  businessDetailsPath: string;
  //扩展参数
  extentParams?: ExtentParams;
  // 包含流程发起表单数据
  hasFormData: boolean;
}

/**
 * 拓展参数
 */
export interface ExtentParams {
  [key: string]: any;
}

/**
 * 流程启动响应内容
 */
export interface ProcessDefinitionStartResult {
  hasStartForm?: boolean;
  startFormData?: ActivitiFormProperty[];
  processInstanceId?: string;
}

/**
 * 动态表单
 */
export interface ActivitiFormProperty {
  // 标识
  id: string;
  // 名称
  name: string;
  // 数据类型
  typeCode: string;
  // 必填
  required: boolean;
  // 可读
  readable: boolean;
  // 可写
  writable: boolean;
  // 日期格式
  datePattern: string;
  // 下拉选项
  values: any;
}
