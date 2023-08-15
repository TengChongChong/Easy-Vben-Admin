import { BasicModel } from '/@/api/model/baseModel';

/**
 * 文章
 */
export interface CmsArticle extends BasicModel {
  // 站点id
  siteId?: string;
  // 栏目id
  columnId?: string;
  // 标题
  title?: string;
  // 标题字体
  titleFontFamily?: string;
  // 标题颜色
  titleColor?: string;
  // 标题字重
  titleFontWeight?: string;
  // 标题文字大小
  titleFontSize?: number;
  // 副标题
  subtitle?: string;
  // 摘要
  excerpt?: string;
  // 内容
  content?: string;
  // 关键字
  keyword?: string;
  // 描述
  description?: string;
  // 标签
  tags?: string;
  // 信息来源
  source?: string;
  // 作者
  author?: string;
  // 发布方式 1.手动 2.定时
  releaseType?: string;
  // 发布时间
  releaseDate?: Date;
  // 下线时间
  offlineDate?: Date;
  // 浏览次数
  viewCount?: number;
  // 类型
  type?: string;
  // 访问地址
  url?: string;
}
