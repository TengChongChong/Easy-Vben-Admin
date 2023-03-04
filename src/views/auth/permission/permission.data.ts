import { BasicColumn, FormSchema } from '/@/components/Table';
import { createVNode, h } from 'vue';
import { Icon } from '/@/components/Icon';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { setStatus } from '/@/api/auth/sysPermission';

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
    label: '权限标识',
    component: 'Input',
  },
  {
    field: 'path',
    label: 'Path',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'title',
    fixed: 'left',
    align: 'left',
    width: 200,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 80,
    format: (_, record) => {
      if (record.icon) {
        return createVNode(Icon, { icon: record.icon });
      } else {
        return '';
      }
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 100,
    format: 'dict|permissionType',
    filters: 'dict|permissionType',
  },
  {
    title: '权限标识',
    dataIndex: 'code',
    width: 200,
  },
  {
    title: 'Path',
    dataIndex: 'path',
    width: 240,
  },
  {
    title: '排序值',
    dataIndex: 'orderNo',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
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
          setStatus(record.id, newStatus, record.type)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`操作成功`);
              if ('menu' === record.type) {
                // 同时更新子级数据
                if (record.children) {
                  record.children.map((item) => {
                    item.status = newStatus;
                  });
                }
              }
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '显示',
    dataIndex: 'display',
    width: 100,
    format: 'dict|whether',
    filters: 'dict|whether',
  },
];
