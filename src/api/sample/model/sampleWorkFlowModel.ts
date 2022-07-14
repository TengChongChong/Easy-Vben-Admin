import { BasicModel } from '/@/api/model/baseModel';

/**
 * 流程示例
 */
export interface SampleWorkFlow extends BasicModel {
  // 请假类型
  leaveType?: string;
  // 开始时间
  startDate?: Date;
  // 结束时间
  endDate?: Date;
  // 原因
  reason?: string;
}
