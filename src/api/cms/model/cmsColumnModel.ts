import { BasicModel } from '/@/api/model/baseModel';

/**
 * 栏目
 */
export interface CmsColumn extends BasicModel {
  // 站点id
  siteId?: string;
  // 名称
  name?: string;
  // 别名
  slug?: string;
  // 类型
  type?: string;
  // 是否可以发布文章
  isRelease?: string;
  // 封面比例-宽
  coverProportionWidth?: number;
  // 封面比例-宽
  coverProportionHeight?: number;
  // 描述
  description?: string;
}
