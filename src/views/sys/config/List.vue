<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sys:config:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:config:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
        <Authority value="sys:config:save">
          <a-button @click="reloadCache">
            <Icon icon="ant-design:reload-outlined" />
            刷新缓存
          </a-button>
        </Authority>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="sys:config:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sys:config:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysConfigInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, get, remove, refresh } from '/@/api/sys/sysConfig';
  import { columns, searchFormSchema } from '/@/views/sys/config/config.data';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import SysConfigInput from '/@/views/sys/config/Input.vue';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SysConfigList',
    components: {
      PageWrapper,
      Authority,
      Icon,
      SysConfigInput,
      AButtonRemoveBatch,
      AButtonRemove,
      AButtonEdit,
      AButtonAdd,
      BasicTable,
    },
    setup() {
      const { createMessage } = useMessage();

      // 表格选中数据
      const checkedKeys = ref<Array<string>>([]);

      const [registerDrawer, { openDrawer }] = useDrawer();
      /**
       * 初始化表格
       */
      const [registerTable, { reload }] = useTable({
        title: '系统参数',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 100,
          title: '操作',
          key: 'action',
        },
      });

      /**
       * 新增
       */
      function handleCreate() {
        openDrawer(true, {
          type: 'text',
          sys: '0',
        });
      }
      function handleEdit(id: string) {
        get(id).then((data) => {
          openDrawer(true, data);
        });
      }

      /**
       * 刷新redis缓存
       */
      const reloadCache = () => {
        refresh().then(() => {
          createMessage.success('刷新成功');
        });
      };

      return {
        checkedKeys,
        onSelectChange(selectedRowKeys: string[]) {
          checkedKeys.value = selectedRowKeys;
        },
        remove,
        registerDrawer,
        registerTable,
        reload,
        handleCreate,
        handleEdit,
        reloadCache,
      };
    },
  });
</script>
