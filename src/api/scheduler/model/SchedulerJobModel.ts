import { BasicModel } from '/@/api/model/baseModel';

/**
 * 定时任务
 */
export interface SchedulerJob extends BasicModel {
  // 名称
  name: string;
  // 代码
  code: string;
  // cron表达式
  cron: string;
  // bean
  bean: string;
  // 方法
  method: string;
  // 是否系统
  sys: string;
  // 上次执行时间
  lastRunDate: Date;
}
