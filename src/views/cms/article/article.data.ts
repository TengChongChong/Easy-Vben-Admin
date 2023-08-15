import { BasicColumn } from '/@/components/Table';

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '封面',
    dataIndex: 'cover',
    width: 180,
  },
  {
    title: '标题',
    dataIndex: 'title',
    sorter: true,
    width: 320,
  },
  {
    title: '栏目',
    dataIndex: 'columnName',
    width: 100,
  },
  {
    title: '作者',
    dataIndex: 'author',
    sorter: true,
    width: 100,
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
    width: 120,
    format: 'dict|cmsArticleStatus',
    filters: 'dict|cmsArticleStatus',
  },
  {
    title: '发布时间',
    dataIndex: 'releaseDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
  {
    title: '更新人',
    dataIndex: 'editUser',
    sorter: true,
    width: 120,
  },
  {
    title: '更新时间',
    dataIndex: 'editDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
