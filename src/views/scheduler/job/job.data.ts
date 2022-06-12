import { BasicColumn, FormSchema } from '/@/components/Table';
import { RoleEnum } from '/@/enums/roleEnum';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { start, pause } from '/@/api/scheduler/schedulerJob';

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
    label: '代码',
    component: 'Input',
  },
  {
    field: 'bean',
    label: '类',
    component: 'Input',
  },
  {
    field: 'method',
    label: '方法',
    component: 'Input',
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
    title: '代码',
    dataIndex: 'code',
    sorter: true,
    width: 150,
  },
  {
    title: 'cron',
    dataIndex: 'cron',
    sorter: true,
    width: 150,
  },
  {
    title: '类',
    dataIndex: 'bean',
    sorter: true,
    width: 150,
  },
  {
    title: '方法',
    dataIndex: 'method',
    sorter: true,
    width: 150,
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
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    filters: 'dict|schedulerJobStatus',
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
          if (checked) {
            start(record.id)
              .then(() => {
                record.status = newStatus;
                createMessage.success(`操作成功`);
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          } else {
            pause(record.id)
              .then(() => {
                record.status = newStatus;
                createMessage.success(`操作成功`);
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          }
        },
      });
    },
  },
  {
    title: '上次执行时间',
    dataIndex: 'lastRunDate',
    sorter: true,
    width: 160,
    format: 'date|YYYY-MM-DD HH:mm',
  },
];
