import { BasicColumn, FormSchema } from '/@/components/Table';
import { useMessage } from '/@/hooks/web/useMessage';
import { setStatus } from '/@/api/auth/sysDeptType';
import { Switch } from 'ant-design-vue';
import { h } from 'vue';

/**
 * 查询条件
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '名称',
    component: 'Input',
  },
  {
    field: 'code',
    label: '代码',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    fixed: 'left',
    align: 'left',
    width: 200,
  },
  {
    title: '代码',
    dataIndex: 'code',
    width: 200,
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    width: 80,
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
    title: '备注',
    dataIndex: 'remarks',
    width: 260,
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
