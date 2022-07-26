import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { setStatus } from '/@/api/auth/sysUser';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '账号',
    component: 'Input',
  },
  {
    field: 'phoneNumber',
    label: '手机号',
    component: 'Input',
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '账号',
    dataIndex: 'username',
    sorter: true,
    fixed: 'left',
    width: 140,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 100,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    sorter: true,
    width: 140,
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    sorter: true,
    width: 140,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    sorter: true,
    width: 80,
    format: 'dict|sex',
    filters: 'dict|sex',
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
    title: '最后登录',
    dataIndex: 'lastLoginDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
