/**
 * 表信息
 */
export interface TableInfo {
  // 表名
  name: string;
  // 注释
  comment: string;
  // 实体类名称
  entityName: string;
  // 是否有主键
  havePrimaryKey: boolean;
  //
  fields: TableField[];
}

export interface TableField {
  // 数据库字段
  name: string;
  // 注释
  comment: string;
  // 类型
  type: string;
  // 属性名
  propertyName: string;
  // 属性类型
  propertyType: string;
  // 是否是主键
  keyFlag: boolean;
}
