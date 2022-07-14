import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'processInstanceId',
    label: '流水号',
    component: 'Input',
  },
  {
    field: 'businessTitle',
    label: '业务',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '流水号',
    dataIndex: 'processInstanceId',
    sortField: 'art.proc_inst_id_',
    width: 100,
    sorter: true,
  },
  {
    title: '业务',
    dataIndex: 'businessTitle',
    sortField: 'arv_businessTitle.text_',
    width: 260,
    sorter: true,
  },
  {
    title: '所属流程',
    dataIndex: 'processDefinitionName',
    sortField: 'arp.name_',
    width: 100,
    sorter: true,
  },
  {
    title: '当前步骤',
    dataIndex: 'name',
    sortField: 'art.name_',
    sorter: true,
    width: 120,
  },
  {
    title: '发起人',
    dataIndex: 'applyUser',
    sortField: 'arv_applyUserId.text_',
    width: 100,
    sorter: true,
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
    sortField: 'art.create_time_',
    format: 'date|YYYY-MM-DD HH:mm',
    width: 170,
    sorter: true,
  },
];
