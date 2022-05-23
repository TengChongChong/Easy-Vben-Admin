import { BasicColumn, FormSchema } from '/@/components/Table';
import { createVNode } from 'vue';
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
    width: 150,
  },
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    width: 150,
    format: (_, record) => {
      return createVNode(DictTag, { dictType: record.dictType, value: record.code });
    },
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    sorter: true,
    width: 250,
    ellipsis: true,
    customRender: ({ record }) => {
      return `${record.dictTypeName}(${record.dictType})`;
    },
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    sorter: true,
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 80,
    format: 'dict|commonStatus',
  },
  {
    title: '编辑人',
    dataIndex: 'editUser',
    sorter: true,
    width: 120,
  },
  {
    title: '编辑时间',
    dataIndex: 'editDate',
    sorter: true,
    width: 140,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
