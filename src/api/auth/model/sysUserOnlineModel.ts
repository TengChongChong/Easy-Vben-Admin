import { SysUser } from '/@/api/auth/model/sysUserModel';

/**
 * 在线用户
 */
export interface SysUserOnline extends SysUser {
  sessionId: string;
  host: string;
  systemHost: string;
  startTimestamp: Date;
  lastAccessTime: Date;
  timeout: number;
}
