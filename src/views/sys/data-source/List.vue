<template>
  <PageWrapper dense>
    <!-- 表格 -->
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', onChange: onSelectChange }"
    >
      <template #toolbar>
        <a-button-add auth="sys:data:source:save" @click="handleCreate" />
        <a-button-remove-batch
          auth="sys:data:source:remove"
          :id="checkedKeys"
          :api="remove"
          @success="reload"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="basic-table-action center">
            <a-button-edit small auth="sys:data:source:save" :id="record.id" @click="handleEdit" />
            <a-divider type="vertical" />
            <a-button-remove
              small
              auth="sys:data:source:remove"
              :id="record.id"
              :api="remove"
              @success="reload"
            />
          </div>
        </template>
      </template>
    </BasicTable>
    <!-- 表单 -->
    <SysDataSourceInput @register="registerDrawer" @success="reload" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { select, get, remove, add } from '/@/api/sys/sysDataSource';
  import { columns, searchFormSchema } from '/@/views/sys/data-source/data-source.data';
  import { useDrawer } from '/@/components/Drawer';
  import { AButtonAdd, AButtonEdit, AButtonRemove, AButtonRemoveBatch } from '/@/components/Button';
  import SysDataSourceInput from '/@/views/sys/data-source/Input.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    name: 'SysDataSourceList',
    components: {
      PageWrapper,
      SysDataSourceInput,
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
        title: '数据源',
        api: select,
        columns,
        useSearchForm: true,
        formConfig: {
          schemas: searchFormSchema,
        },
        actionColumn: {
          width: 140,
          title: '操作',
          key: 'action',
        },
      });

      /**
       * 新增
       */
      function handleCreate() {
        add().then((data) => {
          openDrawer(true, data);
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
