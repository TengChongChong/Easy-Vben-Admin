/**
 * 系统参数
 */
export interface SysException {
  id: string;
  // 触发用户
  userId: string;
  // 触发时间
  triggerTime: Date;
  // 异常类型
  type: string;
  // 错误堆栈
  trace: string;
  // 错误信息
  message: string;
  // 请求地址
  url: string;
  // 错误代码
  code: string;
  // 用户昵称
  nickname: string;
}
