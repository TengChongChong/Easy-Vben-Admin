import {
  ActivitiFormProperty,
  ExtentParams,
} from '/@/api/activiti/model/activitiProcessDefinition';
import { SysUser } from '/@/api/auth/model/sysUserModel';

export interface ActivitiTaskInfo {
  // 是否有表单
  hasTaskForm: boolean;
  // 表单
  taskFormData: ActivitiFormProperty[];
  // 发起时表单
  startFormData: ActivitiFormProperty[];
  // 任务
  businessKey: string;
  // 流程变量
  variables: ExtentParams[];
  // 提交人
  applyUser: SysUser;
  // 提交时间
  createDate: Date;
}
