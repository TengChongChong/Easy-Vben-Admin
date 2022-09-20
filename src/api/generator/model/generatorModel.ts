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
  // metaInfo
  metaInfo: MetaInfo;
}

export interface MetaInfo {
  // 默认值
  defaultValue: any;
  // 字段类型
  jdbcType: string;
  // 字段长度
  length: number;
  // 是否可为空
  nullable: boolean;
  // 注释
  remarks: string;
  scale: number;
}
