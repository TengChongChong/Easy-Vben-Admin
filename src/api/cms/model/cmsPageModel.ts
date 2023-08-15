import { BasicModel } from '/@/api/model/baseModel';

/**
 * 页面
 */
export interface CmsPage extends BasicModel {
  // 站点id
  siteId?: string;
  // 标题
  title?: string;
  // 副标题
  subtitle?: string;
  // 内容
  content?: string;
  // 别名
  slug?: string;
  // 模板
  template?: string;
}
