export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

/**
 * Basic Model
 */
export interface BasicModel {
  // id
  id?: string;
  // 父id
  parentId?: string;
  // 状态
  status?: string;
  // 排序值
  orderNo?: number;
  // 备注
  remarks?: string;
  // 创建人所属部门
  deptId?: string;
  // 租户id
  tenantId?: string;
  // 乐观锁
  version?: number;
  // 创建人
  createUser?: string;
  // 创建时间
  createDate?: Date;
  // 修改人
  editUser?: string;
  // 修改时间
  editDate?: Date;
}
