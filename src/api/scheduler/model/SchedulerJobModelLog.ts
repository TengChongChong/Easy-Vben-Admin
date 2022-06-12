import { BasicModel } from '/@/api/model/baseModel';

/**
 * 定时任务执行日志
 */
export interface SchedulerJobLog extends BasicModel {
  // 任务id
  schedulerJobId: string;
  // 执行时间
  runDate: Date;
  // 耗时
  timeConsuming: number;
}
