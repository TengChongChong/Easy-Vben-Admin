import { BasicModel } from '/@/api/model/baseModel';

/**
 * 网站发布
 */
export interface CmsRelease extends BasicModel {
  // 站点id
  siteId?: string;
  // 页面id
  pageIds?: string;
  // 栏目id
  columnIds?: string;
  // 是否发布栏目下文章
  releaseArticle?: string;
  // 总任务
  total?: number;
  // 已完成数量
  done?: number;
  // 发布失败数量
  fail?: number;
  // 发布时间
  releaseDate?: number;
  // 结束时间
  endDate?: string;
  // 发布回执
  receipt?: string;
}

export interface ReleaseProgressVO {
  // 是否结束
  end: boolean;
  // 发布成功数
  done: number;
  // 发布失败数
  fail: number;
  // 时间戳
  timeStamp: number;
}
