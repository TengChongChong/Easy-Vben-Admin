import { BasicColumn, FormSchema } from '/@/components/Table';
import { RoleEnum } from '/@/enums/roleEnum';

/**
 * 查询条件
 *
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'type',
    label: '类型',
    component: 'Input',
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
  },
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    format: 'dict|commonStatus',
    filters: 'dict|commonStatus',
  },
  {
    title: '系统',
    dataIndex: 'sys',
    sorter: true,
    width: 100,
    auth: RoleEnum.SYS_ADMIN,
    format: 'dict|whether',
    filters: 'dict|whether',
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

// 表单
export const formSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'Input', show: false },
  { field: 'version', label: 'version', component: 'Input', show: false },
  {
    field: 'type',
    label: '类型',
    component: 'Input',
    required: true,
    rules: [{ max: 32, message: '类型不能超过32个字符', trigger: 'blur' }],
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    rules: [{ max: 32, message: '名称不能超过32个字符', trigger: 'blur' }],
  },
  {
    field: 'sys',
    label: '是否系统',
    required: true,
    auth: RoleEnum.SYS_ADMIN,
    component: 'DictRadio',
    componentProps: {
      dictType: 'whether',
    },
    itemProps: { validateTrigger: 'blur' },
  },
  {
    field: 'status',
    label: '状态',
    required: true,
    component: 'DictRadio',
    componentProps: {
      dictType: 'commonStatus',
    },
    itemProps: { validateTrigger: 'blur' },
  },
];
