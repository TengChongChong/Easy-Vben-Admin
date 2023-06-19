import { BasicModel } from '/@/api/model/baseModel';

/**
 * 站点
 */
export interface CmsSite extends BasicModel {
  // 名称
  name?: string;
  // 关键字
  keyword?: string;
  // 描述
  description?: string;
  // 域名
  domainName?: string;
  // 部署路径
  deploymentPath?: string;
  // 主题路径
  theme?: string;
}
