/**
 * 系统日志
 */
export interface SysLog {
  id: string;
  // 模块
  modular: string;
  // 方法
  method: string;
  // ip
  ip: string;
  // 请求地址
  url: string;
  // 请求地址
  uri: string;
  // 类
  clazz: string;
  // 方法
  methodName: string;
  // 参数
  params: string;
  // 耗时
  timeConsuming: string;
  // 租户id
  tenantId: string;
  // 操作人
  operationUser: string;
  // 操作时间
  operationDate: Date;
}
