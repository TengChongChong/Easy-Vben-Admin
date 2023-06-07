/**
 * 偏好设置,可根据习惯自行修改
 */
export const PREFERENCE_SETTING = {
  // 列表页面
  list: {
    query: {
      // 是否将数字类型的属性作为查询条件
      enableNumber: false,
      // 一般不会被搜索的字段
      exclude: [
        'id',
        'parentId',
        'pId',
        'version',
        'tenantId',
        'createUser',
        'createDate',
        'editUser',
        'editDate',
        'deptId',
        'orderNo',
        'icon',
        'url',
      ],
    },
    table: {
      // 长字段默认不显示在表格中
      autoHideFieldLength: 255,
      // 表格单元格最大宽度
      cellMaxWidth: 400,
      // 一般不显示在表格中的字段
      excludeTable: [
        'id',
        'parentId',
        'pId',
        'tips',
        'remarks',
        'content',
        'abstract',
        'describe',
        'createUser',
        'createDate',
        'tenantId',
        'version',
      ],
      // 一般不支持排序的字段
      excludeSorter: [
        'file',
        'path',
        'cover',
        'avatar',
        'doc',
        'img',
        'id',
        'parentId',
        'pId',
        'tips',
        'remarks',
        'content',
        'abstract',
        'describe',
        'createUser',
        'createDate',
        'tenantId',
        'version',
      ],
    },
  },
  export: {
    // excel单元格最大宽度
    cellMaxWidth: 400,

    // 一般不导出的字段
    exclude: [
      'id',
      'parentId',
      'pId',
      'createUser',
      'createDate',
      'editUser',
      'editDate',
      'tenantId',
      'version',
    ],
  },
  importExclude: [
    'id',
    'parentId',
    'pId',
    'createUser',
    'createDate',
    'editUser',
    'editDate',
    'tenantId',
    'version',
  ],
  // 详情页面
  input: {
    // 输入框最大字段长度，如果超出将默认使用InputTextArea
    inputMaxLength: 255,
    // 一般不填写以下字段
    exclude: [
      'id',
      'parentId',
      'pId',
      'createUser',
      'createDate',
      'editUser',
      'editDate',
      'tenantId',
      'version',
    ],
  },
};
