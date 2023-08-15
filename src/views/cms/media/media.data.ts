import { BasicColumn, FormSchema } from '/@/components/Table';

export const fileSuffix = {
  image: ['.bmp', '.jpg', '.jpeg', '.png', '.gif'],
  audio: ['.mp3', '.ogg', '.wav'],
  video: ['.mp4'],
  doc: ['.doc', '.docx', '.pdf', '.txt', '.csv', '.xls', '.xlsx', '.ppt', '.pptx'],
  other: ['.zip', '.rar', '.7z'],
};

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '预览',
    dataIndex: 'preview',
    width: 260,
  },
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    width: 400,
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 150,
    format: 'dict|cmsMediaType',
    filters: 'dict|cmsMediaType',
  },
  {
    title: '更新人',
    dataIndex: 'editUser',
    sorter: true,
    width: 160,
  },
  {
    title: '更新时间',
    dataIndex: 'editDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
