import { BasicColumn } from '/@/components/Table';

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    dataIndex: 'code',
    sorter: true,
    fixed: 'left',
    width: 150,
  },
  {
    title: '名称',
    dataIndex: 'name',
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
