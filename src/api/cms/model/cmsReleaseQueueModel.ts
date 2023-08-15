import { BasicModel } from '/@/api/model/baseModel';

/**
 * 发布列队详情
 */
export interface CmsReleaseQueue extends BasicModel {
  // 站点id
  siteId?: string;
  // 类型
  type?: string;
  // 数据id
  dataId?: string;
  // 标题
  title?: string;
  // 权重
  weight?: number;
  // 发布回执
  receipt?: string;
  // 耗时 毫秒
  duration?: number;
}
