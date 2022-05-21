import { BasicColumn, FormSchema } from '/@/components/Table';
import { createVNode, nextTick } from 'vue';
import DictTag from '/@/components/Dict/DictTag.vue';
import { selectAll } from '/@/api/sys/sysDictType';

/**
 * 查询条件
 *
 * @param reloadTable 刷新表格
 */
export function searchFormSchema(reloadTable: () => any): FormSchema[] {
  return [
    {
      field: 'dictType',
      label: '类型',
      component: 'ApiSelect',
      componentProps: {
        api: selectAll,
        onChange: () => {
          reloadTable();
        },
      },
      colProps: { span: 6 },
    },
    {
      field: 'code',
      label: '编码',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      colProps: { span: 6 },
    },
  ];
}

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    dataIndex: 'code',
    sorter: true,
  },
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    format: (_, record) => {
      return createVNode(DictTag, { dictType: record.dictType, value: record.code });
    },
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    sorter: true,
    width: 260,
    ellipsis: true,
    customRender: ({ record }) => {
      return `${record.dictTypeName}(${record.dictType})`;
    },
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    sorter: true,
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    format: 'dict|commonStatus',
  },
  {
    title: '编辑人',
    dataIndex: 'editUser',
    sorter: true,
    width: 160,
  },
  {
    title: '编辑时间',
    dataIndex: 'editDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];

// 表单
export const formSchema: FormSchema[] = [
  {
    field: 'dictType',
    label: '类型',
    component: 'ApiSelect',
    componentProps: {
      api: selectAll,
      onChange: () => {
        nextTick(() => {
          // todo: 更新上级字典
        });
      },
    },
    required: true,
  },
  {
    field: 'parentCode',
    label: '上级字典',
    component: 'Input',
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    required: true,
    rules: [{ max: 64, message: '编码不能超过64个字符', trigger: 'blur' }],
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    rules: [{ max: 64, message: '名称不能超过64个字符', trigger: 'blur' }],
  },
  {
    field: 'status',
    label: '状态',
    required: true,
    component: 'DictRadio',
    componentProps: {
      dictType: 'commonStatus',
    },
  },
  {
    field: 'orderNo',
    label: '排序值',
    component: 'InputNumber',
    required: true,
    rules: [
      { type: 'number', max: 999, message: '排序值不能大于999', trigger: 'blur' },
      { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' },
    ],
  },
  {
    field: 'displayType',
    label: '颜色',
    component: 'DictSelect',
    componentProps: {
      dictType: 'tagColor',
    },
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
  },
  {
    field: 'remarks',
    label: '备注',
    component: 'InputTextArea',
    rules: [{ max: 900, message: '备注不能超过900个字符', trigger: 'blur' }],
  },
];
