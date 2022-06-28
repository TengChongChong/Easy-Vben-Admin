import { BasicColumn, FormSchema } from '/@/components/Table';
import { RoleEnum } from '/@/enums/roleEnum';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { setStatus } from '/@/api/auth/sysRole';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
  },
  {
    field: 'code',
    label: '标识',
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'DictSelect',
    componentProps: {
      dictType: 'commonStatus',
    },
  },
];

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
    title: '标识',
    dataIndex: 'code',
    sorter: true,
    width: 150,
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    sorter: true,
    width: 80,
  },
  {
    title: '系统',
    dataIndex: 'sys',
    sorter: true,
    width: 100,
    format: 'dict|whether',
    filters: 'dict|whether',
    auth: RoleEnum.SYS_ADMIN,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    filters: 'dict|commonStatus',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === '1',
        checkedChildren: '启用',
        unCheckedChildren: '禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? '1' : '2';
          const { createMessage } = useMessage();
          setStatus(record.id, newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`操作成功`);
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
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
