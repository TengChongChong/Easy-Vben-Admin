import { BasicModel } from '/@/api/model/baseModel';

/**
 * 用户反馈
 */
export interface CmsFeedback extends BasicModel {
  // 站点id
  siteId?: string;
  // 昵称
  nickname?: string;
  // 邮箱
  email?: string;
  // 手机号
  phoneNumber?: string;
  // 内容
  content?: string;
}
