import { BasicModel } from '/@/api/model/baseModel';

/**
 * 消息详情
 */
export interface SysMessageDetail extends BasicModel {
  // 消息id
  messageId: string;
  // 接收人
  receiverUser: string;
  // 阅读时间
  readDate?: Date;
  // 收藏
  star?: string;
}
