import { BasicColumn, FormSchema } from '/@/components/Table';
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
    },
    {
      field: 'name',
      label: '名称',
      component: 'Input',
    },
    {
      field: 'code',
      label: '编码',
      component: 'Input',
    },
  ];
}

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    fixed: 'left',
    width: 150,
  },
  {
    title: '编码',
    dataIndex: 'code',
    sorter: true,
    width: 150,
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
    filters: 'dict|commonStatus',
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
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
