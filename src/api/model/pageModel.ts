/**
 * 分页
 */
export interface Page<T> {
  // 查询数据列表
  records?: T[];
  // 总数
  total?: number;
  // 每页显示条数，默认 15
  pageSize?: number;
  // 当前页
  current?: number;

  //排序字段
  sortField?: string;
  // 排序方式
  sortOrder?: string;
}
