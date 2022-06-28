/**
 * 消息状态 - 发信
 */
export enum SysMessageStatus {
  // 草稿
  DRAFT = '0',
  // 已发送
  HAS_BEEN_SENT = '1',
  // 已撤销
  RESCINDED = '-1',
}

/**
 * 消息状态 - 收信
 */
export enum SysMessageDetailsStatus {
  // 已读
  RECEIVE_STATUS_ALREADY_READ = '1',
  // 未读
  RECEIVE_STATUS_UNREAD = '0',
}
