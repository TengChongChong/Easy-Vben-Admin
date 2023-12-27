import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { setStatus } from '/@/api/file/fileUploadRule';

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
    field: 'slug',
    label: '别名',
    component: 'Input',
  },
  {
    field: 'bucket',
    label: '文件桶',
    component: 'Input',
  },
  {
    field: 'suffix',
    label: '文件后缀',
    component: 'Input',
  },
];

// 表格列数据
export const columns: BasicColumn[] = [
  {
    title: '分类',
    dataIndex: 'category',
    sorter: true,
    width: 120,
    format: 'dict|sysFileUploadRuleCategory',
    filters: 'dict|sysFileUploadRuleCategory',
  },
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    width: 160,
  },
  {
    title: '别名',
    dataIndex: 'slug',
    sorter: true,
    width: 180,
  },
  {
    title: '文件桶',
    dataIndex: 'bucket',
    sorter: true,
    width: 160,
  },
  {
    title: '允许上传的文件大小',
    dataIndex: 'fileSizeLimit',
    sortField: 't.upper_limit',
    sorter: true,
    width: 200,
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
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
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
